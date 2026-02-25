import { loadSiml, loadSimlContent, LoaderError } from './loader';
import { parseSyntax, SyntaxError } from './syntax';
import { validate, ValidationError } from './validator';
import { normalize } from './normaliser';
import { SimlRoot } from './types';

export interface ParserResult {
    model: SimlRoot | null;
    errors: (ValidationError | Error)[];
}

export function parse(filePath: string, mode: 'strict' | 'loose' = 'loose'): ParserResult {
    try {
        const raw = loadSiml(filePath);
        return processModel(raw, mode);
    } catch (e: any) {
        if (e instanceof LoaderError) {
            return { model: null, errors: [e] };
        }
        return { model: null, errors: [e] };
    }
}

export function parseContent(content: string, mode: 'strict' | 'loose' = 'loose'): ParserResult {
    try {
        const raw = loadSimlContent(content);
        return processModel(raw, mode);
    } catch (e: any) {
        if (e instanceof LoaderError) {
            return { model: null, errors: [e] };
        }
        return { model: null, errors: [e] };
    }
}

function processModel(raw: SimlRoot, mode: 'strict' | 'loose'): ParserResult {
    try {
        // 2. Syntax Parse
        const ast = parseSyntax(raw);

        // 3. Validate
        const contentErrors = validate(ast, mode);

        // 4. Normalize
        const normalized = normalize(ast);

        return {
            model: normalized,
            errors: contentErrors
        };
    } catch (e: any) {
        if (e instanceof SyntaxError) {
            return { model: null, errors: [e] };
        }
        throw e;
    }
}

// Re-export types
export * from './types';
export { LoaderError } from './loader';
export { SyntaxError } from './syntax';
