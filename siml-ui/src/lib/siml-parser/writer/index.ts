import { SimlRoot, Component, Sequence, SequenceStep } from '../types';

export function generateYaml(model: Readonly<SimlRoot>): string {
    const lines: string[] = [];

    // 1. Root Version
    lines.push(`siml: "${model.siml}"`);
    lines.push('');

    // 2. Components
    if (model.components && Object.keys(model.components).length > 0) {
        lines.push('components:');
        for (const [name, comp] of Object.entries(model.components)) {
            lines.push(`  ${name}:`);
            writeComponent(lines, comp, 4);
        }
        lines.push('');
    }

    // 3. Contracts (if any)
    if (model.contracts && Object.keys(model.contracts).length > 0) {
        lines.push('contracts:');
        for (const [name, contract] of Object.entries(model.contracts)) {
            lines.push(`  ${name}:`);
            writeIndentedObject(lines, contract, 4);
        }
        lines.push('');
    }

    // 4. Sequences
    if (model.sequences && model.sequences.length > 0) {
        lines.push('sequences:');
        for (const seq of model.sequences) {
            lines.push('  -');
            lines.push(`    name: ${seq.name}`);
            if (seq.note) lines.push(`    note: ${seq.note}`);
            if (seq.actors && seq.actors.length > 0) {
                lines.push(`    actors: [${seq.actors.join(', ')}]`);
            }
            if (seq.steps && seq.steps.length > 0) {
                lines.push('    steps:');
                for (const step of seq.steps) {
                    writeStep(lines, step, 6);
                }
            }
        }
    }

    return lines.join('\n') + '\n';
}

function writeComponent(lines: string[], comp: Component, indentLevel: number) {
    const indent = ' '.repeat(indentLevel);
    lines.push(`${indent}type: ${comp.type}`);
    if (comp.note) lines.push(`${indent}note: ${comp.note}`);
    if (comp.technology) lines.push(`${indent}technology: ${comp.technology}`);
    if (comp.tags && comp.tags.length > 0) {
        lines.push(`${indent}tags: [${comp.tags.join(', ')}]`);
    }

    // attributes
    if (comp.attributes && Object.keys(comp.attributes).length > 0) {
        lines.push(`${indent}attributes:`);
        writeIndentedObject(lines, comp.attributes, indentLevel + 2);
    }

    // routes
    if (comp.routes && comp.routes.length > 0) {
        lines.push(`${indent}routes:`);
        for (const route of comp.routes) {
            lines.push(`${indent}  -`);
            if (route.method) lines.push(`${indent}    method: ${route.method}`);
            if (route.path) lines.push(`${indent}    path: ${route.path}`);
            if (route.contract) lines.push(`${indent}    contract: ${route.contract}`);
            if (route.note) lines.push(`${indent}    note: ${route.note}`);
        }
    }

    // datastore
    if (comp.datastore) {
        lines.push(`${indent}datastore:`);
        writeIndentedObject(lines, comp.datastore as any, indentLevel + 2);
    }

    // messaging
    if (comp.messaging) {
        lines.push(`${indent}messaging:`);
        writeIndentedObject(lines, comp.messaging as any, indentLevel + 2);
    }
}

function writeStep(lines: string[], step: SequenceStep, indentLevel: number) {
    const indent = ' '.repeat(indentLevel);

    // Determine if we can write this as a shorthand call string
    // Shorthand format: from -> to.action(resource)
    if (step.from && step.to) {
        const arrow = step.mode === 'async' ? '~>' : '->';

        let targetSuffix = '';
        if (step.action) {
            targetSuffix += `.${step.action}`;
        }

        const resource = step.route || step.topic || step.contract;
        if (resource) {
            targetSuffix += `(${resource})`;
        }

        const callString = `${step.from} ${arrow} ${step.to}${targetSuffix}`;

        // If it's pure shorthand (no extra fields like operation, description)
        if (!step.note && !step.operation && !step.protocol) {
            const finalString = step.label ? `${callString} "${step.label}"` : callString;
            lines.push(`${indent}- ${finalString}`);
            return;
        } else {
            // Write structured with `call` key
            lines.push(`${indent}-`);
            lines.push(`${indent}  call: ${callString}`);
            if (step.label) lines.push(`${indent}  label: "${step.label}"`);
            if (step.note) lines.push(`${indent}  note: ${step.note}`);
            if (step.operation) lines.push(`${indent}  operation: ${step.operation}`);
            if (step.protocol) lines.push(`${indent}  protocol: ${step.protocol}`);
            return;
        }
    }

    // Fallback: Dump raw structured object
    // Exclude __source__ when writing
    lines.push(`${indent}-`);
    const cleanStep = { ...step };
    delete cleanStep.__source__;

    for (const [k, v] of Object.entries(cleanStep)) {
        if (v !== undefined) {
            lines.push(`${indent}  ${k}: ${v}`);
        }
    }
}

function writeIndentedObject(lines: string[], obj: Record<string, any>, indentLevel: number) {
    const indent = ' '.repeat(indentLevel);
    for (const [k, v] of Object.entries(obj)) {
        if (v === undefined || k === '__source__') continue;
        if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
            lines.push(`${indent}${k}:`);
            writeIndentedObject(lines, v, indentLevel + 2);
        } else if (Array.isArray(v)) {
            lines.push(`${indent}${k}: [${v.join(', ')}]`);
        } else {
            lines.push(`${indent}${k}: ${v}`);
        }
    }
}
