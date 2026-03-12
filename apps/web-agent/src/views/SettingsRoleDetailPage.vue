<template>
  <section class="role-detail">
    <header class="role-detail__header">
      <button type="button" class="role-detail__back" @click="emit('back')">
        <span class="role-detail__back-arrow">‹</span>
        <span>返回</span>
      </button>
      <h2 class="role-detail__title">{{ headerTitle }}</h2>
    </header>

    <div class="role-detail__body agent-scroll">
      <!-- Role name -->
      <div class="role-detail__field">
        <label class="role-detail__label">角色名称</label>
        <input
          v-if="editable"
          v-model="roleName"
          class="agent-input role-detail__name-input"
          placeholder="请输入角色名称"
          maxlength="20"
        />
        <span v-else class="role-detail__value">
          {{ roleName }}
          <span v-if="isSystemRole" class="role-detail__system-badge">系统角色</span>
        </span>
      </div>

      <!-- Bound members count (view mode) -->
      <div v-if="mode === 'view'" class="role-detail__field">
        <label class="role-detail__label">绑定成员数</label>
        <span class="role-detail__value">{{ boundMemberCount }}</span>
      </div>

      <!-- Permission tree -->
      <div class="role-detail__field role-detail__field--tree">
        <label class="role-detail__label">权限配置</label>
        <div class="perm-tree">
          <div v-for="group in permissionTree" :key="group.key" class="perm-group">
            <div class="perm-group__header">
              <label class="perm-group__check">
                <input
                  type="checkbox"
                  :checked="isGroupChecked(group)"
                  :indeterminate="isGroupIndeterminate(group)"
                  :disabled="!editable"
                  @change="toggleGroup(group)"
                />
                <span class="perm-group__title">{{ group.label }}</span>
              </label>
              <span class="perm-group__desc">{{ group.desc }}</span>
            </div>

            <!-- Sub menus -->
            <div v-if="group.children && group.children.length > 0" class="perm-group__children">
              <div v-for="child in group.children" :key="child.key" class="perm-item">
                <div class="perm-item__row">
                  <label class="perm-item__check">
                    <input
                      type="checkbox"
                      :checked="isItemChecked(child)"
                      :indeterminate="isItemIndeterminate(child)"
                      :disabled="!editable"
                      @change="toggleItem(child)"
                    />
                    <span class="perm-item__label">{{ child.label }}</span>
                  </label>
                </div>

                <!-- Feature permissions -->
                <div v-if="child.features && child.features.length > 0" class="perm-item__features">
                  <label
                    v-for="feat in child.features"
                    :key="feat.key"
                    class="perm-feature"
                  >
                    <input
                      type="checkbox"
                      :checked="checkedPerms.has(feat.key)"
                      :disabled="!editable"
                      @change="toggleFeature(feat.key, child)"
                    />
                    <span class="perm-feature__label">{{ feat.label }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer v-if="editable" class="role-detail__footer">
      <button type="button" class="agent-btn agent-btn--ghost" @click="emit('back')">取消</button>
      <button
        type="button"
        class="agent-btn agent-btn--primary"
        :disabled="!canSave"
        @click="handleSave"
      >保存</button>
    </footer>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

type DetailMode = "view" | "create" | "edit";

interface PermFeature {
  key: string;
  label: string;
}

interface PermItem {
  key: string;
  label: string;
  features?: PermFeature[];
}

interface PermGroup {
  key: string;
  label: string;
  desc?: string;
  children?: PermItem[];
}

const props = withDefaults(
  defineProps<{
    mode: DetailMode;
    roleId?: string;
    initialName?: string;
    isSystemRole?: boolean;
    boundMemberCount?: number;
    initialPerms?: string[];
  }>(),
  {
    roleId: "",
    initialName: "",
    isSystemRole: false,
    boundMemberCount: 0,
    initialPerms: () => []
  }
);

const emit = defineEmits<{
  (e: "back"): void;
  (e: "save", payload: { name: string; permissions: string[] }): void;
  (e: "toast", message: string): void;
}>();

const editable = computed(() => props.mode !== "view");

const headerTitle = computed(() => {
  if (props.mode === "create") return "新增角色";
  if (props.mode === "edit") return "编辑角色";
  return "角色详情";
});

const roleName = ref(props.initialName);

// Permission tree definition
const permissionTree: PermGroup[] = [
  {
    key: "conversation",
    label: "会话",
    desc: "管理和处理客服会话",
    children: [
      {
        key: "conv-view",
        label: "查看会话",
        features: [
          { key: "conv-transfer", label: "转移会话" },
          { key: "conv-invite", label: "添加客服" },
          { key: "conv-close", label: "结束会话" }
        ]
      }
    ]
  },
  {
    key: "visitor",
    label: "访客",
    desc: "查看和管理访客信息",
    children: [
      {
        key: "visitor-view",
        label: "查看访客",
        features: [
          { key: "visitor-edit", label: "编辑访客信息" },
          { key: "visitor-tag", label: "管理访客标签" }
        ]
      }
    ]
  },
  {
    key: "archive",
    label: "档案",
    desc: "查看历史会话和聊天记录",
    children: [
      {
        key: "archive-view",
        label: "查看档案"
      }
    ]
  },
  {
    key: "team",
    label: "客服管理",
    desc: "管理客服团队和角色",
    children: [
      {
        key: "agent-list-view",
        label: "查看客服列表",
        features: [
          { key: "agent-invite", label: "邀请客服" },
          { key: "agent-edit", label: "编辑成员" },
          { key: "agent-toggle", label: "启用/停用成员" },
          { key: "agent-delete", label: "删除成员" },
          { key: "agent-reset-pwd", label: "重置密码" },
          { key: "agent-assign-role", label: "分配角色" }
        ]
      },
      {
        key: "invite-record-view",
        label: "查看邀请记录",
        features: [
          { key: "invite-resend", label: "重新邀请" },
          { key: "invite-delete", label: "删除邀请" }
        ]
      },
      {
        key: "role-view",
        label: "查看角色",
        features: [
          { key: "role-create", label: "新增角色" },
          { key: "role-edit", label: "编辑角色" },
          { key: "role-perm-config", label: "配置角色权限" },
          { key: "role-delete", label: "删除角色" }
        ]
      },
      {
        key: "team-settings",
        label: "客服设置"
      }
    ]
  },
  {
    key: "quick-reply",
    label: "快捷回复",
    desc: "管理快捷回复模板",
    children: [
      {
        key: "personal-reply-view",
        label: "个人回复",
        features: [
          { key: "personal-reply-edit", label: "维护个人回复" }
        ]
      },
      {
        key: "public-reply-view",
        label: "公共回复",
        features: [
          { key: "public-reply-edit", label: "维护公共回复" }
        ]
      }
    ]
  },
  {
    key: "settings",
    label: "设置",
    desc: "系统安装与配置",
    children: [
      { key: "install-view", label: "安装" },
      { key: "customize-view", label: "自定义" },
      { key: "tags-view", label: "标签管理" },
      { key: "security-view", label: "安全设置" },
      { key: "dev-settings-view", label: "开发设置" }
    ]
  },
  {
    key: "report",
    label: "报表",
    desc: "查看统计数据和报表",
    children: [
      { key: "report-view", label: "查看报表" }
    ]
  },
  {
    key: "campaign",
    label: "营销",
    desc: "管理营销活动",
    children: [
      { key: "campaign-view", label: "查看营销" },
      {
        key: "campaign-manage",
        label: "管理营销",
        features: [
          { key: "campaign-create", label: "创建活动" },
          { key: "campaign-edit", label: "编辑活动" },
          { key: "campaign-delete", label: "删除活动" }
        ]
      }
    ]
  }
];

// Collect all perm keys
const getAllKeys = (): string[] => {
  const keys: string[] = [];
  for (const group of permissionTree) {
    if (group.children) {
      for (const child of group.children) {
        keys.push(child.key);
        if (child.features) {
          for (const feat of child.features) {
            keys.push(feat.key);
          }
        }
      }
    }
  }
  return keys;
};

// Initialize checked permissions
const initPerms = (): Set<string> => {
  if (props.initialPerms.length > 0) {
    return new Set(props.initialPerms);
  }
  if (props.mode === "create") {
    // Default from 客服 template
    return new Set([
      "conv-view", "conv-transfer", "conv-invite", "conv-close",
      "visitor-view",
      "archive-view",
      "personal-reply-view", "personal-reply-edit",
      "public-reply-view",
      "agent-list-view"
    ]);
  }
  if (props.isSystemRole && props.initialName === "管理员") {
    return new Set(getAllKeys());
  }
  return new Set();
};

const checkedPerms = ref<Set<string>>(initPerms());

// Group-level check state
const getGroupChildKeys = (group: PermGroup): string[] => {
  const keys: string[] = [];
  if (group.children) {
    for (const child of group.children) {
      keys.push(child.key);
      if (child.features) {
        for (const feat of child.features) {
          keys.push(feat.key);
        }
      }
    }
  }
  return keys;
};

const isGroupChecked = (group: PermGroup): boolean => {
  const keys = getGroupChildKeys(group);
  return keys.length > 0 && keys.every((k) => checkedPerms.value.has(k));
};

const isGroupIndeterminate = (group: PermGroup): boolean => {
  const keys = getGroupChildKeys(group);
  const checked = keys.filter((k) => checkedPerms.value.has(k));
  return checked.length > 0 && checked.length < keys.length;
};

const toggleGroup = (group: PermGroup) => {
  const keys = getGroupChildKeys(group);
  const allChecked = isGroupChecked(group);
  const next = new Set(checkedPerms.value);
  for (const k of keys) {
    if (allChecked) {
      next.delete(k);
    } else {
      next.add(k);
    }
  }
  checkedPerms.value = next;
};

// Item-level check state
const getItemKeys = (item: PermItem): string[] => {
  const keys = [item.key];
  if (item.features) {
    for (const feat of item.features) {
      keys.push(feat.key);
    }
  }
  return keys;
};

const isItemChecked = (item: PermItem): boolean => {
  const keys = getItemKeys(item);
  return keys.every((k) => checkedPerms.value.has(k));
};

const isItemIndeterminate = (item: PermItem): boolean => {
  const keys = getItemKeys(item);
  const checked = keys.filter((k) => checkedPerms.value.has(k));
  return checked.length > 0 && checked.length < keys.length;
};

const toggleItem = (item: PermItem) => {
  const keys = getItemKeys(item);
  const allChecked = isItemChecked(item);
  const next = new Set(checkedPerms.value);
  for (const k of keys) {
    if (allChecked) {
      next.delete(k);
    } else {
      next.add(k);
    }
  }
  checkedPerms.value = next;
};

const toggleFeature = (featKey: string, parent: PermItem) => {
  const next = new Set(checkedPerms.value);
  if (next.has(featKey)) {
    next.delete(featKey);
  } else {
    next.add(featKey);
    // Ensure parent item is also checked
    if (!next.has(parent.key)) {
      next.add(parent.key);
    }
  }
  checkedPerms.value = next;
};

const canSave = computed(() => {
  return roleName.value.trim().length > 0;
});

const handleSave = () => {
  if (!canSave.value) return;
  emit("save", {
    name: roleName.value.trim(),
    permissions: Array.from(checkedPerms.value)
  });
};
</script>

<style scoped>
.role-detail {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.role-detail__header {
  align-items: center;
  border-bottom: 1px solid #edf1f5;
  display: flex;
  gap: 12px;
  padding: 14px 18px;
}

.role-detail__back {
  align-items: center;
  background: transparent;
  border: 0;
  color: #105eff;
  cursor: pointer;
  display: inline-flex;
  font-size: 14px;
  gap: 4px;
  padding: 0;
}

.role-detail__back-arrow {
  font-size: 18px;
  line-height: 1;
}

.role-detail__back:hover {
  text-decoration: underline;
}

.role-detail__title {
  color: #252525;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.role-detail__body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 24px 18px;
}

.role-detail__field {
  margin-bottom: 24px;
}

.role-detail__field--tree {
  margin-bottom: 0;
}

.role-detail__label {
  color: #75869c;
  display: block;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px;
}

.role-detail__value {
  align-items: center;
  color: #252525;
  display: inline-flex;
  font-size: 15px;
  gap: 8px;
}

.role-detail__system-badge {
  background: #dce9ff;
  border-radius: 4px;
  color: #105eff;
  font-size: 11px;
  line-height: 16px;
  padding: 1px 6px;
}

.role-detail__name-input {
  max-width: 360px;
  width: 100%;
}

/* Permission tree */
.perm-tree {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.perm-group {
  border: 1px solid #edf1f5;
  border-radius: 12px;
  margin-bottom: 12px;
  overflow: hidden;
}

.perm-group__header {
  align-items: center;
  background: #f8f9fb;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  padding: 12px 16px;
}

.perm-group__check {
  align-items: center;
  cursor: pointer;
  display: inline-flex;
  gap: 8px;
}

.perm-group__check input[type="checkbox"] {
  accent-color: #105eff;
  cursor: pointer;
  height: 16px;
  width: 16px;
}

.perm-group__title {
  color: #252525;
  font-size: 14px;
  font-weight: 600;
}

.perm-group__desc {
  color: #9ca3af;
  font-size: 12px;
}

.perm-group__children {
  display: flex;
  flex-direction: column;
}

.perm-item {
  border-top: 1px solid #edf1f5;
  padding: 12px 16px 12px 40px;
}

.perm-item__row {
  display: flex;
}

.perm-item__check {
  align-items: center;
  cursor: pointer;
  display: inline-flex;
  gap: 8px;
}

.perm-item__check input[type="checkbox"] {
  accent-color: #105eff;
  cursor: pointer;
  height: 15px;
  width: 15px;
}

.perm-item__label {
  color: #252525;
  font-size: 13px;
  font-weight: 500;
}

.perm-item__features {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  margin-top: 10px;
  padding-left: 23px;
}

.perm-feature {
  align-items: center;
  cursor: pointer;
  display: inline-flex;
  gap: 6px;
}

.perm-feature input[type="checkbox"] {
  accent-color: #105eff;
  cursor: pointer;
  height: 14px;
  width: 14px;
}

.perm-feature__label {
  color: #4b5563;
  font-size: 13px;
}

.role-detail__footer {
  align-items: center;
  border-top: 1px solid #edf1f5;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 14px 18px;
}
</style>
