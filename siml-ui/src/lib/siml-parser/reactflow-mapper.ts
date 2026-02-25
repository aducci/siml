import { Node, Edge } from 'reactflow';
import { SimlRoot } from './types';
import { LayoutSettings } from '@/contexts/SettingsContext';

export interface FlowGraph {
    nodes: Node[];
    edges: Edge[];
}

export function generateReactFlowGraph(model: SimlRoot | null, settings: LayoutSettings): FlowGraph {
    if (!model) return { nodes: [], edges: [] };

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Layout configuration
    const COMPONENT_SPACING_X = settings.componentSpacingX;
    const SEQUENCE_START_Y = settings.sequenceStartY;
    const STEP_SPACING_Y = settings.stepSpacingY;

    // 1. Map Participants to X-coordinates
    const componentXMap: Record<string, number> = {};
    const componentIds = Object.keys(model.components || {});

    // Activation Tracking
    const activationsMap: Record<string, { startY: number, endY: number }[]> = {};
    const openActivations: Record<string, number[]> = {};

    componentIds.forEach(id => {
        activationsMap[id] = [];
        openActivations[id] = [];
    });

    // We need to know how tall the longest lifeline should be.
    // Let's estimate based on number of sequences and steps.
    const totalSteps = (model.sequences || []).reduce((acc, seq) => acc + seq.steps.length + 1, 0); // +1 for sequence label gap
    const lifelineHeight = Math.max(800, SEQUENCE_START_Y + (totalSteps * STEP_SPACING_Y) + 100);

    componentIds.forEach((name, index) => {
        const xPos = index * COMPONENT_SPACING_X;
        componentXMap[name] = xPos;

        nodes.push({
            id: `comp-${name}`,
            type: 'component',
            data: {
                name: name,
                componentType: model.components[name].type,
                lifelineHeight: lifelineHeight,
                sourceLine: model.components[name].__source__?.start
            },
            position: { x: xPos, y: 50 },
            draggable: true, // Components are draggable now to reorder
            selectable: false,
            // Only allow dragging by a specific handle if we want
            dragHandle: '.component-drag-handle'
        });
    });

    // 2. Sequence Steps
    let currentY = SEQUENCE_START_Y;

    if (model.sequences) {
        model.sequences.forEach((seq) => {

            seq.steps.forEach((step, stepIndex) => {
                const stepId = `step-${seq.name}-${stepIndex}`;

                if (step.from && step.to && componentXMap[step.from] !== undefined && componentXMap[step.to] !== undefined) {

                    const isSelfCall = step.from === step.to;
                    const targetY = isSelfCall ? currentY + (settings.stepSpacingY * 0.5) : currentY;

                    const fromType = model.components[step.from]?.type;

                    // Activations Logic
                    const isReturn = step.action?.toLowerCase().includes('return') || (step as any).mode === 'return';
                    if (isReturn) {
                        const openStack = openActivations[step.from];
                        if (openStack && openStack.length > 0) {
                            const startY = openStack.pop()!;
                            activationsMap[step.from].push({ startY, endY: currentY });
                        }
                    } else if (isSelfCall) {
                        // Self calls don't hold the lock open; just show brief activation on target
                        activationsMap[step.to].push({ startY: currentY, endY: targetY });
                    } else {
                        // All forward calls (sync and async) push an activation onto the target
                        const targetStack = openActivations[step.to];
                        if (targetStack) {
                            targetStack.push(currentY);
                        }

                        // For async calls acting as a 'pass-through' from a message broker, pop the broker's stack
                        if (step.mode === 'async' && (fromType === 'queue' || fromType === 'eventbus' || fromType === 'external')) {
                            const sourceStack = openActivations[step.from];
                            if (sourceStack && sourceStack.length > 0) {
                                const startY = sourceStack.pop()!;
                                activationsMap[step.from].push({ startY, endY: currentY });
                            }
                        }
                    }

                    // Create Anchor for Source
                    const sourceAnchorId = `anchor-${stepId}-source`;
                    nodes.push({
                        id: sourceAnchorId,
                        type: 'anchor',
                        data: { stepId },
                        position: { x: componentXMap[step.from] + 96, y: currentY }, // 96 is roughly center of the 192px (w-48) component box
                        draggable: true,
                    });

                    // Create Anchor for Target
                    const targetAnchorId = `anchor-${stepId}-target`;
                    nodes.push({
                        id: targetAnchorId,
                        type: 'anchor',
                        data: { stepId },
                        position: { x: componentXMap[step.to] + 96, y: targetY },
                        draggable: false, // Target anchors can't be dragged independently
                    });

                    // If it was a self call, advance the global Y so the next step starts after the return of the loop
                    if (isSelfCall) {
                        currentY = targetY;
                    }

                    // Create Edge between anchors
                    const edgeId = `edge-${stepId}`;
                    let technicalLabel = step.action || 'call';
                    const route = step.route || step.topic || step.contract;
                    if (route) technicalLabel += ` ${route}`;

                    const label = step.label ? `${step.label}\n${technicalLabel}` : technicalLabel;

                    // Async arrows typically have open arrowheads, sync has filled arrowheads
                    const isAsync = step.mode === 'async' || isReturn;

                    // Determine spatial direction to assign the correct connection Handles
                    const srcX = componentXMap[step.from];
                    const tgtX = componentXMap[step.to];
                    const isRTL = srcX > tgtX; // Arrow is flowing Right-to-Left (e.g. Return flow)

                    let sourceHandle = isRTL ? 'left-source' : 'right-source';
                    let targetHandle = isRTL ? 'right-target' : 'left-target';

                    if (isSelfCall) {
                        sourceHandle = 'right-source';
                        targetHandle = 'right-target';
                    }

                    edges.push({
                        id: edgeId,
                        source: sourceAnchorId,
                        sourceHandle: sourceHandle,
                        target: targetAnchorId,
                        targetHandle: targetHandle,
                        type: 'sequence',
                        label: label,
                        data: {
                            sourceLine: step.__source__?.start,
                            isAsync: isAsync
                        },
                        animated: false, // Custom static dashes instead of moving SVG ants
                        markerEnd: {
                            type: isAsync ? 'arrow' as any : 'arrowclosed' as any,
                            color: '#a3a3a3',
                            width: settings.arrowHeadSize,
                            height: settings.arrowHeadSize
                        },
                        style: { stroke: '#a3a3a3', strokeWidth: 2 }
                    });

                } else if (step.note || step.call) {
                    // Note standalone steps (no clear from/to routing)
                    const labelStr = step.note || step.call || '';
                    const estWidth = Math.max(140, labelStr.length * (settings.noteFontSize * 0.75));

                    nodes.push({
                        id: `note-${stepId}`,
                        type: 'note',
                        data: {
                            label: labelStr,
                            estWidth,
                            sourceLine: step.__source__?.start
                        },
                        position: { x: 50, y: currentY },
                    });
                }

                currentY += STEP_SPACING_Y;
            });

            currentY += 50; // Gap between sequences
        });
    }

    // Force close any remaining open activations at the final Y
    componentIds.forEach(id => {
        openActivations[id].forEach(startY => {
            activationsMap[id].push({ startY, endY: currentY });
        });
    });

    // Inject activations array into Component nodes
    nodes.forEach(n => {
        if (n.type === 'component' && n.data?.name) {
            n.data.activations = activationsMap[n.data.name];
        }
    });

    return { nodes, edges };
}
