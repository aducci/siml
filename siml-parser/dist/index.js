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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyntaxError = exports.LoaderError = void 0;
exports.parse = parse;
const loader_1 = require("./loader");
const syntax_1 = require("./syntax");
const validator_1 = require("./validator");
const normaliser_1 = require("./normaliser");
function parse(filePath, mode = 'loose') {
    try {
        // 1. Load
        const raw = (0, loader_1.loadSiml)(filePath);
        // 2. Syntax Parse
        const ast = (0, syntax_1.parseSyntax)(raw);
        // 3. Validate
        const contentErrors = (0, validator_1.validate)(ast, mode);
        // 4. Normalize (even if there are logic errors, we might want to return model if valid enough? 
        // For now, let's normalize only if no structural errors, which is true if parseSyntax succeded)
        const normalized = (0, normaliser_1.normalize)(ast);
        return {
            model: normalized,
            errors: contentErrors
        };
    }
    catch (e) {
        if (e instanceof loader_1.LoaderError || e instanceof syntax_1.SyntaxError) {
            return { model: null, errors: [e] };
        }
        // Unexpected error
        return { model: null, errors: [e] };
    }
}
// Re-export types
__exportStar(require("./types"), exports);
var loader_2 = require("./loader");
Object.defineProperty(exports, "LoaderError", { enumerable: true, get: function () { return loader_2.LoaderError; } });
var syntax_2 = require("./syntax");
Object.defineProperty(exports, "SyntaxError", { enumerable: true, get: function () { return syntax_2.SyntaxError; } });
