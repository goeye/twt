<template>
  <section class="agent-content-page proactive-page" :class="{ 'proactive-page--editor': viewMode === 'editor' }" @click="closeActionMenu">
    <section v-if="viewMode === 'list'" class="agent-panel proactive-list-card">
      <header class="proactive-list-header">
        <div class="proactive-list-header__text">
          <h1 class="agent-content-title">主动营销</h1>
        </div>
        <button type="button" class="agent-btn agent-btn--primary" @click.stop="openTemplateSelector">+ 新建</button>
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
          <p class="trigger-section__title">接收对象</p>
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

    <BaseModal :open="Boolean(deleteTaskId)" title="删除营销任务" @close="deleteTaskId = null">
      <p class="delete-modal__desc">确定删除「{{ selectedDeleteTask?.name ?? "该任务" }}」吗？此操作不可撤销。</p>
      <template #footer>
        <span />
        <div class="modal-footer-actions">
          <button type="button" class="agent-btn agent-btn--ghost" @click="deleteTaskId = null">取消</button>
          <button type="button" class="agent-btn agent-btn--danger" @click="confirmDelete">删除</button>
        </div>
      </template>
    </BaseModal>

    <BaseModal :open="cropModalOpen" title="裁剪头图" @close="closeCropModal">
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
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { AgentSwitch, BaseModal, DataTable, type TableColumn } from "@twt/ui-agent";

type ViewMode = "list" | "editor";
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
  { label: "每用户一次", value: "once_per_user" }
];

const timingOptions: Array<{ label: string; value: DisplayTiming }> = [
  { label: "仅客服在线时", value: "online_only" },
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
  once_per_user: "每用户一次"
};

const timingLabelMap: Record<DisplayTiming, string> = {
  online_only: "仅客服在线时",
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

const createTemplatePreviewImage = (startColor: string, endColor: string, bubbleColor: string): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="360" viewBox="0 0 960 360" fill="none">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="960" y2="360" gradientUnits="userSpaceOnUse">
        <stop stop-color="${startColor}" />
        <stop offset="1" stop-color="${endColor}" />
      </linearGradient>
    </defs>
    <rect width="960" height="360" rx="20" fill="url(#bg)" />
    <rect x="600" y="86" width="310" height="186" rx="16" fill="${bubbleColor}" />
    <rect x="622" y="114" width="184" height="16" rx="8" fill="#A8BCE6" />
    <rect x="622" y="146" width="258" height="12" rx="6" fill="#C3D3EF" />
    <rect x="622" y="166" width="214" height="12" rx="6" fill="#C3D3EF" />
    <rect x="622" y="196" width="258" height="30" rx="10" fill="#2F6BFF" />
    <rect x="56" y="58" width="468" height="32" rx="12" fill="#DCE7FC" />
    <rect x="56" y="108" width="398" height="18" rx="9" fill="#E7EEFD" />
    <rect x="56" y="138" width="352" height="18" rx="9" fill="#E7EEFD" />
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const templateLibrary: TemplateItem[] = [
  {
    id: "welcome-visitor",
    name: "欢迎访客",
    description: "友好问候语，引导在线咨询",
    tags: ["全部访客", "每用户一次", "仅客服在线时"],
    previewImage: createTemplatePreviewImage("#F8FBFF", "#EAF1FF", "#FFFFFF"),
    defaults: createDraft({
      name: "欢迎访客",
      trigger: { audience: "all", frequency: "once_per_user", timing: "online_only", delaySeconds: 5 },
      title: "欢迎来到 TWT",
      description: "你好呀，在线客服随时为你解答产品与价格问题。",
      buttons: [createButton({ label: "在线咨询", actionType: "send_message", value: "在线咨询" })]
    })
  },
  {
    id: "social-follow",
    name: "关注社交媒体",
    description: "引导访客关注 Twitter / Tiktok",
    tags: ["全部访客", "每用户一次", "全时段"],
    previewImage: createTemplatePreviewImage("#F5F2FF", "#E7DEFF", "#FFFFFF"),
    defaults: createDraft({
      name: "关注社交媒体",
      trigger: { audience: "all", frequency: "once_per_user", timing: "all_day", delaySeconds: 8 },
      title: "关注我们，领取最新活动",
      description: "每天更新优惠与实操内容，点击下方渠道即可查看。",
      buttons: [
        createButton({ label: "Twitter", actionType: "open_link", value: "https://example.com" }),
        createButton({ label: "Tiktok", actionType: "open_link", value: "https://example.com" })
      ]
    })
  },
  {
    id: "newsletter",
    name: "订阅通讯",
    description: "邀请订阅获取优惠信息",
    tags: ["首次访客", "每用户一次", "仅客服在线时"],
    previewImage: createTemplatePreviewImage("#FFF9F2", "#FFEBD5", "#FFFFFF"),
    defaults: createDraft({
      name: "订阅通讯",
      trigger: { audience: "first", frequency: "once_per_user", timing: "online_only", delaySeconds: 6 },
      title: "订阅新品与优惠",
      description: "留下你的意向，我们会第一时间同步专属折扣。",
      buttons: [createButton({ label: "立即订阅", actionType: "send_message", value: "立即订阅" })]
    })
  },
  {
    id: "flash-sale",
    name: "限时优惠",
    description: "推送限时折扣活动",
    tags: ["首次访客", "每用户一次", "全时段"],
    previewImage: createTemplatePreviewImage("#FFF7F7", "#FFE6E9", "#FFFFFF"),
    defaults: createDraft({
      name: "限时优惠",
      trigger: { audience: "first", frequency: "once_per_user", timing: "all_day", delaySeconds: 3 },
      title: "今日下单立减",
      description: "复制优惠码即享限时折扣，活动结束后将恢复原价。",
      buttons: [createButton({ label: "获取折扣", actionType: "paste_text", value: "20%OFF" })]
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
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
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
  aspect-ratio: 16 / 6;
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
    grid-template-columns: 1fr;
  }
}
</style>
