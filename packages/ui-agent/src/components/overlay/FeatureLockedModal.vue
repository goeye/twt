<template>
  <BaseModal :open="open" :title="isAdmin ? '升级到专业版' : '功能受限'" max-width="420px" @close="$emit('close')">
    <div class="feature-locked-content">
      <div class="feature-locked-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="11" width="18" height="11" rx="2" stroke="#75869c" stroke-width="1.5" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#75869c" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </div>
      <p v-if="isAdmin" class="feature-locked-desc">
        <strong>{{ featureName }}</strong>
        <br />
        {{ featureDescription }}
      </p>
      <p v-else class="feature-locked-desc">
        「{{ featureName }}」需要专业版支持，请联系管理员开通
      </p>
    </div>
    <template #footer>
      <div v-if="isAdmin" class="feature-locked-footer">
        <button type="button" class="agent-btn agent-btn--ghost" @click="$emit('close')">关闭</button>
        <button type="button" class="agent-btn agent-btn--primary" @click="$emit('close')">联系客服升级</button>
      </div>
      <div v-else class="feature-locked-footer">
        <button type="button" class="agent-btn agent-btn--primary" @click="$emit('close')">我知道了</button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from './BaseModal.vue'

defineProps<{
  open: boolean
  isAdmin: boolean
  featureName: string
  featureDescription: string
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>

<style scoped>
.feature-locked-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--agent-space-16);
  padding: var(--agent-space-12) 0;
  text-align: center;
}

.feature-locked-icon {
  color: var(--agent-color-text-tertiary);
}

.feature-locked-desc {
  color: #75869c;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

.feature-locked-desc strong {
  color: var(--agent-color-text-primary);
  font-size: 15px;
}

.feature-locked-footer {
  display: flex;
  gap: var(--agent-space-8);
  justify-content: flex-end;
  width: 100%;
}
</style>
