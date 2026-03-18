<template>
  <teleport to="body">
    <div v-if="open" class="feature-upgrade-mask">
      <section class="feature-upgrade-card" role="dialog" aria-modal="true">
        <!-- 顶部插画区 -->
        <div class="feature-upgrade-hero">
          <!-- 装饰性 SVG 插画 -->
          <svg class="feature-upgrade-illustration" width="280" height="140" viewBox="0 0 280 140" fill="none">
            <!-- 背景卡片 -->
            <rect x="60" y="20" width="160" height="100" rx="12" fill="#fff" fill-opacity="0.9" />
            <rect x="60" y="20" width="160" height="100" rx="12" stroke="#e0e7ef" stroke-width="0.5" />
            <!-- 头像 1 -->
            <circle cx="42" cy="50" r="18" fill="#fde4cf" />
            <circle cx="42" cy="44" r="6" fill="#e8a87c" />
            <ellipse cx="42" cy="56" rx="9" ry="6" fill="#e8a87c" />
            <!-- 头像 2 -->
            <circle cx="238" cy="70" r="18" fill="#d4e5f7" />
            <circle cx="238" cy="64" r="6" fill="#7bafd4" />
            <ellipse cx="238" cy="76" rx="9" ry="6" fill="#7bafd4" />
            <!-- 卡片内文字行 -->
            <rect x="80" y="38" width="16" height="16" rx="4" fill="#e8f0fe" />
            <rect x="102" y="42" width="60" height="8" rx="4" fill="#d0dce8" />
            <!-- 高亮行 -->
            <rect x="75" y="62" width="130" height="26" rx="6" fill="#f0f6ff" stroke="#4080ff" stroke-width="1.5" />
            <circle cx="92" cy="75" r="8" fill="#4080ff" />
            <path d="M89 75l2 2 4-4" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <rect x="106" y="71" width="50" height="8" rx="4" fill="#4080ff" fill-opacity="0.3" />
            <!-- 底部行 -->
            <rect x="80" y="96" width="16" height="16" rx="4" fill="#e8f0fe" />
            <rect x="102" y="100" width="40" height="8" rx="4" fill="#d0dce8" />
          </svg>
        </div>

        <!-- 文字内容区 -->
        <div class="feature-upgrade-body">
          <h3 class="feature-upgrade-title">升级到专业版</h3>
          <p class="feature-upgrade-desc">该功能在当前服务版本不可用，请升级到专业版</p>
        </div>

        <!-- 按钮区 -->
        <div class="feature-upgrade-footer">
          <template v-if="isAdmin">
            <button type="button" class="agent-btn agent-btn--ghost feature-upgrade-btn-cancel" @click="$emit('close')">取 消</button>
            <button type="button" class="agent-btn agent-btn--primary feature-upgrade-btn-primary" @click="$emit('close')">立即升级</button>
          </template>
          <button v-else type="button" class="agent-btn agent-btn--primary feature-upgrade-btn-primary" @click="$emit('close')">我知道了</button>
        </div>
      </section>
    </div>
  </teleport>
</template>

<script setup lang="ts">
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
.feature-upgrade-mask {
  align-items: center;
  background: var(--agent-color-overlay-mask);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: var(--agent-space-24);
  position: fixed;
  z-index: var(--agent-z-modal);
}

.feature-upgrade-card {
  background: #fff;
  border-radius: var(--agent-radius-xl);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  max-width: 460px;
  overflow: hidden;
  width: 100%;
}

/* 顶部插画区 */
.feature-upgrade-hero {
  background: linear-gradient(135deg, #eef3ff 0%, #f5f0ff 50%, #fff0f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  position: relative;
  padding: 20px;
}

.feature-upgrade-illustration {
  display: block;
}

/* 文字内容区 */
.feature-upgrade-body {
  padding: 24px 32px 0;
}

.feature-upgrade-title {
  color: #1a1a1a;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.4;
  margin: 0 0 8px;
}

.feature-upgrade-desc {
  color: #75869c;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

/* 按钮区 */
.feature-upgrade-footer {
  display: flex;
  gap: var(--agent-space-12);
  justify-content: flex-end;
  padding: 24px 32px 28px;
}

.feature-upgrade-btn-cancel {
  min-width: 100px;
  height: 40px;
  border-radius: var(--agent-radius-lg);
  font-size: 14px;
}

.feature-upgrade-btn-primary {
  min-width: 120px;
  height: 40px;
  border-radius: var(--agent-radius-lg);
  font-size: 14px;
}
</style>
