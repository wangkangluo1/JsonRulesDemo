const customOperators = {
    register: (engine) => {
        // Custom operator for checking state-specific rules
        engine.addOperator('inState', (factValue, jsonValue) => {
            return Array.isArray(jsonValue) 
                ? jsonValue.includes(factValue)
                : factValue === jsonValue;
        });

        // Custom operator for range checking
        engine.addOperator('between', (factValue, jsonValue) => {
            return factValue >= jsonValue.min && factValue <= jsonValue.max;
        });

        // Custom operator for transaction risk assessment
        engine.addOperator('riskLevel', (factValue, jsonValue) => {
            const riskScores = {
                'low': [0, 1000],
                'medium': [1001, 5000],
                'high': [5001, Infinity]
            };
            
            const range = riskScores[jsonValue];
            return factValue >= range[0] && factValue <= range[1];
        });
    },

    // Example rules using custom operators
    rules: [
        {
            name: 'state-specific-check',
            conditions: {
                all: [{
                    fact: 'location',
                    operator: 'inState',
                    value: ['NY', 'CA', 'TX']
                }]
            },
            event: {
                type: 'eligible-state',
                params: {
                    message: 'User is in an eligible state'
                }
            }
        },
        {
            name: 'transaction-risk-assessment',
            conditions: {
                all: [{
                    fact: 'transactionAmount',
                    operator: 'riskLevel',
                    value: 'medium'
                }]
            },
            event: {
                type: 'transaction-risk-level',
                params: {
                    message: 'Transaction risk level assessed'
                }
            }
        }
    ]
};

module.exports = customOperators;
