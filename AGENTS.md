# AGENTS.md

Instructions for AI coding agents (Copilot, Claude, Cursor, etc.) working in this repository.
Follow this file for every change unless the user explicitly overrides it.

Companion documents:

- [docs/architecture.md](docs/architecture.md) — tech stack, repository layout, component model.
- [.specify/memory/constitution.md](.specify/memory/constitution.md) — durable project principles. If this file ever contradicts the constitution, the constitution wins.

---

## 1. Project overview

- **Name:** `web-components-sdk` (Pega Web Components SDK, aka **SDK-WC**)
- **Version target:** see the compatibility notes in [README.md](README.md) for the supported Pega Infinity release
- **Purpose:** DX components that bridge Pega's ConstellationJS Engine APIs to a non-Constellation design system.
- **License:** Apache-2.0. Do not add code under incompatible licenses.

## 2. Runtime & tooling

- **Node / npm:** use the tested versions listed in [README.md](README.md). Do not upgrade toolchain versions without being asked.
- **Package manager:** npm (there is a `package-lock.json`, no yarn/pnpm).
- Prefer editing existing files over introducing new dependencies. If a new dependency is truly required, call it out explicitly and justify it.

## 3. Coding conventions

1. Follow the [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html) as noted in [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md).
2. Match the existing Lion / Lit patterns already used in this repo. Reference [src/components/hello-world/hello-world.ts](src/components/hello-world/hello-world.ts) as the minimal component template.
3. **Component authoring rules:**
   - Use `@customElement('kebab-case-tag')` from `lit/decorators.js`.
   - Use `@property({ type: ... })` for public reactive props.
   - Import any nested custom element the component renders (see the "NOTE" comment in `hello-world.ts`).
   - Keep one component per folder under `src/components/<Name>/index.ts`; co-locate styles in a sibling `*-styles.ts` file when they exceed a few lines (pattern used by `ActionButtons`, `BridgeBase`, etc.).
4. **TypeScript:**
   - Respect `strict: true`; do not add `// @ts-ignore` or `any` casts to silence errors — fix the underlying typing.
   - `// @ts-expect-error` needs an accompanying issue link; `as any` / `as unknown as X` casts across the bridge boundary are not acceptable.
   - `experimentalDecorators` is on; decorators are expected for Lit components.
   - `noImplicitReturns` and `noFallthroughCasesInSwitch` are enforced.
5. **Pega/Constellation:**
   - Interact with the Constellation engine only through the bridge in [src/bridge/BridgeBase](src/bridge/BridgeBase) and typed interfaces in [src/types](src/types).
   - Do not import from `@pega/constellationjs` at random; use the shapes provided by `@pega/pcore-pconnect-typedefs`.
6. **Assets:** Do not modify files in `assets/**/*.br` (Brotli-compressed). Update the uncompressed source and let the build handle compression.
7. **Generated output:** Never edit `dist/`, `types/`, `test-results/`, or `tests/playwright-report/`.
8. **Testing:**
   - There is no unit-test harness in the repo; the only automated tests are Playwright E2E under [tests/e2e](tests/e2e).
   - When you add or change a component, update or add a Playwright scenario if a matching flow exists in `MediaCo` or `DigV2`.
   - If a change cannot be reasonably tested without a live Pega server, say so explicitly in the PR description and describe manual verification steps.
9. **Security & safe operations:**
   - Never commit anything from [keys/](keys) (self-signed dev certs) or any real credentials, tokens, or client secrets.
   - Do not modify [sdk-config.json](sdk-config.json) sample values unless the user asks; it contains connection settings customers replace locally.
   - Follow OWASP Top 10 practices; sanitize any user-provided HTML before feeding it to `unsafeHTML` or similar Lit helpers.
   - Do not run destructive git operations (`push --force`, `reset --hard`, branch deletion) without explicit user confirmation.

## 4. Formatting & linting

- Config comes from [@pega/configs](https://www.npmjs.com/package/@pega/configs) (ESLint + Prettier). Do not create local `.eslintrc` / `.prettierrc` overrides.
- Before finishing a task, run:
  ```bash
  npm run lint
  ```
  Auto-fix with `npm run fix` when appropriate. Do not commit files that fail lint or prettier.

## 5. Build, run, test

Preferred commands (from [package.json](package.json)):

| Task | Command |
|------|---------|
| Install | `npm install` |
| Dev build | `npm run build:dev` |
| Prod build | `npm run build:prod` |
| Dev server (http) | `npm run start-dev` |
| Dev server (https) | `npm run start-dev-https` |
| Watch build | `npm run watch` |
| Lint | `npm run lint` |
| Auto-fix | `npm run fix` |
| E2E tests (Chromium, MediaCo) | `npm test` |
| E2E tests (headed) | `npm run test:headed` |
| E2E report | `npm run test-report` |
| Custom Elements Manifest | `npm run analyze` |

- E2E tests require a running Pega Infinity server plus the **MediaCo** sample app. Do not attempt to modify tests to bypass this — flag it to the user instead.
- Do not run `npm run clean` (it deletes `dist/` and `node_modules/`) unless explicitly asked.

Before declaring a task complete:

- [ ] Code compiles: `npm run build:dev`
- [ ] `npm run lint` passes
- [ ] New/changed components follow the Lit + Lion patterns in §3
- [ ] No edits to `dist/`, `types/`, `assets/**/*.br`, or generated Playwright reports
- [ ] No new dependencies added silently
- [ ] Docs under [docs/](docs) or [README.md](README.md) updated **only if the user asked** or the change is user-facing
- [ ] Referenced the originating issue / spec when applicable (see [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md))

## 6. When in doubt

- Read [docs/architecture.md](docs/architecture.md), [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md), [docs/ImplementationNotes.md](docs/ImplementationNotes.md), and [docs/KeyReleaseUpdates.md](docs/KeyReleaseUpdates.md) before large refactors.
- Ask the user before: bumping `@pega/*` versions, changing Webpack/Babel config, altering the public API surface exported from [src/index.ts](src/index.ts), or touching the bridge contract in [src/bridge/BridgeBase](src/bridge/BridgeBase). Public API changes also need a [CHANGELOG.md](CHANGELOG.md) entry.
