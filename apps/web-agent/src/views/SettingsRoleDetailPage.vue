<template>
  <section class="role-detail-page agent-content-page agent-content-page--hide-scrollbar">
    <article class="role-detail-page__card agent-panel">
      <header class="role-detail-page__header">
        <button type="button" class="role-detail-page__back" @click="handleBack">
          <span class="role-detail-page__back-arrow">‹</span>
        </button>
        <h2 class="role-detail-page__title">{{ headerTitle }}</h2>
      </header>

      <div class="role-detail-page__body agent-scroll">
      <!-- Role name -->
      <div class="role-detail-page__field">
        <label class="role-detail-page__label">角色名称</label>
        <div class="role-detail-page__input-wrap">
          <input
            v-if="editable"
            v-model="roleName"
            class="agent-input role-detail-page__name-input"
            :class="{ 'role-detail-page__name-input--error': nameSubmitted && !roleName.trim() }"
            placeholder="请输入角色名称"
            maxlength="50"
          />
          <span v-else class="role-detail-page__value">{{ roleName }}</span>
          <span v-if="editable && nameSubmitted && !roleName.trim()" class="role-detail-page__name-error">请输入角色名称</span>
        </div>
      </div>

      <!-- Permission table -->
      <div class="perm-table">
        <template v-for="(group, gIdx) in permissionTree" :key="group.key">
          <!-- Locked group: single row -->
          <div
            v-if="group.locked"
            class="perm-group"
            :class="{ 'perm-group--alt': gIdx % 2 === 1 }"
          >
            <div class="perm-locked-row">
              <span class="perm-locked-row__title">{{ group.label }}</span>
              <label class="perm-check perm-check--locked">
                <input type="checkbox" checked disabled />
                <span class="perm-check__label">{{ group.lockedLabel }}</span>
              </label>
            </div>
          </div>

          <!-- Section group: header + child rows -->
          <div
            v-else
            class="perm-group"
            :class="{ 'perm-group--alt': gIdx % 2 === 1 }"
          >
            <div class="perm-section-header">
              <span class="perm-section-header__title">{{ group.label }}</span>
              <span v-if="group.tooltip" class="perm-section-header__tooltip-wrap">
                <span class="perm-section-header__tooltip-trigger">?</span>
                <span class="perm-section-header__tooltip-content">{{ group.tooltip }}</span>
              </span>
            </div>
            <div
              v-for="child in group.children"
              :key="child.key"
              class="perm-child-row"
            >
              <label class="perm-check perm-child-row__item">
                <input
                  type="checkbox"
                  :checked="checkedPerms.has(child.key)"
                  :disabled="!editable"
                  @change="toggleItemWithFeatures(child)"
                />
                <span class="perm-child-row__name">{{ child.label }}</span>
              </label>
              <div class="perm-child-row__perms">
                <label
                  v-for="feat in (child.features || [])"
                  :key="feat.key"
                  class="perm-check"
                >
                  <input
                    type="checkbox"
                    :checked="checkedPerms.has(feat.key)"
                    :disabled="!editable"
                    @change="toggleFeature(feat.key, child.key)"
                  />
                  <span class="perm-check__label">{{ feat.label }}</span>
                </label>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <footer v-if="editable" class="role-detail-page__footer">
      <button type="button" class="agent-btn agent-btn--ghost" @click="handleBack">取消</button>
      <button
        type="button"
        class="agent-btn agent-btn--primary"
        :disabled="!canSave"
        @click="handleSave"
      >保存</button>
    </footer>
    </article>

    <!-- Unsaved changes confirmation modal -->
    <Teleport to="body">
      <div v-if="leaveConfirmVisible" class="leave-confirm-overlay" @click.self="leaveConfirmVisible = false">
        <div class="leave-confirm">
          <h3 class="leave-confirm__title">未保存的更改</h3>
          <p class="leave-confirm__desc">当前页面有未保存的修改，确定要离开吗？</p>
          <footer class="leave-confirm__footer">
            <button type="button" class="agent-btn agent-btn--ghost leave-confirm__cancel" @click="confirmLeave">放弃</button>
            <button type="button" class="agent-btn leave-confirm__ok leave-confirm__ok--danger" @click="leaveConfirmVisible = false">继续编辑</button>
          </footer>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { PERMISSION_TREE, type PermItem } from "../lib/permission";

type DetailMode = "view" | "create" | "edit";

const props = withDefaults(
  defineProps<{
    mode: DetailMode;
    roleId?: string;
    initialName?: string;
    isSystemRole?: boolean;
    initialPerms?: string[];
    existingRoleNames?: string[];
  }>(),
  {
    roleId: "",
    initialName: "",
    isSystemRole: false,
    initialPerms: () => [],
    existingRoleNames: () => []
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
const permissionTree = PERMISSION_TREE;

// Collect all toggleable perm keys (exclude locked)
const getAllKeys = (): string[] => {
  const keys: string[] = [];
  for (const group of permissionTree) {
    if (group.locked) continue;
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
  if (props.isSystemRole && props.initialName === "超级管理员") {
    return new Set(getAllKeys());
  }
  return new Set();
};

const checkedPerms = ref<Set<string>>(initPerms());
const initialPermsSnapshot = new Set(initPerms());

// Track if form has been modified
const isDirty = computed(() => {
  if (roleName.value !== props.initialName) return true;
  if (checkedPerms.value.size !== initialPermsSnapshot.size) return true;
  for (const k of checkedPerms.value) {
    if (!initialPermsSnapshot.has(k)) return true;
  }
  return false;
});

const toggleFeature = (featKey: string, itemKey: string) => {
  const next = new Set(checkedPerms.value);
  if (next.has(featKey)) {
    next.delete(featKey);
    // Auto-uncheck parent item when unchecking the last sub-feature
    const group = permissionTree.find(g => g.children?.some(c => c.key === itemKey));
    const item = group?.children?.find(c => c.key === itemKey);
    if (item?.features) {
      const hasAnyFeature = item.features.some(f => f.key !== featKey && next.has(f.key));
      if (!hasAnyFeature) {
        next.delete(itemKey);
      }
    }
  } else {
    next.add(featKey);
    // Auto-check parent item when checking a feature
    if (!next.has(itemKey)) {
      next.add(itemKey);
    }
  }
  checkedPerms.value = next;
};

const toggleItemWithFeatures = (child: PermItem) => {
  const next = new Set(checkedPerms.value);
  const isChecked = next.has(child.key);
  if (isChecked) {
    next.delete(child.key);
    if (child.features) {
      for (const f of child.features) next.delete(f.key);
    }
  } else {
    next.add(child.key);
    // Auto-check all sub-features when checking parent
    if (child.features) {
      for (const f of child.features) next.add(f.key);
    }
  }
  checkedPerms.value = next;
};

// Leave confirmation
const leaveConfirmVisible = ref(false);

const handleBack = () => {
  if (editable.value && isDirty.value) {
    leaveConfirmVisible.value = true;
  } else {
    emit("back");
  }
};

const confirmLeave = () => {
  leaveConfirmVisible.value = false;
  emit("back");
};

const nameSubmitted = ref(false);

const canSave = computed(() => {
  return roleName.value.trim().length > 0;
});

const handleSave = () => {
  nameSubmitted.value = true;
  if (!canSave.value) return;
  const name = roleName.value.trim();
  // Check duplicate name only on save
  const isDuplicate = props.mode === "edit" && name === props.initialName
    ? false
    : props.existingRoleNames.includes(name);
  if (isDuplicate) {
    emit("toast", "角色名称已存在，请使用其他名称");
    return;
  }
  emit("save", {
    name,
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

.role-detail-page__input-wrap {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.role-detail-page__name-input--error {
  border-color: #ef4444;
}

.role-detail-page__name-error {
  color: #ef4444;
  font-size: 12px;
}

/* Permission table */
.perm-table {
  display: flex;
  flex-direction: column;
}

.perm-group {
  padding: 0;
}

.perm-group--alt {
  background: #f8f9fb;
  border-radius: 8px;
}

/* Locked row (首页 / 会话) */
.perm-locked-row {
  align-items: center;
  display: flex;
  gap: 24px;
  min-height: 44px;
  padding: 10px 16px;
}

.perm-locked-row__title {
  color: #252525;
  font-size: 14px;
  font-weight: 600;
  min-width: 80px;
}

/* Section header */
.perm-section-header {
  align-items: center;
  border-bottom: 1px solid #edf1f5;
  display: flex;
  gap: 6px;
  padding: 12px 16px 8px;
}

.perm-section-header__title {
  color: #252525;
  font-size: 14px;
  font-weight: 600;
}

/* Tooltip */
.perm-section-header__tooltip-wrap {
  display: inline-flex;
  position: relative;
}

.perm-section-header__tooltip-trigger {
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

.perm-section-header__tooltip-content {
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

.perm-section-header__tooltip-content::after {
  border-bottom: 5px solid #222222;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  content: "";
  left: 50%;
  position: absolute;
  top: -5px;
  transform: translateX(-50%);
}

.perm-section-header__tooltip-wrap:hover .perm-section-header__tooltip-content {
  display: block;
}

/* Child row */
.perm-child-row {
  align-items: center;
  border-bottom: 1px solid #edf1f5;
  display: flex;
  gap: 16px;
  min-height: 44px;
  padding: 8px 16px 8px 24px;
}

.perm-child-row:last-child {
  border-bottom: 0;
}

.perm-child-row__item {
  min-width: 140px;
}

.perm-child-row__name {
  color: #252525;
  font-size: 13px;
  font-weight: 500;
}

.perm-child-row__perms {
  align-items: center;
  display: flex;
  gap: 24px;
}

/* Checkbox */
.perm-check {
  align-items: center;
  cursor: pointer;
  display: inline-flex;
  gap: 6px;
}

.perm-check--locked {
  cursor: default;
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

.role-detail-page__footer {
  align-items: center;
  border-top: 1px solid #edf1f5;
  display: flex;
  gap: 12px;
  justify-content: flex-start;
  padding: 14px 28px;
}

/* Leave confirmation modal */
.leave-confirm-overlay {
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  inset: 0;
  justify-content: center;
  position: fixed;
  z-index: 1000;
}

.leave-confirm {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  max-width: 400px;
  padding: 28px 32px 24px;
  width: 90%;
}

.leave-confirm__title {
  color: #252525;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px;
}

.leave-confirm__desc {
  color: #75869c;
  font-size: 14px;
  line-height: 22px;
  margin: 0 0 28px;
}

.leave-confirm__footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.leave-confirm__cancel {
  border: 1px solid #dbe1ea;
  border-radius: 8px;
  font-size: 14px;
  min-width: 72px;
  padding: 8px 20px;
}

.leave-confirm__ok {
  border-radius: 8px;
  font-size: 14px;
  min-width: 96px;
  padding: 8px 20px;
}

.leave-confirm__ok--danger {
  background: #ef4444;
  border-color: #ef4444;
  color: #ffffff;
}
</style>
