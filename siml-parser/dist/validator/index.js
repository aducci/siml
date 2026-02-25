"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
function validate(model, mode = 'loose') {
    const errors = [];
    // 1. Component Validation
    // (Syntax parser already ensures uniqueness via object keys, but we could check other things here)
    // 2. Sequence Validation
    model.sequences.forEach(seq => {
        seq.steps.forEach((step, index) => {
            validateStep(step, index, seq.name, model.components, errors, mode);
        });
    });
    return errors;
}
function validateStep(step, index, seqName, components, errors, mode) {
    // Helper to add error
    const addError = (msg, code) => {
        errors.push({
            code,
            message: msg,
            sequence: seqName,
            stepIndex: index
        });
    };
    // 2.1 Check 'from' component exists
    if (step.from) {
        if (!components[step.from]) {
            addError(`Source component '${step.from}' not found in registry`, 'SIML-2001');
        }
    }
    // 2.2 Check 'to' component exists
    if (step.to) {
        const targetComp = components[step.to];
        if (!targetComp) {
            addError(`Target component '${step.to}' not found in registry`, 'SIML-2002');
            return; // Cannot perform further checks on target
        }
        // 2.3 Check 'action' validity for target component type
        if (step.action) {
            validateAction(step.action, targetComp, addError);
        }
        // 2.4 Check 'route' / 'operation' / 'topic' matches target capabilities
        // (Only if 'strict' mode is on, or if we want to be helpful)
        if (mode === 'strict' && step.route && targetComp.type === 'service') {
            // Need to check if route exists in targetComp.routes
            // This is complex because route strings might be "POST /path" or just "/path"
            // For now, let's just check exact match on "method + path" or just "path"
            // We need a smarter matching logic here.
            let found = false;
            if (targetComp.routes) {
                found = targetComp.routes.some(r => {
                    // simple check: if step.route contains the method and path?
                    // normalized step.route might look like "POST /credit-check"
                    const combined = `${r.method} ${r.path}`;
                    return combined === step.route || r.path === step.route;
                });
            }
            if (!found) {
                addError(`Route '${step.route}' not defined in service '${step.to}'`, 'SIML-3001');
            }
        }
    }
}
function validateAction(action, target, addError) {
    // Mapping of allowed actions per type
    const allowedActions = {
        'service': ['call', 'POST', 'GET', 'PUT', 'DELETE', 'PATCH'], // HTTP methods are often used as actions in shorthand
        'database': ['read', 'write', 'query', 'data'],
        'queue': ['pub', 'sub', 'publish', 'consume', 'message'],
        'eventbus': ['pub', 'sub', 'publish', 'consume', 'message'],
        'external': ['call', 'external'],
        'client': [] // Clients typically don't receive actions, but maybe callbacks?
    };
    const allowed = allowedActions[target.type];
    if (allowed && !allowed.includes(action)) {
        // We might want to be lenient if it's a custom action?
        // For now, let's just warn or strict check?
        // Let's add a generic warning
        // addError(`Action '${action}' not typical for component type '${target.type}'`, 'SIML-2003');
    }
}
