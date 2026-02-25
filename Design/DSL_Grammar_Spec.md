# Service Interaction Modelling Language (SIML) — Draft Grammar Specification

## 1. Overview

SIML is a lightweight, YAML-based domain-specific language for defining system components and modelling their interactions.
The grammar is intentionally minimal, human-readable, and structured to support validation, diagram rendering, and downstream artefact generation.

The language is organised into three primary sections:

1. **components** — definition of architectural elements
2. **contracts** *(optional)* — reusable API/message definitions
3. **sequences** — interaction flows between components

---

## 2. Top-Level Structure

```yaml
siml: <version>

components: {}
contracts: {}
sequences: []
```

### Rules

* `siml` is required (string version identifier)
* `components` is required
* `sequences` is required
* `contracts` is optional

---

## 3. Component Grammar

Components represent deployable or logical runtime participants.

```yaml
components:
  <ComponentName>:
    type: <component_type>
    description: <text>            # optional
    technology: <text>             # optional
    tags: [<tag>, <tag>]           # optional
    attributes:                    # optional arbitrary metadata
      <key>: <value>

    routes:                        # only valid for type=service
      - method: <HTTP method>
        path: <route path>
        contract: <ContractName>   # optional
        description: <text>        # optional

    datastore:                     # only valid for type=database
      engine: <text>
      protocol: <text>

    messaging:                     # only valid for queue/event types
      mode: publish|subscribe|both
      protocol: <text>
```

### Supported Component Types

```
service
database
queue
eventbus
external
client
```

### Constraints

* `routes` only valid when `type: service`
* `datastore` only valid when `type: database`
* `messaging` only valid for `queue` or `eventbus`

---

## 4. Contract Grammar (Optional)

Contracts define reusable API or message payloads.

```yaml
contracts:
  <ContractName>:
    version: <string>
    type: request|response|event
    schema: <reference or inline object>
    description: <text>        # optional
```

Contracts may be referenced from:

* service routes
* sequence interactions

---

## 5. Sequence Grammar

A sequence represents an ordered interaction flow.

```yaml
sequences:
  - name: <SequenceName>
    description: <text>             # optional
    actors: [<ComponentName>]       # optional explicit participants

    steps:
      - from: <ComponentName>
        to: <ComponentName>
        action: <interaction_type>
        route: <HTTP route>         # for service calls
        operation: read|write       # for databases
        topic: <string>             # for messaging
        contract: <ContractName>    # optional
        protocol: <string>          # optional override
        mode: sync|async            # optional
        description: <text>         # optional
```

---

## 6. Interaction Types

The `action` field determines allowed attributes.

### Service Invocation

```yaml
action: call
route: POST /loans
```

Optional fields:

```
contract
mode
timeout
headers
```

---

### Database Interaction

```yaml
action: data
operation: read | write
```

Optional:

```
table
entity
transaction: true|false
```

---

### Messaging Interaction

```yaml
action: message
topic: loan.created
```

Optional:

```
mode: publish|consume
contract
```

---

### External/System Interaction

```yaml
action: external
contract: CreditBureauCheck
```

---

## 7. Validation Rules

A compliant SIML parser should enforce:

1. All referenced components exist
2. Routes referenced in sequences exist on the target service
3. Contracts referenced exist in the contract registry
4. Interaction attributes match the target component type
5. Sequence steps are ordered and deterministic

---

## 8. Minimal Example

```yaml
siml: 0.1

components:

  LoanAPI:
    type: service
    routes:
      - method: POST
        path: /loans
        contract: LoanCreateRequest

  CreditService:
    type: service
    routes:
      - method: POST
        path: /credit-check

  LoanDB:
    type: database
    datastore:
      engine: postgres
      protocol: jdbc

contracts:
  LoanCreateRequest:
    version: v1
    type: request

sequences:

  - name: Create Loan

    steps:
      - from: LoanAPI
        to: CreditService
        action: call
        route: POST /credit-check

      - from: CreditService
        to: LoanDB
        action: data
        operation: write
```

---

## 9. Extensibility Strategy

The grammar is designed so that:

* New component types can be added without changing sequence syntax
* New interaction attributes can be added without breaking existing models
* Additional renderers (diagram, OpenAPI, inventory, dependency map) can be layered on top

The grammar deliberately prioritises:

* structural clarity
* validation capability
* extensibility

over compactness.

---

## 10. Intent of the Grammar

This grammar is not intended to replace UML sequence syntax.
It is intended to provide a structured architecture modelling layer that can *generate* diagrams and specifications from a shared semantic model.

In this sense, SIML treats:

* components as architecture assets
* interactions as typed relationships
* diagrams as visual projections of the model

rather than as the source artefact itself.

---

**End of Draft Grammar v0.1**
