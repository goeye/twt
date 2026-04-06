import { inject, provide, type InjectionKey } from 'vue'
import type { TenantConfig } from './types'

/**
 * 租户配置的 Injection Key
 */
const TENANT_KEY: InjectionKey<TenantConfig> = Symbol('tenant')

/**
 * 提供租户配置到 Vue 应用
 */
export function provideTenant(config: TenantConfig) {
  provide(TENANT_KEY, config)
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
