<template>
  <div class="cw-form">
    <!-- Header -->
    <header class="cw-form-header">
      <div class="cw-form-header__left">
        <button type="button" class="cw-form-header__back" @click="$router.push('/sessions')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </button>
        <div class="cw-form-header__avatar">?</div>
        <span class="cw-form-header__title">新的会话</span>
      </div>
      <button type="button" class="cw-form-header__close" aria-label="最小化" @click="$router.push('/minimized')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" /></svg>
      </button>
    </header>

    <!-- Form Content -->
    <div class="cw-form-messages">
      <div class="cw-form-msg">
        <span class="cw-form-msg__time">10:32</span>
        <div class="cw-form-card">
          <p class="cw-form-card__title">{{ formTitle }}</p>
          <div class="cw-form-card__fields">
            <div v-for="field in formFields" :key="field.id" class="cw-form-field">
              <label class="cw-form-field__label">
                <span v-if="field.required" class="cw-form-field__required">*</span>{{ field.label }}
              </label>
              <input
                v-model="field.value"
                class="cw-form-field__input"
                :placeholder="field.placeholder"
              />
            </div>
          </div>
          <button type="button" class="cw-form-card__submit" @click="handleSubmit">提交</button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="cw-footer">Powered by <strong>Chat</strong></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const formTitle = "Welcome! Please fill in the information.";

const formFields = ref([
  { id: "f-1", label: "姓名", placeholder: "Enter your name", required: true, value: "" },
  { id: "f-2", label: "邮箱", placeholder: "Enter your email", required: true, value: "" },
  { id: "f-3", label: "电话", placeholder: "Enter your phone", required: false, value: "" }
]);

const handleSubmit = () => {
  router.push("/chat/new");
};
</script>

<style scoped>
.cw-form {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Header */
.cw-form-header {
  align-items: center;
  background: #fff;
  border-bottom: 1px solid var(--agent-color-border-default);
  display: flex;
  flex-shrink: 0;
  justify-content: space-between;
  padding: 14px 16px;
}

.cw-form-header__left {
  align-items: center;
  display: flex;
  gap: 10px;
  min-width: 0;
}

.cw-form-header__back {
  align-items: center;
  background: none;
  border: none;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  display: inline-flex;
  padding: 0;
}

.cw-form-header__avatar {
  align-items: center;
  background: #42b4f5;
  border-radius: 50%;
  color: #fff;
  display: flex;
  font-size: 12px;
  height: 28px;
  justify-content: center;
  width: 28px;
}

.cw-form-header__title {
  color: var(--agent-color-text-primary);
  font-size: 13px;
  font-weight: 600;
}

.cw-form-header__close {
  align-items: center;
  background: none;
  border: none;
  border-radius: 50%;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  height: 28px;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
  width: 28px;
}

.cw-form-header__close:hover {
  background: var(--agent-color-bg-hover, rgba(0, 0, 0, 0.06));
  color: var(--agent-color-text-primary);
}

/* Messages area */
.cw-form-messages {
  background: #f5f5f5;
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  padding: 14px;
}

.cw-form-msg {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cw-form-msg__time {
  color: var(--agent-color-text-tertiary);
  font-size: 10px;
  line-height: 1;
}

/* Form Card */
.cw-form-card {
  background: #fff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px 20px;
  width: 100%;
}

.cw-form-card__title {
  color: #222;
  font-size: 12px;
  line-height: 1.6;
  margin: 0;
}

.cw-form-card__fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cw-form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cw-form-field__label {
  color: #222;
  font-size: 11px;
  line-height: 1.4;
}

.cw-form-field__required {
  color: #ff382e;
  font-weight: 500;
  margin-right: 2px;
}

.cw-form-field__input {
  background: #fff;
  border: 1px solid #e2e8ef;
  border-radius: 12px;
  color: #222;
  font-size: 11px;
  height: 34px;
  outline: none;
  padding: 0 12px;
  transition: border-color 0.15s;
}

.cw-form-field__input:focus {
  border-color: var(--agent-color-brand-primary);
}

.cw-form-card__submit {
  background: var(--agent-color-brand-primary);
  border: none;
  border-radius: 12px;
  color: #fff;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  padding: 10px;
  text-align: center;
  transition: opacity 0.15s;
}

.cw-form-card__submit:hover {
  opacity: 0.92;
}

/* Footer */
.cw-footer {
  background: #fff;
  color: var(--agent-color-text-tertiary);
  flex-shrink: 0;
  font-size: 10px;
  padding: 6px;
  text-align: center;
}
</style>
