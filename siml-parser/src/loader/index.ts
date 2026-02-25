import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { SimlRoot } from '../types';

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
        const parsed = yaml.load(content) as any;

        if (!parsed || typeof parsed !== 'object') {
            throw new LoaderError('Invalid YAML content: Root must be an object', filePath);
        }

        // Basic structural check (very loose, just to ensure it's not complete garbage)
        // Detailed validation happens in the Syntax Parser and Validator.
        if (!parsed.siml) {
            // We might want to allow it to pass and fail later, but let's be slightly strict at load time if desired.
            // For now, let's just return what we have.
        }

        return parsed as SimlRoot;
    } catch (e: any) {
        if (e instanceof LoaderError) {
            throw e;
        }
        throw new LoaderError(`Failed to parse YAML: ${e.message}`, filePath);
    }
}

export function loadSiml(filePath: string): SimlRoot {
    if (!fs.existsSync(filePath)) {
        throw new LoaderError(`File not found: ${filePath}`, filePath);
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    return loadSimlContent(fileContent, filePath);
}
