'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    ReactFlowProvider,
    useNodesState,
    useEdgesState,
    Edge,
    Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { SimlRoot } from '@/lib/siml-parser';
import { generateReactFlowGraph } from '@/lib/siml-parser/reactflow-mapper';
import { ComponentNode } from './flow/ComponentNode';
import { AnchorNode } from './flow/AnchorNode';
import { SequenceEdge } from './flow/SequenceEdge';
import { NoteNode } from './flow/NoteNode';
import { handleComponentReorder, handleSequenceStepReorder } from './flow/helpers/dragHandlers';
import { useSettings } from '@/contexts/SettingsContext';

interface VisualizerProps {
    model: SimlRoot | null;
    onModelUpdate?: (updatedModel: SimlRoot) => void;
    onSelectLine?: (line: number) => void;
}

const nodeTypes = {
    component: ComponentNode,
    anchor: AnchorNode,
    note: NoteNode,
};

const edgeTypes = {
    sequence: SequenceEdge,
};

// 2. Main Component Logic
function FlowLayout({ model, onModelUpdate, onSelectLine }: VisualizerProps) {
    const { settings } = useSettings();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        if (!model) {
            setNodes([]);
            setEdges([]);
            return;
        }

        const rawGraph = generateReactFlowGraph(model, settings);

        // Inject onSelectLine into all node data payloads so custom nodes can call it
        const injectedNodes = rawGraph.nodes.map(n => ({
            ...n,
            data: { ...n.data, onSelectLine }
        }));

        // Inject onSelectLine into all edge data payloads so SequenceEdge can call it
        const injectedEdges = rawGraph.edges.map(e => ({
            ...e,
            data: { ...e.data, onSelectLine }
        }));

        setNodes(injectedNodes);
        setEdges(injectedEdges);

    }, [model, setNodes, setEdges, onSelectLine, settings]);

    // Intercept Drag to sync the opposing anchor and keep the arrow perfectly horizontal
    const onNodeDrag = useCallback(
        (event: React.MouseEvent, node: Node) => {
            if (node.type !== 'anchor') return;
            const stepId = node.data?.stepId;
            if (!stepId) return;

            // Find the target anchor and lock its Y to the dragging source anchor's Y natively
            setNodes((nds) =>
                nds.map((n) => {
                    // if it's the partner anchor (not the dragged one, but same step)
                    if (n.type === 'anchor' && n.data?.stepId === stepId && n.id !== node.id) {
                        return { ...n, position: { ...n.position, y: node.position.y } };
                    }
                    return n;
                })
            );
        },
        [setNodes]
    );

    // Intercept Node Dragging to reorder sequence steps or components
    const onNodeDragStop = useCallback(
        (event: React.MouseEvent, node: Node, activeNodes: Node[]) => {
            if (!model || !onModelUpdate) return;

            if (node.type === 'component') {
                const newModel = handleComponentReorder(nodes, model);
                onModelUpdate(newModel);
                return;
            }

            if (node.type === 'anchor') {
                const newModel = handleSequenceStepReorder(nodes, node, model);
                onModelUpdate(newModel);
            }
        },
        [nodes, model, onModelUpdate]
    );

    return (
        <div className="h-full w-full bg-neutral-900 border-l border-neutral-800">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeDrag={onNodeDrag}
                onNodeDragStop={onNodeDragStop}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                defaultViewport={{ x: 50, y: 50, zoom: 1.2 }}
                minZoom={0.1}
            >
                <Background color="#333" gap={16} />
                <Controls />
                <MiniMap style={{ height: 120 }} zoomable pannable />
            </ReactFlow>
        </div>
    );
}

// 3. Wrapper (ReactFlow needs a provider context)
export default function FlowVisualizer({ model, onModelUpdate, onSelectLine }: VisualizerProps) {
    return (
        <ReactFlowProvider>
            <FlowLayout model={model} onModelUpdate={onModelUpdate} onSelectLine={onSelectLine} />
        </ReactFlowProvider>
    );
}
