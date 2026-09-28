<!--
SYNC IMPACT REPORT
==================
Version change: 1.0.0 → 2.0.0
Bump type: MAJOR (principles rewritten as durable, non-technical rules; stack-specific
and path-specific guidance removed)

Modified principles:
  - I. Bridge-Isolated Constellation Integration → I. Stable Boundaries
  - II. Lit + Lion Component Discipline → II. Consistency Over Novelty
  - III. TypeScript Strictness Preserved → III. No Silent Weakening
  - IV. Lint & Format Gates → IV. Shared Standards Are Not Optional
  - V. E2E-Only Testing Reality → V. Honest Verification

Added sections:
  - Purpose
  - Scope Discipline (replaces Compatibility & Dependency Constraints)
  - Working Agreement (replaces Development Workflow & Quality Gates)

Removed sections: none

Notes:
  - Tooling names, commands, versions, and file locations now live in the agent guide and the
    architecture documentation. This document stays implementation-agnostic.

Deferred / follow-up TODOs:
  - TODO(RATIFICATION_DATE): confirm original adoption date with maintainers.
-->

# Pega Web Components SDK Constitution

## Purpose

This document states the durable principles that govern work in this repository. It describes
_what must remain true_, not _how to do it_. Tooling, commands, structure, and technical
convention are documented separately and may change without amending this constitution.

## Core Principles

### I. Stable Boundaries (NON-NEGOTIABLE)

This SDK is a presentation layer over a platform it does not own. Every dependency on that
platform MUST pass through a single, deliberately designed boundary and MUST use the typed
contracts published for it.

Contributors MUST NOT reach around the boundary, depend on platform internals, or spread
platform knowledge across the codebase.

Rationale: the boundary is what lets the SDK absorb upstream platform releases at a known,
bounded cost. Every leak turns a contained upgrade into a repository-wide migration.

### II. Consistency Over Novelty

The repository has an established way of building things. New work MUST follow the shape of
existing work — structure, naming, layering, and separation of concerns — even where a
contributor would personally prefer a different approach.

Introducing a second way of doing something already solved requires maintainer agreement and a
stated reason why the existing approach cannot serve.

Rationale: consumers extend and replace parts of this SDK. Predictable, uniform structure is a
feature of the product, not a matter of taste, and divergence silently breaks tooling that
assumes the established shape.

### III. No Silent Weakening

Safeguards exist to fail loudly. Contributors MUST fix the underlying problem rather than
suppress, bypass, or loosen the mechanism that reported it.

Suppressions are permitted only when they are narrow, explicitly justified in the change
description, and approved in review. An undocumented suppression is a defect.

Rationale: every silenced check converts a build-time failure into a production surprise for a
customer and erases the signal that would have caught an upstream breaking change.

### IV. Shared Standards Are Not Optional

Code style, formatting, and static analysis are defined centrally and shared across sibling
projects. Contributors MUST conform to the shared configuration and MUST NOT introduce local
overrides to make an individual change pass.

If a shared standard is genuinely wrong, it is corrected at its source, not forked here.

Rationale: a shared baseline keeps review focused on substance and lets platform-wide tooling
upgrades apply cleanly. Local exceptions accumulate into an unmaintainable dialect.

### V. Honest Verification

Contributors MUST be truthful about how a change was verified. Automated coverage MUST be
extended when a change falls within its reach. When a change cannot be verified automatically,
the limitation MUST be stated plainly, together with the manual steps actually performed.

Verification MUST NOT be weakened, skipped, or narrowed in order to report a passing result.
Gaps are escalated to maintainers instead.

Rationale: unverifiable claims are worse than acknowledged gaps, because they remove the
maintainer's opportunity to compensate for them.

## Scope Discipline

- Changes MUST stay within what was asked. Unrequested refactors, redesigns, and speculative
  abstractions are rejected on principle, not on merit.
- A new external dependency is a long-term cost. It MUST be justified in the change description
  and MUST NOT be introduced quietly.
- Generated and build-produced content is owned by the tooling that produces it. Contributors
  change the source, never the output.
- Sample and configuration values that consumers replace locally are left alone unless changing
  them is the point of the work.
- Anything that widens the SDK's public surface is a commitment to everyone who depends on it.
  Such changes require maintainer approval and MUST be communicated in the release notes.
- Contributions MUST be compatible with the repository's license; incompatible material MUST NOT
  be merged.

## Working Agreement

- **Specify before building.** Non-trivial work begins with an agreed statement of intent, then a
  plan, then execution. Requirements, plan, and task breakdown MUST be reconciled before
  implementation starts and MUST NOT be allowed to drift apart during it.
- **Design is reviewed against these principles.** Planning MUST include an explicit check against
  Principles I–V. Any accepted deviation MUST be recorded together with the simpler alternative
  that was considered and why it was rejected.
- **Done is binary.** A change is complete only when it builds, satisfies the shared standards,
  respects every principle above, and has had its verification reported honestly.
- **Documentation follows need.** Human-facing documentation is updated when a change is
  user-facing or when it is requested. Speculative documentation MUST NOT be created.
- **Irreversible actions require consent.** Destructive or hard-to-undo operations — discarding
  work, rewriting shared history, deleting branches, wiping local state — MUST NOT be performed
  without explicit confirmation from the person requesting the work.
- **Secrets never enter the repository.** Credentials, tokens, keys, and customer data MUST NOT be
  committed under any circumstance.

## Governance

This constitution supersedes any conflicting practice documented elsewhere in the repository.
Other documents remain authoritative for tactical detail, but MUST NOT contradict the principles
here. A discovered conflict is resolved by correcting the conflicting document, not by weakening
this one.

**Amendment procedure**: amendments are proposed as a change to this document, accompanied by an
updated Sync Impact Report, and reviewed by at least one maintainer. Every amendment MUST bump the
version per the policy below and update the last-amended date.

**Versioning policy** (semantic):

- **MAJOR**: removal, redefinition, or backward-incompatible narrowing of an existing principle or
  governance rule.
- **MINOR**: a new principle, a new normative section, or materially expanded guidance that changes
  what contributors MUST do.
- **PATCH**: clarifications, wording, and typo fixes that do not change what contributors MUST do.

**Compliance review**: every review MUST verify compliance with these principles, and any accepted
deviation MUST be recorded in the change itself. Where tactical guidance and this constitution
conflict, this constitution wins and the tactical document MUST be corrected in the same change
set.

**Version**: 2.0.0 | **Ratified**: TODO(RATIFICATION_DATE): confirm original adoption date with maintainers | **Last Amended**: 2026-08-25
