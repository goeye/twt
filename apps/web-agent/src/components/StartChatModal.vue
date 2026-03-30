<template>
  <BaseModal class="start-chat-modal-dialog" :open="open" title="发起聊天" max-width="684px" @close="handleClose">
    <div class="start-chat-modal">
      <section class="start-chat-modal__left-pane">
        <div class="start-chat-modal__search-wrap">
          <AgentIcon name="search" :size="20" class="start-chat-modal__search-icon" />
          <input
            v-model="keyword"
            type="text"
            class="agent-input start-chat-modal__search-input"
            placeholder="搜索"
          />
        </div>

        <div class="start-chat-modal__tabs">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            type="button"
            class="start-chat-modal__tab"
            :class="{ 'start-chat-modal__tab--active': activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            <span>{{ tab.label }}</span>
            <AgentIcon v-if="tab.key === 'manual'" name="help" :size="16" class="start-chat-modal__tab-help" />
          </button>
        </div>

        <div class="start-chat-modal__pane-body">
          <div v-if="activeTab !== 'manual'" class="start-chat-modal__candidate-list agent-scroll">
            <button
              v-for="candidate in visibleCandidates"
              :key="candidate.id"
              type="button"
              class="start-chat-modal__candidate-row"
              :aria-pressed="isSelected(candidate.id)"
              @click="toggleCandidate(candidate)"
            >
              <span class="start-chat-modal__checkbox" :class="{ 'start-chat-modal__checkbox--selected': isSelected(candidate.id) }">
                <AgentIcon v-if="isSelected(candidate.id)" name="check" :size="18" class="start-chat-modal__checkbox-icon" />
              </span>

              <span class="start-chat-modal__avatar" :style="{ background: candidate.avatarColor }">{{ candidate.avatarText }}</span>

              <span class="start-chat-modal__candidate-name">{{ candidate.name }}</span>
            </button>

            <div v-if="visibleCandidates.length === 0" class="start-chat-modal__empty">
              暂无可选择的对象
            </div>
          </div>

          <div v-else class="start-chat-modal__manual-pane">
            <textarea
              id="start-chat-manual-input"
              v-model="manualText"
              class="agent-input start-chat-modal__manual-input"
              placeholder="请输入客户标识，一行一个，最多支持99个，超出部分将自动忽略"
            />
            <p class="start-chat-modal__manual-tip">支持客户标识、邮箱或手机号，一行一个，识别后会自动加入右侧已选列表。</p>
            <button
              type="button"
              class="agent-btn agent-btn--primary start-chat-modal__manual-submit"
              :disabled="manualText.trim().length === 0"
              @click="appendManualEntries"
            >
              开始识别
            </button>
          </div>
        </div>
      </section>

      <aside class="start-chat-modal__right-pane">
        <p class="start-chat-modal__selected-title">已选择（{{ selectedContacts.length }}）</p>

        <div class="start-chat-modal__pane-body">
          <div class="start-chat-modal__selected-list agent-scroll">
            <div
              v-for="contact in selectedContacts"
              :key="contact.id"
              class="start-chat-modal__selected-item"
              :class="{ 'start-chat-modal__selected-item--fixed': isPinned(contact.id) }"
            >
              <span class="start-chat-modal__selected-main">
                <span class="start-chat-modal__avatar start-chat-modal__avatar--selected" :style="{ background: contact.avatarColor }">
                  {{ contact.avatarText }}
                </span>
                <span class="start-chat-modal__selected-name">{{ contact.name }}</span>
              </span>

              <button
                v-if="!isPinned(contact.id)"
                type="button"
                class="start-chat-modal__selected-remove"
                aria-label="删除联系人"
                @click.stop="removeSelected(contact.id)"
              >
                ×
              </button>
            </div>

            <div v-if="selectedContacts.length === 0" class="start-chat-modal__empty start-chat-modal__empty--selected">
              选择访客、客户、客服，或者手动输入联系人
            </div>
          </div>
        </div>
      </aside>
    </div>

    <template #footer>
      <span />
      <div class="start-chat-modal__footer-actions">
        <button type="button" class="agent-btn agent-btn--ghost" @click="handleClose">取消</button>
        <button
          type="button"
          class="agent-btn agent-btn--primary"
          :disabled="selectedContacts.length === 0"
          @click="handleConfirm"
        >
          确定
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { AgentIcon, BaseModal } from "@twt/ui-agent";

type StartChatTabKey = "visitor" | "customer" | "agent" | "manual";

interface StartChatCandidate {
  id: string;
  type: StartChatTabKey;
  name: string;
  avatarText: string;
  avatarColor: string;
  online?: boolean;
  visitorId?: string;
  email?: string;
  phone?: string;
  sourceSessionId?: string;
}

const props = defineProps<{
  open: boolean;
  candidates: StartChatCandidate[];
  pinnedContact?: StartChatCandidate | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "confirm", contacts: StartChatCandidate[]): void;
}>();

const tabs: Array<{ key: StartChatTabKey; label: string }> = [
  { key: "visitor", label: "访客" },
  { key: "customer", label: "客户" },
  { key: "agent", label: "客服" },
  { key: "manual", label: "手动输入" }
];

const activeTab = ref<StartChatTabKey>("visitor");
const keyword = ref("");
const manualText = ref("");
const selectedContacts = ref<StartChatCandidate[]>([]);

const visibleCandidates = computed(() => {
  const search = keyword.value.trim().toLowerCase();
  return props.candidates.filter((candidate) => {
    if (candidate.type !== activeTab.value) {
      return false;
    }

    if (search.length === 0) {
      return true;
    }

    return candidate.name.toLowerCase().includes(search);
  });
});

const isSelected = (id: string) => selectedContacts.value.some((candidate) => candidate.id === id);
const isPinned = (id: string) => props.pinnedContact?.id === id;

const toggleCandidate = (candidate: StartChatCandidate) => {
  if (isSelected(candidate.id)) {
    if (isPinned(candidate.id)) {
      return;
    }
    removeSelected(candidate.id);
    return;
  }
  selectedContacts.value = [...selectedContacts.value, candidate];
};

const removeSelected = (id: string) => {
  if (isPinned(id)) {
    return;
  }
  selectedContacts.value = selectedContacts.value.filter((candidate) => candidate.id !== id);
};

const buildManualCandidate = (value: string): StartChatCandidate => ({
  id: `manual:${value.toLowerCase()}`,
  type: "manual",
  name: value,
  avatarText: getInitial(value),
  avatarColor: "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)"
});

const appendManualEntries = () => {
  const entries = manualText.value
    .split(/[\n,，;；]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map(buildManualCandidate)
    .filter((candidate, index, list) => list.findIndex((item) => item.id === candidate.id) === index)
    .filter((candidate) => !isSelected(candidate.id));

  if (entries.length === 0) {
    return;
  }

  selectedContacts.value = [...selectedContacts.value, ...entries];
  manualText.value = "";
};

const resetState = () => {
  activeTab.value = "visitor";
  keyword.value = "";
  manualText.value = "";
  selectedContacts.value = props.pinnedContact ? [props.pinnedContact] : [];
};

const handleClose = () => {
  resetState();
  emit("close");
};

const handleConfirm = () => {
  if (selectedContacts.value.length === 0) {
    return;
  }
  emit("confirm", [...selectedContacts.value]);
};

watch(
  () => props.open,
  (open) => {
    if (open) {
      resetState();
    }
  }
);

function getInitial(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "?";
  }
  const first = trimmed[0];
  return /[a-zA-Z]/.test(first) ? first.toUpperCase() : first;
}
</script>

<style>
.modal-mask:has(.start-chat-modal-dialog) {
  background: rgba(15, 23, 42, 0.28);
  padding: 32px;
}

.start-chat-modal-dialog {
  box-sizing: border-box;
  border: 1px solid #e7edf5;
  border-radius: 30px;
  box-shadow: 0 20px 56px rgba(15, 23, 42, 0.14);
  display: grid;
  grid-template-rows: 66px minmax(0, 1fr) 74px;
  height: min(540px, calc(100vh - 48px));
  max-width: 684px !important;
  overflow: hidden;
  width: min(684px, calc(100vw - 32px));
}

.start-chat-modal-dialog .modal-card__header {
  box-sizing: border-box;
  padding: 18px 24px 14px;
}

.start-chat-modal-dialog .modal-card__body {
  box-sizing: border-box;
  min-height: 0;
  overflow: hidden;
  padding: 0 24px;
}

.start-chat-modal-dialog .modal-card__footer {
  box-sizing: border-box;
  padding: 0 24px 22px;
}

.start-chat-modal-dialog .agent-title {
  color: #111827;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0.01em;
}

.start-chat-modal-dialog .close-btn {
  align-items: center;
  border-radius: 999px;
  color: #111827;
  display: inline-flex;
  font-size: 26px;
  font-weight: 400;
  height: 30px;
  justify-content: center;
  line-height: 1;
  padding: 0;
  width: 30px;
}

.start-chat-modal-dialog .close-btn:hover {
  background: rgba(15, 23, 42, 0.04);
}

.start-chat-modal {
  align-items: stretch;
  display: grid;
  flex: 1 1 auto;
  gap: 24px;
  grid-template-columns: 320px minmax(0, 1fr);
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.start-chat-modal__left-pane {
  border-right: 1px solid #edf2f7;
  display: grid;
  gap: 14px;
  grid-template-rows: 42px auto minmax(0, 1fr);
  height: 100%;
  min-height: 0;
  overflow: hidden;
  padding-right: 24px;
}

.start-chat-modal__right-pane {
  display: grid;
  gap: 14px;
  grid-template-rows: auto minmax(0, 1fr);
  height: 100%;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  padding-top: 2px;
}

.start-chat-modal__search-wrap {
  align-items: center;
  background: #ffffff;
  border: 1px solid #dbe4f0;
  border-radius: 12px;
  display: flex;
  gap: 10px;
  height: 42px;
  padding: 0 14px;
}

.start-chat-modal__search-icon {
  color: #a1afc3;
  flex-shrink: 0;
}

.start-chat-modal__search-input {
  background: transparent;
  border: 0;
  box-shadow: none;
  color: #111827;
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  height: 100%;
  min-width: 0;
  padding: 0;
}

.start-chat-modal__search-input::placeholder {
  color: #b1bccb;
}

.start-chat-modal__search-input:focus {
  box-shadow: none;
}

.start-chat-modal__tabs {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  min-width: 0;
  overflow: hidden;
}

.start-chat-modal__pane-body {
  display: flex;
  flex: 1 1 auto;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.start-chat-modal__tab {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 10px;
  color: #344054;
  cursor: pointer;
  display: inline-flex;
  flex: 0 0 auto;
  font-size: 13px;
  font-weight: 600;
  gap: 4px;
  height: 34px;
  justify-content: center;
  padding: 0 12px;
  transition: background-color 0.18s ease, color 0.18s ease;
  white-space: nowrap;
}

.start-chat-modal__tab:hover {
  background: #f5f8fc;
}

.start-chat-modal__tab--active {
  background: #e8f0ff;
  color: #2f6bff;
}

.start-chat-modal__tab-help {
  color: #91a3c0;
}

.start-chat-modal__candidate-list,
.start-chat-modal__selected-list,
.start-chat-modal__manual-pane {
  -ms-overflow-style: none;
  min-height: 0;
  scrollbar-width: none;
}

.start-chat-modal__candidate-list::-webkit-scrollbar,
.start-chat-modal__selected-list::-webkit-scrollbar,
.start-chat-modal__manual-pane::-webkit-scrollbar {
  display: none;
  height: 0;
  width: 0;
}

.start-chat-modal__candidate-list {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 4px;
  height: 100%;
  min-height: 0;
  overflow: auto;
  padding-right: 4px;
}

.start-chat-modal__candidate-row {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 14px;
  cursor: pointer;
  display: grid;
  gap: 10px;
  grid-template-columns: 20px 36px minmax(0, 1fr);
  min-height: 44px;
  padding: 0 4px 0 2px;
  text-align: left;
  transition: background-color 0.18s ease;
  width: 100%;
}

.start-chat-modal__candidate-row:hover {
  background: #f7faff;
}

.start-chat-modal__checkbox {
  align-items: center;
  background: transparent;
  border: 1.5px solid #d7e0ec;
  border-radius: 999px;
  color: transparent;
  display: inline-flex;
  height: 20px;
  justify-content: center;
  width: 20px;
}

.start-chat-modal__checkbox--selected {
  color: #2f6bff;
}

.start-chat-modal__checkbox-icon {
  display: block;
}

.start-chat-modal__avatar {
  align-items: center;
  border-radius: 999px;
  color: #ffffff;
  display: inline-flex;
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 700;
  height: 36px;
  justify-content: center;
  min-width: 36px;
  padding: 0 8px;
}

.start-chat-modal__avatar--selected {
  font-size: 13px;
  height: 28px;
  min-width: 28px;
}

.start-chat-modal__candidate-name,
.start-chat-modal__selected-name {
  color: #111827;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
}

.start-chat-modal__candidate-name {
  min-width: 0;
}

.start-chat-modal__manual-pane {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  padding-right: 4px;
}

.start-chat-modal__manual-input {
  border: 1px solid #dbe4f0;
  border-radius: 14px;
  box-shadow: none;
  color: #111827;
  flex: 1 1 0;
  font-size: 14px;
  line-height: 1.6;
  min-height: 0;
  padding: 14px;
  resize: none;
}

.start-chat-modal__manual-input::placeholder {
  color: #b1bccb;
}

.start-chat-modal__manual-tip {
  color: #667085;
  font-size: 12px;
  line-height: 1.5;
  margin: 0;
}

.start-chat-modal__manual-submit {
  align-self: flex-start;
  border-radius: 12px;
  font-size: 13px;
  height: 36px;
  padding: 0 16px;
}

.start-chat-modal__selected-title {
  color: #111827;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.25;
  margin: 2px 0 0;
}

.start-chat-modal__selected-list {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  min-height: 0;
  overflow: auto;
  padding-right: 4px;
}

.start-chat-modal__selected-item {
  align-items: center;
  background: #f4f6fb;
  border-radius: 14px;
  display: flex;
  justify-content: space-between;
  min-height: 42px;
  padding: 7px 10px;
  width: 100%;
}

.start-chat-modal__selected-item--fixed {
  padding-right: 10px;
}

.start-chat-modal__selected-main {
  align-items: center;
  display: inline-flex;
  gap: 8px;
  min-width: 0;
}

.start-chat-modal__selected-name {
  font-size: 13px;
}

.start-chat-modal__selected-remove {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 999px;
  color: #98a2b3;
  cursor: pointer;
  display: inline-flex;
  font-size: 18px;
  height: 22px;
  justify-content: center;
  line-height: 1;
  padding: 0;
  width: 22px;
}

.start-chat-modal__selected-remove:hover {
  background: #e8edf5;
  color: #475467;
}

.start-chat-modal__footer-actions {
  display: flex;
  gap: 8px;
}

.start-chat-modal__footer-actions .agent-btn {
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  height: 36px;
  justify-content: center;
  min-width: 72px;
  padding: 0 14px;
}

.start-chat-modal__footer-actions .agent-btn--ghost {
  border-color: #d5deea;
  color: #344054;
}

.start-chat-modal__footer-actions .agent-btn--primary {
  box-shadow: 0 10px 30px rgba(47, 107, 255, 0.18);
}

.start-chat-modal__empty {
  align-items: center;
  background: #fafbfd;
  border: 1px dashed #dde5ef;
  border-radius: 14px;
  color: #98a2b3;
  display: flex;
  flex: 1 1 auto;
  font-size: 13px;
  height: 100%;
  justify-content: center;
  min-height: 0;
  text-align: center;
}

.start-chat-modal__empty--selected {
  padding: 0 14px;
}

@media (max-width: 1180px) {
  .start-chat-modal-dialog {
    height: min(540px, calc(100vh - 24px));
    width: min(684px, calc(100vw - 24px));
  }

  .start-chat-modal-dialog .modal-card__header {
    padding: 22px 24px 14px;
  }

  .start-chat-modal-dialog .modal-card__body {
    padding: 0 24px;
  }

  .start-chat-modal-dialog .modal-card__footer {
    padding: 0 24px 22px;
  }

  .start-chat-modal-dialog .agent-title {
    font-size: 22px;
  }

  .start-chat-modal {
    gap: 24px;
    grid-template-columns: 320px minmax(0, 1fr);
  }

  .start-chat-modal__left-pane {
    padding-right: 24px;
  }
}

@media (max-width: 768px) {
  .modal-mask:has(.start-chat-modal-dialog) {
    padding: 12px;
  }

  .start-chat-modal-dialog {
    border-radius: 24px;
    height: min(540px, calc(100vh - 24px));
    width: calc(100vw - 24px);
  }

  .start-chat-modal-dialog .modal-card__header {
    padding: 24px 20px 16px;
  }

  .start-chat-modal-dialog .modal-card__body {
    padding: 0 20px;
  }

  .start-chat-modal-dialog .modal-card__footer {
    padding: 0 20px 20px;
  }

  .start-chat-modal-dialog .agent-title {
    font-size: 20px;
  }

  .start-chat-modal {
    gap: 16px;
    grid-template-columns: minmax(0, 1fr);
  }

  .start-chat-modal__left-pane {
    border-bottom: 1px solid #edf2f7;
    border-right: 0;
    gap: 12px;
    grid-template-rows: 42px auto minmax(0, 1fr);
    padding-bottom: 16px;
    padding-right: 0;
  }

  .start-chat-modal__right-pane {
    gap: 12px;
    grid-template-rows: auto minmax(0, 1fr);
  }

  .start-chat-modal__search-wrap {
    border-radius: 16px;
    height: 42px;
    padding: 0 18px;
  }

  .start-chat-modal__search-input {
    font-size: 14px;
  }

  .start-chat-modal__tabs {
    gap: 8px;
  }

  .start-chat-modal__tab {
    border-radius: 14px;
    font-size: 13px;
    height: 34px;
    padding: 0 12px;
  }

  .start-chat-modal__candidate-row {
    gap: 10px;
    grid-template-columns: 20px 36px minmax(0, 1fr);
    min-height: 42px;
  }

  .start-chat-modal__checkbox {
    height: 20px;
    width: 20px;
  }

  .start-chat-modal__avatar {
    font-size: 14px;
    height: 36px;
    min-width: 36px;
  }

  .start-chat-modal__avatar--selected {
    height: 28px;
    min-width: 28px;
  }

  .start-chat-modal__candidate-name,
  .start-chat-modal__selected-name {
    font-size: 14px;
  }

  .start-chat-modal__selected-title {
    font-size: 16px;
  }

  .start-chat-modal__selected-item {
    border-radius: 14px;
    min-height: 42px;
    padding: 7px 10px;
  }

  .start-chat-modal__manual-input {
    font-size: 14px;
    min-height: 0;
    padding: 14px;
  }

  .start-chat-modal__manual-tip {
    font-size: 12px;
  }

  .start-chat-modal__manual-submit,
  .start-chat-modal__footer-actions .agent-btn {
    border-radius: 16px;
    font-size: 14px;
    height: 36px;
  }

  .start-chat-modal__footer-actions .agent-btn {
    min-width: 72px;
    padding: 0 14px;
  }
}
</style>
