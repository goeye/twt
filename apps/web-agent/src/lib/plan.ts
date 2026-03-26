/**
 * 服务版本 & 功能门控注册表
 * 定义免费版 / 专业版功能映射及功能描述
 */

export type PlanLevel = 'free' | 'pro'

/** 所有受版本限制的功能 key */
export const FEATURES = {
  COPILOT_SMART_REPLY: 'copilot-smart-reply',
  TEXT_POLISH: 'text-polish',
  WRITE_TRANSLATE: 'write-translate',
  REMOTE_ASSIST: 'remote-assist',
  CHAT_TRANSLATE: 'chat-translate',
  DOC_KNOWLEDGE: 'doc-knowledge',
  FAQ_KNOWLEDGE: 'faq-knowledge',
  MASS_MESSAGE: 'mass-message',
  PROACTIVE_MARKETING: 'proactive-marketing',
  ROLES_MANAGE: 'roles-manage',
  HIDE_BRANDING: 'hide-branding',
  HIDE_CONTACT: 'hide-contact',
  EVALUATION_ANALYSIS: 'evaluation-analysis',
  TRUSTED_DOMAINS: 'trusted-domains',
  BLACKLIST: 'blacklist',
  DEV_APP_SECRET: 'dev-app-secret',
  WEBHOOKS: 'webhooks',
  AI_AGENT: 'ai-agent',
} as const

export type FeatureKey = (typeof FEATURES)[keyof typeof FEATURES]

/** 功能 → 所需版本（不在此表中的功能默认为 free） */
export const FEATURE_PLAN_MAP: Record<string, PlanLevel> = {
  [FEATURES.COPILOT_SMART_REPLY]: 'pro',
  [FEATURES.TEXT_POLISH]: 'pro',
  [FEATURES.WRITE_TRANSLATE]: 'pro',
  [FEATURES.REMOTE_ASSIST]: 'pro',
  [FEATURES.CHAT_TRANSLATE]: 'pro',
  [FEATURES.DOC_KNOWLEDGE]: 'pro',
  [FEATURES.FAQ_KNOWLEDGE]: 'pro',
  [FEATURES.MASS_MESSAGE]: 'pro',
  [FEATURES.PROACTIVE_MARKETING]: 'pro',
  [FEATURES.ROLES_MANAGE]: 'pro',
  [FEATURES.HIDE_BRANDING]: 'pro',
  [FEATURES.HIDE_CONTACT]: 'pro',
  [FEATURES.EVALUATION_ANALYSIS]: 'pro',
  [FEATURES.TRUSTED_DOMAINS]: 'pro',
  [FEATURES.BLACKLIST]: 'pro',
  [FEATURES.DEV_APP_SECRET]: 'pro',
  [FEATURES.WEBHOOKS]: 'pro',
  [FEATURES.AI_AGENT]: 'pro',
}

/** 功能描述（升级弹窗中展示给超级管理员） */
export const FEATURE_INFO: Record<string, { name: string; description: string }> = {
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
  [FEATURES.DOC_KNOWLEDGE]: {
    name: '文档知识',
    description: '添加文档知识内容，构建智能客服知识体系',
  },
  [FEATURES.FAQ_KNOWLEDGE]: {
    name: '常见问题',
    description: '添加常见问题内容，快速解答访客高频疑问',
  },
  [FEATURES.MASS_MESSAGE]: {
    name: '群发消息',
    description: '向多个访客批量发送消息，高效触达目标用户',
  },
  [FEATURES.PROACTIVE_MARKETING]: {
    name: '主动营销',
    description: '基于访客行为主动发起营销对话，提升转化率',
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
    name: '会话评价',
    description: '深度分析会话评价数据，持续优化服务质量',
  },
  [FEATURES.TRUSTED_DOMAINS]: {
    name: '信任域名',
    description: '配置信任域名白名单，增强安全防护',
  },
  [FEATURES.BLACKLIST]: {
    name: '黑名单',
    description: '管理访客黑名单，屏蔽恶意用户，保障服务质量',
  },
  [FEATURES.DEV_APP_SECRET]: {
    name: '开发设置',
    description: '生成或重置 AppSecret，对接第三方系统和自定义开发',
  },
  [FEATURES.WEBHOOKS]: {
    name: 'Webhooks',
    description: '配置 Webhook 回调，实现事件驱动的系统集成',
  },
  [FEATURES.AI_AGENT]: {
    name: 'Autopilot',
    description: '启用 AI 智能客服，自动处理访客咨询，提升服务效率',
  },
}
