import { Node } from 'reactflow';
import { SimlRoot } from '@/lib/siml-parser';

export function handleComponentReorder(nodes: Node[], model: SimlRoot): SimlRoot {
    const allComps = nodes.filter(n => n.type === 'component');

    // Sort by current X screen coordinate
    const sortedComps = [...allComps].sort((a, b) => a.position.x - b.position.x);

    // Reconstruct the JSON object keeping the new insertion order
    const newModel: SimlRoot = JSON.parse(JSON.stringify(model));
    const newComponents: Record<string, any> = {};
    sortedComps.forEach(c => {
        const name = c.data.name;
        if (model.components[name]) {
            newComponents[name] = newModel.components[name];
        }
    });

    newModel.components = newComponents;
    return newModel;
}

export function handleSequenceStepReorder(nodes: Node[], draggedNode: Node, model: SimlRoot): SimlRoot {
    // 1. Get all current anchors from state to compare their new Y positions
    const allAnchors = nodes.filter(n => n.type === 'anchor');

    // 2. Create a map of stepId -> Y position.
    // A step has two anchors (source/target), we can just take the average or the first one we find.
    const stepYPositions: Record<string, number> = {};
    allAnchors.forEach(a => {
        const stepId = a.data?.stepId;
        if (!stepId) return;

        // If this is the active dragged node, use its current position, else use standard position
        const currentY = a.id === draggedNode.id ? draggedNode.position.y : a.position.y;

        if (stepYPositions[stepId] === undefined) {
            stepYPositions[stepId] = currentY;
        } else {
            // Average the Y coordinates of the source and target anchors if they drifted apart
            stepYPositions[stepId] = (stepYPositions[stepId] + currentY) / 2;
        }
    });

    // 3. Clone the AST model to mutate
    const newModel: SimlRoot = JSON.parse(JSON.stringify(model));

    // 4. Sort each sequence's steps based on their discovered Y positions
    // Because `JSON.parse` loses the original indexes during sort,
    // a safer way is to map the steps to { step, originalIndex }, sort, then extract.
    if (newModel.sequences) {
        newModel.sequences.forEach((seq) => {
            // Find the original sequence in the original model to guarantee index matches
            const originalSeq = model.sequences?.find(s => s.name === seq.name);
            if (!originalSeq) return;

            const stepsWithY = seq.steps.map((step, idx) => {
                const stepId = `step-${seq.name}-${idx}`;
                // Default to 0 if not found (e.g., notes might not have anchors mapped perfectly yet)
                const yPos = stepYPositions[stepId] ?? (idx * 100);
                return { step, yPos };
            });

            // Sort strictly by Y coordinate top-to-bottom
            stepsWithY.sort((a, b) => a.yPos - b.yPos);

            // Reassign the cleanly sorted steps
            seq.steps = stepsWithY.map(s => s.step);
        });
    }

    return newModel;
}
