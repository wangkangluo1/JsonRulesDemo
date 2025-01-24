/**
 * Utility functions for working with rules
 */

/**
 * Formats rule results for output
 * @param {Array} events - Rule engine events
 * @returns {Object} - Formatted results
 */
function formatRuleResults(events) {
    return {
        timestamp: new Date().toISOString(),
        totalRules: events.length,
        triggeredRules: events.length,
        rules: events.map(event => ({
            type: event.type,
            message: event.params.message,
            triggered: true
        }))
    };
}

/**
 * Validates a rule definition
 * @param {Object} rule - Rule definition
 * @returns {boolean} - Validation result
 */
function validateRule(rule) {
    const requiredFields = ['name', 'conditions', 'event'];
    return requiredFields.every(field => rule.hasOwnProperty(field)) &&
           rule.conditions.hasOwnProperty('all' || 'any');
}

/**
 * Creates a composite rule from multiple rules
 * @param {Array} rules - Array of rules to combine
 * @returns {Object} - Combined rule
 */
function createCompositeRule(rules) {
    if (!Array.isArray(rules) || rules.length === 0) {
        throw new Error('Rules must be a non-empty array');
    }

    const conditions = {
        all: rules.map(rule => ({
            any: [rule.conditions]
        }))
    };

    return {
        name: 'composite-rule',
        conditions: conditions,
        event: {
            type: 'composite-evaluation',
            params: {
                message: 'Composite rule evaluation completed',
                subEvents: rules.map(r => r.event)
            }
        }
    };
}

module.exports = {
    formatRuleResults,
    validateRule,
    createCompositeRule
};