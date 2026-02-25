# SIML Parser — Execution Plan

This document outlines the phased approach to building the **SIML Parser** based on the architecture and requirements defined in the Design folder.

## 1. Project Initialization & Foundation
**Goal**: Set up the project structure and rudimentary file loading.

*   **Task 1.1**: Initialize Node.js project (`siml-parser`) with TypeScript, Jest, and ESLint.
*   **Task 1.2**: Define core TypeScript interfaces for the Internal Model (AST).
*   **Task 1.3**: Implement the **Loader Module** using `js-yaml`.
    *   *Verification*: Test loading a simple `.yaml` file and verifying the JS object output.

## 2. Syntax Parsing
**Goal**: Convert raw layout into a structured AST and validate basic schema.

*   **Task 2.1**: Implement **Syntax Parser**.
    *   Validate presence of `siml`, `components`, `sequences`.
*   **Task 2.2**: Implement Component parsing.
    *   Map `routes`, `datastore`, `messaging` to typed objects.
*   **Task 2.3**: Implement Sequence parsing.
    *   Structure `steps` into explicit objects (even if they use shorthand).
*   *Verification*: Unit tests ensuring raw YAML translates to correct Typescript interfaces.

## 3. Semantic Validation
**Goal**: Ensure the model makes architectural sense (referential integrity).

*   **Task 3.1**: Implement **Validator Module**.
    *   Check 1: Component name uniqueness.
    *   Check 2: `step.from` and `step.to` refer to existing components.
    *   Check 3: `step.action` is valid for the target component's `type`.
*   **Task 3.2**: Implement Route & Contract validation.
    *   Ensure referenced operations (e.g., `POST /loans`) exist in the target Service component.
*   *Verification*: Create "invalid" test files (e.g., calling a non-existent service) and ensure the validator returns correct error messages.

## 4. Model Normalisation
**Goal**: Produce the canonical "Internal Representation" for consumers.

*   **Task 4.1**: Implement **Normaliser Module**.
    *   Expand shorthand syntax (e.g., `A -> B.act`) into full Step objects if not already done.
    *   Apply defaults (e.g., inferred protocols).
*   **Task 4.2**: Implement Public API (`parseSiml`).
    *   Return `{ model, errors, warnings }`.

## 5. CLI & Documentation
**Goal**: Make the tool usable from the command line.

*   **Task 5.1**: specific CLI wrapper (e.g., `bin/siml`).
    *   Command: `siml parse <file.yaml>`.
*   **Task 5.2**: Documentation.
    *   Update `README.md` with usage instructions.

## 6. Modelling/Visualisation Interface [NEW]
**Goal**: Build a web-based interface for visualizing and interacting with the model.

*   **Task 6.1**: Setup Frontend Project (Next.js/React).
*   **Task 6.2**: Implement Editor Interface (CodeMirror/Monaco).
*   **Task 6.3**: Implement Visualizer (build from scratch (very basic)).
*   **Task 6.4**: Connect Parser to Frontend (WASM or API).
    *   *Verification*: Open the web app, type SIML code, and see the rendered diagram update in real-time.
