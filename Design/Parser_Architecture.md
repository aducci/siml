# SIML Parser Architecture Design (Node.js / JavaScript)

## 1. Purpose

This document describes the architecture for a JavaScript-based parser that processes SIML (Service Interaction Modelling Language) files and converts them into a validated internal model suitable for:

* diagram rendering
* validation and linting
* API/spec generation
* dependency analysis

The parser is intended to run in Node.js initially, with a design that allows reuse in browser environments later.

---

## 2. High-Level Architecture

The parser is structured as a pipeline of stages:

```
Input File
   ↓
YAML Loader
   ↓
Syntax Parser
   ↓
Semantic Validator
   ↓
Model Normaliser
   ↓
Internal Representation (AST-like model)
   ↓
Renderers / Exporters
```

Each stage is isolated so it can evolve independently.

---

## 3. Core Modules

### 3.1 Loader Module

**Responsibility**

* Read file(s)
* Parse YAML into JS objects
* Provide error context (line/column mapping)

**Suggested library**

* `yaml` (eemeli/yaml) or `js-yaml`

**Output**
Plain JS object representing the raw SIML document.

---

### 3.2 Syntax Parser

**Responsibility**

* Verify presence of required top-level sections
* Ensure basic structural correctness
* Convert raw object into typed node structures

**Output**
A structured object graph representing:

* ComponentNode
* ContractNode
* SequenceNode
* StepNode

This layer should not validate architecture logic yet — only shape.

---

### 3.3 Semantic Validator

**Responsibility**
This is the most important stage.

It validates relationships and meaning:

#### Component checks

* Duplicate names
* Invalid type usage
* Unsupported attributes for type

#### Sequence checks

* Components referenced exist
* Routes referenced exist on services
* Operations valid for target type
* Contracts referenced exist
* Interaction type matches target component type

#### Optional advanced checks

* Version mismatches
* Protocol inconsistencies
* Circular dependency detection

**Output**

* validated model
* structured error list with locations

---

### 3.4 Model Normaliser

**Responsibility**
Transform the validated model into a canonical internal structure that renderers can consume.

Examples:

* Expand shorthand routes into full objects
* Infer default protocols
* Attach component metadata to steps
* Resolve contract references

This produces a **fully enriched model**.

---

### 3.5 Internal Representation

The internal model should resemble an AST but be domain-focused rather than syntax-focused.

Example structure:

```js
Model {
  components: Map<string, Component>
  contracts: Map<string, Contract>
  sequences: Sequence[]
}

Component {
  name
  type
  routes[]
  metadata{}
}

Sequence {
  name
  steps[]
}

Step {
  from: ComponentRef
  to: ComponentRef
  interactionType
  resolvedRoute
  resolvedContract
}
```

This object becomes the single source of truth for all downstream processing.

---

## 4. Error Handling Strategy

Errors should be:

* precise (line + field)
* categorised
* non-fatal where possible

Example:

```
[SIML1003] Route not found
Sequence: Create Loan
Step: 2
CreditService does not expose POST /credit-check
```

This allows IDE tooling or CLI linting later.

---

## 5. Public API Design

The parser should expose a simple API:

```js
parseSiml(filePath, options) → ModelResult
```

Where:

```js
ModelResult {
  model: InternalModel | null
  errors: ParserError[]
  warnings: ParserWarning[]
}
```

Optional advanced API:

```js
validate(model) → ValidationReport
render(model, rendererType)
```

---

## 6. Suggested Folder Structure

```
/siml-parser
  /src
    /loader
    /syntax
    /validation
    /normaliser
    /model
    /errors
    index.js
```

This separation makes it easy to:

* add plugins later
* add new renderers
* swap loaders (JSON/YAML/Markdown)

---

## 7. Extensibility Strategy

The parser should support:

### Custom validators

Allow registration of additional rules:

```js
registerValidator(fn)
```

### Custom component types

Allow schema extension via configuration.

### Renderer plugins

Renderers should consume only the internal model, not the raw YAML.

---

## 8. Future Evolution Path

This architecture allows:

* browser-based editor integration
* VS Code extension for live validation
* API contract generation
* automated diagram generation
* architecture governance tooling

By keeping parsing, validation, and rendering separate, the SIML model can evolve without breaking tooling.

---

## 9. Summary

The SIML parser should be designed as a layered processing pipeline that:

1. Loads YAML safely
2. Parses structure into typed nodes
3. Validates semantic relationships
4. Normalises data into a canonical internal model
5. Exposes a clean API for rendering and analysis

This approach ensures the parser becomes the foundation of a broader modelling platform rather than just a diagram preprocessor.

---

**End of Parser Architecture Design**
