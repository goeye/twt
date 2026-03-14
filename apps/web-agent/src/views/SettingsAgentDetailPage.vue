<template>
  <section class="agent-detail-page agent-content-page agent-content-page--hide-scrollbar">
    <article class="agent-detail-page__card agent-panel">
      <header class="agent-detail-page__header">
        <button type="button" class="agent-detail-page__back" @click="emit('back')">
          <span class="agent-detail-page__back-arrow">‹</span>
        </button>
        <h2 class="agent-detail-page__title">账号详情</h2>
      </header>

      <div class="agent-detail-page__body agent-scroll">
        <!-- Avatar section -->
        <div class="agent-detail-page__avatar-section">
          <div class="agent-detail-page__avatar-wrapper">
            <div class="agent-detail-page__avatar" :style="{ background: agent.avatarColor }">
              <span class="agent-detail-page__avatar-text">{{ agent.avatarText }}</span>
            </div>
            <span class="agent-detail-page__avatar-edit">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8.5 1.5l2 2-7 7H1.5V8.5l7-7z" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/></svg>
            </span>
          </div>
          <div class="agent-detail-page__avatar-info">
            <button type="button" class="agent-detail-page__upload-btn">上传图片</button>
            <span class="agent-detail-page__avatar-hint">此图像将向访客显示</span>
          </div>
        </div>

        <div class="agent-detail-page__divider" />

        <!-- 个人信息 -->
        <h3 class="agent-detail-page__section-title">个人信息</h3>

        <div class="agent-detail-page__row">
          <div class="agent-detail-page__field">
            <label class="agent-detail-page__label"><span class="agent-detail-page__required">*</span> 姓名</label>
            <input v-model="form.name" class="agent-input agent-detail-page__input" placeholder="请输入姓名" @blur="handleBlur('name')" />
          </div>
          <div class="agent-detail-page__field">
            <label class="agent-detail-page__label"><span class="agent-detail-page__required">*</span> 昵称</label>
            <input v-model="form.nickname" class="agent-input agent-detail-page__input" placeholder="请输入昵称" @blur="handleBlur('nickname')" />
          </div>
        </div>

        <div class="agent-detail-page__row">
          <div class="agent-detail-page__field">
            <label class="agent-detail-page__label">会话限制</label>
            <input v-model="form.sessionLimit" class="agent-input agent-detail-page__input" type="number" placeholder="请输入会话限制" @blur="handleBlur('sessionLimit')" />
          </div>
          <div class="agent-detail-page__field">
            <label class="agent-detail-page__label">角色</label>
            <select v-model="form.roleName" class="agent-input agent-detail-page__input agent-detail-page__select" :disabled="agent.isSelf" @change="handleAutoSave">
              <option v-if="form.roleName === '超级管理员'" value="超级管理员">超级管理员</option>
              <option value="客服">客服</option>
              <option value="高级客服">高级客服</option>
              <option value="主管">主管</option>
            </select>
          </div>
        </div>

        <div class="agent-detail-page__row">
          <div class="agent-detail-page__field">
            <label class="agent-detail-page__label">邮箱</label>
            <input v-model="form.email" class="agent-input agent-detail-page__input" :disabled="agent.isSelf" placeholder="请输入邮箱" @blur="handleBlur('email')" />
          </div>
          <div class="agent-detail-page__field">
            <label class="agent-detail-page__label">所属项目</label>
            <input v-model="form.project" class="agent-input agent-detail-page__input" :disabled="agent.isSelf" placeholder="请输入所属项目" @blur="handleBlur('project')" />
          </div>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { reactive } from "vue";

interface AgentData {
  id: string;
  name?: string;
  nickname?: string;
  email?: string;
  roleName?: string;
  sessionLimit?: number;
  avatarColor?: string;
  avatarText?: string;
  isSelf?: boolean;
}

const props = defineProps<{
  agent: AgentData;
}>();

const emit = defineEmits<{
  (e: "back"): void;
  (e: "save", data: { name: string; nickname: string; sessionLimit: string; email: string; project: string }): void;
  (e: "toast", message: string): void;
}>();

const form = reactive({
  name: props.agent.name || "",
  nickname: props.agent.nickname || "",
  sessionLimit: String(props.agent.sessionLimit ?? ""),
  roleName: props.agent.roleName || "客服",
  email: props.agent.email || "",
  project: "Chat"
});

const handleBlur = (field: keyof typeof form) => {
  const value = String(form[field]).trim();
  if (value === "") {
    emit("toast", "输入内容不能为空");
    return;
  }
  handleAutoSave();
};

const handleAutoSave = () => {
  emit("save", { ...form });
  emit("toast", "保存成功");
};
</script>

<style scoped>
.agent-detail-page {
  align-items: stretch;
  gap: 0;
  overflow: hidden;
  padding: 12px;
}

.agent-detail-page__card {
  background: #ffffff;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.agent-detail-page__header {
  align-items: center;
  border-bottom: 1px solid #edf1f5;
  display: flex;
  flex-shrink: 0;
  gap: 8px;
  padding: 18px 28px;
}

.agent-detail-page__back {
  align-items: center;
  background: transparent;
  border: 0;
  color: #252525;
  cursor: pointer;
  display: inline-flex;
  padding: 0;
}

.agent-detail-page__back-arrow {
  color: #252525;
  font-size: 22px;
  font-weight: 600;
  line-height: 1;
}

.agent-detail-page__back:hover {
  opacity: 0.7;
}

.agent-detail-page__title {
  color: #252525;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.agent-detail-page__body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 28px 28px 40px;
}

/* Avatar */
.agent-detail-page__avatar-section {
  align-items: center;
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
}

.agent-detail-page__avatar-wrapper {
  flex-shrink: 0;
  height: 72px;
  position: relative;
  width: 72px;
}

.agent-detail-page__avatar {
  align-items: center;
  border-radius: 50%;
  color: #ffffff;
  display: flex;
  font-size: 24px;
  font-weight: 600;
  height: 72px;
  justify-content: center;
  width: 72px;
}

.agent-detail-page__avatar-text {
  line-height: 1;
}

.agent-detail-page__avatar-edit {
  align-items: center;
  background: #555;
  border: 2px solid #ffffff;
  border-radius: 50%;
  bottom: 0;
  cursor: pointer;
  display: flex;
  height: 24px;
  justify-content: center;
  position: absolute;
  right: 0;
  width: 24px;
}

.agent-detail-page__avatar-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.agent-detail-page__upload-btn {
  background: transparent;
  border: 1px solid #105eff;
  border-radius: 6px;
  color: #105eff;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  padding: 4px 14px;
  transition: background-color 0.15s;
  width: fit-content;
}

.agent-detail-page__upload-btn:hover {
  background: #f0f5ff;
}

.agent-detail-page__avatar-hint {
  color: #b0b8c8;
  font-size: 12px;
  line-height: 18px;
}

/* Divider */
.agent-detail-page__divider {
  border-top: 1px solid #edf1f5;
  margin-bottom: 24px;
}

/* Section */
.agent-detail-page__section-title {
  color: #252525;
  font-size: 15px;
  font-weight: 600;
  line-height: 22px;
  margin: 0 0 20px;
}

/* Form */
.agent-detail-page__row {
  display: flex;
  gap: 24px;
  margin-bottom: 20px;
}

.agent-detail-page__field {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  max-width: 320px;
}

.agent-detail-page__label {
  color: #252525;
  display: block;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
}

.agent-detail-page__required {
  color: #ef4444;
  margin-right: 2px;
}

.agent-detail-page__input {
  border: 1px solid #dbe1ea;
  border-radius: 8px;
  color: #252525;
  font-size: 14px;
  height: 40px;
  line-height: 20px;
  padding: 0 12px;
  transition: border-color 0.15s;
  width: 100%;
}

.agent-detail-page__input:focus {
  border-color: #105eff;
  outline: none;
}

.agent-detail-page__input::placeholder {
  color: #b0b8c8;
}

.agent-detail-page__input:disabled {
  background: #f5f7f9;
  color: #b0b8c8;
  cursor: not-allowed;
}

.agent-detail-page__select {
  appearance: auto;
}

</style>
