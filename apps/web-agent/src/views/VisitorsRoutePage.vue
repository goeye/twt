<template>
  <section class="agent-content-page visitors-page">
    <header class="agent-content-header">
      <h1 class="agent-content-title">{{ activeKey === 'online-visitors' ? '在线访客' : '全部访客' }}</h1>
    </header>

    <!-- 筛选栏 -->
    <div class="visitor-filter-bar">
      <div class="visitor-filter-bar__left">
        <div class="visitor-filter-group">
          <select v-model="searchField" class="visitor-select visitor-select--field">
            <option value="name">姓名</option>
            <option value="remark">备注名</option>
            <option value="email">邮箱</option>
            <option value="phone">电话</option>
          </select>
          <div class="visitor-search-input-wrap">
            <svg class="visitor-search-input-wrap__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input v-model="searchKeyword" class="agent-input visitor-search-input" placeholder="请输入" />
          </div>
        </div>

        <select v-model="filterTag" class="visitor-select visitor-select--tag">
          <option value="">标签</option>
          <option value="VIP">VIP</option>
          <option value="普通">普通</option>
        </select>

        <select v-model="filterChannel" class="visitor-select visitor-select--channel">
          <option value="">来源渠道</option>
          <option value="web">Web</option>
          <option value="widget">聊天插件</option>
          <option value="email">Email</option>
        </select>

        <div class="visitor-date-input-wrap">
          <input class="agent-input visitor-date-input" placeholder="首次访问" readonly />
          <svg class="visitor-date-input-wrap__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>

        <div v-if="activeKey === 'all-visitors'" class="visitor-date-input-wrap">
          <input class="agent-input visitor-date-input" placeholder="最后访问" readonly />
          <svg class="visitor-date-input-wrap__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
      </div>

      <div class="visitor-filter-bar__right">
        <button type="button" class="agent-btn agent-btn--primary" @click="emit('toast', '搜索功能开发中')">搜索</button>
        <button type="button" class="agent-btn agent-btn--ghost" @click="handleReset">重置</button>
      </div>
    </div>

    <!-- 在线访客表格 -->
    <div v-if="activeKey === 'online-visitors'" class="doc-table-wrap">
      <table class="doc-table visitor-table">
        <thead>
          <tr>
            <th class="doc-table__th">姓名</th>
            <th class="doc-table__th">备注名</th>
            <th class="doc-table__th">邮箱</th>
            <th class="doc-table__th">电话</th>
            <th class="doc-table__th">标签</th>
            <th class="doc-table__th">来源渠道</th>
            <th class="doc-table__th">
              <span class="visitor-th--sortable">
                首次访问
                <svg class="visitor-sort-icon" width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
                  <path d="M5 0L9.33 5H0.67L5 0Z" opacity="0.3"/><path d="M5 14L0.67 9H9.33L5 14Z" opacity="0.3"/>
                </svg>
              </span>
            </th>
            <th class="doc-table__th">最后访问页面</th>
            <th class="doc-table__th">IP 地址</th>
            <th class="doc-table__th doc-table__th--action">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in onlineVisitorsList" :key="item.id" class="doc-table__row">
            <td class="doc-table__td">
              <a class="visitor-name-link" href="javascript:void(0)" @click.prevent="emit('toast', '访客详情开发中')">{{ item.name }}</a>
            </td>
            <td class="doc-table__td">{{ item.remark }}</td>
            <td class="doc-table__td">{{ item.email }}</td>
            <td class="doc-table__td">{{ item.phone }}</td>
            <td class="doc-table__td">{{ item.tag }}</td>
            <td class="doc-table__td">{{ channelTypeLabel[item.channelType] || 'Web' }}</td>
            <td class="doc-table__td">{{ item.firstVisit }}</td>
            <td class="doc-table__td">{{ item.lastPage }}</td>
            <td class="doc-table__td">{{ item.ip }}</td>
            <td class="doc-table__td doc-table__td--action visitor-action-cell">
              <button
                type="button"
                class="doc-action-btn"
                @click="toggleActionMenu(item.id)"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/>
                </svg>
              </button>
              <div v-if="openMenuId === item.id" class="visitor-action-menu">
                <button v-if="item.channelType === 'email'" type="button" class="visitor-action-menu__item" @click="openSendEmailDialog(item)">发送邮件</button>
                <button v-else type="button" class="visitor-action-menu__item" @click="handleMenuAction('创建会话')">创建会话</button>
                <button v-if="item.channelType !== 'email'" type="button" class="visitor-action-menu__item" @click="handleMenuAction('发起聊天')">发起聊天</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 全部访客表格 -->
    <div v-else class="doc-table-wrap">
      <table class="doc-table visitor-table">
        <thead>
          <tr>
            <th class="doc-table__th">姓名</th>
            <th class="doc-table__th">备注名</th>
            <th class="doc-table__th">邮箱</th>
            <th class="doc-table__th">电话</th>
            <th class="doc-table__th">标签</th>
            <th class="doc-table__th">来源渠道</th>
            <th class="doc-table__th">
              <span class="visitor-th--sortable">
                首次访问
                <svg class="visitor-sort-icon" width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
                  <path d="M5 0L9.33 5H0.67L5 0Z" opacity="0.3"/><path d="M5 14L0.67 9H9.33L5 14Z" opacity="0.3"/>
                </svg>
              </span>
            </th>
            <th class="doc-table__th">
              <span class="visitor-th--sortable">
                最后访问
                <svg class="visitor-sort-icon" width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
                  <path d="M5 0L9.33 5H0.67L5 0Z" opacity="0.3"/><path d="M5 14L0.67 9H9.33L5 14Z" opacity="0.3"/>
                </svg>
              </span>
            </th>
            <th class="doc-table__th">访问轨迹数</th>
            <th class="doc-table__th">IP 地址</th>
            <th class="doc-table__th doc-table__th--action">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in allVisitorsList" :key="item.id" class="doc-table__row">
            <td class="doc-table__td">
              <a class="visitor-name-link" href="javascript:void(0)" @click.prevent="emit('toast', '访客详情开发中')">{{ item.name }}</a>
            </td>
            <td class="doc-table__td">{{ item.remark }}</td>
            <td class="doc-table__td">{{ item.email }}</td>
            <td class="doc-table__td">{{ item.phone }}</td>
            <td class="doc-table__td">{{ item.tag }}</td>
            <td class="doc-table__td">{{ channelTypeLabel[item.channelType] || 'Web' }}</td>
            <td class="doc-table__td">{{ item.firstVisit }}</td>
            <td class="doc-table__td">{{ item.lastVisit }}</td>
            <td class="doc-table__td" style="text-align: center;">{{ item.traceCount }}</td>
            <td class="doc-table__td">{{ item.ip }}</td>
            <td class="doc-table__td doc-table__td--action visitor-action-cell">
              <button
                type="button"
                class="doc-action-btn"
                @click="toggleActionMenu(item.id)"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/>
                </svg>
              </button>
              <div v-if="openMenuId === item.id" class="visitor-action-menu">
                <button v-if="item.channelType === 'email'" type="button" class="visitor-action-menu__item" @click="openSendEmailDialog(item)">发送邮件</button>
                <button v-else type="button" class="visitor-action-menu__item" @click="handleMenuAction('创建会话')">创建会话</button>
                <button v-if="item.channelType !== 'email'" type="button" class="visitor-action-menu__item" @click="handleMenuAction('发起聊天')">发起聊天</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="doc-pagination">
      <span class="doc-pagination__total">总条数：{{ activeKey === 'online-visitors' ? onlineVisitorsList.length : allVisitorsList.length }}</span>
      <div class="doc-pagination__pages">
        <button type="button" class="doc-pagination__btn" disabled>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span class="doc-pagination__current">1</span>
        <button type="button" class="doc-pagination__btn" disabled>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
      <div class="doc-pagination__size">
        20 条/页
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
    </div>

    <!-- 发送邮件弹窗 -->
    <Teleport to="body">
      <div v-if="sendEmailOpen" class="send-email-overlay" @click.self="sendEmailOpen = false">
        <div class="send-email-modal">
          <header class="send-email-modal__header">
            <h2 class="send-email-modal__title">发送邮件</h2>
            <button type="button" class="send-email-modal__close" @click="sendEmailOpen = false">&times;</button>
          </header>
          <div class="send-email-modal__fields">
            <div class="send-email-modal__field">
              <label class="send-email-modal__label">To:</label>
              <span class="send-email-modal__value">{{ sendEmailTargetEmail }}</span>
            </div>
            <div class="send-email-modal__field">
              <label class="send-email-modal__label">From:</label>
              <select v-model="sendEmailFrom" class="send-email-modal__from-select">
                <option v-for="email in fromEmailOptions" :key="email" :value="email">{{ email }}</option>
              </select>
            </div>
          </div>
          <div class="send-email-modal__editor-area">
            <div class="send-email-modal__toolbar">
              <button class="send-email-modal__tool-btn" type="button" aria-label="加粗" @click="execEmailFormat('bold')"><b>B</b></button>
              <button class="send-email-modal__tool-btn" type="button" aria-label="斜体" @click="execEmailFormat('italic')"><i>I</i></button>
              <button class="send-email-modal__tool-btn" type="button" aria-label="下划线" @click="execEmailFormat('underline')"><u>U</u></button>
              <span class="send-email-modal__toolbar-divider" />
              <button class="send-email-modal__tool-btn" type="button" aria-label="有序列表" @click="execEmailFormat('insertOrderedList')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><text x="3" y="7" font-size="7" fill="currentColor" stroke="none" font-family="sans-serif">1</text><text x="3" y="13" font-size="7" fill="currentColor" stroke="none" font-family="sans-serif">2</text><text x="3" y="19" font-size="7" fill="currentColor" stroke="none" font-family="sans-serif">3</text></svg>
              </button>
              <button class="send-email-modal__tool-btn" type="button" aria-label="无序列表" @click="execEmailFormat('insertUnorderedList')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="9" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="9" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg>
              </button>
              <button class="send-email-modal__tool-btn" type="button" aria-label="链接" @click="insertEmailLink">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              </button>
              <span class="send-email-modal__toolbar-divider" />
              <button class="send-email-modal__tool-btn" type="button" aria-label="附件" @click="emailFileInputRef?.click()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              </button>
              <button class="send-email-modal__tool-btn" type="button" aria-label="图片" @click="emailImageInputRef?.click()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </button>
            </div>
            <input ref="emailFileInputRef" type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.zip,.rar,.7z,.txt" style="display:none" @change="handleEmailFileSelect" />
            <input ref="emailImageInputRef" type="file" multiple accept="image/*" style="display:none" @change="handleEmailImageSelect" />
            <div
              ref="emailEditorRef"
              class="send-email-modal__editor"
              contenteditable="true"
              data-placeholder="请输入消息"
              @input="handleEmailInput"
            />
          </div>
          <div v-if="emailAttachments.length > 0" class="send-email-modal__attachments">
            <div v-for="(file, idx) in emailAttachments" :key="idx" class="send-email-modal__att-card">
              <span class="send-email-modal__att-name">{{ file.name }}</span>
              <span class="send-email-modal__att-size">{{ formatFileSize(file.size) }}</span>
              <button type="button" class="send-email-modal__att-remove" @click="emailAttachments.splice(idx, 1)">&times;</button>
            </div>
          </div>
          <footer class="send-email-modal__footer">
            <button type="button" class="agent-btn agent-btn--ghost" @click="sendEmailOpen = false">取消</button>
            <button type="button" class="agent-btn agent-btn--primary" :disabled="!emailCanSend" @click="handleSendEmail">确认发送</button>
          </footer>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";

type VisitorsNavKey = "online-visitors" | "all-visitors";

defineProps<{
  activeKey: VisitorsNavKey;
}>();

const emit = defineEmits<{
  (e: "toast", message: string): void;
  (e: "navigate-to-inbox", queueKey: string): void;
}>();

const searchField = ref("name");
const searchKeyword = ref("");
const filterTag = ref("");
const filterChannel = ref("");
const openMenuId = ref<number | null>(null);
const sendEmailOpen = ref(false);
const sendEmailTarget = ref("");
const sendEmailTargetEmail = ref("");
const sendEmailFrom = ref("support@company.gmail.com");
const fromEmailOptions = ["support@company.gmail.com", "help@company.gmail.com"];
const emailEditorRef = ref<HTMLDivElement>();
const emailFileInputRef = ref<HTMLInputElement>();
const emailImageInputRef = ref<HTMLInputElement>();
const emailAttachments = reactive<{ name: string; size: number }[]>([]);
const emailCanSend = computed(() => {
  if (!emailEditorRef.value) return false;
  const hasText = (emailEditorRef.value.textContent || "").trim().length > 0;
  const hasImage = emailEditorRef.value.querySelector("img") !== null;
  return hasText || hasImage || emailAttachments.length > 0;
});

interface AllVisitorItem {
  id: number;
  name: string;
  remark: string;
  email: string;
  phone: string;
  tag: string;
  channelType: "web" | "widget" | "email";
  firstVisit: string;
  lastVisit: string;
  traceCount: number;
  ip: string;
}

interface OnlineVisitorItem {
  id: number;
  name: string;
  remark: string;
  email: string;
  phone: string;
  tag: string;
  channelType: "web" | "widget" | "email";
  firstVisit: string;
  lastPage: string;
  ip: string;
}

const channelTypeLabel: Record<string, string> = { web: "Web", widget: "聊天插件", email: "Email" };

const onlineVisitorsList = ref<OnlineVisitorItem[]>([
  { id: 101, name: "Tom", remark: "Tom-VIP", email: "tom@example.com", phone: "+1 555-0101", tag: "VIP", channelType: "web", firstVisit: "2026-03-17 09:12", lastPage: "/pricing", ip: "192.168.1.23" },
  { id: 102, name: "Emily", remark: "–", email: "emily@mail.com", phone: "–", tag: "普通", channelType: "web", firstVisit: "2026-03-17 10:05", lastPage: "/products/detail", ip: "10.0.0.45" },
  { id: 103, name: "James", remark: "老客户", email: "james@corp.io", phone: "+44 7700-900123", tag: "VIP", channelType: "widget", firstVisit: "2026-03-16 14:30", lastPage: "/support/faq", ip: "172.16.0.88" },
  { id: 104, name: "Sophia", remark: "–", email: "–", phone: "–", tag: "–", channelType: "web", firstVisit: "2026-03-17 11:22", lastPage: "/home", ip: "203.0.113.12" },
  { id: 105, name: "Liam", remark: "潜在客户", email: "liam@startup.co", phone: "+86 138-0000-1234", tag: "普通", channelType: "web", firstVisit: "2026-03-17 08:45", lastPage: "/demo", ip: "198.51.100.7" },
]);

const allVisitorsList = ref<AllVisitorItem[]>([
  { id: 1, name: "Visitor3", remark: "–", email: "–", phone: "–", tag: "–", channelType: "web", firstVisit: "2026-03-16 11:42", lastVisit: "2026-03-16 13:32:59", traceCount: 2, ip: "192.168.1.100" },
  { id: 2, name: "Visitor2", remark: "超级无敌SuperVIP", email: "–", phone: "–", tag: "–", channelType: "web", firstVisit: "2026-03-06 15:14", lastVisit: "2026-03-06 15:14:19", traceCount: 1, ip: "10.0.0.55" },
  { id: 3, name: "Visitor1", remark: "–", email: "–", phone: "–", tag: "123", channelType: "web", firstVisit: "2026-02-12 11:35", lastVisit: "2026-03-06 13:15:09", traceCount: 4, ip: "172.16.0.22" },
  { id: 4, name: "Tom", remark: "Tom-VIP", email: "tom@example.com", phone: "+1 555-0101", tag: "VIP", channelType: "web", firstVisit: "2026-03-10 09:12", lastVisit: "2026-03-17 09:12:33", traceCount: 8, ip: "192.168.1.23" },
  { id: 5, name: "Emily", remark: "–", email: "emily@mail.com", phone: "–", tag: "普通", channelType: "widget", firstVisit: "2026-03-12 10:05", lastVisit: "2026-03-17 10:05:47", traceCount: 3, ip: "10.0.0.45" },
  { id: 6, name: "Michael Brown", remark: "–", email: "michael.brown@acme.com", phone: "–", tag: "–", channelType: "email", firstVisit: "2026-03-18 16:30", lastVisit: "2026-03-18 16:45:12", traceCount: 1, ip: "–" },
  { id: 7, name: "Sarah Johnson", remark: "–", email: "sarah.johnson@techcorp.io", phone: "–", tag: "VIP", channelType: "email", firstVisit: "2026-03-15 13:00", lastVisit: "2026-03-18 14:20:33", traceCount: 3, ip: "–" },
]);

const handleReset = () => {
  searchField.value = "name";
  searchKeyword.value = "";
  filterTag.value = "";
  filterChannel.value = "";
};

const toggleActionMenu = (id: number) => {
  openMenuId.value = openMenuId.value === id ? null : id;
};

const handleMenuAction = (action: string) => {
  openMenuId.value = null;
  emit("toast", `${action}功能开发中`);
};

const openSendEmailDialog = (item: OnlineVisitorItem | AllVisitorItem) => {
  openMenuId.value = null;
  sendEmailTarget.value = item.name;
  sendEmailTargetEmail.value = item.email;
  sendEmailFrom.value = fromEmailOptions[0];
  sendEmailOpen.value = true;
  emailAttachments.splice(0, emailAttachments.length);
  setTimeout(() => {
    if (emailEditorRef.value) emailEditorRef.value.innerHTML = "";
  });
};

const handleEmailInput = () => {
  // 触发 computed 重新计算（emailCanSend 已读取 DOM）
};

const execEmailFormat = (command: string) => {
  document.execCommand(command, false);
  emailEditorRef.value?.focus();
};

const insertEmailLink = () => {
  const url = prompt("输入链接地址：", "https://");
  if (url) {
    document.execCommand("createLink", false, url);
    emailEditorRef.value?.focus();
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const handleEmailFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (!input.files) return;
  for (const file of Array.from(input.files)) {
    if (file.size > 20 * 1024 * 1024) {
      emit("toast", "附件大小不能超过20MB");
      continue;
    }
    if (file.type.startsWith("image/")) {
      insertEmailImage(file);
    } else {
      emailAttachments.push({ name: file.name, size: file.size });
    }
  }
  input.value = "";
};

const handleEmailImageSelect = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (!input.files) return;
  for (const file of Array.from(input.files)) {
    if (file.size > 20 * 1024 * 1024) {
      emit("toast", "图片大小不能超过20MB");
      continue;
    }
    insertEmailImage(file);
  }
  input.value = "";
};

const insertEmailImage = (file: File) => {
  const url = URL.createObjectURL(file);
  if (!emailEditorRef.value) return;
  emailEditorRef.value.focus();
  document.execCommand("insertHTML", false, `<p><br></p><img src="${url}" alt="${file.name}" style="max-width:100%;border-radius:4px;margin:4px 0;" /><p><br></p>`);
};

const handleSendEmail = () => {
  sendEmailOpen.value = false;
  emit("toast", "发送成功");
  emit("navigate-to-inbox", "resolved");
};
</script>

<style scoped>
.visitors-page {
  background: #fff;
  border-radius: var(--agent-radius-xl);
  gap: var(--agent-space-16);
}

.visitors-page > * {
  width: 100%;
}

/* 筛选栏 */
.visitor-filter-bar {
  align-items: center;
  display: flex;
  gap: 12px;
  justify-content: space-between;
}

.visitor-filter-bar__left {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.visitor-filter-bar__right {
  align-items: center;
  display: flex;
  flex-shrink: 0;
  gap: 8px;
}

.visitor-filter-group {
  align-items: center;
  display: flex;
  gap: 0;
}

.visitor-select {
  appearance: none;
  background: #fff url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23999' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 10px center;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  color: var(--agent-color-text-secondary);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  height: 36px;
  padding: 0 28px 0 12px;
}

.visitor-select--field {
  border-radius: var(--agent-radius-md) 0 0 var(--agent-radius-md);
  border-right: 0;
  min-width: 72px;
}

.visitor-select--tag {
  min-width: 140px;
}

.visitor-select--channel {
  min-width: 140px;
}

.visitor-search-input-wrap {
  position: relative;
}

.visitor-search-input-wrap__icon {
  color: var(--agent-color-text-tertiary);
  left: 10px;
  pointer-events: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.visitor-search-input {
  border-radius: 0 var(--agent-radius-md) var(--agent-radius-md) 0;
  font-size: var(--agent-font-size-sm);
  height: 36px;
  padding-left: 32px;
  width: 140px;
}

.visitor-date-input-wrap {
  position: relative;
}

.visitor-date-input {
  font-size: var(--agent-font-size-sm);
  height: 36px;
  padding-right: 32px;
  width: 150px;
}

.visitor-date-input-wrap__icon {
  color: var(--agent-color-text-tertiary);
  pointer-events: none;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

/* 表格复用 doc-table 样式 + 覆盖 */
.visitor-table {
  table-layout: auto;
}

.visitor-th--sortable {
  align-items: center;
  cursor: pointer;
  display: inline-flex;
  gap: 4px;
  user-select: none;
  white-space: nowrap;
}

.visitor-sort-icon {
  color: var(--agent-color-text-tertiary);
  flex-shrink: 0;
}

/* 空状态 */
.visitor-empty-cell {
  padding: 60px 16px;
}

.visitor-empty {
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.visitor-empty__icon {
  margin-bottom: 8px;
}

.visitor-empty__title {
  color: var(--agent-color-text-primary);
  font-size: 15px;
  font-weight: var(--agent-font-weight-medium);
  margin: 0;
}

.visitor-empty__desc {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-sm);
  margin: 0;
}

/* 姓名链接 */
.visitor-name-link {
  color: var(--agent-color-text-primary);
  text-decoration: underline;
}

.visitor-name-link:hover {
  color: var(--agent-color-brand-primary);
}

/* 操作菜单 */
.visitor-action-cell {
  position: relative;
}

.visitor-action-menu {
  background: #fff;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 100px;
  position: absolute;
  right: 0;
  top: 100%;
  z-index: var(--agent-z-dropdown);
}

.visitor-action-menu__item {
  background: none;
  border: 0;
  color: var(--agent-color-text-primary);
  cursor: pointer;
  display: block;
  font-size: var(--agent-font-size-sm);
  padding: 8px 16px;
  text-align: left;
  white-space: nowrap;
  width: 100%;
}

.visitor-action-menu__item:hover {
  background: var(--agent-color-bg-muted);
}

.visitor-action-menu__item:first-child {
  border-radius: var(--agent-radius-md) var(--agent-radius-md) 0 0;
}

.visitor-action-menu__item:last-child {
  border-radius: 0 0 var(--agent-radius-md) var(--agent-radius-md);
}

/* 复用 doc-table / doc-pagination 样式 —— 需要在全局或父组件中有这些类 */
.doc-table-wrap {
  background: #fff;
}

.doc-table {
  border-collapse: collapse;
  width: 100%;
}

.doc-table__th {
  background: #fafbfc;
  border-bottom: 1px solid var(--agent-color-border-default);
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  font-weight: var(--agent-font-weight-semibold);
  padding: 12px 16px;
  text-align: left;
  white-space: nowrap;
}

.doc-table__th--action {
  text-align: center;
}

.doc-table__row:not(:last-child) .doc-table__td {
  border-bottom: 1px solid var(--agent-color-border-default);
}

.doc-table__td {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
  padding: 14px 16px;
  white-space: nowrap;
}

.doc-table__td--action {
  text-align: center;
}

.doc-action-btn {
  align-items: center;
  background: none;
  border: 0;
  border-radius: var(--agent-radius-sm);
  color: var(--agent-color-text-tertiary);
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  padding: 4px;
}

.doc-action-btn:hover {
  background: var(--agent-color-bg-muted);
  color: var(--agent-color-text-secondary);
}

.doc-pagination {
  align-items: center;
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding: 8px 0;
}

.doc-pagination__total {
  color: var(--agent-color-text-secondary);
  font-size: var(--agent-font-size-sm);
}

.doc-pagination__pages {
  align-items: center;
  display: flex;
  gap: 8px;
}

.doc-pagination__btn {
  align-items: center;
  background: none;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-sm);
  color: var(--agent-color-text-tertiary);
  cursor: pointer;
  display: inline-flex;
  height: 32px;
  justify-content: center;
  width: 32px;
}

.doc-pagination__btn:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.doc-pagination__current {
  align-items: center;
  background: var(--agent-color-brand-primary);
  border-radius: var(--agent-radius-sm);
  color: #fff;
  display: inline-flex;
  font-size: var(--agent-font-size-sm);
  height: 32px;
  justify-content: center;
  min-width: 32px;
  padding: 0 8px;
}

.doc-pagination__size {
  align-items: center;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-sm);
  color: var(--agent-color-text-secondary);
  display: inline-flex;
  font-size: var(--agent-font-size-sm);
  gap: 4px;
  height: 32px;
  padding: 0 10px;
}

.visitor-channel-badge {
  border-radius: 999px;
  display: inline-block;
  font-size: var(--agent-font-size-xs);
  font-weight: var(--agent-font-weight-medium);
  line-height: 1;
  padding: 3px 8px;
}

.visitor-channel-badge--web {
  background: #e8f0ff;
  color: #2f6bff;
}

.visitor-channel-badge--email {
  background: #fef3cd;
  color: #b45309;
}

/* 发送邮件弹窗 */
.send-email-overlay {
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  inset: 0;
  justify-content: center;
  position: fixed;
  z-index: var(--agent-z-modal);
}

.send-email-modal {
  background: #fff;
  border-radius: var(--agent-radius-xl);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  max-width: 600px;
  padding: 24px;
  width: 90vw;
}

.send-email-modal__header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.send-email-modal__title {
  color: var(--agent-color-text-primary);
  font-size: 18px;
  font-weight: var(--agent-font-weight-semibold);
  margin: 0;
}

.send-email-modal__close {
  background: none;
  border: 0;
  color: var(--agent-color-text-tertiary);
  cursor: pointer;
  font-size: 24px;
  line-height: 1;
  padding: 0;
}

.send-email-modal__close:hover {
  color: var(--agent-color-text-primary);
}

.send-email-modal__fields {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.send-email-modal__field {
  align-items: center;
  border-bottom: 1px solid var(--agent-color-border-default);
  display: flex;
  gap: 8px;
  min-height: 36px;
  padding: 4px 0;
}

.send-email-modal__field:last-child {
  border-bottom: 0;
}

.send-email-modal__label {
  color: var(--agent-color-text-secondary, #75869c);
  flex-shrink: 0;
  font-size: var(--agent-font-size-sm);
  min-width: 48px;
}

.send-email-modal__value {
  color: var(--agent-color-text-primary);
  font-size: var(--agent-font-size-sm);
}

.send-email-modal__from-select {
  background: transparent;
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-sm);
  color: var(--agent-color-text-primary);
  cursor: pointer;
  font-size: var(--agent-font-size-sm);
  height: 28px;
  outline: none;
  padding: 0 8px;
}

.send-email-modal__from-select:focus {
  border-color: var(--agent-color-brand-primary);
}

.send-email-modal__editor-area {
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.send-email-modal__toolbar {
  align-items: center;
  border-bottom: 1px solid var(--agent-color-border-default);
  display: flex;
  gap: 2px;
  padding: 4px 8px;
}

.send-email-modal__tool-btn {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 4px;
  color: var(--agent-color-text-secondary, #75869c);
  cursor: pointer;
  display: inline-flex;
  font-size: 13px;
  height: 28px;
  justify-content: center;
  width: 28px;
}

.send-email-modal__tool-btn:hover {
  background: var(--agent-color-bg-muted, #f5f7fa);
  color: var(--agent-color-text-primary);
}

.send-email-modal__toolbar-divider {
  background: var(--agent-color-border-default);
  height: 16px;
  margin: 0 4px;
  width: 1px;
}

.send-email-modal__editor {
  color: var(--agent-color-text-primary);
  font-family: inherit;
  font-size: var(--agent-font-size-sm);
  line-height: 1.6;
  min-height: 200px;
  outline: none;
  overflow-y: auto;
  padding: 12px;
}

.send-email-modal__editor:empty::before {
  color: #a6afbd;
  content: attr(data-placeholder);
  pointer-events: none;
}

.send-email-modal__attachments {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.send-email-modal__att-card {
  align-items: center;
  background: var(--agent-color-bg-muted, #f5f7fa);
  border: 1px solid var(--agent-color-border-default);
  border-radius: var(--agent-radius-md);
  display: inline-flex;
  font-size: var(--agent-font-size-sm);
  gap: 6px;
  padding: 4px 10px;
}

.send-email-modal__att-name {
  color: var(--agent-color-text-primary);
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.send-email-modal__att-size {
  color: var(--agent-color-text-tertiary);
  font-size: var(--agent-font-size-xs);
}

.send-email-modal__att-remove {
  background: transparent;
  border: 0;
  color: var(--agent-color-text-tertiary);
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 0 2px;
}

.send-email-modal__att-remove:hover {
  color: var(--agent-color-status-error, #ef4444);
}

.send-email-modal__footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
