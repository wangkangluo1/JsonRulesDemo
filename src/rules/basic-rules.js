const basicRules = [
    {
        name: "age-check",
        conditions: {
            all: [
                {
                    fact: "age",
                    operator: "greaterThanInclusive",
                    value: 18,
                },
            ],
        },
        event: {
            type: "is-adult",
            params: {
                message: "User is an adult",
            },
        },
    },
    {
        name: "credit-score-check",
        conditions: {
            all: [
                {
                    fact: "creditScore",
                    operator: "greaterThanInclusive",
                    value: 700,
                },
            ],
        },
        event: {
            type: "good-credit",
            params: {
                message: "User has good credit",
            },
        },
    },
    {
        name: "income-threshold",
        conditions: {
            all: [
                {
                    fact: "income",
                    operator: "greaterThanInclusive",
                    value: 30000,
                },
            ],
        },
        event: {
            type: "minimum-income-met",
            params: {
                message: "User meets minimum income requirement",
            },
        },
    },
];

module.exports = basicRules;
