import * as yaml from 'yaml';
import { SimlRoot, SimlSourceLocation } from '../types';

export class LoaderError extends Error {
    public filePath: string;

    constructor(message: string, filePath: string = '<memory>') {
        super(message);
        this.name = 'LoaderError';
        this.filePath = filePath;
    }
}

export function loadSimlContent(content: string, filePath: string = '<memory>'): SimlRoot {
    try {
        const doc = yaml.parseDocument(content);

        if (doc.errors.length > 0) {
            throw new LoaderError(doc.errors[0].message, filePath);
        }

        const parsed = doc.toJSON();

        if (!parsed || typeof parsed !== 'object') {
            throw new LoaderError('Invalid YAML content: Root must be an object', filePath);
        }

        // Attach source mapping from CST to the initial object for Syntax to consume
        attachSourceMaps(parsed, doc.contents);

        return parsed as SimlRoot;
    } catch (e: any) {
        if (e instanceof LoaderError) {
            throw e;
        }
        throw new LoaderError(`Failed to parse YAML: ${e.message}`, filePath);
    }
}

function attachSourceMaps(obj: any, node: any) {
    if (!obj || typeof obj !== 'object' || !node) return;

    if (node.range) {
        // Range is [start, end, ...]. We typically want line numbers.
        // We defer exact line number resolution to the syntax parser, or do it here?
        // Let's just pass the raw range for now, and rely on `doc.contents` or full string later?
        // Actually, yaml library gives us `range` in character offsets. 
        // We can attach a method or just pass raw offset and compute line numbers later.
        // Let's calculate lines here if possible, or just pass offsets.
        // For simplicity, let's keep `range` offsets as `start` and `end` in `__source__`.
        Object.defineProperty(obj, '__source__', {
            value: { start: node.range[0], end: node.range[1], type: 'offset' },
            enumerable: false, // Don't serialize it by default
            writable: true
        });
    }

    if (node.type === 'MAP' || yaml.isMap(node)) {
        for (const item of node.items) {
            if (item.key && item.key.value && obj[item.key.value] !== undefined) {
                attachSourceMaps(obj[item.key.value], item.value);
            }
        }
    } else if (node.type === 'SEQ' || yaml.isSeq(node)) {
        for (let i = 0; i < node.items.length; i++) {
            if (obj[i] !== undefined) {
                attachSourceMaps(obj[i], node.items[i]);
            }
        }
    }
}
// Removed loadSiml(filePath) which uses fs
