const complexRules = [
    {
        name: 'loan-eligibility',
        conditions: {
            all: [
                {
                    fact: 'creditScore',
                    operator: 'greaterThanInclusive',
                    value: 700
                },
                {
                    fact: 'income',
                    operator: 'greaterThanInclusive',
                    value: 50000
                },
                {
                    fact: 'accountAge',
                    operator: 'greaterThanInclusive',
                    value: 24
                }
            ]
        },
        event: {
            type: 'loan-eligible',
            params: {
                message: 'User is eligible for a loan'
            }
        }
    },
    {
        name: 'premium-customer',
        conditions: {
            any: [
                {
                    all: [
                        {
                            fact: 'income',
                            operator: 'greaterThanInclusive',
                            value: 100000
                        },
                        {
                            fact: 'creditScore',
                            operator: 'greaterThanInclusive',
                            value: 750
                        }
                    ]
                },
                {
                    all: [
                        {
                            fact: 'accountAge',
                            operator: 'greaterThanInclusive',
                            value: 60
                        },
                        {
                            fact: 'income',
                            operator: 'greaterThanInclusive',
                            value: 75000
                        }
                    ]
                }
            ]
        },
        event: {
            type: 'premium-status',
            params: {
                message: 'User qualifies for premium status'
            }
        }
    }
];

module.exports = complexRules;
