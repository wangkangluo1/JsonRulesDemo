const { Engine } = require('json-rules-engine');
const basicRules = require('./rules/basic-rules');
const complexRules = require('./rules/complex-rules');
const customOperators = require('./rules/custom-operators');
const { createFactInstance } = require('./utils/fact-definitions');

async function main() {
    try {
        // Initialize the engine
        const engine = new Engine();

        // Add custom operators
        customOperators.register(engine);

        // Load all rules
        basicRules.forEach(rule => engine.addRule(rule));
        complexRules.forEach(rule => engine.addRule(rule));

        // Create a fact instance for demonstration
        const facts = createFactInstance({
            age: 25,
            income: 50000,
            creditScore: 720,
            accountAge: 36,
            location: 'NY',
            transactionAmount: 1000
        });

        // Run the engine
        const results = await engine.run(facts);

        // Process results
        console.log('Rule Engine Results:');
        results.events.forEach(event => {
            console.log(`Rule triggered: ${event.type}`);
            console.log('Params:', event.params);
        });

    } catch (error) {
        console.error('Error running rules engine:', error);
        process.exit(1);
    }
}

// Start the demonstration
if (require.main === module) {
    main();
}

module.exports = { main };
