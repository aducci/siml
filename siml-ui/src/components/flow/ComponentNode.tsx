import React, { memo } from 'react';

import { useSettings } from '@/contexts/SettingsContext';

/**
 * ComponentNode represents a "Participant" or "Actor" at the top of a sequence diagram.
 * It renders a box with the component's name and type, and then draws a long vertical
 * dashed line extending down behind all sequence steps (the "lifeline").
 */
export const ComponentNode = memo(({ data }: any) => {
    const { settings } = useSettings();
    // The fixed height of the lifeline (could be calculated dynamically based on sequence steps later)
    // For now, we make it very tall.
    const lifelineHeight = data.lifelineHeight || 1000;

    return (
        <div className="relative flex flex-col items-center">
            {/* The Top Box */}
            <div
                className="w-48 bg-neutral-800 text-white border-2 border-neutral-600 rounded-lg shadow-md font-mono text-xs z-10 flex flex-col items-center justify-center py-2 px-1 cursor-pointer hover:border-neutral-400 transition-colors relative"
                onClick={() => {
                    if (data.onSelectLine && data.sourceLine) {
                        data.onSelectLine(data.sourceLine);
                    }
                }}
            >
                {/* Drag Handle */}
                <div
                    className="component-drag-handle absolute -top-1.5 -right-1.5 w-3 h-3 bg-neutral-400 hover:bg-white rounded-full cursor-grab active:cursor-grabbing border border-neutral-700 shadow-sm"
                    title="Drag to reorder"
                />

                <span
                    className="font-bold mb-1"
                    style={{ fontSize: `${settings.headerFontSize}px` }}
                >
                    {data.name}
                </span>
                {data.componentType && (
                    <span className="text-neutral-400 text-[10px]">&lt;&lt;{data.componentType}&gt;&gt;</span>
                )}
            </div>

            {/* The Lifeline (drawn behind other nodes) */}
            <div
                className="absolute border-l-2 border-dashed border-neutral-600 z-0"
                style={{
                    height: `${lifelineHeight}px`,
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    pointerEvents: 'none' // clicking the line shouldn't trigger node selection
                }}
            />

            {/* Activations (Execution Boxes) */}
            {data.activations && data.activations.map((act: { startY: number, endY: number }, i: number) => {
                // The Node itself is positioned at y=50.
                // `startY` from the AST mapper is the global canvas Y coordinate.
                // Calculating startY - 50 perfectly aligns the box to the global arrows.
                return (
                    <div
                        key={i}
                        className="absolute w-3 bg-neutral-600 border border-neutral-400 z-0 shadow-sm"
                        style={{
                            top: `${Math.max(0, act.startY - 50)}px`,
                            height: `${Math.max(10, act.endY - act.startY)}px`,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            pointerEvents: 'none',
                        }}
                    />
                );
            })}
        </div>
    );
});

ComponentNode.displayName = 'ComponentNode';
