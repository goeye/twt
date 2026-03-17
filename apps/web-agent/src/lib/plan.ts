/**
 * 服务版本 & 功能门控注册表
 * 定义免费版 / 专业版功能映射及功能描述
 */

export type PlanLevel = 'free' | 'pro'

/** 所有受版本限制的功能 key */
export const FEATURES = {
  AI_TITLE: 'ai-title',
  COPILOT_SMART_REPLY: 'copilot-smart-reply',
  TEXT_POLISH: 'text-polish',
  WRITE_TRANSLATE: 'write-translate',
  REMOTE_ASSIST: 'remote-assist',
  CHAT_TRANSLATE: 'chat-translate',
  VISITOR_TAGS: 'visitor-tags',
  SESSION_TAGS: 'session-tags',
  KNOWLEDGE_ADD: 'knowledge-add',
  MASS_MESSAGE: 'mass-message',
  PROACTIVE_MARKETING: 'proactive-marketing',
  INITIATE_CHAT: 'initiate-chat',
  CREATE_SESSION: 'create-session',
  ROLES_MANAGE: 'roles-manage',
  HIDE_BRANDING: 'hide-branding',
  HIDE_CONTACT: 'hide-contact',
  EVALUATION_ANALYSIS: 'evaluation-analysis',
  TRUSTED_DOMAINS: 'trusted-domains',
} as const

export type FeatureKey = (typeof FEATURES)[keyof typeof FEATURES]

/** 功能 → 所需版本（不在此表中的功能默认为 free） */
export const FEATURE_PLAN_MAP: Record<string, PlanLevel> = {
  [FEATURES.AI_TITLE]: 'pro',
  [FEATURES.COPILOT_SMART_REPLY]: 'pro',
  [FEATURES.TEXT_POLISH]: 'pro',
  [FEATURES.WRITE_TRANSLATE]: 'pro',
  [FEATURES.REMOTE_ASSIST]: 'pro',
  [FEATURES.CHAT_TRANSLATE]: 'pro',
  [FEATURES.VISITOR_TAGS]: 'pro',
  [FEATURES.SESSION_TAGS]: 'pro',
  [FEATURES.KNOWLEDGE_ADD]: 'pro',
  [FEATURES.MASS_MESSAGE]: 'pro',
  [FEATURES.PROACTIVE_MARKETING]: 'pro',
  [FEATURES.INITIATE_CHAT]: 'pro',
  [FEATURES.CREATE_SESSION]: 'pro',
  [FEATURES.ROLES_MANAGE]: 'pro',
  [FEATURES.HIDE_BRANDING]: 'pro',
  [FEATURES.HIDE_CONTACT]: 'pro',
  [FEATURES.EVALUATION_ANALYSIS]: 'pro',
  [FEATURES.TRUSTED_DOMAINS]: 'pro',
}

/** 功能描述（升级弹窗中展示给超级管理员） */
export const FEATURE_INFO: Record<string, { name: string; description: string }> = {
  [FEATURES.AI_TITLE]: {
    name: 'AI 生成会话标题',
    description: 'AI 根据会话内容自动生成标题，客服端和访客端同步展示并支持二次修改',
  },
  [FEATURES.COPILOT_SMART_REPLY]: {
    name: 'Copilot 智能回复',
    description: 'AI 智能推荐回复内容，提升客服响应速度和服务质量',
  },
  [FEATURES.TEXT_POLISH]: {
    name: '文本润色',
    description: 'AI 自动优化客服回复文本，使表达更专业、更得体',
  },
  [FEATURES.WRITE_TRANSLATE]: {
    name: '边写边译',
    description: '客服发送的消息自动翻译为访客语言，轻松服务全球客户',
  },
  [FEATURES.REMOTE_ASSIST]: {
    name: '远程协助',
    description: '实时查看并协助访客操作页面，快速解决复杂问题',
  },
  [FEATURES.CHAT_TRANSLATE]: {
    name: '聊天翻译',
    description: '自动翻译访客消息，消除语言障碍，无缝沟通',
  },
  [FEATURES.VISITOR_TAGS]: {
    name: '访客标签',
    description: '为访客添加自定义标签，精准分类和管理访客群体',
  },
  [FEATURES.SESSION_TAGS]: {
    name: '会话标签',
    description: '为会话添加分类标签，便于归档检索和数据分析',
  },
  [FEATURES.KNOWLEDGE_ADD]: {
    name: '知识库管理',
    description: '添加常见问题和文档知识，构建智能客服知识体系',
  },
  [FEATURES.MASS_MESSAGE]: {
    name: '群发消息',
    description: '向多个访客批量发送消息，高效触达目标用户',
  },
  [FEATURES.PROACTIVE_MARKETING]: {
    name: '主动营销',
    description: '基于访客行为主动发起营销对话，提升转化率',
  },
  [FEATURES.INITIATE_CHAT]: {
    name: '发起聊天',
    description: '主动向访客、客户或客服发起聊天会话',
  },
  [FEATURES.CREATE_SESSION]: {
    name: '创建会话',
    description: '手动创建新的客服会话，灵活管理服务流程',
  },
  [FEATURES.ROLES_MANAGE]: {
    name: '角色管理',
    description: '创建和编辑自定义角色，精细化团队权限管理',
  },
  [FEATURES.HIDE_BRANDING]: {
    name: '隐藏官方标识',
    description: '移除产品品牌标识，打造专属企业形象',
  },
  [FEATURES.HIDE_CONTACT]: {
    name: '隐藏联系我们',
    description: '隐藏默认联系入口，自定义客户触达方式',
  },
  [FEATURES.EVALUATION_ANALYSIS]: {
    name: '会话评价分析',
    description: '深度分析会话评价数据，持续优化服务质量',
  },
  [FEATURES.TRUSTED_DOMAINS]: {
    name: '信任域名',
    description: '配置信任域名白名单，增强安全防护',
  },
}
