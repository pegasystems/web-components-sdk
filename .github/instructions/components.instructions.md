---
applyTo: 'src/{components,helpers}/**'
description: 'Use when creating, modifying, or reviewing SDK components. Covers component structure per category (field, template, widget, designSystemExtension, container), FormComponentBase, Lion rendering, display modes, and helpers.'
---

# Components

Lit + Lion reference implementation of the DX components. Every component lives in its own folder and extends `BridgeBase` (or `FormComponentBase` for form fields).

## Categories at a glance

| Category                 | Location                             | Extends             | Pattern                                                            |
| ------------------------ | ------------------------------------ | ------------------- | ------------------------------------------------------------------ |
| `fields/`                | `src/components/fields`              | `FormComponentBase` | Input controls — propagate values through the engine's actions API |
| `templates/`             | `src/components/templates`           | `BridgeBase`        | Layout/view shells — render children from the PConnect tree        |
| `widgets/`               | `src/components/widgets`             | `BridgeBase`        | Self-contained data views                                          |
| `designSystemExtension/` | `src/components/designSystemExtension` | `LitElement`/`BridgeBase` | Presentational building blocks resolved by other components |
| container / infra        | `src/components` (root level)        | `BridgeBase`        | Case flow, routing, assignment lifecycle plumbing                  |

## Structure

```text
MyComponent/
├── index.ts             # Component implementation + @customElement registration
└── my-component-styles.ts   # Lit `css` template (only when styles exceed a few lines)
```

Copy [src/components/Boilerplate/index.ts](../../src/components/Boilerplate/index.ts) as the starting point. [src/components/hello-world/hello-world.ts](../../src/components/hello-world/hello-world.ts) is the minimal plain-Lit example.

## Standard component shape

```ts
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BridgeBase } from '../../bridge/BridgeBase';
import '../Region'; // every nested custom element MUST be imported explicitly
import { myComponentStyles } from './my-component-styles';

@customElement('my-component')
class MyComponent extends BridgeBase {
  @property({ type: String }) label = '';

  constructor() {
    super(false, false); // (inDebug, inLogging) — never commit these flipped to true
    this.pConn = {};
  }

  connectedCallback() {
    super.connectedCallback();
    this.theComponentStyleTemplate = myComponentStyles;
    this.registerAndSubscribeComponent(this.onStateChange.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  onStateChange() {
    if (super.shouldComponentUpdate()) {
      this.updateSelf();
    }
  }

  render() {
    this.prepareForRender();
    this.renderTemplates.push(html`...`);
    this.addChildTemplates();
    return this.renderTemplates;
  }
}

export default MyComponent;
```

Non-negotiables in this shape:

- `@customElement('kebab-case-tag')` — the Custom Elements standard requires the hyphen.
- `super.connectedCallback()` / `super.disconnectedCallback()` must be called; skipping them leaks store subscriptions and form-field registrations.
- Callbacks passed to `registerAndSubscribeComponent()` must be bound (`.bind(this)`).
- `render()` starts with `prepareForRender()`, otherwise stale templates accumulate.
- A nested custom element that is not imported in the rendering module never upgrades — the tag renders empty with no error.

## Field components (`fields/`)

`FormComponentBase` extends `BridgeBase` and supplies the shared field behaviour: `bRequired` / `bDisabled` / `bReadonly` / `bVisible`, `label` / `annotatedLabel` (asterisk when required), `value`, `displayMode`, `testId`, `actionsApi`, `propName`, and the Lion validator array.

Value propagation always goes through `handleEvent` from [src/helpers/event-utils.ts](../../src/helpers/event-utils.ts) — never call the actions API directly from a field:

| Event type     | Effect                                          | Used by                                      |
| -------------- | ----------------------------------------------- | -------------------------------------------- |
| `'change'`     | `updateFieldValue`                              | `fieldOnChange` (all fields)                 |
| `'blur'`       | `triggerFieldChange`                            | `fieldOnBlur` (text-style inputs)            |
| `'changeNblur'` | both, in one call                               | fields whose value is final on selection     |

Text inputs let the value settle on `@blur`; selection-style fields (checkbox, dropdown, date) propagate on `@model-value-changed` so the engine sees the final value immediately.

Rendering rules:

- Editable → the appropriate `@lion/ui` element (`lion-input`, `lion-select`, `lion-checkbox`, `lion-input-dateonly`, …).
- Read-only (`bReadonly`) → the read-only form variant, not a bare `<span>`.
- `displayMode` set (`DISPLAY_ONLY`, `STACKED_LARGE_VAL`) → delegate to `field-value-list` from `designSystemExtension`. Never hand-roll read-only markup.
- Validation styling is driven by `validatemessage`; the Lion element is marked touched and given the attention class rather than being styled ad hoc.

## Templates and containers

Templates extend `BridgeBase` and render children from the PConnect tree — either by delegating to `Region` / `View`, or by pushing child templates via `addChildTemplates()` / `getChildTemplateArray()`. Never render a PConnect child as raw markup.

Container and navigation components at the root of `src/components` (`RootContainer`, `ViewContainer`, `FlowContainer`, `Assignment`, `NavBar`, `Stages`, `MultiStep`) drive the case lifecycle. They can be changed, but changes must be backward compatible, tested in both portal and embedded samples, and commented with the reasoning — they affect the entire rendering pipeline.

## designSystemExtension

Presentational components consumed by fields and templates: `FieldValueList`, `FieldGroup`, `FieldGroupList`, `SummaryItem`, `SummaryList`, `ProgressIndicator`, `ListUtility`, `Operator`, and the `LionInput*` wrappers. They receive data as properties and are resolved by other components rather than by the engine.

## Helpers (`src/helpers`)

| File                    | Use for                                                                     |
| ----------------------- | --------------------------------------------------------------------------- |
| `event-utils.ts`        | `handleEvent(actions, eventType, propName, value)` — field value propagation |
| `utils.ts`              | Control IDs, static content URLs, option lists, initials, icon URLs          |
| `data_page.ts`          | `getDataPage()` — data page access for dropdowns and lookups                 |
| `banner-utils.ts`       | Validation banner retrieval and rendering                                    |
| `instructions-utils.ts` | Page instructions for multi-select reference lists                           |
| `field-group-utils.ts`  | Field group reference lists and per-item view construction                   |
| `details-utils.ts`      | Converts fields to display-only for details templates                        |
| `date-format-utils.ts`  | Locale-aware date format detection and strings                               |
| `currency-utils.ts`     | Currency ISO code → locale options                                           |
| `versionHelpers.ts`     | SDK / PCore version comparison                                               |
| `formatters/`           | Display-mode value formatters (boolean, currency, date)                      |

## Creating a new component

1. Create `src/components/<Category>/<ComponentName>/`.
2. Copy `Boilerplate/index.ts` and its styles file; rename the class, the style export, and the `@customElement` tag.
3. Fix the relative path to `BridgeBase` for the folder depth.
4. Import every nested custom element the template renders.
5. Add the component's tag to the parent that renders it (for example `Region`), so the engine's component name resolves to a tag.
