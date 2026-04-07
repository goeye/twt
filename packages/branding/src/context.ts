import { inject, type App, type InjectionKey } from 'vue'
import type { TenantConfig } from './types'

const TENANT_KEY: InjectionKey<TenantConfig> = Symbol('tenant')

export function provideTenant(app: App, config: TenantConfig) {
  app.provide(TENANT_KEY, config)
}

/**
 * 在组件中使用租户配置
 */
export function useTenant(): TenantConfig {
  const tenant = inject(TENANT_KEY)
  if (!tenant) {
    throw new Error('Tenant config not provided. Make sure to call provideTenant() in your app setup.')
  }
  return tenant
}
