'use client';

import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { X } from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const { settings, updateSettings } = useSettings();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 w-96 shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold mb-4 text-white">Layout Settings</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-neutral-400 mb-1">
                            Component Spacing X (px)
                        </label>
                        <input
                            type="number"
                            value={settings.componentSpacingX}
                            onChange={(e) => updateSettings({ componentSpacingX: Number(e.target.value) })}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-neutral-400 mb-1">
                            Sequence Start Y (px)
                        </label>
                        <input
                            type="number"
                            value={settings.sequenceStartY}
                            onChange={(e) => updateSettings({ sequenceStartY: Number(e.target.value) })}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-neutral-400 mb-1">
                            Step Spacing Y (px)
                        </label>
                        <input
                            type="number"
                            value={settings.stepSpacingY}
                            onChange={(e) => updateSettings({ stepSpacingY: Number(e.target.value) })}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-neutral-400 mb-1">
                            Header Font Size (px)
                        </label>
                        <input
                            type="number"
                            value={settings.headerFontSize}
                            onChange={(e) => updateSettings({ headerFontSize: Number(e.target.value) })}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-neutral-400 mb-1">
                            Label Font Size (px)
                        </label>
                        <input
                            type="number"
                            value={settings.labelFontSize}
                            onChange={(e) => updateSettings({ labelFontSize: Number(e.target.value) })}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-neutral-400 mb-1">
                            Arrow Head Size (px)
                        </label>
                        <input
                            type="number"
                            value={settings.arrowHeadSize}
                            onChange={(e) => updateSettings({ arrowHeadSize: Number(e.target.value) })}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-neutral-400 mb-1">
                            Note Font Size (px)
                        </label>
                        <input
                            type="number"
                            value={settings.noteFontSize}
                            onChange={(e) => updateSettings({ noteFontSize: Number(e.target.value) })}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
