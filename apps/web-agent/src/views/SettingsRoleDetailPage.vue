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
            <div
              v-if="isInlinePermissionGroup(group)"
              class="perm-inline-row"
            >
              <div class="perm-inline-row__title">
                <span class="perm-section-header__title">{{ group.label }}</span>
                <span v-if="group.tooltip" class="perm-section-header__tooltip-wrap">
                  <span class="perm-section-header__tooltip-trigger">?</span>
                  <span class="perm-section-header__tooltip-content">{{ group.tooltip }}</span>
                </span>
              </div>
              <div class="perm-inline-row__perms">
                <label
                  v-for="(feat, featIdx) in getInlinePermissionGroupFeatures(group)"
                  :key="feat.key"
                  class="perm-check"
                  :style="getFeatureGridStyle(feat, featIdx)"
                >
                  <input
                    type="checkbox"
                    :checked="checkedPerms.has(feat.key)"
                    :disabled="!editable || feat.disabledInRoleEditor"
                    @change="toggleFeature(feat.key, getInlinePermissionGroupKey(group))"
                  />
                  <span class="perm-check__label">{{ feat.label }}</span>
                </label>
              </div>
            </div>
            <template v-else>
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
                :class="{ 'perm-child-row--item-hidden': child.hiddenInRoleEditor }"
              >
                <label v-if="!child.hiddenInRoleEditor" class="perm-check perm-child-row__item">
                  <input
                    type="checkbox"
                    :checked="checkedPerms.has(child.key)"
                    :disabled="!editable"
                    @change="toggleItemWithFeatures(child)"
                  />
                  <span class="perm-child-row__name">{{ child.label }}</span>
                </label>
                <div v-else class="perm-child-row__item perm-child-row__item--placeholder" aria-hidden="true" />
                <div class="perm-child-row__perms">
                  <label
                    v-for="(feat, featIdx) in getOrderedFeatures(child)"
                    :key="feat.key"
                    class="perm-check"
                    :style="getFeatureGridStyle(feat, featIdx)"
                  >
                    <input
                      type="checkbox"
                      :checked="checkedPerms.has(feat.key)"
                      :disabled="!editable || feat.disabledInRoleEditor"
                      @change="toggleFeature(feat.key, child.key)"
                    />
                    <span class="perm-check__label">{{ feat.label }}</span>
                  </label>
                </div>
              </div>
            </template>
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
import { PERMISSION_TREE, getScopedToggleableKeys, type PermFeature, type PermItem } from "../lib/permission";

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

const findPermItem = (itemKey: string): PermItem | undefined => {
  for (const group of permissionTree) {
    const item = group.children?.find((child) => child.key === itemKey);
    if (item) {
      return item;
    }
  }
  return undefined;
};

const getInlinePermissionGroupChild = (group: typeof PERMISSION_TREE[number]): PermItem | undefined => {
  if (!group.children || group.children.length !== 1) {
    return undefined;
  }

  const [child] = group.children;
  return child.hiddenInRoleEditor ? child : undefined;
};

const isInlinePermissionGroup = (group: typeof PERMISSION_TREE[number]): boolean =>
  Boolean(getInlinePermissionGroupChild(group));

const getInlinePermissionGroupFeatures = (group: typeof PERMISSION_TREE[number]): PermFeature[] => {
  const child = getInlinePermissionGroupChild(group);
  return child ? getOrderedFeatures(child) : [];
};

const getInlinePermissionGroupKey = (group: typeof PERMISSION_TREE[number]): string => {
  const child = getInlinePermissionGroupChild(group);
  return child?.key ?? "";
};

const getImplicitRoleEditorPermissionKeys = (): string[] => {
  const keys: string[] = [];

  for (const group of permissionTree) {
    for (const item of group.children ?? []) {
      if (!item.hiddenInRoleEditor) {
        continue;
      }

      keys.push(item.key);

      const handledExclusiveGroups = new Set<string>();

      for (const feature of item.features ?? []) {
        if (feature.exclusiveGroup) {
          if (handledExclusiveGroups.has(feature.exclusiveGroup)) {
            continue;
          }

          handledExclusiveGroups.add(feature.exclusiveGroup);

          const preferred =
            item.features?.find(
              (candidate) =>
                candidate.exclusiveGroup === feature.exclusiveGroup && candidate.autoSelect !== false
            ) ??
            item.features?.find((candidate) => candidate.exclusiveGroup === feature.exclusiveGroup);

          if (preferred) {
            keys.push(preferred.key);
          }
          continue;
        }

        if (feature.autoSelect !== false) {
          keys.push(feature.key);
        }
      }
    }
  }

  return Array.from(new Set(keys));
};

const normalizePermissionKeys = (keys: string[]): Set<string> => {
  const next = new Set(
    [...keys, ...getImplicitRoleEditorPermissionKeys()]
  );
  let changed = true;

  while (changed) {
    changed = false;

    for (const group of permissionTree) {
      for (const item of group.children ?? []) {
        const selectedFeatures = (item.features ?? []).filter((feature) => next.has(feature.key));
        if (selectedFeatures.length > 0 && !next.has(item.key)) {
          next.add(item.key);
          changed = true;
        }

        for (const feature of selectedFeatures) {
          for (const requiredKey of feature.requires ?? []) {
            if (!next.has(requiredKey)) {
              next.add(requiredKey);
              changed = true;
            }
          }
        }
      }
    }
  }

  return next;
};

// Initialize checked permissions
const initPerms = (): Set<string> => {
  if (props.initialPerms.length > 0) {
    return normalizePermissionKeys(props.initialPerms);
  }
  if (props.mode === "create") {
    return normalizePermissionKeys([]);
  }
  if (props.isSystemRole && props.initialName === "超级管理员") {
    return normalizePermissionKeys(getScopedToggleableKeys("all"));
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

const getDefaultFeatureKeys = (item: PermItem): string[] => {
  if (!item.features || item.features.length === 0) {
    return [];
  }

  const defaults: string[] = [];
  const handledExclusiveGroups = new Set<string>();

  for (const feature of item.features) {
    if (feature.exclusiveGroup) {
      if (handledExclusiveGroups.has(feature.exclusiveGroup)) {
        continue;
      }

      handledExclusiveGroups.add(feature.exclusiveGroup);

      const preferred =
        item.features.find(
          (candidate) =>
            candidate.exclusiveGroup === feature.exclusiveGroup && candidate.autoSelect !== false
        ) ??
        item.features.find((candidate) => candidate.exclusiveGroup === feature.exclusiveGroup);

      if (preferred) {
        defaults.push(preferred.key);
      }
      continue;
    }

    if (feature.autoSelect !== false) {
      defaults.push(feature.key);
    }
  }

  return defaults;
};

const getOrderedFeatures = (item: PermItem): PermFeature[] => {
  if (!item.features) {
    return [];
  }

  return item.features.filter((feature) => !feature.hiddenInRoleEditor).sort((left, right) => {
    const leftColumn = left.roleEditorColumn ?? Number.MAX_SAFE_INTEGER;
    const rightColumn = right.roleEditorColumn ?? Number.MAX_SAFE_INTEGER;

    if (leftColumn !== rightColumn) {
      return leftColumn - rightColumn;
    }

    const leftIsScope = Boolean(left.scopeLevel);
    const rightIsScope = Boolean(right.scopeLevel);

    if (leftIsScope === rightIsScope) {
      return 0;
    }

    return leftIsScope ? 1 : -1;
  });
};

const getFeatureMeta = (item: PermItem | undefined, featKey: string): PermFeature | undefined =>
  item?.features?.find((feature) => feature.key === featKey);

const getFeatureGridStyle = (_feature: PermFeature, featureIndex: number): { gridColumn: string } => ({
  gridColumn: String(featureIndex + 1),
});

const collectRequiredFeatureKeys = (
  item: PermItem | undefined,
  featKey: string,
  visited = new Set<string>()
): string[] => {
  if (!item || visited.has(featKey)) {
    return [];
  }

  visited.add(featKey);
  const feature = getFeatureMeta(item, featKey);
  if (!feature?.requires?.length) {
    return [];
  }

  const requiredKeys: string[] = [];

  for (const requiredKey of feature.requires) {
    requiredKeys.push(requiredKey);
    requiredKeys.push(...collectRequiredFeatureKeys(item, requiredKey, visited));
  }

  return Array.from(new Set(requiredKeys));
};

const collectDependentFeatureKeys = (
  item: PermItem | undefined,
  featKey: string,
  visited = new Set<string>()
): string[] => {
  if (!item || visited.has(featKey)) {
    return [];
  }

  visited.add(featKey);

  const dependents = (item.features ?? [])
    .filter((feature) => feature.requires?.includes(featKey))
    .map((feature) => feature.key);

  const nested = dependents.flatMap((dependentKey) =>
    collectDependentFeatureKeys(item, dependentKey, visited)
  );

  return Array.from(new Set([...dependents, ...nested]));
};

const toggleFeature = (featKey: string, itemKey: string) => {
  const item = findPermItem(itemKey);
  const feature = getFeatureMeta(item, featKey);
  if (!item || !feature) {
    return;
  }

  const next = new Set(checkedPerms.value);
  if (next.has(featKey)) {
    if (feature.exclusiveGroup) {
      const siblings = item.features?.filter(
        (candidate) => candidate.exclusiveGroup === feature.exclusiveGroup
      ) ?? [];
      const hasOtherSelected = siblings.some(
        (candidate) => candidate.key !== featKey && next.has(candidate.key)
      );

      if (!hasOtherSelected) {
        const hiddenFallback = siblings.find(
          (candidate) => candidate.key !== featKey && candidate.hiddenInRoleEditor
        );

        if (!hiddenFallback) {
          return;
        }

        for (const requiredKey of collectRequiredFeatureKeys(item, hiddenFallback.key)) {
          next.add(requiredKey);
        }
        next.add(hiddenFallback.key);
      }
    }

    for (const dependentKey of collectDependentFeatureKeys(item, featKey)) {
      next.delete(dependentKey);
    }

    next.delete(featKey);
    if (item?.features) {
      const hasAnyFeature = item.features.some((candidate) => next.has(candidate.key));
      if (!hasAnyFeature) {
        next.delete(itemKey);
      }
    }
  } else {
    if (feature.exclusiveGroup) {
      for (const candidate of item.features ?? []) {
        if (candidate.exclusiveGroup === feature.exclusiveGroup) {
          next.delete(candidate.key);
        }
      }
    }

    for (const requiredKey of collectRequiredFeatureKeys(item, featKey)) {
      next.add(requiredKey);
    }

    next.add(featKey);
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
    for (const featureKey of getDefaultFeatureKeys(child)) {
      next.add(featureKey);
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
  --perm-label-column-width: 148px;
  --perm-row-gap: 16px;
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
  column-gap: var(--perm-row-gap);
  display: grid;
  grid-template-columns: var(--perm-label-column-width) minmax(0, 1fr);
  min-height: 44px;
  padding: 10px 16px;
}

.perm-locked-row__title {
  color: #252525;
  font-size: 14px;
  font-weight: 600;
  flex: 0 0 var(--perm-label-column-width);
  min-width: var(--perm-label-column-width);
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

.perm-inline-row {
  align-items: center;
  border-bottom: 1px solid #edf1f5;
  column-gap: var(--perm-row-gap);
  display: grid;
  grid-template-columns: var(--perm-label-column-width) minmax(0, 1fr);
  min-height: 44px;
  padding: 12px 16px 12px 16px;
}

.perm-inline-row__title {
  align-items: center;
  display: flex;
  gap: 6px;
  min-width: 0;
}

.perm-inline-row__perms {
  align-items: center;
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(4, 112px);
  justify-content: start;
  row-gap: 12px;
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
  align-items: start;
  border-bottom: 1px solid #edf1f5;
  column-gap: var(--perm-row-gap);
  display: grid;
  grid-template-columns: var(--perm-label-column-width) minmax(0, 1fr);
  min-height: 44px;
  padding: 12px 16px;
}

.perm-child-row:last-child {
  border-bottom: 0;
}

.perm-child-row--item-hidden {
  align-items: center;
}

.perm-child-row__item {
  min-width: 0;
}

.perm-child-row__item--placeholder {
  pointer-events: none;
}

.perm-child-row__name {
  color: #252525;
  font-size: 13px;
  font-weight: 500;
}

.perm-child-row__perms {
  align-items: center;
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(4, 112px);
  justify-content: start;
  row-gap: 12px;
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

@media (max-width: 1080px) {
  .perm-inline-row {
    align-items: flex-start;
    grid-template-columns: minmax(0, 1fr);
  }

  .perm-locked-row,
  .perm-child-row {
    grid-template-columns: minmax(0, 1fr);
  }

  .perm-inline-row__perms,
  .perm-child-row__perms {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
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
