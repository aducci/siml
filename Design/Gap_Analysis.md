# SIML UI Gap Analysis & Resolution Plan

## 1. Executive Summary

This document reviews the current state of the `siml-ui` codebase against the `Design/Modelling_interface_concept.md` design concept. The current implementation has successfully established the foundational "Split Pane" layout connecting a Monaco YAML Editor to a live Mermaid-based diagram. However, the advanced interactive features defined in the concept are currently missing, largely constrained by the choice of Mermaid as the diagramming engine.

## 2. Gap Analysis

| Requirement | Design Concept | Current Implementation | Gap / Status |
| :--- | :--- | :--- | :--- |
| **Single Source of Truth** | Parser builds an internal model; both Editor and Diagram update from it. Changes to either surface rewrite the other. | React state holds raw YAML string and parsed `SimlRoot`. Diagram auto-updates on YAML change, but Diagram *cannot* update the YAML. | ⚠️ **Partial.** Unidirectional flow (Text -> Diagram) only. |
| **Two-Level Click Behaviour** | Clicking visual elements highlights YAML lines. Second click enables edit mode. | Static Mermaid SVG is rendered. No event listeners are attached to diagram nodes. | ❌ **Missing.** |
| **Structural Dragging** | Dragging components/steps in diagram updates layout and rewrites YAML. | Mermaid SVGs do not natively support drag-and-drop reordering. | ❌ **Missing.** |
| **Hidden Logic Indicators** | Expandable dots to show/hide conditional logic in the diagram. | Standard Mermaid sequence diagram flow. No expandable custom visual blocks. | ❌ **Missing.** |
| **Visual Renderer** | WebGL-rendered diagram via a scene graph (to support smooth animation and interaction). | Client-side Mermaid rendering to SVG string. | ⚠️ **Deviation.** Mermaid is used instead of WebGL. |
| **YAML Writer** | Regenerates YAML file from AST/Model, preserving order and ideally comments. | `siml-parser` currently acts only as a parser/validator. It has no AST-to-YAML stringifier. | ❌ **Missing.** |

## 3. Plan of Resolution

To close the gap between the Proof-of-Concept and the Design Concept, a phased approach is recommended:

### Phase 2: Migrate Rendering Engine (Starting Small)
Mermaid.js is inherently poorly suited for drag-and-drop interactions and two-way binding. We will iteratively replace it with a custom React-based renderer, most likely utilizing **React Flow** (coupled with a layout engine like Dagre or ELK.js for deterministic sequence diagram placement).

1. **Step 1 - Basic React Flow Setup (Visual Parity)**: Introduce React Flow and implement an auto-layout that renders standard nodes for Components and connections for Sequence steps. The goal is static visual parity with the current Mermaid implementation.
2. **Step 2 - Custom Sequence Nodes**: Build React components for custom React Flow nodes to map onto the layered visual layout (Layer 1). This focuses on styling the participant columns and sequence arrows clearly.
3. **Step 3 - Drag and Drop (Structural Editing)**: Enable React Flow's native dragging properties. Bind `onNodeDragEnd` events to rearrange the sequence order in the `SimlRoot` model, which then feeds into the Phase 1 YAML Writer to update the Monaco editor continuously.

### Phase 3: Implement Interactive Behaviours
Once the new renderer and two-way binding foundation are stable:
1. **Click-to-Highlight**: Map node clicks in the renderer to line mappings on the AST. Trigger the Monaco Editor API `editor.revealLineInCenter(lineNumber)` and apply highlight decorations.
2. **Hidden Logic Nodes**: Implement the expandable conditionals logic as specialized interactive custom nodes within React Flow.
3. **Inline Title Editing**: Hook the "second click on label" interaction to inline inputs that trigger the YAML compiler to re-process.
