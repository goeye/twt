# Component Library Blueprint

## 1. System model

Use `1 core + N platform adapters`:

- Core (shared):
  - Naming rules
  - Design tokens
  - State model
  - Accessibility baseline
- Platform adapters:
  - `ui-web`
  - `ui-mobile`
- Domain components:
  - Business-level components composed from base UI components

## 2. What must be shared across platforms

- Token semantics:
  - color roles (`bg.surface`, `text.primary`, `status.success`)
  - spacing scale (`space.2`, `space.4`, `space.8`)
  - type scale (`font.size.sm`, `font.weight.medium`)
  - radius and shadow scale
- Component naming semantics:
  - Example: `Button`, `Input`, `Tag`, `Table`, `Pagination`
- State naming:
  - `default`, `hover`, `active`, `focus`, `disabled`, `error`, `loading`

## 3. What can differ by platform

- Navigation patterns (sidebar vs tabbar)
- Gesture interactions (mobile swipe, pull-to-refresh)
- Density and layout behavior
- Input modes and keyboard behavior

## 4. Naming conventions

- Figma component name:
  - `Button/Primary/MD`
  - `Input/Text/Default`
- Code component name:
  - `Button`
  - `TextInput`
- Props for variants:
  - `variant="primary" size="md" state="default"`

## 5. Mapping table (Figma -> code -> AI)

Keep this table updated for every approved component.

| Figma Name | Code Package | Component | Key Props | Allowed States |
|---|---|---|---|---|
| Button/Primary/MD | `@repo/ui-web` | `Button` | `variant,size,disabled,loading` | default,hover,focus,disabled,loading |
| Input/Text/Default | `@repo/ui-web` | `TextInput` | `value,placeholder,error` | default,focus,error,disabled |
| Tag/Status/Open | `@repo/domain-components` | `TicketStatusTag` | `status` | open,pending,resolved |

## 6. Release gates

A page is accepted only if:

1. Uses approved components only.
2. Uses approved token names only.
3. Does not introduce ad-hoc styles.
4. Passes visual and interaction review.

