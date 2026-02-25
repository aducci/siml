#!/usr/bin/env node
import { parse } from './index';
import * as fs from 'fs';
import * as path from 'path';

const args = process.argv.slice(2);
if (args.length < 1) {
    console.error("Usage: siml-parse <file.yaml> [--strict]");
    process.exit(1);
}

const filePath = args[0];
const strictMode = args.includes('--strict');
const absolutePath = path.resolve(process.cwd(), filePath);

console.log(`Parsing ${absolutePath}...`);

const result = parse(absolutePath, strictMode ? 'strict' : 'loose');

if (result.errors.length > 0) {
    console.error("\nErrors found:");
    result.errors.forEach(e => {
        if ('code' in e) {
            console.error(`[${e.code}] ${e.message} (seq: ${e.sequence}, step: ${e.stepIndex})`);
        } else {
            console.error(`[Fatal] ${e.message}`);
        }
    });

    if (!result.model) process.exit(1);
    // If model exists but has errors, exit 1 anyway? 
    // Design says "non-fatal where possible". 
    // Let's exit 1 if errors exist.
    process.exit(1);
}

console.log("\nSuccess!");
console.log(JSON.stringify(result.model, null, 2));
