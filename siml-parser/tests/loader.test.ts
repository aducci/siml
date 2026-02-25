import { loadSiml, LoaderError } from '../src/loader';
import * as fs from 'fs';
import * as path from 'path';

describe('Loader Module', () => {
    const validYamlPath = path.join(__dirname, 'valid.siml.yaml');
    const invalidYamlPath = path.join(__dirname, 'invalid.siml.yaml');

    beforeAll(() => {
        // Create temporary test files
        fs.writeFileSync(validYamlPath, `
siml: "1.0"
components:
  MyService:
    type: service
sequences: []
    `);

        fs.writeFileSync(invalidYamlPath, `
: - invalid yaml content
    `);
    });

    afterAll(() => {
        // Cleanup
        if (fs.existsSync(validYamlPath)) fs.unlinkSync(validYamlPath);
        if (fs.existsSync(invalidYamlPath)) fs.unlinkSync(invalidYamlPath);
    });

    it('should load a valid SIML file', () => {
        const result = loadSiml(validYamlPath);
        expect(result).toBeDefined();
        expect(result.siml).toBe('1.0');
        expect(result.components).toHaveProperty('MyService');
    });

    it('should throw LoaderError if file does not exist', () => {
        expect(() => loadSiml('non-existent.yaml')).toThrow(LoaderError);
    });

    it('should throw LoaderError for invalid YAML syntax', () => {
        expect(() => loadSiml(invalidYamlPath)).toThrow(LoaderError);
    });
});
