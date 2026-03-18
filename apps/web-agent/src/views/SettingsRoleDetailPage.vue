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

      <!-- Permission table -->
      <div class="perm-table">
        <template v-for="(row, idx) in flatRows" :key="row.rowKey">
          <!-- Group header row (simple group without children, or group with children as section title) -->
          <div
            v-if="row.type === 'group'"
            class="perm-row"
            :class="{ 'perm-row--alt': idx % 2 === 1 }"
          >
            <div class="perm-row__label">
              <span class="perm-row__title">{{ row.label }}</span>
              <span v-if="row.tooltip" class="perm-row__tooltip-wrap">
                <span class="perm-row__tooltip-trigger">?</span>
                <span class="perm-row__tooltip-content">{{ row.tooltip }}</span>
              </span>
            </div>
            <div class="perm-row__checks">
              <template v-if="row.locked">
                <label class="perm-check">
                  <input type="checkbox" checked disabled />
                  <span class="perm-check__label">{{ row.lockedLabel }}</span>
                </label>
              </template>
              <template v-else-if="row.features && row.features.length > 0">
                <label
                  v-for="feat in row.features"
                  :key="feat.key"
                  class="perm-check"
                >
                  <input
                    type="checkbox"
                    :checked="checkedPerms.has(feat.key)"
                    :disabled="!editable"
                    @change="togglePerm(feat.key)"
                  />
                  <span class="perm-check__label">{{ feat.label }}</span>
                </label>
              </template>
            </div>
          </div>

          <!-- Section header row (group with children) -->
          <div
            v-else-if="row.type === 'section'"
            class="perm-row perm-row--section"
            :class="{ 'perm-row--alt': idx % 2 === 1 }"
          >
            <div class="perm-row__label">
              <span class="perm-row__title">{{ row.label }}</span>
            </div>
          </div>

          <!-- Child item row -->
          <div
            v-else-if="row.type === 'child'"
            class="perm-row perm-row--child"
            :class="{ 'perm-row--alt': idx % 2 === 1 }"
          >
            <div class="perm-row__label">
              <label class="perm-check">
                <input
                  type="checkbox"
                  :checked="isItemChecked(row.itemKey!)"
                  :disabled="!editable"
                  @change="toggleItemWithFeatures(row.itemKey!, row.features || [])"
                />
                <span class="perm-row__child-label">{{ row.label }}</span>
              </label>
            </div>
            <div class="perm-row__checks">
              <label
                v-for="feat in row.features"
                :key="feat.key"
                class="perm-check"
              >
                <input
                  type="checkbox"
                  :checked="checkedPerms.has(feat.key)"
                  :disabled="!editable"
                  @change="togglePerm(feat.key)"
                />
                <span class="perm-check__label">{{ feat.label }}</span>
              </label>
            </div>
          </div>
        </template>
      </div>
    </div>

    <footer v-if="editable" class="role-detail-page__footer">
      <button type="button" class="agent-btn agent-btn--ghost" @click="emit('back')">取消</button>
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
import { PERMISSION_TREE, type PermGroup, type PermItem } from "../lib/permission";

type DetailMode = "view" | "create" | "edit";

interface FlatRow {
  rowKey: string;
  type: "group" | "section" | "child";
  label: string;
  tooltip?: string;
  locked?: boolean;
  lockedLabel?: string;
  itemKey?: string;
  features?: { key: string; label: string }[];
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

// Build flat rows from permission tree
const flatRows = computed<FlatRow[]>(() => {
  const rows: FlatRow[] = [];
  for (const group of PERMISSION_TREE) {
    // Filter out locked children
    const visibleChildren = (group.children || []).filter(c => !c.locked);

    if (group.locked) {
      // Locked group (e.g. 首页, 会话) — show as single row with checked disabled
      rows.push({
        rowKey: group.key,
        type: "group",
        label: group.label,
        locked: true,
        lockedLabel: `查看${group.label}`,
      });
    } else if (!group.children || group.children.length === 0) {
      // Group with no children — shouldn't happen but handle gracefully
      rows.push({
        rowKey: group.key,
        type: "group",
        label: group.label,
        tooltip: group.tooltip,
        features: [],
      });
    } else if (visibleChildren.length === 0) {
      // All children are locked — show as locked row
      rows.push({
        rowKey: group.key,
        type: "group",
        label: group.label,
        locked: true,
        lockedLabel: `查看${group.label}`,
      });
    } else if (visibleChildren.length === 1 && !visibleChildren[0].features) {
      // Simple group with one visible child and no sub-features
      const child = visibleChildren[0];
      const allFeatures = [{ key: child.key, label: child.label }];
      rows.push({
        rowKey: group.key,
        type: "group",
        label: group.label,
        tooltip: group.tooltip,
        features: allFeatures,
      });
    } else if (visibleChildren.every(c => !c.features || c.features.filter(f => !f.locked).length === 0)) {
      // Group where all visible children have no sub-features — flat row with all children as checkboxes
      const allFeatures = visibleChildren.map(c => ({ key: c.key, label: c.label }));
      rows.push({
        rowKey: group.key,
        type: "group",
        label: group.label,
        tooltip: group.tooltip,
        features: allFeatures,
      });
    } else {
      // Complex group (has children with features) — section header + child rows
      rows.push({
        rowKey: `${group.key}-section`,
        type: "section",
        label: group.label,
        tooltip: group.tooltip,
      });
      for (const child of visibleChildren) {
        const visibleFeatures = (child.features || []).filter(f => !f.locked);
        rows.push({
          rowKey: child.key,
          type: "child",
          label: child.label,
          itemKey: child.key,
          features: visibleFeatures,
        });
      }
    }
  }
  return rows;
});

// Collect all toggleable perm keys (exclude locked)
const getAllKeys = (): string[] => {
  const keys: string[] = [];
  for (const group of PERMISSION_TREE) {
    if (group.locked) continue;
    if (group.children) {
      for (const child of group.children) {
        if (child.locked) continue;
        keys.push(child.key);
        if (child.features) {
          for (const feat of child.features) {
            if (!feat.locked) keys.push(feat.key);
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
  if (props.isSystemRole && props.initialName === "超级管理员") {
    const allKeys = getAllKeys();
    return new Set(allKeys);
  }
  return new Set();
};

const checkedPerms = ref<Set<string>>(initPerms());

const togglePerm = (key: string) => {
  const next = new Set(checkedPerms.value);
  if (next.has(key)) {
    next.delete(key);
  } else {
    next.add(key);
  }
  checkedPerms.value = next;
};

const isItemChecked = (itemKey: string): boolean => {
  return checkedPerms.value.has(itemKey);
};

const toggleItemWithFeatures = (itemKey: string, features: { key: string; label: string }[]) => {
  const next = new Set(checkedPerms.value);
  const isChecked = next.has(itemKey);
  if (isChecked) {
    next.delete(itemKey);
    for (const f of features) next.delete(f.key);
  } else {
    next.add(itemKey);
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
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
}

.role-detail-page__label {
  color: #252525;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
  width: 80px;
}

.role-detail-page__value {
  align-items: center;
  color: #252525;
  display: inline-flex;
  font-size: 15px;
  gap: 8px;
}

.role-detail-page__name-input {
  max-width: 480px;
  width: 100%;
}

/* Permission table */
.perm-table {
  display: flex;
  flex-direction: column;
}

.perm-row {
  align-items: center;
  display: flex;
  gap: 24px;
  min-height: 48px;
  padding: 12px 16px;
}

.perm-row--alt {
  background: #f8f9fb;
  border-radius: 8px;
}

.perm-row--section {
  padding-bottom: 4px;
}

.perm-row--child {
  padding-left: 32px;
}

.perm-row__label {
  align-items: center;
  display: flex;
  flex-shrink: 0;
  gap: 6px;
  min-width: 100px;
}

.perm-row__title {
  color: #252525;
  font-size: 14px;
  font-weight: 600;
}

.perm-row__child-label {
  color: #252525;
  font-size: 13px;
  font-weight: 500;
}

.perm-row__checks {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
}

.perm-check {
  align-items: center;
  cursor: pointer;
  display: inline-flex;
  gap: 6px;
}

.perm-check input[type="checkbox"] {
  accent-color: #105eff;
  cursor: pointer;
  height: 16px;
  width: 16px;
}

.perm-check input[type="checkbox"]:disabled {
  cursor: default;
}

.perm-check__label {
  color: #4b5563;
  font-size: 13px;
  white-space: nowrap;
}

/* Tooltip */
.perm-row__tooltip-wrap {
  display: inline-flex;
  position: relative;
}

.perm-row__tooltip-trigger {
  align-items: center;
  border: 1px solid #c7cdd8;
  border-radius: 50%;
  color: #75869c;
  cursor: help;
  display: inline-flex;
  font-size: 11px;
  font-weight: 600;
  height: 16px;
  justify-content: center;
  line-height: 1;
  width: 16px;
}

.perm-row__tooltip-content {
  background: #222222;
  border-radius: 6px;
  color: #ffffff;
  display: none;
  font-size: 12px;
  left: 50%;
  line-height: 18px;
  padding: 6px 10px;
  position: absolute;
  top: calc(100% + 8px);
  transform: translateX(-50%);
  white-space: nowrap;
  z-index: 10;
}

.perm-row__tooltip-content::after {
  border-bottom: 5px solid #222222;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  content: "";
  left: 50%;
  position: absolute;
  top: -5px;
  transform: translateX(-50%);
}

.perm-row__tooltip-wrap:hover .perm-row__tooltip-content {
  display: block;
}

.role-detail-page__footer {
  align-items: center;
  border-top: 1px solid #edf1f5;
  display: flex;
  gap: 12px;
  justify-content: flex-start;
  padding: 14px 28px;
}
</style>
