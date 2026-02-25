import { SimlRoot, Component, Sequence, SequenceStep, ComponentType } from '../types';

export class SyntaxError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'SyntaxError';
    }
}

export function parseSyntax(rawObj: any): SimlRoot {
    if (!rawObj || typeof rawObj !== 'object') {
        throw new SyntaxError('Root must be an object');
    }

    // 1. Validate 'siml' version
    if (!rawObj.siml || typeof rawObj.siml !== 'string') {
        throw new SyntaxError("Missing or invalid 'siml' version string");
    }

    // 2. Validate 'components'
    if (!rawObj.components || typeof rawObj.components !== 'object') {
        throw new SyntaxError("Missing or invalid 'components' object");
    }

    const components: Record<string, Component> = {};
    for (const [name, rawComp] of Object.entries(rawObj.components)) {
        components[name] = parseComponent(name, rawComp);
    }

    // 3. Validate 'sequences'
    if (!rawObj.sequences || !Array.isArray(rawObj.sequences)) {
        throw new SyntaxError("Missing or invalid 'sequences' array");
    }

    const sequences: Sequence[] = rawObj.sequences.map((rawSeq: any, index: number) => parseSequence(rawSeq, index));

    // 4. Validate 'contracts' (optional)
    const contracts: Record<string, any> = rawObj.contracts || {};

    return {
        siml: rawObj.siml,
        components,
        contracts,
        sequences
    };
}

function parseComponent(name: string, raw: any): Component {
    const validTypes: ComponentType[] = ['service', 'database', 'queue', 'eventbus', 'external', 'client'];

    if (!raw.type || !validTypes.includes(raw.type)) {
        throw new SyntaxError(`Component '${name}' has invalid or missing type: ${raw.type}`);
    }

    return {
        type: raw.type,
        description: raw.description,
        routes: raw.routes,
        datastore: raw.datastore,
        messaging: raw.messaging,
        technology: raw.technology,
        tags: raw.tags,
        attributes: raw.attributes
    } as Component;
}

function parseSequence(raw: any, index: number): Sequence {
    if (!raw.name) {
        throw new SyntaxError(`Sequence at index ${index} missing 'name'`);
    }

    if (!raw.steps || !Array.isArray(raw.steps)) {
        throw new SyntaxError(`Sequence '${raw.name}' missing 'steps' array`);
    }

    return {
        name: raw.name,
        description: raw.description,
        actors: raw.actors,
        steps: raw.steps.map((s: any, i: number) => parseStep(s, i, raw.name))
    };
}

function parseStep(raw: any, index: number, seqName: string): SequenceStep {
    // Check for shorthand string
    if (typeof raw === 'string') {
        // We defer parsing the shorthand string to the Normaliser? 
        // Or do we want the Syntax Parser to at least structurize it?
        // Design doc says: "Parser Implementation (Regex-based Tokenizer)"
        // Let's implement basic regex parsing here to populate the object *partially*
        return parseShorthandStep(raw);
    }

    // Check for 'call' shorthand key
    if (raw.call && typeof raw.call === 'string') {
        const step = parseShorthandStep(raw.call);
        // merge other props
        return { ...step, ...raw };
    }

    // Standard object
    return raw as SequenceStep;
}

// Regex from Design/DSL Shorthand Spec.md
// /^(?<from>\w+)\s*(?<mode>->|~>)\s*(?<to>\w+)\.?(?<action>\w+)?\(?(?<resource>[^\)]+)?\)?$/
const SHORTHAND_REGEX = /^(?<from>\w+)\s*(?<mode>->|~>)\s*(?<to>\w+)(?:\.(?<action>\w+))?(?:\((?<resource>[^)]+)\))?$/;

function parseShorthandStep(str: string): SequenceStep {
    const match = str.match(SHORTHAND_REGEX);
    if (!match || !match.groups) {
        // If it doesn't match, we return it as a raw 'call' string or throw?
        // For now let's just return it as a step with 'call' property so Validator can flag it.
        return { call: str };
    }

    const { from, mode, to, action, resource } = match.groups;

    return {
        from,
        to,
        mode: mode === '~>' ? 'async' : 'sync',
        action, // might be undefined if omitted
        // Resource map is complex (path, db operation, etc).
        // We'll store it in 'route' (service), 'topic' (msg), or 'operation' (db) 
        // BUT we don't know the component type here yet!
        // So we need a generic field or stick it in 'route' for now and let Normaliser fix it based on type?
        // Let's add a generic 'targetResource' to Step interface temporarily? 
        // OR just leave it for Normaliser.
        // Actually, let's just map it to 'route' as a default container for the "thing being acted upon"
        route: resource
    };
}
