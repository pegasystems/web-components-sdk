<!--
SYNC IMPACT REPORT
==================
Version change: unversioned template → 1.0.0
Bump type: MAJOR (initial ratification; all placeholders resolved)

Modified principles:
  - [PRINCIPLE_1_NAME] → I. Bridge-Isolated Constellation Integration (NON-NEGOTIABLE)
  - [PRINCIPLE_2_NAME] → II. Lit + Lion Component Discipline
  - [PRINCIPLE_3_NAME] → III. TypeScript Strictness Preserved
  - [PRINCIPLE_4_NAME] → IV. Lint & Format Gates
  - [PRINCIPLE_5_NAME] → V. E2E-Only Testing Reality

Added sections:
  - Compatibility & Dependency Constraints (was [SECTION_2_NAME])
  - Development Workflow & Quality Gates (was [SECTION_3_NAME])
  - Governance (populated)

Removed sections: none

Templates / files requiring alignment review:
  - .specify/templates/plan-template.md — verify "Constitution Check" gate references
    principles I–V by name.
  - .specify/templates/tasks-template.md — ensure tasks default to Playwright E2E, not TDD,
    since Principle V supersedes generic TDD guidance.
  - AGENTS.md — already aligned with these principles; keep in sync on future amendments.

Deferred / follow-up TODOs:
  - TODO(RATIFICATION_DATE): confirm original adoption date with maintainers; placeholder
    set to today's amendment date until confirmed.
-->

# Pega Web Components SDK Constitution

## Core Principles

### I. Bridge-Isolated Constellation Integration (NON-NEGOTIABLE)

All access to the Pega ConstellationJS Engine MUST flow through the bridge in
`src/bridge/BridgeBase` and typed interfaces in `src/types` (backed by
`@pega/pcore-pconnect-typedefs`). Components MUST NOT import from
`@pega/constellationjs` directly or reach into engine internals. Rationale: the bridge is
the single seam that lets this SDK track Pega Infinity `'24.2` engine changes without
rewriting every component; leaking engine details into components breaks that contract and
compounds upgrade cost.

### II. Lit + Lion Component Discipline

Every DX component MUST follow the established Lit + Lion pattern:

- One component per folder under `src/components/<Name>/`, entry file `index.ts` (or the
  historical single-file form used by `hello-world`).
- Public tag registered with `@customElement('kebab-case-tag')` from `lit/decorators.js`.
- Reactive public state declared via `@property({ type: ... })`.
- Any nested custom element rendered by the component MUST be imported explicitly in that
  component's module.
- Styles exceeding a few lines MUST live in a sibling `*-styles.ts` file
  (see `ActionButtons`, `BridgeBase`).

Rationale: consistency with the existing Lion-derived design system is what makes this SDK
extensible for customers replacing the Constellation design system; ad hoc component
shapes break tooling (`ts-lit-plugin`, `lit-analyzer`, CEM analyzer).

### III. TypeScript Strictness Preserved

`tsconfig.json` runs with `strict: true`, `noImplicitReturns: true`, and
`noFallthroughCasesInSwitch: true`. Contributions MUST fix the underlying typing rather
than silence errors. The following are prohibited unless accompanied by a written
justification approved in the PR:

- `// @ts-ignore`, `// @ts-expect-error` without an issue link
- `as any` or `as unknown as X` casts across the Constellation bridge boundary
- Widening a typed pconnect shape to `any` to bypass a compiler error

Rationale: `@pega/pcore-pconnect-typedefs` is the load-bearing contract with the engine;
type erosion silently absorbs upstream breaking changes and surfaces as runtime failures
in customer portals.

### IV. Lint & Format Gates

Linting and formatting are governed by `@pega/configs` (ESLint + Prettier). Contributors:

- MUST NOT introduce local `.eslintrc` / `.prettierrc` overrides.
- MUST run `npm run lint` before declaring a task complete; `npm run fix` is the sanctioned
  auto-fix path.
- MUST NOT commit files that fail Prettier or ESLint.

Rationale: `@pega/configs` is shared across Pega's SDK repositories; drifting from it
fragments developer experience and breaks the assumption that Pega tooling upgrades apply
cleanly to this repo.

### V. E2E-Only Testing Reality

There is no unit-test harness in this repository; Playwright suites under `tests/e2e`
(`MediaCo`, `DigV2`) are the only automated tests, and they require a running Pega Infinity
server and the MediaCo sample app.

- New or modified components MUST update or add a Playwright scenario if a matching flow
  exists in `MediaCo` or `DigV2`.
- Contributions that cannot be reasonably automated without a live Pega server MUST call
  that out in the PR and provide manual verification steps.
- Tests MUST NOT be weakened or bypassed to make CI "pass" without the required server;
  such gaps are escalated to maintainers instead.

Rationale: pretending an offline test harness exists produces false confidence; being
explicit about the E2E-only reality forces contributors to negotiate verification with
maintainers when live infrastructure is unavailable.

## Compatibility & Dependency Constraints

- **Pega Infinity target**: `'24.2 GA` and later. The SDK version stays aligned with the
  supported Infinity release train (currently `24.2.11`).
- **Runtime**: tested with Node `24.11.0` and npm `11.6.1`. Toolchain version bumps require
  explicit maintainer approval; agents MUST NOT upgrade unilaterally.
- **Package manager**: npm only. `package-lock.json` is authoritative; adding `yarn.lock`
  or `pnpm-lock.yaml` is prohibited.
- **Dependencies**: prefer editing existing code over adding dependencies. Any new runtime
  dependency MUST be justified in the PR description; new `@pega/*` version bumps require
  maintainer sign-off.
- **Do-not-touch paths**: `dist/`, `types/` (generated `.d.ts`), `assets/**/*.br`
  (Brotli-compressed outputs), `test-results/`, `tests/playwright-report/`, and everything
  under `keys/`. Update the uncompressed source and let the build regenerate compressed
  assets.
- **Configuration samples**: `sdk-config.json` holds sample connection values that
  customers replace locally; do not edit unless the user explicitly requests it.
- **License**: Apache-2.0. Contributions under incompatible licenses MUST NOT be merged.

## Development Workflow & Quality Gates

- **Spec-Driven Development**: features MUST flow through the Spec-Kit workflow —
  `/constitution` → `/specify` → `/clarify` → `/plan` → `/tasks` → `/analyze` →
  `/implement`. Per-feature artifacts live under `specs/<NNN-slug>/`. Use `/analyze` before
  `/implement` whenever `spec.md`, `plan.md`, and `tasks.md` may have drifted.
- **Constitution Check gate**: `/plan` MUST verify the proposed design against Principles
  I–V before generating design artifacts. Deviations MUST be recorded in the plan's
  Complexity Tracking section with a Simpler Alternative Rejected justification.
- **Public API stability**: the exports from `src/index.ts` and the bridge contract under
  `src/bridge/BridgeBase` are the SDK's public API surface. Changes require maintainer
  approval and a changelog entry.
- **Documentation**: `docs/` and `README.md` are updated only when the change is
  user-facing or the user asks. Agents MUST NOT create speculative documentation.
- **Definition of Done** (before any PR is declared complete):
  1. `npm run build:dev` succeeds.
  2. `npm run lint` passes.
  3. New/changed components follow Principle II.
  4. No edits to any do-not-touch path (see previous section).
  5. No silent dependency additions.
  6. Playwright coverage updated per Principle V, or manual verification steps documented.
  7. Originating issue / spec referenced in the PR body.
- **Destructive operations**: `git push --force`, `git reset --hard`, branch deletion, and
  `npm run clean` MUST NOT be executed without explicit user confirmation.

## Governance

This constitution supersedes any conflicting practice documented in `README.md`,
`docs/CONTRIBUTING.md`, `AGENTS.md`, or ad hoc code comments. Where those documents remain
authoritative for tactical detail (commands, contributor mechanics, agent behavior), they
MUST NOT contradict the principles here; discovered conflicts are resolved by amending the
conflicting document, not by weakening the constitution.

**Amendment procedure**: amendments are proposed via a PR that updates
`.specify/memory/constitution.md`, includes an updated Sync Impact Report, and is reviewed
by at least one maintainer. Amendments MUST bump the version per the versioning policy
below and update `LAST_AMENDED_DATE`.

**Versioning policy** (semantic):

- **MAJOR**: removal, redefinition, or backward-incompatible narrowing of an existing
  principle or governance rule.
- **MINOR**: new principle, new normative section, or materially expanded guidance that
  changes what contributors MUST do.
- **PATCH**: clarifications, wording, typo fixes, or non-semantic refinements that do not
  change what contributors MUST do.

**Compliance review**: every PR review MUST verify constitution compliance. `/plan` and
`/analyze` runs MUST re-check the design against Principles I–V and record any deviation.
Agents working in this repository consult `AGENTS.md` for tactical guidance and this
constitution for durable rules; when the two conflict, the constitution wins and
`AGENTS.md` MUST be corrected in the same change set.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): confirm original adoption date with maintainers | **Last Amended**: 2026-08-13
