import type { TenantConfig } from './types'
import { getDefaultQuickAccessItems } from './widget'

/**
 * 默认租户配置（TWT）
 */
export const DEFAULT_TENANT_CONFIG: TenantConfig = {
  tenantId: 'default',
  name: 'TWT Chat',
  displayName: 'TWT Chat',
  logo: '/logo.svg',
  favicon: '/favicon.ico',
  primaryColor: '#2F6BFF',
  domains: ['chat.twt.com', 'localhost'],
  legalName: 'TWT Technology Co., Ltd.',
  stripeAccountId: '',

  app: {
    bundleId: 'com.twt.chat',
    packageName: 'com.twt.chat',
    appName: 'TWT Chat',
    appIcon: '/app-icon.png',
    splashScreen: '/splash.png',
  },

  website: {
    heroTitle: 'TWT Chat - 统一客户服务场景的智能客服平台',
    heroSubtitle: '为企业提供全渠道客服解决方案',
    features: [
      {
        title: '全渠道接入',
        description: '支持网页、邮件、社交媒体等多种渠道',
        icon: 'channel',
      },
      {
        title: 'AI 智能助手',
        description: '自动回复、智能推荐、情感分析',
        icon: 'ai',
      },
      {
        title: '数据分析',
        description: '实时数据看板、客户洞察、性能报表',
        icon: 'analytics',
      },
    ],
    footer: {
      companyName: 'TWT Technology Co., Ltd.',
      links: [
        { label: '关于我们', url: '/about' },
        { label: '隐私政策', url: '/privacy' },
        { label: '服务条款', url: '/terms' },
      ],
    },
  },

  email: {
    fromName: 'TWT Chat',
    fromEmail: 'noreply@twt.com',
    replyTo: 'support@twt.com',
  },

  oss: {
    provider: 'aliyun',
    bucket: 'twt-chat',
    region: 'cn-hangzhou',
    accessKeyId: '',
    accessKeySecret: '',
  },

  features: {
    hideOriginalBrand: false,
    customEmailTemplate: false,
    customDomain: false,
    independentApp: false,
  },

  metadata: {
    widget: {
      quickAccessItems: getDefaultQuickAccessItems(),
    },
  },
}

/**
 * 租户配置加载器
 */
export async function loadTenantConfig(): Promise<TenantConfig> {
  const hostname = window.location.hostname

  // 开发环境：直接返回默认配置
  if (import.meta.env.DEV) {
    return DEFAULT_TENANT_CONFIG
  }

  // 生产环境：根据域名加载对应的租户配置
  try {
    // 尝试从静态 JSON 文件加载
    const response = await fetch(`/tenants/${hostname}.json`)
    if (response.ok) {
      return await response.json()
    }
  } catch (error) {
    console.warn('Failed to load tenant config, using default:', error)
  }

  // 降级到默认配置
  return DEFAULT_TENANT_CONFIG
}
