#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const path = __importStar(require("path"));
const args = process.argv.slice(2);
if (args.length < 1) {
    console.error("Usage: siml-parse <file.yaml> [--strict]");
    process.exit(1);
}
const filePath = args[0];
const strictMode = args.includes('--strict');
const absolutePath = path.resolve(process.cwd(), filePath);
console.log(`Parsing ${absolutePath}...`);
const result = (0, index_1.parse)(absolutePath, strictMode ? 'strict' : 'loose');
if (result.errors.length > 0) {
    console.error("\nErrors found:");
    result.errors.forEach(e => {
        if ('code' in e) {
            console.error(`[${e.code}] ${e.message} (seq: ${e.sequence}, step: ${e.stepIndex})`);
        }
        else {
            console.error(`[Fatal] ${e.message}`);
        }
    });
    if (!result.model)
        process.exit(1);
    // If model exists but has errors, exit 1 anyway? 
    // Design says "non-fatal where possible". 
    // Let's exit 1 if errors exist.
    process.exit(1);
}
console.log("\nSuccess!");
console.log(JSON.stringify(result.model, null, 2));
