# First Batch Component Backlog

Scope this backlog to the first workflow:

- Conversation list
- Conversation detail
- Customer profile side panel

## 1. Foundation (tokens)

- Color roles: `bg.*`, `text.*`, `border.*`, `status.*`
- Typography: `font.family`, `font.size.*`, `font.weight.*`, `line.height.*`
- Spacing: `space.2`, `space.4`, `space.8`, `space.12`, `space.16`, `space.24`
- Radius: `radius.sm`, `radius.md`, `radius.lg`
- Shadow: `shadow.sm`, `shadow.md`

## 2. Base UI (ui-web)

1. `Button`
2. `IconButton`
3. `TextInput`
4. `Select`
5. `Checkbox`
6. `Radio`
7. `Switch`
8. `Tag`
9. `Avatar`
10. `Tooltip`
11. `Modal`
12. `Drawer`
13. `Tabs`
14. `Table`
15. `Pagination`
16. `EmptyState`
17. `Toast`
18. `Skeleton`

## 3. Domain UI (domain-components)

1. `ConversationListItem`
2. `ConversationListFilterBar`
3. `ConversationHeader`
4. `MessageBubble`
5. `MessageComposer`
6. `CustomerProfileCard`
7. `TicketStatusTag`
8. `SlaCountdownBadge`
9. `AssigneeSelect`
10. `InternalNotePanel`

## 4. Minimal props definition

Use this level of definition before implementation:

| Component | Required Props | Optional Props |
|---|---|---|
| Button | `variant`, `size`, `children` | `disabled`, `loading`, `icon` |
| TextInput | `value`, `onChange` | `placeholder`, `error`, `prefix`, `suffix` |
| Table | `columns`, `data` | `loading`, `rowSelection`, `pagination` |
| ConversationListItem | `customerName`, `lastMessage`, `status` | `unreadCount`, `assignee`, `updatedAt` |
| MessageBubble | `role`, `content`, `time` | `status`, `translated`, `attachments` |

## 5. Build order

1. Build foundation tokens.
2. Build base UI components.
3. Build domain components.
4. Build one vertical slice page.

