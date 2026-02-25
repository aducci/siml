# Service Interaction Modelling Language (SIML) — Concept & Intent

## Purpose

The intent of this initiative is to create a lightweight, markup-driven modelling language for designing and documenting service interactions in modern architectures.

Rather than focusing on diagram syntax, the goal is to define a **semantic model of system components and their interactions**, from which visualisations such as sequence diagrams can be generated automatically.

This shifts the emphasis from drawing diagrams to **designing structured, verifiable architecture artefacts**.

---

## Problem Statement

Traditional sequence diagram tools such as PlantUML, Mermaid, or Structurizr treat interactions primarily as presentation constructs. Messages are typically free-text annotations rather than structured, validated architectural elements.

This creates several limitations:

* Interactions are not validated against real service definitions
* Routes, protocols, and contracts are not modelled as first-class entities
* Diagrams cannot be reused to generate specifications or inventories
* Architecture knowledge remains informal and non-machine-readable

As a result, sequence diagrams often drift from reality and provide limited long-term architectural value.

---

## Core Concept

The proposed solution is a **Service Interaction Modelling Language (SIML)** that:

1. Defines system components as typed resources
   (e.g. services, databases, queues, external systems)

2. Defines interactions as structured relationships
   rather than textual arrows

3. Treats routes, protocols, and operations as explicit model elements

4. Generates visualisations (such as sequence diagrams) from the model, rather than treating the diagram as the source of truth

This makes the diagram a *view*, not the artefact.

---

## Design Principles

### 1. Model-first, diagram-second

The primary output is a structured architecture model.
Diagrams are generated representations of that model.

### 2. Semantic interactions

Interactions should express architectural meaning, such as:

* invoking a service route
* writing to a datastore
* publishing to a queue
* calling an external contract

This allows interactions to be validated and reused.

### 3. Typed components

Each component has a defined type which influences how it can be used:

* Service → exposes routes
* Database → supports read/write operations
* Queue/Event Bus → supports publish/consume
* External system → supports contract calls

This reduces ambiguity and enables automated checks.

### 4. Minimal authoring overhead

The language should remain simple enough to write in Markdown/YAML form, prioritising clarity over verbosity.

---

## Intended Capabilities

A SIML model should enable:

* Generation of sequence diagrams
* Automated validation of routes and interactions
* Production of API inventories
* Identification of integration dependencies
* Traceability between architecture design and API specifications
* Potential generation of OpenAPI scaffolding

Over time, the model could serve as a **source of truth for service interaction design**.

---

## Positioning

This initiative does not aim to replace UML tools.
Instead, it fills a gap between:

* architecture modelling tools
* API specification frameworks
* integration documentation

The goal is to create a pragmatic modelling layer focused specifically on **runtime service interactions and API-driven design**.

---

## Summary

This effort proposes a shift from diagramming to modelling.

By defining a structured language for service interactions, architecture artefacts become:

* machine readable
* verifiable
* reusable
* and automatically visualisable

The outcome is a more reliable and scalable way to design, document, and reason about distributed service architectures.
