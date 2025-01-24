/**
 * Creates a fact instance with validated data
 * @param {Object} data - Raw fact data
 * @returns {Object} - Validated fact instance
 */
function createFactInstance(data) {
    const validators = {
        age: (value) => {
            if (typeof value !== 'number' || value < 0) {
                throw new Error('Age must be a positive number');
            }
            return value;
        },
        income: (value) => {
            if (typeof value !== 'number' || value < 0) {
                throw new Error('Income must be a positive number');
            }
            return value;
        },
        creditScore: (value) => {
            if (typeof value !== 'number' || value < 300 || value > 850) {
                throw new Error('Credit score must be between 300 and 850');
            }
            return value;
        },
        accountAge: (value) => {
            if (typeof value !== 'number' || value < 0) {
                throw new Error('Account age must be a positive number');
            }
            return value;
        },
        location: (value) => {
            if (typeof value !== 'string' || value.length !== 2) {
                throw new Error('Location must be a valid 2-letter state code');
            }
            return value.toUpperCase();
        },
        transactionAmount: (value) => {
            if (typeof value !== 'number' || value < 0) {
                throw new Error('Transaction amount must be a positive number');
            }
            return value;
        }
    };

    const facts = {};
    for (const [key, value] of Object.entries(data)) {
        if (validators[key]) {
            facts[key] = validators[key](value);
        }
    }

    return facts;
}

module.exports = {
    createFactInstance
};
