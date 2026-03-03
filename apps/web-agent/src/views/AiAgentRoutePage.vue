<template>
  <section class="agent-content-page ai-agent-page">
    <template v-if="activeKey === 'copilot-settings'">
      <header class="agent-content-header">
        <h1 class="agent-content-title">Copilot设置</h1>
        <p class="agent-content-subtitle">使用 Copilot 工具在客服对话中提供智能辅助功能。</p>
      </header>

      <CopilotPromoBanner
        v-if="showBanner"
        title="以智能驱动服务，助力业务增长"
        description="通过 Copilot 提升响应速度与服务满意度。将每一次咨询转化为高质量的互动，让智能客服成为你业务转化的核心驱动力。"
        @close="showBanner = false"
        @learn="emitToast('文档功能开发中')"
      />

      <div class="ai-agent-page__list">
        <CopilotSettingItem
          v-for="item in copilotSettings"
          :key="item.key"
          :description="item.description"
          :model-value="item.enabled"
          :title="item.title"
          @update:model-value="updateCopilotSetting(item.key, $event)"
        />
      </div>
    </template>

    <section v-else class="ai-agent-page__placeholder agent-panel">
      <h2 class="agent-settings-feature-title">{{ activeSectionLabel }}</h2>
      <p class="agent-settings-feature-description">
        {{ activeKey === "doc-knowledge" ? "文档知识管理页面建设中。" : "常见问题管理页面建设中。" }}
      </p>
      <button type="button" class="agent-btn agent-btn--ghost" @click="emitToast('功能开发中')">了解更多</button>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { CopilotPromoBanner, CopilotSettingItem } from "@twt/ui-agent";

type AiAgentNavKey = "doc-knowledge" | "faq" | "copilot-settings";

interface CopilotSetting {
  key: string;
  title: string;
  description: string;
  enabled: boolean;
}

const props = defineProps<{
  activeKey: AiAgentNavKey;
}>();

const emit = defineEmits<{
  (e: "toast", message: string): void;
}>();

const showBanner = ref(true);
const copilotSettings = ref<CopilotSetting[]>([
  { key: "auto-suggest", title: "自动推荐回复", description: "针对访客咨询，自动生成推荐回复。", enabled: true },
  { key: "chat-translation", title: "聊天翻译", description: "访客发送的消息将被自动翻译。", enabled: true },
  { key: "side-translation", title: "边写边译", description: "客服发送的消息将被自动翻译。", enabled: true },
  {
    key: "text-polish",
    title: "文本润色",
    description: "借助 AI 优化客服回复内容，支持润色、丰富内容、精简内容等。",
    enabled: true
  }
]);

const activeSectionLabel = computed(() => {
  if (props.activeKey === "doc-knowledge") return "文档知识";
  if (props.activeKey === "faq") return "常见问题";
  return "Copilot设置";
});

const updateCopilotSetting = (key: string, next: boolean) => {
  copilotSettings.value = copilotSettings.value.map((item) => {
    if (item.key !== key) return item;
    return { ...item, enabled: next };
  });
  emit("toast", next ? "设置已开启" : "设置已关闭");
};

const emitToast = (message: string) => {
  emit("toast", message);
};
</script>

<style scoped>
.ai-agent-page {
  gap: var(--agent-space-16);
}

.ai-agent-page__list {
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-16);
}

.ai-agent-page__placeholder {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-12);
  justify-content: center;
  min-height: 240px;
  padding: var(--agent-space-24);
}

@media (max-width: 1280px) {
  .ai-agent-page__placeholder {
    padding: var(--agent-space-16);
  }
}
</style>
