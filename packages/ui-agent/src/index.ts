import "./styles/ui-agent.css";

export type * from "./types";

export { default as AgentAppShell } from "./components/layout/AgentAppShell.vue";
export { default as AgentIcon } from "./components/icon/AgentIcon.vue";
export { default as PrimaryNavItem } from "./components/navigation/PrimaryNavItem.vue";
export { default as PrimaryNavRail } from "./components/navigation/PrimaryNavRail.vue";
export { default as AiSettingsNav } from "./components/navigation/AiSettingsNav.vue";

export { default as SessionList } from "./components/session/SessionList.vue";
export { default as SessionListItem } from "./components/session/SessionListItem.vue";
export { default as SessionQueueNav } from "./components/session/SessionQueueNav.vue";

export { default as ConversationHeader } from "./components/conversation/ConversationHeader.vue";
export { default as MessageBubble } from "./components/conversation/MessageBubble.vue";
export { default as MessageList } from "./components/conversation/MessageList.vue";

export { default as MessageComposer } from "./components/composer/MessageComposer.vue";

export { default as DetailPanel } from "./components/detail/DetailPanel.vue";

export { default as BaseModal } from "./components/overlay/BaseModal.vue";
export { default as UnsavedChangesModal } from "./components/overlay/UnsavedChangesModal.vue";
export { default as TransferModal } from "./components/overlay/TransferModal.vue";
export { default as InviteModal } from "./components/overlay/InviteModal.vue";
export { default as FeatureLockedModal } from "./components/overlay/FeatureLockedModal.vue";

export { default as EmptyState } from "./components/feedback/EmptyState.vue";
export { default as LoadingSpinner } from "./components/feedback/LoadingSpinner.vue";
export { default as AgentToast } from "./components/feedback/AgentToast.vue";

export { default as FilterBar } from "./components/form/FilterBar.vue";
export { default as AgentSwitch } from "./components/form/AgentSwitch.vue";
export { default as TimeDurationInput } from "./components/form/TimeDurationInput.vue";

export { default as DataTable } from "./components/table/DataTable.vue";
export { default as PaginationBar } from "./components/table/PaginationBar.vue";

export { default as CopilotPromoBanner } from "./components/settings/CopilotPromoBanner.vue";
export { default as CopilotSettingItem } from "./components/settings/CopilotSettingItem.vue";
