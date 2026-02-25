import { validate } from '../src/validator';
import { SimlRoot } from '../src/types';

describe('Semantic Validator', () => {
    const minimalModel: SimlRoot = {
        siml: "1.0",
        components: {
            API: {
                type: 'service',
                routes: [{ method: 'POST', path: '/users' }]
            },
            DB: { type: 'database', datastore: { engine: 'sql', protocol: 'jdbc' } }
        },
        sequences: []
    };

    it('should pass for valid model', () => {
        const model: SimlRoot = {
            ...minimalModel,
            sequences: [{
                name: "Test",
                steps: [
                    { from: "API", to: "DB", action: "write" }
                ]
            }]
        };
        const errors = validate(model);
        expect(errors).toHaveLength(0);
    });

    it('should return error if source component missing', () => {
        const model: SimlRoot = {
            ...minimalModel,
            sequences: [{
                name: "Test",
                steps: [
                    { from: "Ghost", to: "API", action: "call" }
                ]
            }]
        };
        const errors = validate(model);
        expect(errors).toHaveLength(1);
        expect(errors[0].code).toBe('SIML-2001');
        expect(errors[0].message).toContain("Ghost");
    });

    it('should return error if target component missing', () => {
        const model: SimlRoot = {
            ...minimalModel,
            sequences: [{
                name: "Test",
                steps: [
                    { from: "API", to: "Ghost", action: "call" }
                ]
            }]
        };
        const errors = validate(model);
        expect(errors).toHaveLength(1);
        expect(errors[0].code).toBe('SIML-2002');
    });

    it('should check route existence in strict mode', () => {
        const model: SimlRoot = {
            ...minimalModel,
            sequences: [{
                name: "Test",
                steps: [
                    { from: "DB", to: "API", action: "call", route: "GET /unknown" }
                ]
            }]
        };

        // Loose mode (default) -> No error
        expect(validate(model, 'loose')).toHaveLength(0);

        // Strict mode -> Error
        const errors = validate(model, 'strict');
        expect(errors).toHaveLength(1);
        expect(errors[0].code).toBe('SIML-3001');
    });
});
