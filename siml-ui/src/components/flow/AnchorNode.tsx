import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

/**
 * AnchorNode represents a specific moment in time (a Y-coordinate) on a Component's lifeline.
 * Sequence arrows connect strictly between two AnchorNodes.
 * 
 * It renders as an invisible (or faintly visible) interactive dot.
 */
export const AnchorNode = memo(({ data }: any) => {
    // In debug mode, show a small red dot. Otherwise, keep it invisible but interactive.
    const isDebug = false;

    return (
        <div
            className={`rounded-full flex items-center justify-center ${isDebug ? 'bg-red-500 w-3 h-3' : 'bg-neutral-400 w-3 h-3 border border-neutral-600'}`}
        >
            <Handle type="target" position={Position.Left} id="left-target" className="w-1 h-1 bg-transparent border-none min-w-0 opacity-0" />
            <Handle type="source" position={Position.Left} id="left-source" className="w-1 h-1 bg-transparent border-none min-w-0 opacity-0" />

            <Handle type="target" position={Position.Right} id="right-target" className="w-1 h-1 bg-transparent border-none min-w-0 opacity-0" />
            <Handle type="source" position={Position.Right} id="right-source" className="w-1 h-1 bg-transparent border-none min-w-0 opacity-0" />
        </div>
    );
});

AnchorNode.displayName = 'AnchorNode';
