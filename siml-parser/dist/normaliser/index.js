"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalize = normalize;
function normalize(model) {
    // Deep clone to avoid mutating original
    const normalized = JSON.parse(JSON.stringify(model));
    normalized.sequences.forEach(seq => {
        seq.steps = seq.steps.map(step => normalizeStep(step, normalized.components));
    });
    return normalized;
}
function normalizeStep(step, components) {
    const newStep = { ...step };
    // 1. Resolve Target Resource
    // In syntax parsing, we put the "resource" (path/topic/query) into `step.route` temporarily.
    // Now we can move it to the correct field based on the target component type.
    if (newStep.to && components[newStep.to]) {
        const targetType = components[newStep.to].type;
        const resource = newStep.route; // This held the "resource" from shorthand string
        if (resource) {
            if (targetType === 'database') {
                // For DB, if we have "write(users)", 'write' is action, 'users' is resource
                // We probably want to map resource to 'entity' or 'table' or just keep it generic?
                // Our AST has `step.operation` but not a generic resource field. 
                // Let's assume `step.route` is okay for now, or we can add `details`?
                // Actually, let's leave it in `route` but maybe rename it if we had a better AST.
                // For now, let's just leave it. 
                // Wait, if it was `LoanDB.write(users)`, action=write, route=users
                // The AST has `operation` for DB. 
                if (!newStep.operation && newStep.action) {
                    // map action to operation?
                    // "write" -> operation="write"
                    // This seems redundant but technically `action` is the generic Interaction and `operation` is DB specific.
                    if (['read', 'write'].includes(newStep.action)) {
                        newStep.operation = newStep.action;
                    }
                }
            }
            else if (targetType === 'queue' || targetType === 'eventbus') {
                // For Queue, `bus.pub(event)`, action=pub, route=event
                // AST has `topic`
                if (!newStep.topic) {
                    newStep.topic = resource;
                }
                delete newStep.route; // Remove valid service route from messaging step
            }
        }
    }
    // 2. Apply Defaults
    if (!newStep.mode) {
        // Async if using ~> (already handled in syntax), but what if not specified?
        // Default to sync?
        newStep.mode = 'sync';
    }
    return newStep;
}
