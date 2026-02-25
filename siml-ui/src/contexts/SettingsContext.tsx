'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface LayoutSettings {
    componentSpacingX: number;
    sequenceStartY: number;
    stepSpacingY: number;
    headerFontSize: number;
    labelFontSize: number;
    arrowHeadSize: number;
    noteFontSize: number;
}

const defaultSettings: LayoutSettings = {
    componentSpacingX: 350,
    sequenceStartY: 150,
    stepSpacingY: 80,
    headerFontSize: 16,
    labelFontSize: 14,
    arrowHeadSize: 15,
    noteFontSize: 11,
};

interface SettingsContextType {
    settings: LayoutSettings;
    updateSettings: (newSettings: Partial<LayoutSettings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<LayoutSettings>(defaultSettings);

    const updateSettings = (newSettings: Partial<LayoutSettings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
