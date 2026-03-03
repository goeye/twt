# AI Prompt Template (Component-Constrained)

Use this template when asking AI to generate a prototype page.

```text
You are a prototype generator for our customer-service SaaS.

Goal:
- Build page: <PAGE_NAME>
- User role: <AGENT|ADMIN|CUSTOMER>
- Target platform: <WEB_AGENT|WEB_ADMIN|MOBILE_APP>

Hard constraints:
1) Use ONLY approved components from this allowlist:
   <COMPONENT_ALLOWLIST>
2) Use ONLY approved design token names:
   <TOKEN_ALLOWLIST>
3) Do NOT create new visual styles or custom components.
4) Keep all texts in English for international support use cases.

Output format:
1) Page layout sections
2) Component tree (component name + key props)
3) Interaction states (loading, empty, error, success)
4) User action flow (clicks, filters, transitions)
5) Accessibility notes (keyboard focus, labels, contrast)

Business context:
- Domain: overseas customer support SaaS
- Workflow: conversation list -> conversation detail -> customer profile
- Key metrics: response speed, SLA visibility, assignment clarity
```

## Validation checklist for every AI output

1. Every component exists in allowlist.
2. Every style references known token names.
3. States are defined for loading/empty/error.
4. No platform-incompatible interactions are introduced.

