/**
 * 角色权限 composable
 *
 * 管理当前用户的角色权限状态，提供权限检查、路由守卫和导航过滤能力。
 * 与 usePlan 正交：usePlan 管"版本是否允许"，usePermission 管"角色是否允许"。
 */
import { reactive, computed } from 'vue'
import {
  ROUTE_PERMISSION_MAP,
  NAV_PERMISSION_MAP,
  SETTINGS_NAV_PERMISSION_MAP,
  LOCKED_PERMISSIONS,
  getAllPermissionKeys,
  getScopedPermissionKeys,
} from '../lib/permission'

// ---- Mock 角色预设 ----

export type MockRole = 'admin' | 'agent' | 'limited'

const MOCK_ROLE_PRESETS: Record<MockRole, () => string[]> = {
  admin: () => getScopedPermissionKeys('all'),
  agent: () => [
    'home', 'conversation',
    'conversation-online', 'conversation-online-manage', 'conversation-online-scope-personal',
    'archive', 'archive-conversation', 'archive-conversation-scope-personal', 'archive-conversation-claim',
    'archive-chat', 'archive-chat-manage', 'archive-chat-scope-personal',
    'visitor', 'visitor-online', 'visitor-online-manage',
    'customer', 'customer-online', 'customer-online-manage',
    'campaign', 'campaign-mass', 'campaign-mass-manage',
    'quick-reply',
    'public-reply', 'public-reply-manage',
    'personal-reply', 'personal-reply-manage',
    'tags', 'visitor-tags', 'visitor-tags-manage',
  ],
  limited: () => [
    'home', 'conversation',
    'conversation-online', 'conversation-online-manage', 'conversation-online-scope-personal',
    'archive', 'archive-conversation', 'archive-conversation-scope-personal',
  ],
}

const MOCK_ROLE_LABELS: Record<MockRole, string> = {
  admin: '管理员',
  agent: '成员',
  limited: '受限',
}

// ---- 模块级单例状态 ----

interface PermissionState {
  permissions: Set<string>
  version: number
  currentMockRole: MockRole
}

const state = reactive<PermissionState>({
  permissions: new Set(getAllPermissionKeys()),
  version: 0,
  currentMockRole: 'admin',
})

const modalState = reactive({
  visible: false,
})

let lastSnapshot: Set<string> = new Set(state.permissions)

// ---- Mock API ----

/** 模拟从后端获取最新权限（真实场景替换为 GET /api/me/permissions） */
async function fetchPermissions(): Promise<string[]> {
  return Array.from(state.permissions)
}

// ---- Composable ----

export function usePermission() {
  const permissions = computed(() => {
    void state.version
    return state.permissions
  })

  const currentMockRole = computed(() => state.currentMockRole)
  const currentMockRoleLabel = computed(() => MOCK_ROLE_LABELS[state.currentMockRole])

  /** 检查是否拥有某个权限 */
  function hasPermission(key: string): boolean {
    if (LOCKED_PERMISSIONS.includes(key)) return true
    return state.permissions.has(key)
  }

  /** 检查路由是否有权访问 */
  function canAccessRoute(routeName: string): boolean {
    const requiredPerm = ROUTE_PERMISSION_MAP[routeName]
    if (!requiredPerm) return true
    return hasPermission(requiredPerm)
  }

  /** 检查侧边栏导航项是否应显示 */
  function canShowNavItem(navKey: string): boolean {
    const requiredPerm = NAV_PERMISSION_MAP[navKey]
    if (!requiredPerm) return true
    return hasPermission(requiredPerm)
  }

  /** 检查设置页子导航分组是否应显示 */
  function canShowSettingsGroup(groupKey: string): boolean {
    const requiredPerm = SETTINGS_NAV_PERMISSION_MAP[groupKey]
    if (!requiredPerm) return true
    return hasPermission(requiredPerm)
  }

  /**
   * 刷新权限并检测变更
   * 返回被撤销和新授予的权限 key
   */
  async function refreshPermissions(): Promise<{ revoked: string[]; granted: string[] }> {
    const fresh = await fetchPermissions()
    const freshSet = new Set(fresh)

    const revoked: string[] = []
    const granted: string[] = []

    for (const key of lastSnapshot) {
      if (!freshSet.has(key)) revoked.push(key)
    }
    for (const key of freshSet) {
      if (!lastSnapshot.has(key)) granted.push(key)
    }

    // 仅在权限实际变化时更新状态，避免不必要的响应式重渲染
    if (revoked.length > 0 || granted.length > 0) {
      state.permissions = freshSet
      state.version++
    }
    lastSnapshot = new Set(freshSet)

    return { revoked, granted }
  }

  /** 显示权限变更弹窗 */
  function showPermissionChangedModal() {
    modalState.visible = true
  }

  /** 关闭权限变更弹窗 */
  function closePermissionChangedModal() {
    modalState.visible = false
  }

  /** 页面内操作的权限守卫：检查当前页面权限是否仍有效，无效则弹窗 */
  function guardCurrentRoute(routeName: string): boolean {
    if (canAccessRoute(routeName)) return true
    showPermissionChangedModal()
    return false
  }

  // ---- 开发调试 ----

  /** 按预设角色切换权限 */
  function setMockRole(role: MockRole) {
    const perms = MOCK_ROLE_PRESETS[role]()
    lastSnapshot = new Set(state.permissions)
    state.permissions = new Set(perms)
    state.currentMockRole = role
    state.version++
  }

  /** 自定义权限集合 */
  function setPermissions(keys: string[]) {
    lastSnapshot = new Set(state.permissions)
    state.permissions = new Set(keys)
    state.version++
  }

  return {
    permissions,
    modalState,
    currentMockRole,
    currentMockRoleLabel,
    hasPermission,
    canAccessRoute,
    canShowNavItem,
    canShowSettingsGroup,
    refreshPermissions,
    showPermissionChangedModal,
    closePermissionChangedModal,
    guardCurrentRoute,
    setMockRole,
    setPermissions,
  }
}
