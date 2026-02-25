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
exports.LoaderError = void 0;
exports.loadSiml = loadSiml;
const fs = __importStar(require("fs"));
const yaml = __importStar(require("js-yaml"));
class LoaderError extends Error {
    constructor(message, filePath) {
        super(message);
        this.name = 'LoaderError';
        this.filePath = filePath;
    }
}
exports.LoaderError = LoaderError;
function loadSiml(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            throw new LoaderError(`File not found: ${filePath}`, filePath);
        }
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const parsed = yaml.load(fileContent);
        if (!parsed || typeof parsed !== 'object') {
            throw new LoaderError('Invalid YAML content: Root must be an object', filePath);
        }
        // Basic structural check (very loose, just to ensure it's not complete garbage)
        // Detailed validation happens in the Syntax Parser and Validator.
        if (!parsed.siml) {
            // We might want to allow it to pass and fail later, but let's be slightly strict at load time if desired.
            // For now, let's just return what we have.
        }
        return parsed;
    }
    catch (e) {
        if (e instanceof LoaderError) {
            throw e;
        }
        throw new LoaderError(`Failed to parse YAML: ${e.message}`, filePath);
    }
}
