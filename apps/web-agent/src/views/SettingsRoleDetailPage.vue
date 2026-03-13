<template>
  <section class="role-detail-page agent-content-page agent-content-page--hide-scrollbar">
    <article class="role-detail-page__card agent-panel">
      <header class="role-detail-page__header">
        <button type="button" class="role-detail-page__back" @click="emit('back')">
          <span class="role-detail-page__back-arrow">‹</span>
        </button>
        <h2 class="role-detail-page__title">{{ headerTitle }}</h2>
      </header>

      <div class="role-detail-page__body agent-scroll">
      <!-- Role name -->
      <div class="role-detail-page__field">
        <label class="role-detail-page__label">角色名称</label>
        <input
          v-if="editable"
          v-model="roleName"
          class="agent-input role-detail-page__name-input"
          placeholder="请输入角色名称"
          maxlength="50"
        />
        <span v-else class="role-detail-page__value">{{ roleName }}</span>
      </div>

      <!-- Permission tree -->
      <div class="role-detail-page__field role-detail-page__field--tree">
        <label class="role-detail-page__label">权限配置</label>
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

    <footer v-if="editable" class="role-detail-page__footer" :class="{ 'role-detail-page__footer--start': mode === 'create' }">
      <button v-if="mode !== 'create'" type="button" class="agent-btn agent-btn--ghost" @click="emit('back')">取消</button>
      <button
        type="button"
        class="agent-btn agent-btn--primary"
        :disabled="!canSave"
        @click="handleSave"
      >保存</button>
    </footer>
    </article>
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
  children?: PermItem[];
}

const props = withDefaults(
  defineProps<{
    mode: DetailMode;
    roleId?: string;
    initialName?: string;
    isSystemRole?: boolean;
    initialPerms?: string[];
  }>(),
  {
    roleId: "",
    initialName: "",
    isSystemRole: false,
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
    key: "archive",
    label: "档案",
    children: [
      { key: "archive-view", label: "查看档案" },
      { key: "archive-manage", label: "管理档案" }
    ]
  },
  {
    key: "visitor",
    label: "访客",
    children: [
      { key: "visitor-manage", label: "管理访客" }
    ]
  },
  {
    key: "customer",
    label: "客户",
    children: [
      { key: "customer-manage", label: "管理客户" }
    ]
  },
  {
    key: "report",
    label: "报表",
    children: [
      { key: "report-view", label: "查看报表" }
    ]
  },
  {
    key: "campaign",
    label: "营销",
    children: [
      { key: "campaign-manage", label: "管理营销" }
    ]
  },
  {
    key: "team",
    label: "团队",
    children: [
      {
        key: "agent",
        label: "客服",
        features: [
          { key: "agent-list-view", label: "查看客服" },
          { key: "agent-manage", label: "管理客服" }
        ]
      },
      {
        key: "team-settings",
        label: "客服设置",
        features: [
          { key: "team-settings-manage", label: "管理客服设置" }
        ]
      }
    ]
  },
  {
    key: "settings",
    label: "设置",
    children: [
      { key: "install-manage", label: "管理安装" },
      { key: "reply-manage", label: "管理快捷回复" },
      { key: "tags-manage", label: "管理标签" },
      { key: "security-manage", label: "管理安全" },
      { key: "dev-settings-manage", label: "管理开发设置" }
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
    return new Set();
  }
  if (props.isSystemRole && props.initialName === "管理员") {
    // Admin gets all permissions + conversation
    const allKeys = getAllKeys();
    return new Set([...allKeys, "conv-view", "conv-transfer", "conv-invite", "conv-close"]);
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
.role-detail-page {
  align-items: stretch;
  gap: 0;
  overflow: hidden;
  padding: 12px;
}

.role-detail-page__card {
  background: #ffffff;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.role-detail-page__header {
  align-items: center;
  border-bottom: 1px solid #edf1f5;
  display: flex;
  flex-shrink: 0;
  gap: 8px;
  padding: 18px 28px;
}

.role-detail-page__back {
  align-items: center;
  background: transparent;
  border: 0;
  color: #252525;
  cursor: pointer;
  display: inline-flex;
  padding: 0;
}

.role-detail-page__back-arrow {
  color: #252525;
  font-size: 22px;
  font-weight: 600;
  line-height: 1;
}

.role-detail-page__back:hover {
  opacity: 0.7;
}

.role-detail-page__title {
  color: #252525;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.role-detail-page__body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 28px 28px 40px;
}

.role-detail-page__field {
  margin-bottom: 24px;
}

.role-detail-page__field--tree {
  margin-bottom: 0;
}

.role-detail-page__label {
  color: #75869c;
  display: block;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px;
}

.role-detail-page__value {
  align-items: center;
  color: #252525;
  display: inline-flex;
  font-size: 15px;
  gap: 8px;
}

.role-detail-page__name-input {
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

.role-detail-page__footer {
  align-items: center;
  border-top: 1px solid #edf1f5;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 14px 28px;
}

.role-detail-page__footer--start {
  justify-content: flex-start;
}
</style>
