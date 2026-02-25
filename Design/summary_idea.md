# SIML — Service Interaction Modelling Language

## Updated Core Concept & Direction (Draft v0.2)

---

# 1. Revised Vision

SIML is evolving from a simple modelling DSL into a **hybrid textual–semantic architecture design framework**.

It combines:

* the simplicity and readability of PlantUML-style sequence syntax
* the structural rigor of architecture modelling languages
* the governance value of API, security, and observability metadata
* and the extensibility needed to power diagrams, validation, and automation

SIML is no longer just a diagram generator — it is intended to be a **single source of truth for service interaction design** that supports both visualisation and engineering controls.

---

# 2. Core Intent

SIML aims to provide:

### A. A Text-First Modelling Experience

* Syntax should feel lightweight and readable like PlantUML
* Authors should be able to describe flows quickly
* Shorthand expressions should be supported
* Full structured syntax remains available when needed

### B. A Semantic Architecture Model Beneath the Text

Behind the readable syntax, SIML maintains a structured model that:

* knows what components exist
* understands their routes and capabilities
* validates interactions
* stores operational attributes
* links to external authoritative sources

This enables diagrams to be generated *and* validated.

---

# 3. Key Design Pillars

## 3.1 Diagram Simplicity, Model Depth

Visually, diagrams should remain minimal and readable.

However, the underlying model may include:

* conditional logic
* parallel branches
* retries/timeouts
* exception paths
* data mappings
* security attributes
* observability metadata

Visual cues (icons, annotations, markers) indicate these exist without cluttering the diagram.

The model can also generate alternative views:

* sequence diagrams
* flow diagrams
* BPMN-like orchestration maps
* dependency graphs

---

## 3.2 External Source Hydration

To avoid duplication and drift, SIML supports importing definitions from external artefacts.

Components may reference:

* OpenAPI specifications
* event schemas
* contract registries
* architecture catalogues

Example:

```yaml
LoanAPI:
  type: service
  spec: https://api.docs.com/loan-api/openapi.json
```

The parser hydrates routes, schemas, and metadata automatically.

SIML therefore becomes an integration layer rather than a parallel registry.

---

## 3.3 Referential Integrity & Context Linking

SIML supports referencing components from external hierarchies or registries.

This enables:

* linking to enterprise architecture inventories
* maintaining traceability to authoritative sources
* embedding SIML into larger modelling ecosystems

Possible syntax:

```yaml
LoanAPI:
  type: service
  import: ea://domain/lending/apis/loan-api
```

SIML models interactions while authoritative systems manage component metadata.

---

## 3.4 Advanced Flow Modelling

SIML sequences may include control constructs such as:

* if / else blocks
* loops
* parallel flows
* error paths (try/catch)
* timeouts
* retries

These enrich the model without forcing complex diagram syntax.

The same model could generate:

* sequence diagrams
* orchestration flows
* operational runbooks

---

## 3.5 Data Flow Awareness

SIML can optionally track payload evolution across steps.

This supports:

* data lineage
* transformation mapping
* payload validation
* performance modelling

Future extensions may allow:

* parametric equations for throughput or latency
* cost or scaling simulations
* architectural impact analysis

---

## 3.6 Governance-Ready Attributes

SIML steps and components may include operational metadata such as:

* authentication type (JWT, OAuth, mTLS)
* encryption requirements
* retry behaviour
* logging expectations
* tracing/span identifiers

This allows SIML to support:

* architecture governance
* security reviews
* observability design
* platform standards enforcement

---

# 4. Syntax Philosophy

SIML will support **two complementary syntaxes**:

### Structured YAML (authoritative form)

Used for precision, automation, and tooling.

### Shorthand Flow Expressions (author-friendly form)

Example:

```yaml
- call: LoanAPI -> CreditService.POST(/credit-check)
```

The parser expands shorthand into structured form automatically.

This preserves readability while maintaining semantic integrity.

---

# 5. Validation Modes

SIML introduces configurable validation strictness.

### Loose Mode

* Missing routes produce warnings
* Useful for exploratory design
* Supports early-stage modelling

### Strict Mode

* Missing routes cause failure
* Contract mismatches fail builds
* Enables SIML to act as a CI/CD contract gate

This allows the same DSL to support both ideation and enforcement.

---

# 6. Updated Role of the Parser

The SIML parser is no longer just a file reader.

It becomes:

* a model builder
* a validator
* a hydrator of external specs
* a normaliser of shorthand syntax
* a provider of architecture intelligence

Its output model should be capable of powering:

* diagram rendering
* API verification
* governance checks
* documentation automation
* dependency analysis

---

# 7. Updated Positioning

SIML is best understood as:

> A semantic interaction modelling layer that sits between architecture tooling, API specifications, and diagram visualisation.

It is not a UML replacement, and not merely a diagram syntax.

It is a **design-time integration language** intended to make service interactions:

* explicit
* verifiable
* traceable
* and automatable

---

# 8. Summary

With these updates, SIML evolves into a platform that:

* keeps the usability of PlantUML-style modelling
* adds semantic understanding of systems and interactions
* integrates with external sources of truth
* supports governance and validation
* and enables richer architecture views beyond diagrams

The long-term intent is for SIML to become a lightweight but powerful layer for defining, validating, and communicating how services actually collaborate at runtime.

---

**End of Updated SIML Core Concept (v0.2 Draft)**
