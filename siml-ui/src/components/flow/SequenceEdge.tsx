import React, { memo } from 'react';
import { EdgeProps, getStraightPath, EdgeLabelRenderer } from 'reactflow';
import { LabelBadge } from './helpers/LabelBadge';

/**
 * SequenceEdge represents a horizontal arrow flying between two AnchorNodes upon lifelines.
 * It renders a perfectly straight path and floats the text label directly above it.
 */
export const SequenceEdge = memo(({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    label,
    markerEnd,
    animated,
    style,
    data
}: EdgeProps) => {

    let edgePath = '';
    let labelX = 0;
    let labelY = 0;

    const isSelfCall = Math.abs(sourceX - targetX) < 1;

    if (isSelfCall) {
        // Draw a tight rectangular loop extending to the right for self-calls
        const loopOutX = sourceX + 60;

        // Cubic bezier: Start, Control1, Control2, End
        edgePath = `M ${sourceX} ${sourceY} C ${loopOutX} ${sourceY}, ${loopOutX} ${targetY}, ${targetX} ${targetY}`;

        labelX = loopOutX + 10;
        labelY = (sourceY + targetY) / 2;
    } else {
        // Sequence diagrams typically use strictly straight horizontal arrows
        // So we use getStraightPath instead of Bezier
        const straight = getStraightPath({
            sourceX,
            sourceY,
            targetX,
            targetY,
        });
        edgePath = straight[0];
        labelX = straight[1];
        labelY = straight[2];
    }

    // We want the label to sit *above* the horizontal line, centered.
    // labelY represents the exact mid-point of the line. So we offset it up.
    // We parse the multiline label (label might have Action\nRoute)
    const labelLines = typeof label === 'string' ? label.split('\n') : [];

    return (
        <>
            {/* Invisible thicker path for easier clicking */}
            <path
                d={edgePath}
                fill="none"
                strokeOpacity={0}
                strokeWidth={20}
                className="cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation();
                    if (data?.onSelectLine && data?.sourceLine) {
                        data.onSelectLine(data.sourceLine);
                    }
                }}
            />
            {/* Visible path */}
            <path
                id={id}
                className="react-flow__edge-path cursor-pointer hover:stroke-white transition-colors"
                d={edgePath}
                markerEnd={markerEnd}
                style={{
                    ...style,
                    strokeDasharray: data?.isAsync ? '5,5' : 'none',
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    if (data?.onSelectLine && data?.sourceLine) {
                        data.onSelectLine(data.sourceLine);
                    }
                }}
            />
            {label && (
                <EdgeLabelRenderer>
                    <LabelBadge
                        labelLines={labelLines}
                        x={labelX}
                        y={labelY}
                        sourceLine={data?.sourceLine}
                        onSelectLine={data?.onSelectLine}
                    />
                </EdgeLabelRenderer>
            )}
        </>
    );
});

SequenceEdge.displayName = 'SequenceEdge';
