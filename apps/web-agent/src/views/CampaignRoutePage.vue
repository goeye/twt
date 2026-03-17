<template>
  <section class="agent-content-page">
    <div class="agent-panel campaign-card">
      <header class="campaign-header">
        <h1 class="agent-content-title">群发消息</h1>
        <button type="button" class="agent-btn agent-btn--primary" @click="handleCreate">
          + 新建
          <span v-if="!canUse(FEATURES.MASS_MESSAGE)" class="agent-feature-lock"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span>
        </button>
      </header>
      <DataTable bare :columns="columns" :rows="rows">
        <template #empty>暂无群发记录</template>
        <template #cell-action="{ value }">
          <span class="action-link">{{ value }}</span>
        </template>
      </DataTable>
    </div>
  </section>
</template>

<script setup lang="ts">
import { DataTable, type TableColumn } from "@twt/ui-agent";
import { FEATURES } from "../lib/plan";
import { usePlan } from "../composables/usePlan";

interface CampaignRow extends Record<string, unknown> {
  content: string;
  total: number;
  success: number;
  read: number;
  replied: number;
  creator: string;
  createdAt: string;
  action: string;
}

const emit = defineEmits<{ toast: [msg: string] }>();

const { canUse, guardFeature } = usePlan();

const handleCreate = () => {
  if (!guardFeature(FEATURES.MASS_MESSAGE)) return;
  emit("toast", "新建功能开发中");
};

const columns: TableColumn<CampaignRow>[] = [
  { key: "content", title: "消息内容", width: "22%" },
  { key: "total", title: "发送总数", width: "10%" },
  { key: "success", title: "成功", width: "10%" },
  { key: "read", title: "已读", width: "10%" },
  { key: "replied", title: "已回复", width: "10%" },
  { key: "creator", title: "创建人", width: "10%" },
  { key: "createdAt", title: "创建时间", width: "18%" },
  { key: "action", title: "操作", width: "10%" },
];

const rows: CampaignRow[] = [
  {
    content: "元旦大优惠，快来买",
    total: 25,
    success: 10,
    read: 3,
    replied: 1,
    creator: "Wang",
    createdAt: "2025-10-29 17:08",
    action: "详情",
  },
];
</script>

<style scoped>
.agent-content-page {
  padding: 10px !important;
}

.campaign-card {
  border-radius: var(--agent-radius-xl);
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.campaign-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
}

.campaign-header .agent-btn--primary {
  border-radius: 10px;
  font-size: var(--agent-font-size-md);
  padding: 7px 12px 7px 10px;
}

.campaign-card :deep(.agent-table) {
  border-spacing: 0 8px;
}

.campaign-card :deep(.agent-table th) {
  background: #eff2f5;
  color: #222;
  font-size: var(--agent-font-size-md);
  padding: 10px 20px;
}

.campaign-card :deep(.agent-table td) {
  font-size: var(--agent-font-size-md);
  padding: 10px 20px;
}

.action-link {
  color: #1b539a;
  cursor: pointer;
}
</style>
