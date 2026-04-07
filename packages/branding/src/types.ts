/**
 * 租户配置类型定义
 */
export type QuickAccessActionType = 'link' | 'copy' | 'message'

export interface QuickAccessItem {
  id: string
  label: string
  url: string
  icon?: string
  actionType?: QuickAccessActionType
  faqId?: string
}

export interface TenantWidgetMetadata {
  quickAccessItems?: QuickAccessItem[]
}

export type TenantMetadata = Record<string, any> & {
  widget?: TenantWidgetMetadata
}

export interface TenantConfig {
  tenantId: string
  name: string              // 品牌名称
  displayName: string       // 显示名称
  logo: string              // logo URL 或 data URI
  favicon: string           // favicon URL
  primaryColor: string      // 主色
  domains: string[]         // 绑定的域名
  legalName: string         // 法律实体名称
  stripeAccountId: string   // Stripe Connect 账号 ID

  // APP 配置
  app: {
    bundleId: string        // iOS Bundle ID
    packageName: string     // Android Package Name
    appName: string         // APP 名称
    appIcon: string         // APP 图标
    splashScreen: string    // 启动页
    appleTeamId?: string    // Apple 开发者团队 ID
    googlePlayAccount?: string  // Google Play 账号
  }

  // 官网配置
  website: {
    heroTitle: string       // 首页标题
    heroSubtitle: string    // 首页副标题
    features: Array<{       // 功能列表
      title: string
      description: string
      icon: string
    }>
    footer: {               // 页脚配置
      companyName: string
      links: Array<{
        label: string
        url: string
      }>
    }
  }

  // 邮件配置
  email: {
    fromName: string        // 发件人名称
    fromEmail: string       // 发件人邮箱
    replyTo: string         // 回复邮箱
    smtpConfig?: {          // SMTP 配置（可选）
      host: string
      port: number
      username: string
      password: string
    }
  }

  // OSS 配置
  oss: {
    provider: 'aliyun' | 'aws' | 'qiniu'
    bucket: string
    region: string
    accessKeyId: string
    accessKeySecret: string
  }

  features: {               // 功能开关
    hideOriginalBrand: boolean
    customEmailTemplate: boolean
    customDomain: boolean
    independentApp: boolean  // 是否有独立 APP
  }

  metadata: TenantMetadata  // 扩展字段
}
