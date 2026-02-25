# SIML Web Modelling Interface — Lightweight Design Concept (v0.1)

## 1. Purpose

This document outlines the design for a browser-based SIML modelling interface that provides:

* a YAML editor as the authoring surface
* a live auto-layout visualisation of the model
* bidirectional interaction between text and diagram
* simple visual cues for advanced flow logic

The goal is to create a clean, fast authoring experience that feels lightweight like text-first diagram tools, while enabling structured architectural modelling.

---

# 2. Core Interaction Principles

### Single Source of Truth

* SIML file is loaded on open
* Parser builds an **internal model**
* Both YAML editor and diagram update from that model
* Any change in either surface updates the model, then re-renders both

This ensures consistency while enabling visual editing.

---

### Two-Level Click Behaviour

**Single click on visual element**
→ highlights the corresponding YAML line

**Second click on element label**
→ switches to edit mode
→ jumps to the definition block in YAML
→ focuses cursor for editing

This preserves the text-first workflow while enabling quick navigation.

---

### Structural Dragging

Drag operations update both:

* diagram layout
* YAML ordering in file

Supported initially:

* reorder participants (columns)
* reorder sequence steps

Dragging triggers:

1. update internal model ordering
2. rewrite YAML structure
3. re-render diagram

This keeps file and view aligned at all times.

---

### Hidden Logic Indicators

Advanced constructs (conditions, loops, retries, etc.) should not clutter the base diagram.

Instead:

* a small dot indicator appears on the step
* clicking expands an inline visual block
* block shows conditional/logic structure
* clicking again collapses it

This keeps the diagram readable while exposing deeper behaviour when needed.

Future extension:

* side inspection panel for detailed structured view

---

# 3. Layout & Visual Model

### Layout Philosophy

* auto-layout only
* deterministic placement
* no free positioning
* columns represent components
* vertical flow represents time/order

This ensures diagrams remain stable and reproducible from the model.

---

### Visual Layers

**Layer 1 — Core Sequence**

* participants
* arrows
* step labels

**Layer 2 — Semantic Indicators**

* condition dot
* retry/timeout icons
* async/sync markers
* security markers (later)

**Layer 3 — Expanded Blocks (on click)**

* condition branches
* loop bounds
* exception paths

This layered approach prevents visual overload.

---

# 4. Interface Layout

```
 -----------------------------------------------------
| YAML Editor        |  Visual Diagram               |
|                    |                               |
|                    |                               |
|                    |                               |
|                    |                               |
 -----------------------------------------------------
```

### Left Pane

* YAML editor
* syntax highlighting
* line tracking
* error annotations

### Right Pane

* WebGL-rendered diagram
* interactive nodes and edges
* hover highlights
* click navigation
* drag reordering

Resizable split divider between panes.

---

# 5. Rendering Technology Choice

### Editor

* Monaco editor (robust, extensible, widely supported)

### Framework

* React (strong ecosystem, component model, future extensibility)

### Diagram Engine

* WebGL renderer (via a scene graph abstraction)

Rationale:

* smooth animations
* scalable for large diagrams
* future support for overlays and interactive layers
* easier expansion into richer modelling views later

SVG could be fallback for export.

---

# 6. Internal Architecture

## Core Modules

### Parser Bridge

* converts YAML → SIML model
* stores source position mapping
* enables reverse lookup from diagram nodes to text

### Model Store

* central in-memory model
* updates from editor OR diagram
* emits change events

### Renderer

* consumes model
* builds visual graph
* manages layout engine

### Interaction Controller

* maps clicks to model nodes
* maps drags to ordering changes
* triggers YAML rewrite

### YAML Writer

* regenerates file from updated model
* preserves ordering and comments where possible

---

# 7. Event Flow Examples

### Click Diagram Node

1. renderer identifies node id
2. lookup source location from model
3. editor highlights line

---

### Drag Step

1. user drags arrow
2. controller updates model order
3. YAML writer rewrites sequence steps
4. editor updates
5. renderer re-runs layout

---

### Edit YAML

1. editor change event fires
2. parser updates model
3. renderer re-renders diagram

---

# 8. Initial Scope

Version 1 should support:

* single SIML file
* sequence diagrams only
* component columns
* step dragging
* click-to-highlight navigation
* conditional indicators (expand inline)
* YAML rewrite on visual edits

---

# 9. Future Expansion Path

This architecture allows later addition of:

* external imports / hydration
* BPMN-style flow view
* data lineage overlays
* governance checks
* observability visualisation
* collaborative editing
* multi-file workspaces

The internal model and WebGL renderer make these upgrades feasible without redesigning the UI.

---

# 10. Summary

The SIML interface is intended to feel like a lightweight text-driven diagram tool, while quietly providing the power of a structured architecture modelling platform.

It preserves the simplicity of writing YAML, but adds:

* visual navigation
* structural editing
* semantic awareness
* extensible rendering

The result is a modelling environment that supports both rapid design and long-term architectural governance.

---

**End of SIML Web Interface Concept (v0.1)**
