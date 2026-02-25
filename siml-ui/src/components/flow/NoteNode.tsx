import React, { memo } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

/**
 * NoteNode represents a standalone comment or description block.
 */
export const NoteNode = memo(({ data }: any) => {
    const { settings } = useSettings();

    return (
        <div
            className="flex items-center justify-center text-center font-mono rounded shadow-sm border border-amber-500/50 bg-[#3d2f19] text-amber-300 cursor-pointer hover:border-amber-400 transition-colors"
            style={{
                fontSize: `${settings.noteFontSize}px`,
                width: data.estWidth ? `${data.estWidth}px` : 'auto',
                padding: '4px 8px', // Tighter bounding box buffer
                lineHeight: '1.2' // Removes vertical height text jumping
            }}
            onClick={(e) => {
                if (data.onSelectLine && data.sourceLine) {
                    e.stopPropagation();
                    data.onSelectLine(data.sourceLine);
                }
            }}
        >
            {data.label}
        </div>
    );
});

NoteNode.displayName = 'NoteNode';
