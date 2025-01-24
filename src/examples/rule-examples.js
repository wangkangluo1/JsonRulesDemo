const { Engine } = require('json-rules-engine');
const { createFactInstance } = require('../utils/fact-definitions');
const { formatRuleResults, createCompositeRule } = require('../utils/rule-helpers');
const customOperators = require('../rules/custom-operators');

/**
 * Creates a new engine instance with registered custom operators
 */
function createEngineWithOperators() {
    const engine = new Engine();
    customOperators.register(engine);
    return engine;
}

/**
 * Runs a scenario with proper error handling
 * @param {string} name - Scenario name
 * @param {Function} scenarioFn - Async function containing scenario logic
 */
async function runScenario(name, scenarioFn) {
    console.log(`\n=== ${name} ===`);
    try {
        await scenarioFn();
    } catch (error) {
        console.error(`Error in ${name}:`, error.message);
    }
}

/**
 * Demonstrates how to run different rule scenarios
 */
async function demonstrateRuleScenarios() {
    // Example 1: E-commerce scenario
    await runScenario('E-commerce Discount Scenario', async () => {
        const engine = createEngineWithOperators();
        engine.addRule(discountRules[0]);
        const facts = createFactInstance({
            accountAge: 24,
            transactionAmount: 150
        });
        const results = await engine.run(facts);
        console.log(formatRuleResults(results.events));
    });

    // Example 2: Insurance risk assessment
    await runScenario('Insurance Risk Assessment Scenario', async () => {
        const engine = createEngineWithOperators();
        engine.addRule(insuranceRules[0]);
        const facts = createFactInstance({
            age: 22,
            creditScore: 580,
            location: 'FL'
        });
        const results = await engine.run(facts);
        console.log(formatRuleResults(results.events));
    });

    // Example 3: Banking transaction scenario
    await runScenario('Banking Transaction Scenario', async () => {
        const engine = createEngineWithOperators();
        engine.addRule(bankingRules[0]);
        const facts = createFactInstance({
            transactionAmount: 6000,
            accountAge: 3
        });
        const results = await engine.run(facts);
        console.log(formatRuleResults(results.events));
    });

    // Example 4: Complex loan approval scenario
    await runScenario('Premium Loan Approval Scenario', async () => {
        const engine = createEngineWithOperators();
        engine.addRule(loanApprovalRules[0]);
        const facts = createFactInstance({
            creditScore: 820,
            income: 200000,
            accountAge: 72,
            location: 'NY'
        });
        const results = await engine.run(facts);
        console.log(formatRuleResults(results.events));
    });
}

/**
 * Example of using composite rules
 */
async function demonstrateCompositeRules() {
    await runScenario('Composite Rule Scenario', async () => {
        const engine = createEngineWithOperators();
        const compositeRule = createCompositeRule([
            discountRules[0],
            insuranceRules[0]
        ]);

        engine.addRule(compositeRule);
        const facts = createFactInstance({
            accountAge: 24,
            transactionAmount: 150,
            age: 22,
            creditScore: 580,
            location: 'FL'
        });

        const results = await engine.run(facts);
        console.log(formatRuleResults(results.events));
    });
}

/**
 * Example 1: E-commerce Discount Rules
 */
const discountRules = [
    {
        name: 'loyalty-discount',
        conditions: {
            all: [
                {
                    fact: 'accountAge',
                    operator: 'greaterThanInclusive',
                    value: 12
                },
                {
                    fact: 'transactionAmount',
                    operator: 'greaterThanInclusive',
                    value: 100
                }
            ]
        },
        event: {
            type: 'apply-loyalty-discount',
            params: {
                discountPercent: 10,
                message: 'Loyal customer discount applied'
            }
        }
    }
];

/**
 * Example 2: Insurance Risk Assessment Rules
 */
const insuranceRules = [
    {
        name: 'high-risk-profile',
        conditions: {
            any: [
                {
                    all: [
                        {
                            fact: 'age',
                            operator: 'lessThan',
                            value: 25
                        },
                        {
                            fact: 'creditScore',
                            operator: 'lessThan',
                            value: 600
                        }
                    ]
                },
                {
                    fact: 'location',
                    operator: 'inState',
                    value: ['FL', 'CA']  // High-risk states
                }
            ]
        },
        event: {
            type: 'risk-assessment',
            params: {
                riskLevel: 'high',
                message: 'High risk profile detected'
            }
        }
    }
];

/**
 * Example 3: Banking Transaction Rules with Dynamic Facts
 */
const bankingRules = [
    {
        name: 'suspicious-transaction',
        conditions: {
            all: [
                {
                    fact: 'transactionAmount',
                    operator: 'greaterThan',
                    value: 5000
                },
                {
                    fact: 'accountAge',
                    operator: 'lessThan',
                    value: 6
                }
            ]
        },
        event: {
            type: 'flag-transaction',
            params: {
                action: 'review',
                message: 'Large transaction on new account'
            }
        }
    }
];

/**
 * Example 4: Nested Complex Rules for Loan Approval
 */
const loanApprovalRules = [
    {
        name: 'premium-loan-eligibility',
        conditions: {
            all: [
                {
                    any: [
                        {
                            fact: 'creditScore',
                            operator: 'greaterThanInclusive',
                            value: 800
                        },
                        {
                            all: [
                                {
                                    fact: 'income',
                                    operator: 'greaterThanInclusive',
                                    value: 150000
                                },
                                {
                                    fact: 'accountAge',
                                    operator: 'greaterThanInclusive',
                                    value: 60
                                }
                            ]
                        }
                    ]
                },
                {
                    fact: 'location',
                    operator: 'inState',
                    value: ['NY', 'CA', 'TX', 'FL', 'IL']
                }
            ]
        },
        event: {
            type: 'premium-loan-offer',
            params: {
                interestRate: '3.5%',
                message: 'Customer eligible for premium loan terms'
            }
        }
    }
];

// Export examples for use in other parts of the application
module.exports = {
    discountRules,
    insuranceRules,
    bankingRules,
    loanApprovalRules,
    demonstrateRuleScenarios,
    demonstrateCompositeRules
};

// Run demonstrations if file is executed directly
if (require.main === module) {
    Promise.all([
        demonstrateRuleScenarios(),
        demonstrateCompositeRules()
    ]).catch(console.error);
}