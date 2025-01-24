const { Engine } = require('json-rules-engine');
const basicRules = require('../src/rules/basic-rules');
const complexRules = require('../src/rules/complex-rules');
const customOperators = require('../src/rules/custom-operators');
const { createFactInstance } = require('../src/utils/fact-definitions');
const { validateRule } = require('../src/utils/rule-helpers');

describe('Rule Engine Tests', () => {
    let engine;

    beforeEach(() => {
        engine = new Engine();
        customOperators.register(engine);
    });

    test('Basic rules evaluate correctly', async () => {
        const facts = createFactInstance({
            age: 25,
            creditScore: 750,
            income: 45000
        });

        basicRules.forEach(rule => engine.addRule(rule));
        const results = await engine.run(facts);
        
        expect(results.events).toHaveLength(3);
        expect(results.events.some(e => e.type === 'is-adult')).toBeTruthy();
        expect(results.events.some(e => e.type === 'good-credit')).toBeTruthy();
        expect(results.events.some(e => e.type === 'minimum-income-met')).toBeTruthy();
    });

    test('Complex rules evaluate correctly', async () => {
        const facts = createFactInstance({
            creditScore: 800,
            income: 120000,
            accountAge: 36
        });

        complexRules.forEach(rule => engine.addRule(rule));
        const results = await engine.run(facts);

        expect(results.events).toHaveLength(2);
        expect(results.events.some(e => e.type === 'loan-eligible')).toBeTruthy();
        expect(results.events.some(e => e.type === 'premium-status')).toBeTruthy();
    });

    test('Custom operators work correctly', async () => {
        const facts = createFactInstance({
            location: 'NY',
            transactionAmount: 2500
        });

        customOperators.rules.forEach(rule => engine.addRule(rule));
        const results = await engine.run(facts);

        expect(results.events).toHaveLength(2);
        expect(results.events.some(e => e.type === 'eligible-state')).toBeTruthy();
        expect(results.events.some(e => e.type === 'transaction-risk-level')).toBeTruthy();
    });

    test('Fact validation works', () => {
        expect(() => {
            createFactInstance({ age: -1 });
        }).toThrow();

        expect(() => {
            createFactInstance({ creditScore: 900 });
        }).toThrow();

        expect(() => {
            createFactInstance({ location: 'NYC' });
        }).toThrow();
    });

    test('Rule validation works', () => {
        const validRule = basicRules[0];
        expect(validateRule(validRule)).toBeTruthy();

        const invalidRule = { name: 'invalid' };
        expect(validateRule(invalidRule)).toBeFalsy();
    });
});
