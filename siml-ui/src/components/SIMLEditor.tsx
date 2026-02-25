'use client';

import React, { useImperativeHandle, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';

interface ComponentProps {
    value: string;
    onChange: (value: string | undefined) => void;
    errors?: any[];
    editorRef?: React.Ref<EditorRef>;
}

export interface EditorRef {
    focusOffset: (offset: number) => void;
}

export default function SIMLEditor({ value, onChange, errors, editorRef: customRef }: ComponentProps) {
    const editorRef = useRef<any>(null);

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;
    };

    useImperativeHandle(customRef, () => ({
        focusOffset(offset: number) {
            if (editorRef.current) {
                const editor = editorRef.current;
                const model = editor.getModel();

                if (model) {
                    const pos = model.getPositionAt(offset);
                    const lineNum = pos.lineNumber;

                    editor.revealLineInCenter(lineNum);
                    editor.setSelection({
                        startLineNumber: lineNum,
                        startColumn: 1,
                        endLineNumber: lineNum,
                        endColumn: 100
                    });
                    editor.focus();
                }
            }
        }
    }));

    return (
        <div className="h-full w-full">
            <Editor
                height="100%"
                defaultLanguage="yaml"
                value={value}
                onChange={onChange}
                theme="vs-dark"
                options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                }}
                onMount={handleEditorDidMount}
            />
        </div>
    );
}
