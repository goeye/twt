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
  exclusiveGroup?: string
  autoSelect?: boolean
  disabledInRoleEditor?: boolean
  hiddenInRoleEditor?: boolean
  roleEditorColumn?: number
  requires?: string[]
  scopeLevel?: 'personal' | 'robot' | 'all'
}

export interface PermItem {
  key: string
  label: string
  hiddenInRoleEditor?: boolean
  features?: PermFeature[]
}

export interface PermGroup {
  key: string
  label: string
  locked?: boolean
  lockedLabel?: string
  tooltip?: string
  children?: PermItem[]
}

// ---- 权限树定义（单一数据源） ----

export const PERMISSION_TREE: PermGroup[] = [
  {
    key: 'home',
    label: '首页',
    locked: true,
    lockedLabel: '查看',
  },
  {
    key: 'conversation',
    label: '会话',
    children: [
      {
        key: 'conversation-online',
        label: '会话',
        hiddenInRoleEditor: true,
        features: [
          {
            key: 'conversation-online-manage',
            label: '管理',
            autoSelect: true,
            disabledInRoleEditor: true,
            roleEditorColumn: 1,
          },
          {
            key: 'conversation-online-scope-personal',
            label: '个人数据',
            exclusiveGroup: 'conversation-online-scope',
            autoSelect: true,
            hiddenInRoleEditor: true,
            requires: ['conversation-online-manage'],
            scopeLevel: 'personal',
          },
          {
            key: 'conversation-online-scope-all',
            label: '全员数据',
            autoSelect: false,
            roleEditorColumn: 2,
            requires: ['conversation-online-manage'],
            scopeLevel: 'all',
          },
          {
            key: 'conversation-online-scope-robot',
            label: 'Autopilot数据',
            autoSelect: false,
            roleEditorColumn: 3,
            requires: ['conversation-online-manage'],
            scopeLevel: 'robot',
          },
        ],
      },
    ],
  },
  {
    key: 'archive',
    label: '档案',
    children: [
      {
        key: 'archive-conversation',
        label: '会话记录',
        features: [
          {
            key: 'archive-conversation-scope-personal',
            label: '个人数据',
            exclusiveGroup: 'archive-conversation-scope',
            autoSelect: true,
            hiddenInRoleEditor: true,
            scopeLevel: 'personal',
          },
          {
            key: 'archive-conversation-scope-all',
            label: '全员数据',
            exclusiveGroup: 'archive-conversation-scope',
            autoSelect: false,
            roleEditorColumn: 2,
            scopeLevel: 'all',
          },
          {
            key: 'archive-conversation-claim',
            label: '管理',
            autoSelect: false,
            roleEditorColumn: 1,
          },
          {
            key: 'archive-conversation-assign',
            label: 'Autopilot数据',
            autoSelect: false,
            roleEditorColumn: 3,
          },
        ],
      },
      {
        key: 'archive-chat',
        label: '聊天记录',
        features: [
          {
            key: 'archive-chat-manage',
            label: '管理',
            autoSelect: false,
            roleEditorColumn: 1,
          },
          {
            key: 'archive-chat-scope-personal',
            label: '个人数据',
            exclusiveGroup: 'archive-chat-scope',
            autoSelect: true,
            hiddenInRoleEditor: true,
            scopeLevel: 'personal',
          },
          {
            key: 'archive-chat-scope-all',
            label: '全员数据',
            exclusiveGroup: 'archive-chat-scope',
            autoSelect: false,
            roleEditorColumn: 2,
            scopeLevel: 'all',
          },
        ],
      },
    ],
  },
  {
    key: 'visitor',
    label: '访客',
    children: [
      { key: 'visitor-online', label: '在线访客', features: [{ key: 'visitor-online-manage', label: '管理' }] },
      { key: 'visitor-all', label: '全部访客', features: [{ key: 'visitor-all-manage', label: '管理' }] },
    ],
  },
  {
    key: 'customer',
    label: '客户',
    tooltip: '仅在接入客户标识后启用客户模块',
    children: [
      { key: 'customer-online', label: '在线客户', features: [{ key: 'customer-online-manage', label: '管理' }] },
      { key: 'customer-all', label: '全部客户', features: [{ key: 'customer-all-manage', label: '管理' }] },
    ],
  },
  {
    key: 'campaign',
    label: '营销',
    children: [
      { key: 'campaign-mass', label: '群发消息', features: [{ key: 'campaign-mass-manage', label: '管理' }] },
      { key: 'campaign-proactive', label: '主动营销', features: [{ key: 'campaign-proactive-manage', label: '管理' }] },
    ],
  },
  {
    key: 'report',
    label: '报表',
    children: [
      { key: 'report-manual', label: '人工客服', features: [{ key: 'report-manual-view', label: '查看' }] },
      { key: 'report-autopilot', label: 'Autopilot', features: [{ key: 'report-autopilot-view', label: '查看' }] },
      { key: 'report-evaluation', label: '会话评价', features: [{ key: 'report-evaluation-view', label: '查看' }] },
    ],
  },
  {
    key: 'ai-agent',
    label: 'AI Agent',
    children: [
      { key: 'ai-doc', label: '文档知识', features: [{ key: 'ai-doc-manage', label: '管理' }] },
      { key: 'ai-faq', label: '常见问题', features: [{ key: 'ai-faq-manage', label: '管理' }] },
      { key: 'ai-copilot', label: 'Copilot', features: [{ key: 'ai-copilot-manage', label: '管理' }] },
      { key: 'ai-agent-settings', label: 'Autopilot', features: [{ key: 'ai-agent-settings-manage', label: '管理' }] },
    ],
  },
  {
    key: 'team',
    label: '团队',
    children: [
      { key: 'agent', label: '成员', features: [{ key: 'agent-manage', label: '管理' }] },
      { key: 'role', label: '角色', features: [{ key: 'role-manage', label: '管理' }] },
      { key: 'team-settings', label: '成员设置', features: [{ key: 'team-settings-manage', label: '管理' }] },
    ],
  },
  {
    key: 'quick-reply',
    label: '快捷回复',
    children: [
      { key: 'public-reply', label: '公共回复', features: [{ key: 'public-reply-manage', label: '管理' }] },
      { key: 'personal-reply', label: '个人回复', features: [{ key: 'personal-reply-manage', label: '管理' }] },
    ],
  },
  {
    key: 'tags',
    label: '标签',
    children: [
      { key: 'visitor-tags', label: '访客标签', features: [{ key: 'visitor-tags-manage', label: '管理' }] },
      { key: 'conversation-tags', label: '会话标签', features: [{ key: 'conversation-tags-manage', label: '管理' }] },
    ],
  },
  {
    key: 'install',
    label: '网页',
    children: [
      { key: 'website-code', label: '网站代码', features: [{ key: 'website-code-view', label: '查看' }] },
      { key: 'chat-page', label: '聊天页面', features: [{ key: 'chat-page-view', label: '查看' }] },
      { key: 'customize', label: '自定义', features: [{ key: 'customize-manage', label: '管理' }] },
    ],
  },
  {
    key: 'email-channel-group',
    label: 'Email 渠道',
    children: [
      { key: 'email-channel', label: 'Email', features: [{ key: 'email-channel-manage', label: '管理' }] },
    ],
  },
  {
    key: 'security',
    label: '安全',
    children: [
      { key: 'blacklist', label: '黑名单', features: [{ key: 'blacklist-manage', label: '管理' }] },
      { key: 'trusted-domains', label: '信任域名', features: [{ key: 'trusted-domains-manage', label: '管理' }] },
    ],
  },
  {
    key: 'dev-settings',
    label: '开发设置',
    children: [
      { key: 'dev-settings-page', label: '开发设置', features: [{ key: 'dev-settings-page-manage', label: '管理' }] },
      { key: 'webhooks', label: 'Webhooks', features: [{ key: 'webhooks-manage', label: '管理' }] },
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
  'ai-agent': 'ai-agent',
  settings: 'team',
}

// ---- 侧边栏导航 key → 权限 key 映射（导航过滤查此表） ----

export const NAV_PERMISSION_MAP: Record<string, string> = {
  files: 'archive',
  visitors: 'visitor',
  customer: 'customer',
  campaign: 'campaign',
  report: 'report',
  'ai-agent': 'ai-agent',
}

// ---- 设置页子导航 group key → 权限 key 映射 ----

export const SETTINGS_NAV_PERMISSION_MAP: Record<string, string> = {
  'channel-group': 'install',
  'team-group': 'team',
  'quick-reply-group': 'quick-reply',
  'idle-conversation-group': 'team',
  'tags-group': 'tags',
  'security-group': 'security',
  'dev-settings-group': 'dev-settings',
}

// ---- 工具函数 ----

/** 从权限树中收集所有可勾选的权限 key（排除 locked） */
export function getAllToggleableKeys(): string[] {
  const keys: string[] = []
  for (const group of PERMISSION_TREE) {
    if (group.locked) continue
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

export function getScopedPermissionKeys(scopePreference: 'personal' | 'robot' | 'all' = 'all'): string[] {
  const keys: string[] = []

  for (const group of PERMISSION_TREE) {
    keys.push(group.key)

    if (!group.children) continue

    for (const item of group.children) {
      keys.push(item.key)

      if (!item.features) continue

      const resolvedExclusiveGroups = new Set<string>()

      for (const feat of item.features) {
        if (!feat.exclusiveGroup) {
          keys.push(feat.key)
          continue
        }

        if (resolvedExclusiveGroups.has(feat.exclusiveGroup)) {
          continue
        }

        resolvedExclusiveGroups.add(feat.exclusiveGroup)

        const candidates = item.features.filter(
          (candidate) => candidate.exclusiveGroup === feat.exclusiveGroup
        )

        const preferred =
          candidates.find((candidate) => candidate.scopeLevel === scopePreference) ??
          candidates.find((candidate) => candidate.autoSelect !== false) ??
          candidates[0]

        if (preferred) {
          keys.push(preferred.key)
        }
      }
    }
  }

  return keys
}

export function getScopedToggleableKeys(scopePreference: 'personal' | 'robot' | 'all' = 'all'): string[] {
  const keys: string[] = []

  for (const group of PERMISSION_TREE) {
    if (group.locked || !group.children) continue

    for (const item of group.children) {
      keys.push(item.key)

      if (!item.features) continue

      const resolvedExclusiveGroups = new Set<string>()

      for (const feat of item.features) {
        if (!feat.exclusiveGroup) {
          keys.push(feat.key)
          continue
        }

        if (resolvedExclusiveGroups.has(feat.exclusiveGroup)) {
          continue
        }

        resolvedExclusiveGroups.add(feat.exclusiveGroup)

        const candidates = item.features.filter(
          (candidate) => candidate.exclusiveGroup === feat.exclusiveGroup
        )

        const preferred =
          candidates.find((candidate) => candidate.scopeLevel === scopePreference) ??
          candidates.find((candidate) => candidate.autoSelect !== false) ??
          candidates[0]

        if (preferred) {
          keys.push(preferred.key)
        }
      }
    }
  }

  return keys
}
