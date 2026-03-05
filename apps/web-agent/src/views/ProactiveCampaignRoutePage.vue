<template>
  <section class="agent-content-page proactive-page" :class="{ 'proactive-page--editor': viewMode === 'editor' }" @click="closeActionMenu">
    <section v-if="viewMode === 'list'" class="agent-panel proactive-list-card">
      <header class="proactive-list-header">
        <div class="proactive-list-header__text">
          <h1 class="agent-content-title">主动营销</h1>
        </div>
        <div class="proactive-list-header__actions">
          <button type="button" class="agent-btn agent-btn--ghost" @click.stop="openVisitorPerspectiveModal">
            访客端视角
          </button>
          <button type="button" class="agent-btn agent-btn--primary" @click.stop="openTemplateSelector">+ 新建</button>
        </div>
      </header>

      <DataTable bare :columns="columns" :rows="tableRows">
        <template #empty>
          <div class="list-empty">
            <p class="list-empty__title">暂无主动营销任务</p>
            <p class="list-empty__desc">先选择一个模板快速创建任务</p>
            <button type="button" class="agent-btn agent-btn--primary" @click.stop="openTemplateSelector">使用模板新建</button>
          </div>
        </template>

        <template #cell-name="{ value }">
          <span class="task-name-cell">{{ value }}</span>
        </template>

        <template #cell-status="{ row }">
          <AgentSwitch :model-value="Boolean(row.status)" @update:model-value="toggleTaskStatus(String(row.id), $event)" />
        </template>

        <template #cell-action="{ row }">
          <div class="task-action-wrap" @click.stop>
            <button type="button" class="icon-action-btn" @click="toggleActionMenu(String(row.id))">...</button>
            <div v-if="openActionMenuTaskId === String(row.id)" class="task-action-menu">
              <button type="button" @click="startEdit(String(row.id))">编辑</button>
              <button type="button" class="task-action-menu__danger" @click="promptDelete(String(row.id))">删除</button>
            </div>
          </div>
        </template>
      </DataTable>
    </section>

    <section v-else class="campaign-editor">
      <header class="campaign-editor__header">
        <div class="campaign-editor__title-row">
          <button type="button" class="campaign-editor__back-btn" aria-label="返回主动营销列表" @click="cancelEditor">
            <span aria-hidden="true">←</span>
          </button>
          <h1 class="agent-content-title">{{ editingTaskId ? "编辑主动营销" : "新建主动营销" }}</h1>
        </div>
      </header>

      <div v-if="editorDraft" class="campaign-editor__layout">
        <div class="campaign-editor__form agent-scroll">
          <article class="agent-panel editor-card">
            <h3 class="editor-card__title">基础设置</h3>
            <div class="editor-field">
              <label class="editor-field__label">任务名称</label>
              <input
                v-model="editorDraft.name"
                class="agent-input"
                :class="{ 'agent-input--error': shouldShowEditorFieldError('name', isTaskNameEmpty) }"
                placeholder="请输入"
                @blur="markEditorFieldTouched('name')"
              />
              <p v-if="shouldShowEditorFieldError('name', isTaskNameEmpty)" class="editor-field__error">请输入</p>
            </div>

            <div class="editor-field">
              <label class="editor-field__label">触发条件</label>
              <button type="button" class="condition-trigger" @click="openTriggerModal">
                <span>{{ triggerSummary }}</span>
                <span class="condition-trigger__edit">编辑</span>
              </button>
            </div>
          </article>

          <article class="agent-panel editor-card">
            <h3 class="editor-card__title">营销内容</h3>
            <div class="editor-field">
              <label class="editor-field__label">图片</label>
              <input ref="headerImageInputRef" class="header-image-input-hidden" type="file" accept="image/*" @change="handleHeaderImageUpload" />
              <button v-if="!editorDraft.headerImage" type="button" class="upload-btn upload-btn--compact" @click="triggerHeaderImageSelect">上传图片</button>
              <div v-if="editorDraft.headerImage" class="header-image-preview header-image-preview--compact">
                <img :src="editorDraft.headerImage" alt="图片预览" />
                <button type="button" class="header-image-action-btn header-image-action-btn--edit" aria-label="重新上传图片" @click="triggerHeaderImageSelect">
                  ⤴
                </button>
                <button type="button" class="header-image-action-btn header-image-action-btn--delete" aria-label="删除图片" @click="removeHeaderImage">
                  🗑
                </button>
              </div>
            </div>

            <div class="editor-field">
              <label class="editor-field__label">标题</label>
              <input v-model="editorDraft.title" class="agent-input" maxlength="20" placeholder="请输入" @input="limitDraftText('title', 20)" />
            </div>

            <div class="editor-field">
              <label class="editor-field__label">描述</label>
              <input
                v-model="editorDraft.description"
                class="agent-input"
                :class="{ 'agent-input--error': shouldShowEditorFieldError('description', isDescriptionEmpty) }"
                maxlength="100"
                placeholder="请输入"
                @input="limitDraftText('description', 100)"
                @blur="markEditorFieldTouched('description')"
              />
              <p v-if="shouldShowEditorFieldError('description', isDescriptionEmpty)" class="editor-field__error">请输入</p>
            </div>
          </article>

          <article class="agent-panel editor-card">
            <div class="editor-card__title-row">
              <h3 class="editor-card__title">按钮</h3>
              <button
                type="button"
                class="text-add-btn"
                :disabled="editorDraft.buttons.length >= 5"
                @click="appendButton"
              >
                <span aria-hidden="true">+</span>
                <span>添加按钮</span>
              </button>
            </div>

            <div class="button-editor-list">
              <article v-for="(button, index) in editorDraft.buttons" :key="button.id" class="button-editor-item">
                <header class="button-editor-item__header">
                  <strong class="button-editor-item__title">按钮 {{ index + 1 }}</strong>
                  <button
                    type="button"
                    class="text-danger-btn"
                    :disabled="editorDraft.buttons.length === 1"
                    @click="removeButton(index)"
                  >
                    删除
                  </button>
                </header>

                <div class="editor-field">
                  <label class="editor-field__label">按钮文案</label>
                  <input
                    v-model="button.label"
                    class="agent-input"
                    :class="{ 'agent-input--error': shouldShowEditorFieldError(`button-label-${button.id}`, isButtonLabelEmpty(button)) }"
                    maxlength="20"
                    placeholder="立即聊天"
                    @blur="markEditorFieldTouched(`button-label-${button.id}`)"
                  />
                  <p v-if="shouldShowEditorFieldError(`button-label-${button.id}`, isButtonLabelEmpty(button))" class="editor-field__error">请输入</p>
                </div>

                <div class="editor-field">
                  <label class="editor-field__label">动作配置</label>
                  <div class="button-action-row">
                    <select v-model="button.actionType" class="agent-input button-action-select">
                      <option v-for="option in actionTypeOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                    <input
                      v-model="button.value"
                      class="agent-input"
                      :class="{ 'agent-input--error': shouldShowEditorFieldError(`button-value-${button.id}`, isButtonValueEmpty(button)) }"
                      :placeholder="actionValuePlaceholder(button.actionType)"
                      @blur="markEditorFieldTouched(`button-value-${button.id}`)"
                    />
                  </div>
                  <p v-if="shouldShowEditorFieldError(`button-value-${button.id}`, isButtonValueEmpty(button))" class="editor-field__error">请输入</p>
                </div>
              </article>
            </div>
          </article>
        </div>

        <aside class="campaign-editor__preview">
          <section class="agent-panel preview-sticky">
            <div class="preview-canvas">
              <div class="preview-canvas__bar">
                <span />
                <span />
                <span />
              </div>
              <div class="preview-canvas__body">
                <div class="preview-grid" />
                <div class="preview-widget">
                  <section class="preview-bubble">
                    <img v-if="editorDraft.headerImage" class="preview-bubble__image" :src="editorDraft.headerImage" alt="头图" />
                    <h4 v-if="editorDraft.title" class="preview-bubble__title">{{ editorDraft.title }}</h4>
                    <p class="preview-bubble__desc">{{ editorDraft.description || "请输入" }}</p>
                    <div class="preview-bubble__actions">
                      <button
                        v-for="(button, index) in editorDraft.buttons"
                        :key="button.id"
                        type="button"
                        class="preview-bubble__btn"
                        :class="{ 'preview-bubble__btn--primary': index === 0 }"
                      >
                        {{ button.label || "立即聊天" }}
                      </button>
                    </div>
                  </section>
                  <button type="button" class="preview-fab" aria-label="在线客服">客服</button>
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>

      <footer class="campaign-editor__footer agent-panel">
        <button type="button" class="agent-btn agent-btn--ghost" @click="cancelEditor">取消</button>
        <button type="button" class="agent-btn agent-btn--primary" @click="saveEditor">保存并开启</button>
      </footer>
    </section>

    <teleport to="body">
      <div v-if="templateModalOpen" class="template-modal-mask" @click.self="templateModalOpen = false">
        <section class="template-modal agent-panel" role="dialog" aria-modal="true">
          <header class="template-modal__header">
            <div>
              <h3>选择营销模板</h3>
            </div>
            <button type="button" class="template-modal__close" @click="templateModalOpen = false">x</button>
          </header>

          <div class="template-modal__body agent-scroll">
            <article
              v-for="template in templateLibrary"
              :key="template.id"
              class="template-card"
              @click="createFromTemplate(template.id)"
            >
              <div class="template-card__preview">
                <img :src="template.previewImage" :alt="`${template.name} 预览图`" />
              </div>

              <div class="template-card__meta">
                <h4>{{ template.name }}</h4>
                <p>{{ template.description }}</p>
                <div class="template-tags">
                  <span v-for="tag in template.tags" :key="tag" class="template-tag">{{ tag }}</span>
                </div>
              </div>

              <button type="button" class="agent-btn agent-btn--ghost" @click.stop="createFromTemplate(template.id)">使用模板</button>
            </article>
          </div>
        </section>
      </div>
    </teleport>

    <BaseModal :open="triggerModalOpen" title="触发条件" @close="closeTriggerModal">
      <div v-if="triggerModalDraft" class="trigger-modal-form">
        <section class="trigger-section">
          <p class="trigger-section__title">接收访客</p>
          <div class="pill-group">
            <button
              v-for="option in audienceOptions"
              :key="option.value"
              type="button"
              class="pill-option"
              :class="{ 'pill-option--active': triggerModalDraft.audience === option.value }"
              @click="setTriggerAudience(option.value)"
            >
              {{ option.label }}
            </button>
          </div>
        </section>

        <section class="trigger-section">
          <p class="trigger-section__title">展示次数</p>
          <div class="pill-group">
            <button
              v-for="option in frequencyOptions"
              :key="option.value"
              type="button"
              class="pill-option"
              :class="{ 'pill-option--active': triggerModalDraft.frequency === option.value }"
              @click="setTriggerFrequency(option.value)"
            >
              {{ option.label }}
            </button>
          </div>
        </section>

        <section class="trigger-section">
          <p class="trigger-section__title">展示时机</p>
          <div class="pill-group">
            <button
              v-for="option in timingOptions"
              :key="option.value"
              type="button"
              class="pill-option"
              :class="{ 'pill-option--active': triggerModalDraft.timing === option.value }"
              @click="setTriggerTiming(option.value)"
            >
              {{ option.label }}
            </button>
          </div>
        </section>

        <section class="trigger-section">
          <p class="trigger-section__title">延迟时间</p>
          <div class="delay-stepper">
            <input
              v-model.number="triggerModalDraft.delaySeconds"
              class="agent-input"
              :class="{ 'agent-input--error': showTriggerDelayError }"
              type="number"
              min="1"
              max="600"
              @blur="handleTriggerDelayBlur"
            />
            <span>秒</span>
          </div>
          <p v-if="showTriggerDelayError" class="editor-field__error">请输入</p>
        </section>
      </div>

      <template #footer>
        <span />
        <div class="modal-footer-actions">
          <button type="button" class="agent-btn agent-btn--ghost" @click="closeTriggerModal">取消</button>
          <button type="button" class="agent-btn agent-btn--primary" @click="confirmTriggerModal">确定</button>
        </div>
      </template>
    </BaseModal>

    <BaseModal :open="Boolean(deleteTaskId)" title="删除数据" @close="deleteTaskId = null">
      <p class="delete-modal__desc">删除后不可恢复，确认删除？</p>
      <template #footer>
        <span />
        <div class="modal-footer-actions">
          <button type="button" class="agent-btn agent-btn--ghost" @click="deleteTaskId = null">取消</button>
          <button type="button" class="agent-btn agent-btn--danger" @click="confirmDelete">确认</button>
        </div>
      </template>
    </BaseModal>

    <BaseModal :open="cropModalOpen" title="图片裁剪" @close="closeCropModal">
      <div v-if="cropState.imageSrc" class="crop-modal-content">
        <div
          class="crop-canvas"
          :class="{ 'crop-canvas--dragging': cropDragging }"
          @mousedown.prevent="startCropDrag"
          @mousemove.prevent="handleCropDrag"
          @mouseup="endCropDrag"
          @mouseleave="endCropDrag"
        >
          <img :src="cropState.imageSrc" alt="裁剪预览" :style="cropImageStyle" draggable="false" />
        </div>
      </div>
      <template #footer>
        <span />
        <div class="modal-footer-actions">
          <button type="button" class="agent-btn agent-btn--ghost" @click="closeCropModal">取消</button>
          <button type="button" class="agent-btn agent-btn--primary" @click="confirmCropImage">确定</button>
        </div>
      </template>
    </BaseModal>

    <BaseModal :open="visitorPreviewModalOpen" title="访客端视角" max-width="800px" @close="closeVisitorPerspectiveModal">
      <div class="visitor-preview-modal">
        <div class="visitor-preview-mode-group">
          <button
            v-for="option in visitorPreviewModeOptions"
            :key="option.value"
            type="button"
            class="visitor-preview-mode-btn"
            :class="{ 'visitor-preview-mode-btn--active': visitorPreviewMode === option.value }"
            @click="switchVisitorPreviewMode(option.value)"
          >
            {{ option.label }}
          </button>
          <button
            type="button"
            class="visitor-preview-mode-btn visitor-preview-mode-btn--simulate"
            @click="simulateAgentMessage"
          >
            + 模拟客服消息
          </button>
        </div>

        <div class="visitor-preview-canvas">
          <div class="visitor-preview-canvas__header">
            <span />
            <span />
            <span />
          </div>
          <div class="visitor-preview-canvas__body">
            <div class="visitor-preview-bg">
              <div class="visitor-preview-bg__hero">
                <p>Visitor Page</p>
                <h4>营销弹窗样式观察</h4>
              </div>
            </div>

            <div class="visitor-preview-widget">
              <section v-if="!visitorBubbleDismissed" class="preview-bubble preview-bubble--visitor-modal" :class="{ 'preview-bubble--overflow': visitorPreviewContent.overflowScroll }">
                <button type="button" class="preview-bubble__close" aria-label="关闭" @click="visitorBubbleDismissed = true">&times;</button>
                <img v-if="visitorPreviewContent.headerImage" class="preview-bubble__image" :src="visitorPreviewContent.headerImage" alt="头图" />
                <h4 v-if="visitorPreviewContent.showTitle" class="preview-bubble__title" :class="{ 'preview-bubble__title--wrap': visitorPreviewContent.overflowScroll }">
                  {{ visitorPreviewContent.title }}
                </h4>
                <p class="preview-bubble__desc" :class="{ 'preview-bubble__desc--wrap': visitorPreviewContent.overflowScroll }">
                  {{ visitorPreviewContent.description }}
                </p>
                <div class="preview-bubble__actions">
                  <button
                    v-for="(buttonLabel, index) in visitorPreviewContent.buttonLabels"
                    :key="`${visitorPreviewMode}-${buttonLabel}-${index}`"
                    type="button"
                    class="preview-bubble__btn"
                    :class="{ 'preview-bubble__btn--primary': index === 0 }"
                    @click="handleVisitorBubbleAction(buttonLabel)"
                  >
                    {{ buttonLabel }}
                  </button>
                </div>
              </section>

              <!-- 客服主动消息通知气泡 -->
              <div v-if="agentNotifications.length > 0" class="agent-notify-wrap">
                <button type="button" class="agent-notify-wrap__close" @click="agentNotifications = []">&times;</button>
                <transition-group name="agent-notify" tag="div" class="agent-notify-stack">
                  <div
                    v-for="n in agentNotifications"
                    :key="n.id"
                    class="agent-notify-bubble"
                    @click="clickAgentNotification(n.text)"
                  >
                    <span class="agent-notify-bubble__text">{{ n.text }}</span>
                  </div>
                </transition-group>
              </div>

              <button type="button" class="preview-fab" aria-label="在线客服" @click="openVisitorChat">客服</button>
            </div>

            <!-- 访客聊天窗口 -->
            <transition name="visitor-chat-slide">
              <div v-if="visitorChatOpen" class="visitor-chat-panel">
                <header class="visitor-chat-panel__header">
                  <div class="visitor-chat-panel__header-left">
                    <div class="visitor-chat-avatar">?</div>
                    <span>新的会话</span>
                  </div>
                  <button type="button" class="visitor-chat-panel__close" @click="visitorChatOpen = false">&times;</button>
                </header>
                <div class="visitor-chat-panel__body">
                  <div class="visitor-chat-time">{{ visitorChatTime }}</div>
                  <div class="visitor-chat-msg visitor-chat-msg--agent">
                    <div class="visitor-chat-msg__bubble visitor-chat-msg__bubble--agent">
                      下午好，欢迎来到Chat。很高兴为您服务。请尽可能详细地描述您的使用场景，以便我更有效地帮助您。为了更好地协助您，能否请您提供您的姓名和联络地址？
                    </div>
                  </div>
                  <template v-if="visitorChatMessages.length > 0">
                    <div class="visitor-chat-time">{{ visitorChatTime }}</div>
                    <div
                      v-for="(msg, msgIdx) in visitorChatMessages"
                      :key="msgIdx"
                      class="visitor-chat-msg"
                      :class="msg.role === 'agent' ? 'visitor-chat-msg--agent' : 'visitor-chat-msg--visitor'"
                    >
                      <div
                        class="visitor-chat-msg__bubble"
                        :class="msg.role === 'agent' ? 'visitor-chat-msg__bubble--agent' : 'visitor-chat-msg__bubble--visitor'"
                      >
                        {{ msg.text }}
                      </div>
                    </div>
                  </template>
                </div>
                <footer class="visitor-chat-panel__footer">
                  <input type="text" class="visitor-chat-input" placeholder="输入信息..." readonly />
                  <div class="visitor-chat-powered">Powered by <strong>Chat</strong></div>
                </footer>
              </div>
            </transition>
          </div>
        </div>
      </div>
      <template #footer>
        <span />
        <div class="modal-footer-actions">
          <button type="button" class="agent-btn agent-btn--primary" @click="closeVisitorPerspectiveModal">关闭</button>
        </div>
      </template>
    </BaseModal>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { AgentSwitch, BaseModal, DataTable, type TableColumn } from "@twt/ui-agent";

type ViewMode = "list" | "editor";
type VisitorPreviewMode = "image-title-desc-buttons" | "image-desc-buttons" | "overflow-scroll";
type AudienceType = "all" | "first" | "returning";
type DisplayFrequency = "every_visit" | "once_per_user";
type DisplayTiming = "online_only" | "all_day";
type ButtonActionType = "open_link" | "send_message" | "paste_text";

interface TriggerCondition {
  audience: AudienceType;
  frequency: DisplayFrequency;
  timing: DisplayTiming;
  delaySeconds: number;
}

interface ActionButtonConfig {
  id: string;
  label: string;
  actionType: ButtonActionType;
  value: string;
}

interface TaskDraft {
  name: string;
  trigger: TriggerCondition;
  headerImage: string;
  title: string;
  description: string;
  buttons: ActionButtonConfig[];
}

interface ProactiveTask extends TaskDraft {
  id: string;
  status: boolean;
  creator: string;
  createdAt: string;
}

interface TemplateItem {
  id: string;
  name: string;
  description: string;
  tags: string[];
  previewImage: string;
  defaults: TaskDraft;
}

interface ProactiveTaskRow extends Record<string, unknown> {
  id: string;
  name: string;
  status: boolean;
  creator: string;
  createdAt: string;
  action: string;
}

const emit = defineEmits<{
  (e: "toast", message: string): void;
}>();

const audienceOptions: Array<{ label: string; value: AudienceType }> = [
  { label: "全部访客", value: "all" },
  { label: "首次访客", value: "first" },
  { label: "回访访客", value: "returning" }
];

const frequencyOptions: Array<{ label: string; value: DisplayFrequency }> = [
  { label: "每次访问", value: "every_visit" },
  { label: "每访客一次", value: "once_per_user" }
];

const timingOptions: Array<{ label: string; value: DisplayTiming }> = [
  { label: "客服在线", value: "online_only" },
  { label: "全时段", value: "all_day" }
];

const actionTypeOptions: Array<{ label: string; value: ButtonActionType }> = [
  { label: "打开链接", value: "open_link" },
  { label: "发送消息", value: "send_message" },
  { label: "复制文本", value: "paste_text" }
];

const audienceLabelMap: Record<AudienceType, string> = {
  all: "全部访客",
  first: "首次访客",
  returning: "回访访客"
};

const frequencyLabelMap: Record<DisplayFrequency, string> = {
  every_visit: "每次访问",
  once_per_user: "每访客一次"
};

const timingLabelMap: Record<DisplayTiming, string> = {
  online_only: "客服在线",
  all_day: "全时段"
};

const actionTypeMeta: Record<ButtonActionType, { valueLabel: string; placeholder: string }> = {
  open_link: { valueLabel: "链接地址", placeholder: "请输入 URL" },
  send_message: { valueLabel: "预设消息", placeholder: "请输入" },
  paste_text: { valueLabel: "待复制文本", placeholder: "请输入" }
};

const CROP_WIDTH = 480;
const CROP_HEIGHT = 270;
const CROP_DRAG_SCALE = 1.2;

const createId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const defaultTrigger = (): TriggerCondition => ({
  audience: "all",
  frequency: "once_per_user",
  timing: "online_only",
  delaySeconds: 5
});

const createButton = (overrides: Partial<Omit<ActionButtonConfig, "id">> = {}): ActionButtonConfig => ({
  id: createId(),
  label: "立即聊天",
  actionType: "send_message",
  value: "在线咨询",
  ...overrides
});

const createDraft = (overrides: Partial<TaskDraft> = {}): TaskDraft => ({
  name: "",
  trigger: defaultTrigger(),
  headerImage: "",
  title: "",
  description: "",
  buttons: [createButton()],
  ...overrides
});

const cloneTrigger = (trigger: TriggerCondition): TriggerCondition => ({ ...trigger });
const cloneButtons = (buttons: ActionButtonConfig[]) => buttons.map((button) => ({ ...button }));

const cloneDraft = (draft: TaskDraft, resetButtonIds = false): TaskDraft => ({
  name: draft.name,
  trigger: cloneTrigger(draft.trigger),
  headerImage: draft.headerImage,
  title: draft.title,
  description: draft.description,
  buttons: cloneButtons(draft.buttons).map((button) => (resetButtonIds ? { ...button, id: createId() } : button))
});

const createTemplatePreviewImage = (id: string): string => {
  const configs: Record<string, { bg: string[]; accent: string; icon: string }> = {
    "welcome-visitor": {
      bg: ["#E0ECFF", "#F0F6FF"],
      accent: "#3B82F6",
      icon: `<circle cx="480" cy="148" r="48" fill="#3B82F6" opacity="0.12"/><path d="M464 136c0-8.8 7.2-16 16-16s16 7.2 16 16v8h-32v-8zm-4 12h40c2.2 0 4 1.8 4 4v20c0 2.2-1.8 4-4 4h-40c-2.2 0-4-1.8-4-4v-20c0-2.2 1.8-4 4-4z" fill="#3B82F6" opacity="0.7"/><path d="M460 180h40" stroke="#3B82F6" stroke-width="2" opacity="0.3"/><text x="480" y="210" text-anchor="middle" fill="#3B82F6" font-size="13" font-weight="600" font-family="system-ui">Hi, Welcome!</text>`
    },
    "social-follow": {
      bg: ["#EDE7FF", "#F5F2FF"],
      accent: "#8B5CF6",
      icon: `<circle cx="480" cy="148" r="48" fill="#8B5CF6" opacity="0.12"/><path d="M468 140a16 16 0 0 1 24 0l6 8-6 8a16 16 0 0 1-24 0l-6-8z" fill="#8B5CF6" opacity="0.5"/><circle cx="480" cy="148" r="10" fill="#8B5CF6" opacity="0.7"/><text x="480" y="210" text-anchor="middle" fill="#8B5CF6" font-size="13" font-weight="600" font-family="system-ui">Follow Us</text>`
    },
    newsletter: {
      bg: ["#FFF0D4", "#FFFAF0"],
      accent: "#F59E0B",
      icon: `<circle cx="480" cy="148" r="48" fill="#F59E0B" opacity="0.12"/><rect x="462" y="130" width="36" height="28" rx="4" fill="#F59E0B" opacity="0.6"/><path d="M462 134l18 14 18-14" stroke="#FFF" stroke-width="2.5" fill="none"/><text x="480" y="210" text-anchor="middle" fill="#D97706" font-size="13" font-weight="600" font-family="system-ui">Subscribe</text>`
    },
    "flash-sale": {
      bg: ["#FFE4E6", "#FFF5F5"],
      accent: "#EF4444",
      icon: `<circle cx="480" cy="148" r="48" fill="#EF4444" opacity="0.12"/><path d="M474 126l-8 28h12l-2 22 16-30h-14z" fill="#EF4444" opacity="0.7"/><text x="480" y="210" text-anchor="middle" fill="#EF4444" font-size="13" font-weight="600" font-family="system-ui">Flash Sale</text>`
    },
    "customer-service": {
      bg: ["#D1FAE5", "#F0FDF4"],
      accent: "#10B981",
      icon: `<circle cx="480" cy="148" r="48" fill="#10B981" opacity="0.12"/><rect x="460" y="130" width="40" height="30" rx="14" fill="#10B981" opacity="0.6"/><circle cx="473" cy="145" r="3" fill="#FFF"/><circle cx="487" cy="145" r="3" fill="#FFF"/><path d="M497 152c0 6-8 10-17 10" stroke="#10B981" stroke-width="3" fill="none" opacity="0.5"/><text x="480" y="210" text-anchor="middle" fill="#10B981" font-size="13" font-weight="600" font-family="system-ui">Live Chat</text>`
    },
    custom: {
      bg: ["#F1F5F9", "#F8FAFC"],
      accent: "#64748B",
      icon: `<circle cx="480" cy="148" r="48" fill="#64748B" opacity="0.1"/><path d="M470 136h20v24h-20z" fill="none" stroke="#64748B" stroke-width="2.5" opacity="0.5" rx="3"/><path d="M474 144h12m-12 5h8m-8 5h10" stroke="#64748B" stroke-width="1.8" opacity="0.4"/><text x="480" y="210" text-anchor="middle" fill="#64748B" font-size="13" font-weight="600" font-family="system-ui">Custom</text>`
    }
  };
  const c = configs[id] ?? configs.custom;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="280" viewBox="0 0 960 280" fill="none">
    <defs>
      <linearGradient id="bg-${id}" x1="0" y1="0" x2="960" y2="280" gradientUnits="userSpaceOnUse">
        <stop stop-color="${c.bg[0]}"/><stop offset="1" stop-color="${c.bg[1]}"/>
      </linearGradient>
    </defs>
    <rect width="960" height="280" rx="16" fill="url(#bg-${id})"/>
    <rect x="48" y="230" width="200" height="10" rx="5" fill="${c.accent}" opacity="0.12"/>
    <rect x="48" y="250" width="140" height="8" rx="4" fill="${c.accent}" opacity="0.08"/>
    <rect x="712" y="230" width="200" height="10" rx="5" fill="${c.accent}" opacity="0.12"/>
    <rect x="712" y="250" width="140" height="8" rx="4" fill="${c.accent}" opacity="0.08"/>
    ${c.icon}
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const templateLibrary: TemplateItem[] = [
  {
    id: "welcome-visitor",
    name: "欢迎",
    description: "用友好的问候语给访客留下良好的第一印象",
    tags: ["全部访客", "每访客一次", "客服在线"],
    previewImage: createTemplatePreviewImage("welcome-visitor"),
    defaults: createDraft({
      name: "欢迎",
      trigger: { audience: "all", frequency: "once_per_user", timing: "online_only", delaySeconds: 5 },
      title: "欢迎来到 Chat",
      description: "你好，在线客服随时为你解答产品与价格问题",
      buttons: [createButton({ label: "在线咨询", actionType: "send_message", value: "我要咨询价格" })]
    })
  },
  {
    id: "social-follow",
    name: "关注我们",
    description: "引导访客关注你的社交媒体账号，保持互动",
    tags: ["全部访客", "每访客一次", "全时段"],
    previewImage: createTemplatePreviewImage("social-follow"),
    defaults: createDraft({
      name: "关注社交媒体",
      trigger: { audience: "all", frequency: "once_per_user", timing: "all_day", delaySeconds: 8 },
      title: "关注我们",
      description: "每天更新内容，点击下方渠道即可查看",
      buttons: [
        createButton({ label: "Twitter", actionType: "open_link", value: "https://example.com" }),
        createButton({ label: "Tiktok", actionType: "open_link", value: "https://example.com" })
      ]
    })
  },
  {
    id: "newsletter",
    name: "分享重要更新",
    description: "告诉访客重要通知及其他相关信息",
    tags: ["首次访客", "每访客一次", "客服在线"],
    previewImage: createTemplatePreviewImage("newsletter"),
    defaults: createDraft({
      name: "分享重要更新",
      trigger: { audience: "first", frequency: "once_per_user", timing: "online_only", delaySeconds: 6 },
      title: "重要更新",
      description: "由于天气原因，配送可能延迟 1-2 天",
      buttons: [createButton({ label: "联系我们", actionType: "send_message", value: "我要咨询配送延迟问题" })]
    })
  },
  {
    id: "flash-sale",
    name: "限时优惠",
    description: "推送限时折扣活动，提升转化率",
    tags: ["首次访客", "每访客一次", "全时段"],
    previewImage: createTemplatePreviewImage("flash-sale"),
    defaults: createDraft({
      name: "限时优惠",
      trigger: { audience: "first", frequency: "once_per_user", timing: "all_day", delaySeconds: 3 },
      title: "今日下单立减",
      description: "复制优惠码即享限时折扣，活动结束后将恢复原价",
      buttons: [createButton({ label: "获取折扣", actionType: "paste_text", value: "20%OFF" })]
    })
  },
  {
    id: "customer-service",
    name: "客服引导",
    description: "主动邀请访客进行，提升服务体验",
    tags: ["全部访客", "每次访问", "客服在线"],
    previewImage: createTemplatePreviewImage("customer-service"),
    defaults: createDraft({
      name: "客服引导",
      trigger: { audience: "all", frequency: "every_visit", timing: "online_only", delaySeconds: 4 },
      title: "需要帮助吗？",
      description: "我们的客服团队在线等候，随时为你解答疑问",
      buttons: [
        createButton({ label: "立即咨询", actionType: "send_message", value: "我需要帮助" }),
      ]
    })
  },
  {
    id: "custom",
    name: "自定义",
    description: "从零开始创建你自己的营销模板",
    tags: ["自由配置"],
    previewImage: createTemplatePreviewImage("custom"),
    defaults: createDraft({
      name: "自定义",
      trigger: { audience: "all", frequency: "once_per_user", timing: "all_day", delaySeconds: 5 },
      title: "自定义",
      description: "自定义",
      buttons: [createButton({ label: "立即咨询", actionType: "send_message", value: "立即咨询" })]
    })
  }
];

const makeInitialTask = (
  templateId: string,
  options: { taskName: string; creator: string; createdAt: string; status?: boolean }
): ProactiveTask => {
  const template = templateLibrary.find((item) => item.id === templateId);
  const draft = cloneDraft(template?.defaults ?? createDraft(), true);
  return {
    id: createId(),
    name: options.taskName,
    status: options.status ?? true,
    creator: options.creator,
    createdAt: options.createdAt,
    trigger: draft.trigger,
    headerImage: draft.headerImage,
    title: draft.title,
    description: draft.description,
    buttons: draft.buttons
  };
};

const tasks = ref<ProactiveTask[]>([
  makeInitialTask("welcome-visitor", {
    taskName: "首访欢迎气泡",
    creator: "客服主管",
    createdAt: "2026-03-03 10:12",
    status: true
  }),
  makeInitialTask("flash-sale", {
    taskName: "首访限时优惠",
    creator: "客服主管",
    createdAt: "2026-03-02 18:30",
    status: false
  })
]);

const viewMode = ref<ViewMode>("list");
const templateModalOpen = ref(false);
const triggerModalOpen = ref(false);
const triggerModalDraft = ref<TriggerCondition | null>(null);
const editingTaskId = ref<string | null>(null);
const deleteTaskId = ref<string | null>(null);
const openActionMenuTaskId = ref<string | null>(null);
const editorDraft = ref<TaskDraft | null>(null);
const editorSubmitAttempted = ref(false);
const editorFieldTouched = ref<Record<string, boolean>>({});
const triggerDelayTouched = ref(false);
const headerImageInputRef = ref<HTMLInputElement | null>(null);
const cropModalOpen = ref(false);
const cropDragging = ref(false);
const cropDragStart = ref({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
const visitorPreviewModalOpen = ref(false);
const visitorPreviewMode = ref<VisitorPreviewMode>("image-title-desc-buttons");
const visitorBubbleDismissed = ref(false);
const visitorChatOpen = ref(false);
const visitorChatMessages = ref<Array<{ role: "visitor" | "agent"; text: string }>>([]);
const visitorChatTime = ref("");
const agentNotifications = ref<Array<{ id: string; text: string }>>([]);
const cropState = ref({
  imageSrc: "",
  naturalWidth: 0,
  naturalHeight: 0,
  offsetX: 0,
  offsetY: 0
});

const columns: TableColumn<ProactiveTaskRow>[] = [
  { key: "name", title: "任务名称", width: "38%" },
  { key: "status", title: "状态", width: "12%" },
  { key: "creator", title: "创建人", width: "15%" },
  { key: "createdAt", title: "创建时间", width: "20%" },
  { key: "action", title: "操作", width: "15%" }
];

const tableRows = computed<ProactiveTaskRow[]>(() =>
  tasks.value.map((task) => ({
    id: task.id,
    name: task.name,
    status: task.status,
    creator: task.creator,
    createdAt: task.createdAt,
    action: "..."
  }))
);

const selectedDeleteTask = computed(() => tasks.value.find((task) => task.id === deleteTaskId.value) ?? null);

const isTaskNameEmpty = computed(() => {
  const draft = editorDraft.value;
  if (!draft) return false;
  return draft.name.trim().length === 0;
});

const isDescriptionEmpty = computed(() => {
  const draft = editorDraft.value;
  if (!draft) return false;
  return draft.description.trim().length === 0;
});

const triggerSummary = computed(() => {
  const trigger = editorDraft.value?.trigger;
  if (!trigger) {
    return "点击设置触发条件";
  }
  return `${audienceLabelMap[trigger.audience]} · ${frequencyLabelMap[trigger.frequency]} · ${timingLabelMap[trigger.timing]} · 延迟 ${trigger.delaySeconds} 秒`;
});

const isDelayValueInvalid = (value: unknown) => value === "" || value === null || value === undefined || !Number.isFinite(Number(value));

const showTriggerDelayError = computed(() => {
  if (!triggerModalDraft.value) return false;
  if (!triggerDelayTouched.value) return false;
  return isDelayValueInvalid(triggerModalDraft.value.delaySeconds);
});

const visitorPreviewModeOptions: Array<{ label: string; value: VisitorPreviewMode }> = [
  { label: "图片+标题+描述+按钮", value: "image-title-desc-buttons" },
  { label: "图片+描述+按钮", value: "image-desc-buttons" },
  { label: "图片+20字标题+100字描述+按钮(超出滚动)", value: "overflow-scroll" }
];

const toExactLength = (input: string, targetLength: number, padChar: string) => {
  const sliced = Array.from(input).slice(0, targetLength).join("");
  const missing = Math.max(0, targetLength - Array.from(sliced).length);
  return `${sliced}${padChar.repeat(missing)}`;
};

const overflowTitleText = toExactLength("访客端营销气泡标题滚动样式观察文本", 20, "标");
const overflowDescriptionText = toExactLength(
  "这是用于观察访客端营销气泡内容超出后的滚动效果示例文本，包含图片、标题、描述与多个按钮，请重点查看内容边界、滚动条表现、按钮顺序和整体视觉层级是否符合预期。",
  100,
  "内"
);

const visitorPreviewPlaceholderImage = (() => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360" fill="none">
    <defs>
      <linearGradient id="pbg" x1="0" y1="0" x2="640" y2="360" gradientUnits="userSpaceOnUse">
        <stop stop-color="#E8F0FE"/><stop offset="1" stop-color="#D4E4FF"/>
      </linearGradient>
    </defs>
    <rect width="640" height="360" rx="10" fill="url(#pbg)"/>
    <rect x="220" y="120" width="200" height="24" rx="12" fill="#B8D0F5"/>
    <rect x="180" y="160" width="280" height="14" rx="7" fill="#C8DAFA"/>
    <rect x="210" y="190" width="220" height="14" rx="7" fill="#C8DAFA"/>
    <circle cx="320" cy="260" r="24" fill="#A3C4F3" opacity="0.5"/>
    <path d="M310 260l6-8h8l6 8-4 6h-12z" fill="#fff" opacity="0.7"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
})();

const visitorPreviewSource = computed(() => {
  const task = tasks.value.find((item) => item.status) ?? tasks.value[0] ?? null;
  const fallback = templateLibrary[0]?.defaults ?? createDraft();
  const buttonLabels = (task?.buttons ?? fallback.buttons)
    .map((button) => button.label.trim())
    .filter((label) => label.length > 0);

  return {
    headerImage: task?.headerImage || fallback.headerImage || visitorPreviewPlaceholderImage,
    title: task?.title || fallback.title || "欢迎来到 TWT",
    description: task?.description || fallback.description || "你好呀，在线客服随时为你解答产品与价格问题。",
    buttonLabels: buttonLabels.length > 0 ? buttonLabels : ["立即咨询"]
  };
});

const visitorPreviewContent = computed(() => {
  const source = visitorPreviewSource.value;
  if (visitorPreviewMode.value === "image-desc-buttons") {
    return {
      headerImage: source.headerImage,
      title: source.title,
      showTitle: false,
      description: source.description,
      buttonLabels: source.buttonLabels.slice(0, 5),
      overflowScroll: false
    };
  }

  if (visitorPreviewMode.value === "overflow-scroll") {
    return {
      headerImage: source.headerImage,
      title: overflowTitleText,
      showTitle: true,
      description: overflowDescriptionText,
      buttonLabels: ["立即咨询", "领取折扣", "查看活动", "获取报价", "联系顾问"],
      overflowScroll: true
    };
  }

  return {
    headerImage: source.headerImage,
    title: source.title,
    showTitle: true,
    description: source.description,
    buttonLabels: source.buttonLabels.slice(0, 5),
    overflowScroll: false
  };
});

const getCropDrawMetrics = () => {
  const { naturalWidth, naturalHeight, offsetX, offsetY } = cropState.value;
  if (!naturalWidth || !naturalHeight) {
    return {
      drawWidth: 0,
      drawHeight: 0,
      left: 0,
      top: 0,
      maxOffsetX: 0,
      maxOffsetY: 0
    };
  }
  const baseScale = Math.max(CROP_WIDTH / naturalWidth, CROP_HEIGHT / naturalHeight);
  const drawWidth = naturalWidth * baseScale * CROP_DRAG_SCALE;
  const drawHeight = naturalHeight * baseScale * CROP_DRAG_SCALE;
  const maxOffsetX = Math.max(0, (drawWidth - CROP_WIDTH) / 2);
  const maxOffsetY = Math.max(0, (drawHeight - CROP_HEIGHT) / 2);
  const clampedOffsetX = Math.max(-maxOffsetX, Math.min(maxOffsetX, offsetX));
  const clampedOffsetY = Math.max(-maxOffsetY, Math.min(maxOffsetY, offsetY));
  const left = CROP_WIDTH / 2 - drawWidth / 2 + clampedOffsetX;
  const top = CROP_HEIGHT / 2 - drawHeight / 2 + clampedOffsetY;

  return {
    drawWidth,
    drawHeight,
    left,
    top,
    maxOffsetX,
    maxOffsetY
  };
};

const cropImageStyle = computed(() => {
  const { drawWidth, drawHeight, left, top } = getCropDrawMetrics();
  return {
    width: `${drawWidth}px`,
    height: `${drawHeight}px`,
    left: `${left}px`,
    top: `${top}px`
  };
});

const pad = (value: number) => String(value).padStart(2, "0");
const formatCurrentTime = () => {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

const closeActionMenu = () => {
  openActionMenuTaskId.value = null;
};

const formatChatTime = () => {
  const now = new Date();
  return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

const switchVisitorPreviewMode = (mode: VisitorPreviewMode) => {
  visitorPreviewMode.value = mode;
  visitorBubbleDismissed.value = false;
  visitorChatOpen.value = false;
  agentNotifications.value = [];
};

const openVisitorPerspectiveModal = () => {
  visitorPreviewMode.value = "image-title-desc-buttons";
  visitorBubbleDismissed.value = false;
  visitorChatOpen.value = false;
  visitorChatMessages.value = [];
  agentNotifications.value = [];
  visitorPreviewModalOpen.value = true;
  closeActionMenu();
};

const closeVisitorPerspectiveModal = () => {
  visitorPreviewModalOpen.value = false;
};

const openVisitorChat = () => {
  visitorChatTime.value = formatChatTime();
  visitorChatOpen.value = true;
};

const handleVisitorBubbleAction = (label: string) => {
  visitorChatTime.value = formatChatTime();
  visitorChatMessages.value = [{ role: "visitor", text: label }];
  visitorBubbleDismissed.value = true;
  visitorChatOpen.value = true;
};

const pushAgentNotification = (text: string) => {
  const id = createId();
  agentNotifications.value = [...agentNotifications.value, { id, text }].slice(-3);
};

const dismissAgentNotification = (id: string) => {
  agentNotifications.value = agentNotifications.value.filter((n) => n.id !== id);
};

const clickAgentNotification = (text: string) => {
  visitorChatTime.value = formatChatTime();
  visitorChatMessages.value = [{ role: "agent", text }];
  agentNotifications.value = [];
  visitorBubbleDismissed.value = true;
  visitorChatOpen.value = true;
};

const agentSimMessages = [
  "你好，有什么可以帮你的吗？",
  "当前有限时优惠活动，需要了解一下吗？",
  "欢迎回来！上次咨询的问题解决了吗？",
  "新品已上架，点击查看详情。",
  "今日下单可享 8 折优惠哦！"
];
let agentSimIndex = 0;

const simulateAgentMessage = () => {
  const text = agentSimMessages[agentSimIndex % agentSimMessages.length];
  agentSimIndex++;
  visitorBubbleDismissed.value = true;
  visitorChatOpen.value = false;
  pushAgentNotification(text);
};

const resetEditorValidationState = () => {
  editorSubmitAttempted.value = false;
  editorFieldTouched.value = {};
  triggerDelayTouched.value = false;
};

const markEditorFieldTouched = (fieldKey: string) => {
  editorFieldTouched.value = {
    ...editorFieldTouched.value,
    [fieldKey]: true
  };
};

const shouldShowEditorFieldError = (fieldKey: string, invalid: boolean) =>
  invalid && (editorSubmitAttempted.value || Boolean(editorFieldTouched.value[fieldKey]));

const isButtonLabelEmpty = (button: ActionButtonConfig) => button.label.trim().length === 0;
const isButtonValueEmpty = (button: ActionButtonConfig) => button.value.trim().length === 0;

const clampByCharCount = (value: string, maxLength: number) => Array.from(value).slice(0, maxLength).join("");

const limitDraftText = (field: "title" | "description", maxLength: number) => {
  if (!editorDraft.value) return;
  const nextValue = clampByCharCount(String(editorDraft.value[field] ?? ""), maxLength).replace(/\r?\n/g, "");
  editorDraft.value[field] = nextValue;
};

const triggerHeaderImageSelect = () => {
  headerImageInputRef.value?.click();
};

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("read-failed"));
    reader.readAsDataURL(file);
  });

const loadImageMeta = (src: string) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => reject(new Error("image-load-failed"));
    image.src = src;
  });

const loadImageElement = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("image-load-failed"));
    image.src = src;
  });

const clampCropOffset = () => {
  const { maxOffsetX, maxOffsetY } = getCropDrawMetrics();
  cropState.value.offsetX = Math.max(-maxOffsetX, Math.min(maxOffsetX, cropState.value.offsetX));
  cropState.value.offsetY = Math.max(-maxOffsetY, Math.min(maxOffsetY, cropState.value.offsetY));
};

const openCropModalWithSource = async (source: string) => {
  try {
    const meta = await loadImageMeta(source);
    cropState.value = {
      imageSrc: source,
      naturalWidth: meta.width,
      naturalHeight: meta.height,
      offsetX: 0,
      offsetY: 0
    };
    cropModalOpen.value = true;
  } catch {
    emit("toast", "图片解析失败，请重试");
  }
};

const closeCropModal = () => {
  cropModalOpen.value = false;
  cropDragging.value = false;
  cropState.value = {
    imageSrc: "",
    naturalWidth: 0,
    naturalHeight: 0,
    offsetX: 0,
    offsetY: 0
  };
};

const startCropDrag = (event: MouseEvent) => {
  if (!cropState.value.imageSrc) return;
  cropDragging.value = true;
  cropDragStart.value = {
    x: event.clientX,
    y: event.clientY,
    offsetX: cropState.value.offsetX,
    offsetY: cropState.value.offsetY
  };
};

const handleCropDrag = (event: MouseEvent) => {
  if (!cropDragging.value) return;
  cropState.value.offsetX = cropDragStart.value.offsetX + (event.clientX - cropDragStart.value.x);
  cropState.value.offsetY = cropDragStart.value.offsetY + (event.clientY - cropDragStart.value.y);
  clampCropOffset();
};

const endCropDrag = () => {
  cropDragging.value = false;
};

const confirmCropImage = async () => {
  const draft = editorDraft.value;
  if (!draft || !cropState.value.imageSrc) return;
  try {
    const image = await loadImageElement(cropState.value.imageSrc);
    const canvas = document.createElement("canvas");
    canvas.width = CROP_WIDTH;
    canvas.height = CROP_HEIGHT;
    const context = canvas.getContext("2d");
    if (!context) return;
    const { drawWidth, drawHeight, left, top } = getCropDrawMetrics();
    context.drawImage(image, left, top, drawWidth, drawHeight);
    draft.headerImage = canvas.toDataURL("image/jpeg", 0.92);
    closeCropModal();
  } catch {
    emit("toast", "图片裁剪失败，请重试");
  }
};

const openTemplateSelector = () => {
  templateModalOpen.value = true;
};

const createFromTemplate = (templateId: string) => {
  const template = templateLibrary.find((item) => item.id === templateId);
  if (!template) {
    emit("toast", "未找到对应模板");
    return;
  }

  editingTaskId.value = null;
  editorDraft.value = cloneDraft(template.defaults, true);
  resetEditorValidationState();
  templateModalOpen.value = false;
  viewMode.value = "editor";
  closeActionMenu();
};

const toggleTaskStatus = (taskId: string, status: boolean) => {
  tasks.value = tasks.value.map((task) => {
    if (task.id !== taskId) return task;
    return { ...task, status };
  });
};

const toggleActionMenu = (taskId: string) => {
  openActionMenuTaskId.value = openActionMenuTaskId.value === taskId ? null : taskId;
};

const startEdit = (taskId: string) => {
  const task = tasks.value.find((item) => item.id === taskId);
  if (!task) {
    emit("toast", "任务不存在");
    return;
  }

  editingTaskId.value = task.id;
  editorDraft.value = cloneDraft(task);
  resetEditorValidationState();
  viewMode.value = "editor";
  closeActionMenu();
};

const promptDelete = (taskId: string) => {
  deleteTaskId.value = taskId;
  closeActionMenu();
};

const confirmDelete = () => {
  if (!deleteTaskId.value) {
    return;
  }
  tasks.value = tasks.value.filter((task) => task.id !== deleteTaskId.value);
  deleteTaskId.value = null;
  emit("toast", "任务已删除");
};

const cancelEditor = () => {
  resetEditorValidationState();
  closeCropModal();
  viewMode.value = "list";
  editingTaskId.value = null;
  editorDraft.value = null;
  triggerModalOpen.value = false;
  triggerModalDraft.value = null;
};

const saveEditor = () => {
  const draft = editorDraft.value;
  if (!draft) {
    return;
  }
  editorSubmitAttempted.value = true;

  const normalizedName = draft.name.trim();
  const normalizedDescription = draft.description.trim();
  const hasEmptyButtonLabel = draft.buttons.some((button) => button.label.trim().length === 0);
  const hasEmptyActionValue = draft.buttons.some((button) => button.value.trim().length === 0);

  if (!normalizedName || !normalizedDescription || hasEmptyButtonLabel || hasEmptyActionValue) {
    return;
  }

  if (draft.buttons.length < 1) {
    emit("toast", "至少保留 1 个按钮");
    return;
  }

  const normalizedDraft: TaskDraft = {
    ...cloneDraft(draft),
    name: normalizedName,
    description: normalizedDescription,
    buttons: draft.buttons.map((button) => ({
      ...button,
      label: button.label.trim() || "立即聊天",
      value: button.value.trim()
    }))
  };

  if (editingTaskId.value) {
    tasks.value = tasks.value.map((task) => {
      if (task.id !== editingTaskId.value) return task;
      return {
        ...task,
        ...normalizedDraft,
        status: true
      };
    });
    emit("toast", "营销任务已保存并开启");
  } else {
    tasks.value = [
      {
        id: createId(),
        status: true,
        creator: "当前客服",
        createdAt: formatCurrentTime(),
        ...normalizedDraft
      },
      ...tasks.value
    ];
    emit("toast", "营销任务已保存并开启");
  }

  cancelEditor();
};

const appendButton = () => {
  if (!editorDraft.value) return;
  if (editorDraft.value.buttons.length >= 5) {
    emit("toast", "最多添加 5 个按钮");
    return;
  }
  editorDraft.value.buttons.push(createButton());
};

const removeButton = (index: number) => {
  if (!editorDraft.value) return;
  if (editorDraft.value.buttons.length <= 1) {
    emit("toast", "至少保留 1 个按钮");
    return;
  }
  editorDraft.value.buttons.splice(index, 1);
};
const actionValuePlaceholder = (actionType: ButtonActionType) => actionTypeMeta[actionType].placeholder;

const normalizeDelay = (value: unknown) => Math.min(600, Math.max(1, Math.round(Number(value))));

const openTriggerModal = () => {
  if (!editorDraft.value) return;
  triggerModalDraft.value = cloneTrigger(editorDraft.value.trigger);
  triggerDelayTouched.value = false;
  triggerModalOpen.value = true;
};

const closeTriggerModal = () => {
  triggerModalOpen.value = false;
  triggerModalDraft.value = null;
  triggerDelayTouched.value = false;
};

const setTriggerAudience = (value: AudienceType) => {
  if (!triggerModalDraft.value) return;
  triggerModalDraft.value.audience = value;
};

const setTriggerFrequency = (value: DisplayFrequency) => {
  if (!triggerModalDraft.value) return;
  triggerModalDraft.value.frequency = value;
};

const setTriggerTiming = (value: DisplayTiming) => {
  if (!triggerModalDraft.value) return;
  triggerModalDraft.value.timing = value;
};

const handleTriggerDelayBlur = () => {
  if (!triggerModalDraft.value) return;
  triggerDelayTouched.value = true;
  if (isDelayValueInvalid(triggerModalDraft.value.delaySeconds)) return;
  triggerModalDraft.value.delaySeconds = normalizeDelay(triggerModalDraft.value.delaySeconds);
};

const confirmTriggerModal = () => {
  triggerDelayTouched.value = true;
  if (!editorDraft.value || !triggerModalDraft.value) return;
  if (isDelayValueInvalid(triggerModalDraft.value.delaySeconds)) return;
  editorDraft.value.trigger = {
    ...cloneTrigger(triggerModalDraft.value),
    delaySeconds: normalizeDelay(triggerModalDraft.value.delaySeconds)
  };
  closeTriggerModal();
};

const handleHeaderImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    emit("toast", "仅支持上传图片文件");
    input.value = "";
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    emit("toast", "图片不能超过 2MB");
    input.value = "";
    return;
  }

  readFileAsDataUrl(file)
    .then((source) => openCropModalWithSource(source))
    .catch(() => emit("toast", "图片读取失败，请重试"));
  input.value = "";
};

const removeHeaderImage = () => {
  if (!editorDraft.value) return;
  editorDraft.value.headerImage = "";
};
</script>

<style scoped>
.proactive-page {
  padding: 10px !important;
}

.proactive-page--editor {
  overflow: hidden;
}

.proactive-list-card {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  overflow: visible;
}

.proactive-list-header {
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  padding: 14px 20px;
}

.proactive-list-header__text {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.proactive-list-header__actions {
  display: inline-flex;
  gap: 8px;
}

.proactive-list-card :deep(.agent-table) {
  border-collapse: separate;
  border-spacing: 0;
  overflow: visible;
}

.proactive-list-card :deep(.table-wrap) {
  overflow: visible;
}

.proactive-list-card :deep(.agent-table th) {
  background: #eff2f5;
  color: #222;
  font-size: var(--agent-font-size-md);
  padding: 11px 20px;
}

.proactive-list-card :deep(.agent-table td) {
  font-size: var(--agent-font-size-md);
  overflow: visible;
  padding: 12px 20px;
  position: relative;
}

.proactive-list-card :deep(.agent-table tbody tr:hover td) {
  background: #f5f9ff;
}

.task-name-cell {
  color: #222;
  display: inline-flex;
  font-weight: var(--agent-font-weight-medium);
}

.task-action-wrap {
  display: inline-flex;
  position: relative;
  z-index: 3;
}

.icon-action-btn {
  background: transparent;
  border: 0;
  border-radius: var(--agent-radius-sm);
  color: #52637a;
  cursor: pointer;
  font-size: 16px;
  height: 26px;
  line-height: 1;
  width: 32px;
}

.icon-action-btn:hover {
  background: #eef3ff;
}

.task-action-menu {
  background: #fff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: 10px;
  box-shadow: var(--agent-shadow-sm);
  display: flex;
  flex-direction: column;
  min-width: 92px;
  padding: 6px;
  position: absolute;
  right: 0;
  top: 28px;
  z-index: 30;
}

.task-action-menu button {
  background: transparent;
  border: 0;
  border-radius: 8px;
  color: var(--agent-color-text-primary);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  padding: 8px 10px;
  text-align: left;
}

.task-action-menu button:hover {
  background: var(--agent-color-bg-muted);
}

.task-action-menu .task-action-menu__danger {
  color: var(--agent-color-status-error);
}

.list-empty {
  align-items: center;
  color: var(--agent-color-text-tertiary);
  display: flex;
  flex-direction: column;
  gap: var(--agent-space-8);
  justify-content: center;
  min-height: 180px;
  text-align: center;
}

.list-empty__title {
  color: var(--agent-color-text-primary);
  font-size: 14px;
  margin: 0;
}

.list-empty__desc {
  margin: 0;
}

.campaign-editor {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.campaign-editor__header {
  align-items: flex-start;
  display: flex;
  flex: 0 0 auto;
}

.campaign-editor__title-row {
  align-items: center;
  display: inline-flex;
  gap: 8px;
}

.campaign-editor__back-btn {
  align-items: center;
  background: #fff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: 999px;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  display: inline-flex;
  font-size: 16px;
  height: 30px;
  justify-content: center;
  line-height: 1;
  transition: border-color var(--agent-motion-fast) ease, color var(--agent-motion-fast) ease, background var(--agent-motion-fast) ease;
  width: 30px;
}

.campaign-editor__back-btn:hover {
  background: #f6f9ff;
  border-color: #b9cdf5;
  color: var(--agent-color-brand-primary);
}

.agent-input--error {
  border-color: var(--agent-color-status-error) !important;
}

.editor-field__error {
  color: var(--agent-color-status-error);
  font-size: 12px;
  line-height: 1.2;
  margin: -2px 0 0;
}

.campaign-editor__layout {
  align-items: stretch;
  display: grid;
  flex: 1;
  gap: 16px;
  grid-template-columns: minmax(0, 1.55fr) minmax(360px, 1fr);
  min-height: 0;
  overflow: hidden;
}

.campaign-editor__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
  overflow: auto;
  padding-right: 8px;
}

.editor-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
}

.editor-card__title-row {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.editor-card__title {
  color: #1f2329;
  font-size: 15px;
  margin: 0;
}

.editor-helper {
  color: var(--agent-color-text-tertiary);
  font-size: 12px;
  margin: 0;
}

.editor-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.editor-field__label {
  color: var(--agent-color-text-primary);
  font-size: 13px;
  font-weight: var(--agent-font-weight-medium);
}

.condition-trigger {
  align-items: center;
  background: #fff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  display: flex;
  font-size: var(--agent-font-size-sm);
  justify-content: space-between;
  min-height: 40px;
  padding: 0 12px;
  text-align: left;
}

.condition-trigger__edit {
  color: var(--agent-color-brand-primary);
  font-size: 12px;
}

.header-image-input-hidden {
  display: none;
}

.upload-btn {
  background: #f7f8fa;
  border: 1px dashed #bcc6d6;
  border-radius: var(--agent-radius-md);
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  font-size: 13px;
  padding: 8px 12px;
}

.upload-btn--compact {
  width: fit-content;
}

.header-image-preview {
  border: 1px solid var(--agent-color-border-default);
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.header-image-preview img {
  aspect-ratio: 16 / 9;
  display: block;
  height: auto;
  object-fit: cover;
  width: 100%;
}

.header-image-preview--compact {
  max-width: 240px;
}

.header-image-action-btn {
  align-items: center;
  background: rgba(17, 24, 39, 0.68);
  border: 0;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  font-size: 14px;
  height: 26px;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  top: 8px;
  transition: opacity var(--agent-motion-fast) ease, background var(--agent-motion-fast) ease;
  width: 26px;
}

.header-image-action-btn:hover {
  background: rgba(17, 24, 39, 0.84);
}

.header-image-action-btn--edit {
  left: 8px;
}

.header-image-action-btn--delete {
  right: 8px;
}

.header-image-preview:hover .header-image-action-btn {
  opacity: 1;
  pointer-events: auto;
}

.text-add-btn {
  align-items: center;
  background: transparent;
  border: 0;
  color: #2563eb;
  cursor: pointer;
  display: inline-flex;
  font-size: 14px;
  gap: 5px;
  padding: 0;
}

.text-add-btn span:first-child {
  font-size: 18px;
  line-height: 1;
}

.text-add-btn span:last-child {
  font-size: 14px;
}

.text-add-btn:disabled {
  color: var(--agent-color-text-disabled);
  cursor: not-allowed;
}

.button-editor-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.button-editor-item {
  background: #f7f8fa;
  border: 1px solid #e3e8ef;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
}

.button-editor-item__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.button-editor-item__title {
  color: #4b5563;
  font-size: 14px;
  font-weight: var(--agent-font-weight-medium);
  line-height: 1;
}

.text-danger-btn {
  background: transparent;
  border: 0;
  color: #64748b;
  cursor: pointer;
  font-size: 13px;
  padding: 0;
}

.text-danger-btn:disabled {
  color: var(--agent-color-text-disabled);
  cursor: not-allowed;
}

.text-danger-btn:not(:disabled):hover {
  color: var(--agent-color-status-error);
}

.button-action-row {
  display: grid;
  gap: 10px;
  grid-template-columns: 140px minmax(0, 1fr);
}

.button-action-select {
  cursor: pointer;
}

.pill-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pill-option {
  background: #f4f6fa;
  border: 1px solid transparent;
  border-radius: 999px;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  font-size: 12px;
  padding: 6px 12px;
}

.pill-option--active {
  background: #e9f1ff;
  border-color: #b7ccff;
  color: var(--agent-color-brand-primary);
}

.campaign-editor__preview {
  min-width: 0;
}

.preview-sticky {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  padding: 14px;
  position: sticky;
  top: 0;
}

.preview-canvas {
  background: #f5f8ff;
  border: 1px solid #dce6f8;
  border-radius: 14px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  position: relative;
}

.preview-canvas__bar {
  align-items: center;
  background: #edf2fb;
  display: flex;
  gap: 6px;
  padding: 10px;
}

.preview-canvas__bar span {
  background: #c5d0e2;
  border-radius: 999px;
  display: block;
  height: 8px;
  width: 8px;
}

.preview-canvas__body {
  height: calc(100% - 28px);
  min-height: 392px;
  position: relative;
}

.preview-grid {
  background-image:
    linear-gradient(rgba(157, 173, 203, 0.2) 1px, transparent 1px),
    linear-gradient(90deg, rgba(157, 173, 203, 0.2) 1px, transparent 1px);
  background-size: 26px 26px;
  inset: 0;
  position: absolute;
}

.preview-widget {
  bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: absolute;
  right: 14px;
  width: min(320px, calc(100% - 28px));
}

.preview-bubble {
  background: #fff;
  border: 1px solid #d8e1ef;
  border-radius: 14px;
  box-shadow: var(--agent-shadow-md);
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
}

.preview-bubble__image {
  aspect-ratio: 16 / 9;
  border-radius: 10px;
  object-fit: cover;
  width: 100%;
}

.preview-bubble__title,
.preview-bubble__desc {
  display: block;
  margin: 0;
  overflow-x: auto;
  overflow-y: hidden;
  text-overflow: clip;
  white-space: nowrap;
}

.preview-bubble__title::-webkit-scrollbar,
.preview-bubble__desc::-webkit-scrollbar {
  height: 4px;
}

.preview-bubble__title {
  color: var(--agent-color-text-primary);
  font-size: 14px;
  font-weight: var(--agent-font-weight-semibold);
}

.preview-bubble__desc {
  color: var(--agent-color-text-secondary);
  font-size: 13px;
  line-height: 1.45;
}

.preview-bubble__actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.preview-bubble__btn {
  background: #f3f6ff;
  border: 1px solid #d5e1ff;
  border-radius: 9px;
  color: #355a9b;
  cursor: default;
  font-size: 13px;
  padding: 8px 10px;
  pointer-events: none;
  text-align: center;
}

.preview-bubble__btn--primary {
  background: var(--agent-color-brand-primary);
  border-color: var(--agent-color-brand-primary);
  color: #fff;
}

.preview-fab {
  align-self: flex-end;
  background: radial-gradient(circle at 35% 30%, #7db4ff 0%, #2f6bff 45%, #1e4fb9 100%);
  border: 0;
  border-radius: 999px;
  color: #fff;
  cursor: default;
  font-size: 13px;
  font-weight: var(--agent-font-weight-medium);
  height: 46px;
  pointer-events: none;
  width: 46px;
}

.campaign-editor__footer {
  align-items: center;
  backdrop-filter: blur(4px);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  display: flex;
  flex: 0 0 auto;
  gap: 8px;
  justify-content: flex-start;
  padding: 10px 14px;
}

.template-modal-mask {
  align-items: center;
  background: var(--agent-color-overlay-mask);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 20px;
  position: fixed;
  z-index: var(--agent-z-modal);
}

.template-modal {
  display: flex;
  flex-direction: column;
  height: 85vh;
  max-width: 1080px;
  width: min(1080px, 94vw);
}

.template-modal__header {
  align-items: flex-start;
  display: flex;
  justify-content: space-between;
  padding: 16px 18px;
}

.template-modal__header h3 {
  margin: 0;
}

.template-modal__close {
  background: transparent;
  border: 0;
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  font-size: 16px;
}

.template-modal__body {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  overflow: auto;
  padding: 0 18px 18px;
}

.template-card {
  border: 1px solid #dee5f2;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  transition: border-color var(--agent-motion-fast) ease, box-shadow var(--agent-motion-fast) ease;
}

.template-card:hover {
  border-color: var(--agent-color-brand-primary);
  box-shadow: 0 6px 20px rgba(47, 107, 255, 0.12);
}

.template-card__preview {
  border-radius: 10px;
  overflow: hidden;
}

.template-card__preview img {
  aspect-ratio: 16 / 9;
  display: block;
  height: auto;
  object-fit: cover;
  width: 100%;
}

.template-card__meta {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
}

.template-card__meta h4 {
  color: var(--agent-color-text-primary);
  font-size: 15px;
  margin: 0;
}

.template-card__meta p {
  color: var(--agent-color-text-secondary);
  font-size: 13px;
  line-height: 1.45;
  margin: 0;
}

.template-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.template-tag {
  background: #f4f6fa;
  border-radius: 999px;
  color: #52637a;
  font-size: 11px;
  padding: 4px 8px;
}

.trigger-modal-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.trigger-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.trigger-section__title {
  color: var(--agent-color-text-primary);
  font-size: 13px;
  font-weight: var(--agent-font-weight-medium);
  margin: 0;
}

.delay-stepper {
  align-items: center;
  display: inline-flex;
  gap: 8px;
}

.delay-stepper .agent-input {
  width: 88px;
}

.delay-stepper span {
  color: var(--agent-color-text-secondary);
  font-size: 12px;
}

.modal-footer-actions {
  display: flex;
  gap: 8px;
}

.delete-modal__desc {
  color: var(--agent-color-text-secondary);
  line-height: 1.6;
  margin: 6px 0;
}

.crop-modal-content {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.crop-canvas {
  background: #f4f6fa;
  border: 1px solid var(--agent-color-border-default);
  border-radius: 12px;
  cursor: grab;
  height: 270px;
  overflow: hidden;
  position: relative;
  width: 480px;
}

.crop-canvas--dragging {
  cursor: grabbing;
}

.crop-canvas img {
  position: absolute;
  user-select: none;
}

.visitor-preview-modal {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.visitor-preview-mode-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.visitor-preview-mode-btn {
  background: #f2f5fb;
  border: 1px solid #d9e2f2;
  border-radius: 999px;
  color: #4d617e;
  cursor: pointer;
  font-size: 12px;
  line-height: 1;
  padding: 7px 12px;
}

.visitor-preview-mode-btn--active {
  background: #e9f1ff;
  border-color: #b4cbff;
  color: var(--agent-color-brand-primary);
}

.visitor-preview-mode-btn--simulate {
  background: #f0fdf4;
  border-color: #86efac;
  color: #16a34a;
}

.visitor-preview-mode-btn--simulate:hover {
  background: #dcfce7;
  border-color: #4ade80;
}

.visitor-preview-canvas {
  background: #f5f8ff;
  border: 1px solid #dce6f8;
  border-radius: 14px;
  overflow: hidden;
}

.visitor-preview-canvas__header {
  align-items: center;
  background: #edf2fb;
  display: flex;
  gap: 6px;
  padding: 10px;
}

.visitor-preview-canvas__header span {
  background: #c5d0e2;
  border-radius: 999px;
  display: block;
  height: 8px;
  width: 8px;
}

.visitor-preview-canvas__body {
  background:
    radial-gradient(circle at 14% 10%, rgba(255, 255, 255, 0.9) 0%, rgba(244, 248, 255, 0.82) 36%, rgba(237, 242, 251, 0.96) 100%),
    linear-gradient(180deg, #f4f7ff 0%, #eef3fb 100%);
  min-height: 460px;
  position: relative;
}

.visitor-preview-bg {
  inset: 14px;
  position: absolute;
}

.visitor-preview-bg__hero {
  background: linear-gradient(130deg, #dfe9ff 0%, #eef3ff 52%, #f8fbff 100%);
  border: 1px solid #d7e2f5;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 118px;
  padding: 14px;
}

.visitor-preview-bg__hero p {
  color: #48627a;
  font-size: 11px;
  font-weight: var(--agent-font-weight-medium);
  letter-spacing: 0.02em;
  margin: 0;
}

.visitor-preview-bg__hero h4 {
  color: #1f2937;
  font-size: 16px;
  margin: 0;
}

.visitor-preview-widget {
  bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: absolute;
  right: 14px;
  width: min(340px, calc(100% - 28px));
}

.preview-bubble--visitor-modal {
  border-color: #d4deef;
  box-shadow: 0 14px 30px rgba(38, 56, 88, 0.16);
  position: relative;
}

.preview-bubble--visitor-modal .preview-bubble__btn {
  cursor: pointer;
  pointer-events: auto;
  transition: background 0.15s, border-color 0.15s;
}

.preview-bubble--visitor-modal .preview-bubble__btn:hover {
  background: #e6edff;
  border-color: #b8ccff;
}

.preview-bubble--visitor-modal .preview-bubble__btn--primary:hover {
  background: var(--agent-color-brand-primary-hover);
  border-color: var(--agent-color-brand-primary-hover);
}

.preview-bubble--overflow {
  max-height: 320px;
  overflow-y: auto;
  padding-right: 8px;
}

.preview-bubble--overflow::-webkit-scrollbar {
  width: 6px;
}

.preview-bubble--overflow::-webkit-scrollbar-thumb {
  background: #c8d4e8;
  border-radius: 999px;
}

.preview-bubble__title--wrap,
.preview-bubble__desc--wrap {
  overflow: visible;
  overflow-wrap: anywhere;
  white-space: normal;
}

/* 气泡关闭按钮 — 悬浮在卡片上方右侧 */
.preview-bubble__close {
  align-items: center;
  background: rgba(0, 0, 0, 0.45);
  border: 0;
  border-radius: 999px;
  color: #fff;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  height: 24px;
  justify-content: center;
  line-height: 1;
  position: absolute;
  right: 0;
  top: -32px;
  transition: background 0.15s;
  width: 24px;
  z-index: 2;
}

.preview-bubble__close:hover {
  background: rgba(0, 0, 0, 0.65);
}

/* 访客聊天窗口 */
.visitor-chat-panel {
  background: #fff;
  border-radius: 16px;
  bottom: 14px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  height: calc(100% - 28px);
  overflow: hidden;
  position: absolute;
  right: 14px;
  width: min(360px, calc(100% - 28px));
  z-index: 10;
}

.visitor-chat-panel__header {
  align-items: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: #fff;
  display: flex;
  flex: 0 0 auto;
  justify-content: space-between;
  padding: 14px 16px;
}

.visitor-chat-panel__header-left {
  align-items: center;
  display: flex;
  font-size: 14px;
  font-weight: 600;
  gap: 10px;
}

.visitor-chat-avatar {
  align-items: center;
  background: #3b82f6;
  border-radius: 999px;
  color: #fff;
  display: flex;
  font-size: 14px;
  font-weight: 700;
  height: 32px;
  justify-content: center;
  width: 32px;
}

.visitor-chat-panel__close {
  background: transparent;
  border: 0;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  padding: 0;
  transition: color 0.15s;
}

.visitor-chat-panel__close:hover {
  color: #fff;
}

.visitor-chat-panel__body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  padding: 16px;
}

.visitor-chat-time {
  color: #94a3b8;
  font-size: 11px;
  text-align: center;
}

.visitor-chat-msg {
  display: flex;
}

.visitor-chat-msg--agent {
  justify-content: flex-start;
}

.visitor-chat-msg--visitor {
  justify-content: flex-end;
}

.visitor-chat-msg__bubble {
  border-radius: 14px;
  font-size: 13px;
  line-height: 1.6;
  max-width: 80%;
  padding: 10px 14px;
}

.visitor-chat-msg__bubble--agent {
  background: #f1f5f9;
  border-bottom-left-radius: 4px;
  color: #334155;
}

.visitor-chat-msg__bubble--visitor {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  border-bottom-right-radius: 4px;
  color: #fff;
}

.visitor-chat-panel__footer {
  border-top: 1px solid #e2e8f0;
  flex: 0 0 auto;
  padding: 12px 16px;
}

.visitor-chat-input {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  color: #94a3b8;
  font-size: 13px;
  outline: none;
  padding: 8px 16px;
  width: 100%;
}

.visitor-chat-powered {
  color: #cbd5e1;
  font-size: 10px;
  margin-top: 8px;
  text-align: center;
}

.visitor-chat-powered strong {
  color: #94a3b8;
  font-weight: 600;
}

/* 聊天窗口动画 */
.visitor-chat-slide-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.visitor-chat-slide-leave-active {
  transition: all 0.2s ease-in;
}

.visitor-chat-slide-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.visitor-chat-slide-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.98);
}

/* 客服主动消息通知气泡 */
.agent-notify-wrap {
  position: relative;
}

.agent-notify-wrap__close {
  align-items: center;
  background: rgba(0, 0, 0, 0.45);
  border: 0;
  border-radius: 999px;
  color: #fff;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  height: 24px;
  justify-content: center;
  line-height: 1;
  position: absolute;
  right: 0;
  top: -32px;
  transition: background 0.15s;
  width: 24px;
  z-index: 2;
}

.agent-notify-wrap__close:hover {
  background: rgba(0, 0, 0, 0.65);
}

.agent-notify-stack {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.agent-notify-bubble {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  padding: 10px 14px;
  transition: box-shadow 0.15s, border-color 0.15s;
}

.agent-notify-bubble:hover {
  border-color: #cbd5e1;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.14);
}

.agent-notify-bubble__text {
  color: #334155;
  display: -webkit-box;
  font-size: 13px;
  line-height: 1.45;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

/* 通知气泡进出动画 */
.agent-notify-enter-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.agent-notify-leave-active {
  position: absolute;
  transition: all 0.2s ease-in;
  width: 100%;
}

.agent-notify-move {
  transition: transform 0.25s ease;
}

.agent-notify-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.95);
}

.agent-notify-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

@media (max-width: 1200px) {
  .proactive-page--editor {
    overflow: auto;
  }

  .campaign-editor {
    overflow: visible;
  }

  .campaign-editor__layout {
    overflow: visible;
    grid-template-columns: 1fr;
  }

  .campaign-editor__form {
    overflow: visible;
    padding-right: 0;
  }

  .preview-sticky {
    height: auto;
    position: static;
  }

  .preview-canvas {
    min-height: 420px;
  }
}

@media (max-width: 920px) {
  .template-modal__body {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .template-modal__body {
    grid-template-columns: 1fr;
  }
}
</style>
