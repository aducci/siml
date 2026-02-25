'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { parseContent, SimlRoot, generateYaml } from '@/lib/siml-parser';
import { Settings } from 'lucide-react';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { SettingsModal } from '@/components/SettingsModal';
import { EditorRef } from '@/components/SIMLEditor';

// Dynamic imports for heavy client-side components
const SIMLEditor = dynamic(() => import('@/components/SIMLEditor'), { ssr: false });
const FlowVisualizer = dynamic(() => import('@/components/FlowVisualizer'), { ssr: false });

const DEFAULT_YAML = `siml: "1.0"
components:
  Frontend:
    type: client
  APIGateway:
    type: service
  AuthService:
    type: service
  KafkaQueue:
    type: queue
  PaymentGateway:
    type: external
  UserDB:
    type: database
  NotificationSvc:
    type: eventbus

sequences:
  - name: Comprehensive System Flow
    steps:
      - Frontend -> APIGateway.POST(/login) "Validate Customer Login"
      - APIGateway -> APIGateway.validateToken() "Internal Token Check"
      - APIGateway -> AuthService.validate()
      - AuthService -> UserDB.query(user_hash)
      - UserDB -> AuthService.return(user_record)
      - AuthService -> APIGateway.return(200 OK Token)

      - mode: async
        call: APIGateway -> KafkaQueue.publish(login_event)
        label: "Asynchronous Event Offload"
      - APIGateway -> Frontend.return(JWT Success)

      - mode: async
        call: KafkaQueue -> NotificationSvc.consume()
        label: "Consume & Notify Workstream"

      - NotificationSvc -> PaymentGateway.verifySub() "Check External Sub Status"
      - PaymentGateway -> NotificationSvc.return(Active)

      - mode: async
        call: NotificationSvc -> Frontend.notify(Welcome!)
        label: "Fire & Forget UI Notification"
`;

export default function Home() {
  const [yaml, setYaml] = useState<string>(DEFAULT_YAML);
  const [model, setModel] = useState<SimlRoot | null>(null);
  const [errors, setErrors] = useState<any[]>([]);

  const editorRef = React.useRef<EditorRef>(null);

  // Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Split Pane Resizing State
  const [leftWidth, setLeftWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth > 20 && newWidth < 80) {
      setLeftWidth(newWidth);
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  useEffect(() => {
    // Debounce checking?
    const timer = setTimeout(() => {
      const result = parseContent(yaml);
      setModel(result.model);
      setErrors(result.errors);
    }, 500);

    return () => clearTimeout(timer);
  }, [yaml]);

  return (
    <SettingsProvider>
      <main className="flex h-screen w-screen flex-col bg-black text-white overflow-hidden">
        <div className="z-10 w-full h-full font-mono text-sm flex flex-col">
          {/* Header */}
          <header className="h-12 border-b border-neutral-800 flex items-center px-4 bg-neutral-900">
            <h1 className="font-bold text-lg">SIML Editor</h1>
            <span className="ml-4 text-xs text-neutral-500">v0.1</span>

            <button
              onClick={() => {
                if (model) {
                  const generated = generateYaml(model);
                  setYaml(generated);
                }
              }}
              disabled={!model || errors.length > 0}
              className="ml-4 px-3 py-1 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-700 text-white text-xs rounded transition-colors"
            >
              Format / Regen YAML
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="ml-auto p-2 text-neutral-400 hover:text-white transition-colors"
              title="Settings"
            >
              <Settings size={20} />
            </button>

            {errors.length > 0 && (
              <span className="ml-4 text-red-400 text-xs">
                {errors.length} error(s)
              </span>
            )}
          </header>

          {/* Main Content Split */}
          <div
            className="flex-1 flex flex-row overflow-hidden relative"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Left: Editor */}
            <div style={{ width: `${leftWidth}%` }} className="h-full relative border-r border-neutral-800">
              <SIMLEditor
                value={yaml}
                onChange={(val) => setYaml(val || '')}
                errors={errors}
                editorRef={editorRef}
              />
            </div>

            <div
              className="w-2 z-10 bg-neutral-900 border-x border-neutral-800 hover:bg-blue-600 transition-colors cursor-col-resize flex flex-col items-center justify-center select-none"
              onMouseDown={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
            >
              <div className="w-0.5 h-8 bg-neutral-500 rounded-full pointer-events-none" />
            </div>

            {/* Right: Visualizer */}
            <div style={{ width: `${100 - leftWidth}%` }} className="h-full bg-neutral-900 relative">
              <FlowVisualizer
                model={model}
                onModelUpdate={(updatedModel) => {
                  const newYamlStr = generateYaml(updatedModel);
                  setYaml(newYamlStr);
                }}
                onSelectLine={(offset) => editorRef.current?.focusOffset(offset)}
              />
            </div>

            {/* Cover iframe pointer events while dragging */}
            {isDragging && <div className="absolute inset-0 z-50 cursor-col-resize" />}
          </div>

          {/* Footer / Error Panel */}
          {errors.length > 0 && (
            <div className="h-32 bg-neutral-950 border-t border-red-900 overflow-auto p-2">
              <h3 className="text-red-500 font-bold mb-1">Errors</h3>
              {errors.map((e, i) => (
                <div key={i} className="text-red-400 mb-1">
                  {e instanceof Error ? e.message : (e.message || JSON.stringify(e))}
                  {'sequence' in e && ` (seq: ${e.sequence}, step: ${e.stepIndex})`}
                </div>
              ))}
            </div>
          )}
        </div>
        <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      </main>
    </SettingsProvider>
  );
}
