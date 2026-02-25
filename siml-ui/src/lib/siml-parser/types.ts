export interface SimlSourceLocation {
    start: number; // line number
    end: number;
    col?: number;
}

export interface SimlRoot {
    __source__?: SimlSourceLocation;
    siml: string;
    components: Record<string, Component>;
    contracts?: Record<string, Contract>;
    sequences: Sequence[];
}

export type ComponentType = 'service' | 'database' | 'queue' | 'eventbus' | 'external' | 'client';

export interface Component {
    __source__?: SimlSourceLocation;
    type: ComponentType;
    note?: string;
    technology?: string;
    tags?: string[];
    attributes?: Record<string, any>;
    routes?: ServiceRoute[];
    datastore?: DatastoreConfig;
    messaging?: MessagingConfig;
}

export interface ServiceRoute {
    method: string;
    path: string;
    contract?: string;
    note?: string;
}

export interface DatastoreConfig {
    engine: string;
    protocol: string;
}

export interface MessagingConfig {
    mode: 'publish' | 'subscribe' | 'both';
    protocol: string;
}

export interface Contract {
    version: string;
    type: 'request' | 'response' | 'event';
    schema: any;
    note?: string;
}

export interface Sequence {
    __source__?: SimlSourceLocation;
    name: string;
    note?: string;
    actors?: string[];
    steps: SequenceStep[];
}

export interface SequenceStep {
    __source__?: SimlSourceLocation;
    // We need to support both shorthand (during parsing) and full objects
    // But strictly speaking, the Loader should return the raw JS object which *might* match this or might be shorthand.
    // The Syntax Parser will normalize it. 
    // For now, let's define the "Raw" step separate from the "Normalized" step?
    // Or just allow optional fields.

    // Shorthand support:
    call?: string;

    // Full object support:
    from?: string;
    to?: string;
    action?: string;
    route?: string;
    operation?: 'read' | 'write';
    topic?: string;
    contract?: string;
    protocol?: string;
    mode?: 'sync' | 'async';
    note?: string;
    label?: string;
}
