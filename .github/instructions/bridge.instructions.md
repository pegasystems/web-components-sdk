---
applyTo: 'src/bridge/**'
description: 'Use when modifying the BridgeBase layer. Covers PConnect normalization, store subscription, prop diffing, child template composition, and action wiring.'
---

# BridgeBase Architecture

`src/bridge/BridgeBase` is the SDK's integration layer between the ConstellationJS Engine and Lit web components. The engine decides **what** to render; the bridge decides **how** a Lit component receives, diffs, and re-renders it.

`@pega/constellationjs` provides `PCore` (global API), `PConnect` (per-component API), and the Redux store (`PCore.getStore()`). `BridgeBase` extends `LitElement` and consumes those so individual components never touch `PCore` directly.

## Files

| File                 | Responsibility                                                                     |
| -------------------- | ---------------------------------------------------------------------------------- |
| `index.ts`           | `BridgeBase` class — normalization, subscription, prop diffing, template assembly   |
| `bootstrap-styles.ts` | Minified Bootstrap CSS as a Lit `css` template, applied as `BridgeBase.styles`      |

## How BridgeBase works

1. **PConnect normalization**: `normalizePConnect()` accepts either a raw PConnect object or a wrapper exposing `getPConnect()`, and resolves both to `this.thePConn`. Children are pulled with `getChildren()`.
2. **Registration**: `registerAndSubscribeComponent(callback)` snapshots the current props, calls `processActions()`, subscribes to the Redux store, stores the unsubscribe function, and calls `addFormField()`.
3. **Prop diffing**: `shouldComponentUpdate()` compares the cached `theComponentProps` against freshly resolved props (`resolveConfigProps()`), refreshes `validateMessage`, and returns whether a re-render is warranted.
4. **Action wiring**: `processActions()` binds `onChange` → `changeHandler` and `onBlur` → `eventHandler`, both delegating to `thePConn.getActionsApi()`.
5. **Template assembly**: `prepareForRender()` resets `renderTemplates` and re-adds the component's style template; `addChildTemplates()` / `getChildTemplateArray()` map child component names to their custom element tags with `.pConn=${child}` bound.
6. **Teardown**: `disconnectedCallback()` unsubscribes from the store, calls `removeFormField()`, and cleans up the context tree node.

```text
PConnect metadata (from engine)
  → normalizePConnect() resolves thePConn + children
  → registerAndSubscribeComponent() subscribes to PCore.getStore()
  → store change → onStateChange() → shouldComponentUpdate()
  → render() → prepareForRender() → addChildTemplates() → renderTemplates
```

## Rules for modifying bridge code

- **Do NOT create a separate store** — `PCore.getStore()` **is** the store.
- **Do NOT bypass `BridgeBase`** to render PConnect nodes; components must extend it rather than talk to the engine directly.
- **Do NOT import from `@pega/constellationjs` directly** — use the shapes from `@pega/pcore-pconnect-typedefs`.
- **The bridge contains no business logic** — it is a mapping and wiring layer only.
- **Subscription and form-field registration are paired** — anything added in `registerAndSubscribeComponent()` must be released in `disconnectedCallback()`, or field references leak into the context tree and later submissions fail.
- **`removeFormField()` on teardown is not optional** — skipping it leaves stale fields registered with the engine.
- **Prop diffing is intentional** — `shouldComponentUpdate()` exists to avoid re-rendering the whole subtree on every store event. Do not simplify it into an unconditional re-render.
- The bridge contract is public API: changes here require maintainer approval and a `CHANGELOG.md` entry.
