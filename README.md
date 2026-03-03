# SaaS Prototype Starter (Vue Monorepo)

This repository is a Vue-based starter for AI-assisted product prototyping.  
Goal: generate runnable prototype pages by composing approved components instead of drawing static Axure pages.

## Current structure

```text
apps/
  web-agent/         # Vue app: customer service workspace prototype
  web-admin/         # Admin app placeholder
  web-customer/      # Visitor app placeholder
  mobile-app/        # Mobile placeholder
packages/
  tokens/            # Shared design tokens (agent tokens included)
  ui-agent/          # Vue component library for web-agent
  ui-admin/          # Placeholder for admin-only components
  ui-customer/       # Placeholder for customer-only components
  ui-web/            # Legacy placeholder
  ui-mobile/         # Legacy placeholder
  domain-components/ # Legacy placeholder
docs/
  web-agent-components-and-tokens.md
  component-library-blueprint.md
  first-batch-components.md
  ai-prototype-prompt-template.md
```

## Quick start

1. Install dependencies with `pnpm install`.
2. Start agent prototype with `pnpm dev:web-agent`.
3. Build with `pnpm build:web-agent`.

## Guardrails

1. `web-agent` pages should only use `@twt/ui-agent` and `@twt/tokens`.
2. Do not add ad-hoc colors/spacing in page files.
3. Keep cross-end component boundaries strict (`ui-agent` / `ui-admin` / `ui-customer`).
