import { parseSyntax, SyntaxError } from '../src/syntax';

describe('Syntax Parser', () => {

    it('should parse a minimal valid SIML object', () => {
        const input = {
            siml: "1.0",
            components: {
                AuthService: { type: 'service' }
            },
            sequences: [
                {
                    name: "Login",
                    steps: [
                        { from: "Client", to: "AuthService", action: "call" }
                    ]
                }
            ]
        };
        const result = parseSyntax(input);
        expect(result.components.AuthService.type).toBe('service');
        expect(result.sequences[0].steps[0].from).toBe('Client');
    });

    it('should throw error for missing components', () => {
        const input = { siml: "1.0", sequences: [] };
        expect(() => parseSyntax(input)).toThrow(SyntaxError);
    });

    it('should parse shorthand strings', () => {
        const input = {
            siml: "1.0",
            components: { A: { type: 'service' }, B: { type: 'service' } },
            sequences: [
                {
                    name: "Test",
                    // Mixed shorthand types
                    steps: [
                        "A -> B.POST(/path)",
                        { call: "A ~> B.pub(event)" }
                    ]
                }
            ]
        };
        const result = parseSyntax(input);
        const steps = result.sequences[0].steps;

        // "A -> B.POST(/path)"
        expect(steps[0].from).toBe('A');
        expect(steps[0].to).toBe('B');
        expect(steps[0].mode).toBe('sync');
        expect(steps[0].action).toBe('POST');
        expect(steps[0].route).toBe('/path');

        // "{ call: "A ~> B.pub(event)" }"
        expect(steps[1].from).toBe('A');
        expect(steps[1].to).toBe('B');
        expect(steps[1].mode).toBe('async');
        expect(steps[1].action).toBe('pub');
        expect(steps[1].route).toBe('event');
    });
});
