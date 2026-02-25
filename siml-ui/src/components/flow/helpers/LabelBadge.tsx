import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';

interface LabelBadgeProps {
    labelLines: string[];
    x: number;
    y: number;
    sourceLine?: number;
    onSelectLine?: (line: number) => void;
}

/**
 * A reusable floating label badge designed for Sequence Diagram arrows.
 * Positions itself precisely above the coordinate, centered.
 */
export function LabelBadge({ labelLines, x, y, sourceLine, onSelectLine }: LabelBadgeProps) {
    const { settings } = useSettings();
    if (!labelLines || labelLines.length === 0) return null;

    return (
        <div
            style={{
                position: 'absolute',
                transform: `translate(-50%, -100%) translate(${x}px, ${y - 5}px)`,
                pointerEvents: 'all',
                fontSize: `${settings.labelFontSize}px`
            }}
            className="nodrag nopan flex flex-col items-center justify-end font-mono font-medium text-neutral-300 drop-shadow-md z-20 cursor-pointer hover:scale-105 transition-transform"
            onClick={(e) => {
                e.stopPropagation();
                if (onSelectLine && sourceLine) onSelectLine(sourceLine);
            }}
        >
            {labelLines.map((line, idx) => (
                <span key={idx} className={idx === 0 && labelLines.length > 1 ? 'text-amber-200 font-bold bg-neutral-900/90 px-1 py-[1px] rounded-t text-sm' : 'text-neutral-300 bg-neutral-900/90 px-1 py-[1px] rounded-b mt-[1px] text-xs'}>
                    {line}
                </span>
            ))}
        </div>
    );
}
