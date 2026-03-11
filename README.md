```
███████╗██╗███╗   ███╗██╗     
██╔════╝██║████╗ ████║██║     
███████╗██║██╔████╔██║██║     
╚════██║██║██║╚██╔╝██║██║     
███████║██║██║ ╚═╝ ██║███████╗
╚══════╝╚═╝╚═╝     ╚═╝╚══════╝
```

# SIML — Service Interaction Modelling Language

> **Model-first. Diagram-second. AI-ready.**
> A next-generation, semantically-rich DSL for designing, validating, and visualising service interactions in distributed systems — built for the age of intelligent, autonomous architectures.

---

## What is SIML?

SIML is a lightweight, text-first **Domain-Specific Language (DSL)** and visual modelling platform that treats service interactions as first-class, validated artefacts rather than presentation constructs. Where traditional diagramming tools (PlantUML, Mermaid, draw.io) produce pictures, SIML produces a **semantic model** — a structured, machine-readable representation of your system's architecture that can be queried, validated, and reasoned over.

This makes SIML uniquely suited for teams building AI-augmented development workflows, autonomous code-generation pipelines, and intelligent architecture governance tooling.

---

## Why SIML?

| Problem | Traditional Tools | SIML |
|---|---|---|
| Interactions are free-text, not validated | PlantUML, Mermaid | Typed, structured interactions validated against real definitions |
| Diagrams drift from the code | Architecture wikis | Model is the single source of truth; diagrams are generated views |
| No machine-readable architecture | Static images | Structured YAML consumed by parsers, linters, and AI agents |
| Governance is an afterthought | Manual docs | Security, observability, and tracing metadata baked into the model |
| Reuse is limited | Copy-paste diagrams | Shared contracts, typed components, composable sequences |

---

## Core Principles

1. **Model-First, Diagram-Second** — diagrams are rendered views of the model, not the source of truth.
2. **Semantic Interactions** — every step is typed (`call`, `data`, `message`, `external`) and verified.
3. **Typed Components** — services, databases, queues, event buses, clients, and external systems are distinct first-class entities.
4. **Minimal Authoring Overhead** — concise shorthand syntax lets you express complex flows in seconds.

---

## Quick Example

```yaml
siml: "1.0"

components:
  - name: Client
    type: client

  - name: AuthService
    type: service
    routes:
      - method: POST
        path: /login

  - name: UserDB
    type: database

  - name: EventBus
    type: queue

sequences:
  - name: User Login
    steps:
      - from: Client
        to: AuthService
        action: call
        method: POST
        path: /login

      - from: AuthService
        to: UserDB
        action: data
        operation: read

      - from: AuthService
        to: EventBus
        action: message
        event: user.authenticated
```

### Shorthand Syntax

SIML also supports a compact shorthand for rapid authoring:

```
Client -> AuthService.POST(/login)
AuthService -> UserDB.read(users)
AuthService ~> EventBus.publish(user.authenticated)
```

Use `->` for synchronous calls and `~>` for asynchronous events.

---

## Features

### ✅ Available Now
- **YAML-based DSL** with a formal grammar specification
- **TypeScript parser** with multi-stage pipeline: loader → syntax parser → semantic validator → normaliser
- **Strict and loose validation modes** — fail-fast on errors or emit warnings only
- **CLI tool** (`siml parse <file.yaml> [--strict]`)
- **Split-pane web editor** — Monaco YAML editor alongside a live React Flow diagram
- **Real-time diagram rendering** — diagrams update as you type
- **Drag-and-drop reordering** — reorder components and sequences visually
- **Settings panel** — customise colours, layout, and display preferences

### 🚧 In Development
- **Two-way binding** — edits in the diagram update the YAML and vice versa
- **Click-to-highlight** — click a component or edge to jump to its YAML definition
- **YAML writer** — regenerate clean SIML from model changes
- **Advanced flow logic** — visualise conditionals, retries, and loops

### 🔮 On the Roadmap
- **OpenAPI hydration** — pull real routes directly from your service specs
- **API spec generation** — generate OpenAPI from your SIML model
- **Dependency analysis** — detect coupling, blast radius, and critical paths
- **CI/CD validation gates** — fail builds when model integrity is violated
- **Multi-file workspaces** — compose large architectures from modular SIML files
- **AI-assisted authoring** — natural language → SIML model generation
- **Collaborative editing** — real-time multi-user modelling

---

## Project Structure

```
siml/
├── Design/                  # Architecture specs and design documents
│   ├── DSL Concept.md       # Core vision and motivation
│   ├── DSL_Grammar_Spec.md  # Full grammar reference
│   ├── DSL Shorthand Spec.md
│   ├── Design Principles.md
│   ├── Parser_Architecture.md
│   ├── Modelling_interface_concept.md
│   ├── Gap_Analysis.md
│   ├── Execution_Plan.md
│   └── summary_idea.md
│
├── siml-parser/             # TypeScript parser library and CLI
│   └── src/
│       ├── index.ts         # Public API (parse, parseContent)
│       ├── cli.ts           # CLI entry point
│       ├── types.ts         # Core TypeScript interfaces
│       ├── loader/          # YAML file loading
│       ├── syntax/          # Syntax parsing and AST construction
│       ├── validator/       # Semantic validation
│       └── normaliser/      # Model normalisation and shorthand expansion
│
└── siml-ui/                 # Next.js web application
    └── src/
        ├── app/             # Next.js app router
        ├── components/      # React components
        │   ├── SIMLEditor.tsx
        │   ├── FlowVisualizer.tsx
        │   ├── SettingsModal.tsx
        │   └── flow/        # React Flow custom nodes and edges
        ├── contexts/        # React context (settings)
        └── lib/
            └── siml-parser/ # Bundled parser (with writer and React Flow mapper)
```

---

## Getting Started

### Parser

```bash
cd siml-parser
npm install
npm run build
```

**Programmatic API:**

```typescript
import { parse, parseContent } from 'siml-parser';

// Parse from file
const result = parse('architecture.yaml', 'strict');

// Parse from string
const result = parseContent(yamlString, 'loose');

console.log(result.model);   // Validated, normalised SimlRoot
console.log(result.errors);  // Validation errors
```

**CLI:**

```bash
npm install -g siml-parser

siml parse architecture.yaml
siml parse architecture.yaml --strict
```

### Web UI

```bash
cd siml-ui
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to launch the visual editor. The application opens with a fully-featured example model you can explore and modify immediately.

**Build for production:**

```bash
npm run build
npm run start
```

---

## Technology Stack

| Layer | Technology |
|---|---|
| Parser | Node.js, TypeScript, js-yaml, Jest |
| Web UI | Next.js 14, React 18, TypeScript |
| Editor | Monaco Editor (`@monaco-editor/react`) |
| Diagram | React Flow + Dagre layout engine |
| Styling | Tailwind CSS |
| Icons | Lucide React |

---

## Architecture Overview

```
┌────────────────────────────────────────────────────────────┐
│                      SIML Ecosystem                        │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  siml-parser                         │  │
│  │                                                      │  │
│  │  YAML Input                                          │  │
│  │      │                                               │  │
│  │      ▼                                               │  │
│  │  [ Loader ] ──► [ Syntax Parser ] ──► [ Validator ]  │  │
│  │                                           │          │  │
│  │                                           ▼          │  │
│  │                                     [ Normaliser ]   │  │
│  │                                           │          │  │
│  │                                           ▼          │  │
│  │                                     SimlRoot Model   │  │
│  └──────────────────────────────────────────────────────┘  │
│                        │                                    │
│              npm package / bundled lib                      │
│                        │                                    │
│                        ▼                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    siml-ui                           │  │
│  │                                                      │  │
│  │  ┌───────────────────┐   ┌────────────────────────┐ │  │
│  │  │   Monaco Editor   │   │     React Flow         │ │  │
│  │  │   (YAML Source)   │◄──►   (Live Diagram)       │ │  │
│  │  └───────────────────┘   └────────────────────────┘ │  │
│  │           ▲                         ▲                │  │
│  │           └──────── Parser ─────────┘                │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

---

## SIML as an AI-Aligned Architecture Tool

SIML is designed with the emerging AI-augmented development landscape in mind.

- **Machine-readable models** — the structured YAML format is trivially consumable by LLMs, code generators, and autonomous agents, enabling AI tools to reason over your architecture with full context.
- **Validation as a contract** — strict parsing ensures any AI-generated SIML is structurally and semantically correct before it enters your workflow.
- **Traceable, version-controlled architecture** — SIML files live in your repo alongside code, giving AI tools full history and diff-ability of architectural decisions.
- **Foundation for agentic workflows** — SIML models can act as the authoritative architectural context fed to AI coding agents, grounding their code generation in real service topology.

> SIML bridges the gap between the human-readable intent of your architecture and the machine-processable representation needed for the next generation of intelligent development tools.

---

## Contributing

Contributions are welcome! The design specifications in the `Design/` directory describe the full intended grammar, parser architecture, and UI concept. If you're looking for a place to start:

- Check `Design/Execution_Plan.md` for the phased implementation roadmap
- Review `Design/Gap_Analysis.md` for known gaps between the current implementation and the target design
- Browse open issues for tasks in progress

---

## License

This project is open source. See [LICENSE](LICENSE) for details.
