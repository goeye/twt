# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TWT is a Vue 3 monorepo for an overseas customer-service SaaS prototype. The goal is to generate runnable prototype pages by composing approved components, replacing static Axure wireframes. The primary active app is `web-agent` (a customer-service workspace). Other apps (`web-admin`, `web-customer`, `mobile-app`) are placeholders.

## Commands

```bash
pnpm install                # Install all dependencies
pnpm dev:web-agent          # Start web-agent dev server (Vite)
pnpm build:web-agent        # Production build
pnpm deploy:web-agent       # Build + rsync to remote preview server
```

No test runner or linter is currently configured.

## Monorepo Structure

Package manager: **pnpm** (v10) with workspaces (`apps/*`, `packages/*`).

### Dependency Graph

```
apps/web-agent
  ├── @twt/ui-agent   (component library)
  │     └── @twt/tokens  (design tokens)
  └── @twt/tokens      (CSS variables + JSON tokens)
```

- `packages/tokens` — Design tokens exported three ways: CSS custom properties (`agent.css`), JSON (`agent.json`), and TypeScript (`index.ts` re-exports the JSON).
- `packages/ui-agent` — Vue 3 SFC component library for the agent workspace. Barrel-exported from `src/index.ts`. Shared types in `src/types.ts`. Base CSS utilities in `src/styles/ui-agent.css`.
- `apps/web-agent` — Vite + Vue 3 + vue-router app. In build mode, `base` is set to `/<package-name>/` for deployment. Routes are defined in `src/router.ts`; the main layout lives in `src/App.vue`.

### Shared TypeScript Config

All apps extend `tsconfig.base.json` (ES2021, Bundler module resolution, strict mode).

## Guardrails (Strict)

1. `web-agent` pages may **only** import from `@twt/ui-agent` and `@twt/tokens`. Never import `ui-admin`, `ui-customer`, or other cross-end packages.
2. **No ad-hoc colors or spacing** in page/view files. Always use `--agent-*` CSS custom properties from `@twt/tokens/agent.css`.
3. Component boundaries are strict: `ui-agent` components are for the agent workspace only; admin/customer UIs get their own component packages.

## Design Token Conventions

All CSS variables are prefixed `--agent-`. Key namespaces:
- Layout: `--agent-layout-*` (nav rail, sub-nav, pane widths)
- Spacing: `--agent-space-{4|8|12|16|20|24}`
- Radius: `--agent-radius-{sm|md|lg|xl}`
- Colors: `--agent-color-{brand|text|bg|border|status|overlay}-*`
- Typography: `--agent-font-size-*`, `--agent-font-weight-*`
- Motion: `--agent-motion-{fast|base|slow}`
- Z-index: `--agent-z-{dropdown|modal|toast}`

## UI Component Patterns

Components use BEM-style CSS classes prefixed with `agent-` (e.g., `agent-btn`, `agent-btn--primary`, `agent-input`). Utility classes: `agent-panel`, `agent-title`, `agent-text-secondary`, `agent-muted`, `agent-divider`, `agent-scroll`, `agent-content-page`.

The `AgentAppShell` component provides the top-level layout with named slots: `#nav-rail`, `#sub-nav`, `#session-list`, `#detail`, and a default slot for main content.

## Deployment

`apps/upcode.sh` rsyncs a built app's `dist/` to a remote server and triggers a webhook. Credentials file (`chanpin6.p`) sits in the `apps/` directory. Preview URL pattern: `https://pm.pro.jishu666.com/<app-name>/index.html`.
