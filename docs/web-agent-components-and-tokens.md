# Web-Agent Components and Tokens

## Tokens (agent)

- Layout: `navRail=44`, `subNav=200`, `sessionPane=320`, `detailPane=320`
- Spacing: `4, 8, 12, 16, 24`
- Radius: `6, 8, 12`
- Semantic colors:
  - Brand: `primary`, `primaryHover`, `primaryActive`
  - Text: `primary`, `secondary`, `tertiary`, `disabled`
  - Background: `page`, `panel`, `muted`
  - Border: `default`, `strong`
  - Status: `success`, `warning`, `error`, `info`

## UI Components (ui-agent)

- Layout: `AgentAppShell`
- Navigation: `PrimaryNavRail`, `PrimaryNavItem`
- Session: `SessionList`, `SessionListItem`
- Conversation: `ConversationHeader`, `MessageList`, `MessageBubble`
- Composer: `MessageComposer`
- Detail: `DetailPanel`
- Overlay: `BaseModal`, `TransferModal`
- Form/Table: `FilterBar`, `DataTable`, `PaginationBar`
- Feedback: `EmptyState`, `LoadingSpinner`

## AI guardrail (must)

1. Only import `@twt/ui-agent` and `@twt/tokens` for `web-agent` pages.
2. Do not add raw color/spacing constants in page files.
3. Do not import cross-end packages such as `ui-admin` or `ui-customer`.
