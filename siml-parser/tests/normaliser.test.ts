import { normalize } from '../src/normaliser';
import { SimlRoot } from '../src/types';

describe('Model Normaliser', () => {
    const baseModel: SimlRoot = {
        siml: "1.0",
        components: {
            Svc: { type: 'service' },
            Bus: { type: 'eventbus' },
            DB: { type: 'database', datastore: { engine: 'sql', protocol: 'jdbc' } }
        },
        sequences: []
    };

    it('should normalize messaging topic from shorthand route', () => {
        const input: SimlRoot = {
            ...baseModel,
            sequences: [{
                name: "MsgFlow",
                steps: [{
                    from: "Svc",
                    to: "Bus",
                    action: "pub",
                    route: "UserCreated" // Shorthand puts resource here
                }]
            }]
        };

        const result = normalize(input);
        const step = result.sequences[0].steps[0];

        expect(step.topic).toBe("UserCreated");
        expect(step.route).toBeUndefined(); // Should be moved
    });

    it('should set default mode to sync', () => {
        const input: SimlRoot = {
            ...baseModel,
            sequences: [{
                name: "Flow",
                steps: [{ from: "Svc", to: "Svc", action: "call" }]
            }]
        };
        const result = normalize(input);
        expect(result.sequences[0].steps[0].mode).toBe('sync');
    });
});
