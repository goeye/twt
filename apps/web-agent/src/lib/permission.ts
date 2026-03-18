/**
 * 角色权限注册表
 *
 * 定义权限树结构、路由-权限映射、导航-权限映射。
 * 与服务版本门控（plan.ts）正交：plan 管"版本是否允许"，permission 管"角色是否允许"。
 */

// ---- 权限树类型 ----

export interface PermFeature {
  key: string
  label: string
  locked?: boolean
}

export interface PermItem {
  key: string
  label: string
  locked?: boolean
  features?: PermFeature[]
}

export interface PermGroup {
  key: string
  label: string
  locked?: boolean
  tooltip?: string
  children?: PermItem[]
}

// ---- 权限树定义（单一数据源） ----

export const PERMISSION_TREE: PermGroup[] = [
  {
    key: 'home',
    label: '首页',
    locked: true,
  },
  {
    key: 'conversation',
    label: '会话',
    locked: true,
  },
  {
    key: 'archive',
    label: '档案',
    children: [
      { key: 'archive-view', label: '查看档案' },
      { key: 'archive-manage', label: '管理档案' },
    ],
  },
  {
    key: 'visitor',
    label: '访客',
    children: [
      { key: 'visitor-view', label: '查看访客', locked: true },
      { key: 'visitor-manage', label: '管理访客' },
    ],
  },
  {
    key: 'customer',
    label: '客户',
    tooltip: '仅在接入客户标识后启用客户模块',
    children: [
      { key: 'customer-view', label: '查看客户', locked: true },
      { key: 'customer-manage', label: '管理客户' },
    ],
  },
  {
    key: 'report',
    label: '报表',
    children: [
      { key: 'report-view', label: '查看报表' },
    ],
  },
  {
    key: 'campaign',
    label: '营销',
    children: [
      { key: 'campaign-view', label: '查看营销', locked: true },
      { key: 'campaign-manage', label: '管理营销' },
    ],
  },
  {
    key: 'quick-reply',
    label: '快捷回复',
    children: [
      {
        key: 'public-reply',
        label: '公共回复',
        features: [
          { key: 'public-reply-view', label: '查看公共回复', locked: true },
          { key: 'public-reply-manage', label: '管理公共回复' },
        ],
      },
      {
        key: 'personal-reply',
        label: '个人回复',
        features: [
          { key: 'personal-reply-view', label: '查看个人回复', locked: true },
          { key: 'personal-reply-manage', label: '管理个人回复' },
        ],
      },
    ],
  },
  {
    key: 'tags',
    label: '标签',
    children: [
      { key: 'tags-view', label: '查看标签', locked: true },
      { key: 'tags-manage', label: '管理标签' },
    ],
  },
  {
    key: 'team',
    label: '团队',
    children: [
      {
        key: 'agent',
        label: '成员',
        features: [
          { key: 'agent-list-view', label: '查看成员' },
          { key: 'agent-manage', label: '管理成员' },
        ],
      },
      {
        key: 'role',
        label: '角色',
        features: [
          { key: 'role-manage', label: '管理角色' },
        ],
      },
      {
        key: 'team-settings',
        label: '成员设置',
        features: [
          { key: 'team-settings-manage', label: '管理成员设置' },
        ],
      },
    ],
  },
  {
    key: 'install',
    label: '安装',
    children: [
      { key: 'install-view-code', label: '查看网站代码' },
      { key: 'install-view-chat', label: '查看聊天页面' },
      { key: 'install-manage-custom', label: '管理自定义' },
    ],
  },
  {
    key: 'settings',
    label: '设置',
    children: [
      { key: 'security-manage', label: '管理安全' },
      { key: 'dev-settings-manage', label: '管理开发设置' },
    ],
  },
]

// ---- 锁定权限（所有角色都拥有，不可配置） ----

export const LOCKED_PERMISSIONS: string[] = ['home', 'conversation']

// ---- 路由名称 → 权限 key 映射（路由守卫查此表） ----

export const ROUTE_PERMISSION_MAP: Record<string, string> = {
  files: 'archive',
  visitors: 'visitor',
  customer: 'customer',
  campaign: 'campaign',
  report: 'report',
  'ai-agent': 'settings',
  settings: 'settings',
}

// ---- 侧边栏导航 key → 权限 key 映射（导航过滤查此表） ----

export const NAV_PERMISSION_MAP: Record<string, string> = {
  files: 'archive',
  visitors: 'visitor',
  customer: 'customer',
  campaign: 'campaign',
  report: 'report',
  'ai-agent': 'settings',
}

// ---- 设置页子导航 group key → 权限 key 映射 ----

export const SETTINGS_NAV_PERMISSION_MAP: Record<string, string> = {
  'install-group': 'install',
  'team-group': 'team',
  'quick-reply-group': 'quick-reply',
  'tags-group': 'tags',
  'security-group': 'settings',
  'dev-settings-group': 'settings',
  'roles-group': 'team',
}

// ---- 工具函数 ----

/** 从权限树中收集所有可勾选的权限 key（排除 locked） */
export function getAllToggleableKeys(): string[] {
  const keys: string[] = []
  for (const group of PERMISSION_TREE) {
    if (group.locked) continue
    keys.push(group.key)
    if (group.children) {
      for (const item of group.children) {
        if (!item.locked) keys.push(item.key)
        if (item.features) {
          for (const feat of item.features) {
            if (!feat.locked) keys.push(feat.key)
          }
        }
      }
    }
  }
  return keys
}

/** 收集所有权限 key（包括 locked） */
export function getAllPermissionKeys(): string[] {
  const keys: string[] = []
  for (const group of PERMISSION_TREE) {
    keys.push(group.key)
    if (group.children) {
      for (const item of group.children) {
        keys.push(item.key)
        if (item.features) {
          for (const feat of item.features) {
            keys.push(feat.key)
          }
        }
      }
    }
  }
  return keys
}
