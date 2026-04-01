import { reactive, computed } from 'vue'
import { FEATURE_PLAN_MAP, FEATURE_INFO } from '../lib/plan'
import type { PlanLevel, FeatureKey } from '../lib/plan'

/** 弹窗状态 */
export interface UpgradeModalState {
  visible: boolean
  featureKey: string
  featureName: string
  featureDescription: string
  isAdmin: boolean
}

/** 租户服务版本信息 */
interface PlanState {
  level: PlanLevel
  expireAt: string | null
  isExpired: boolean
}

// ---- Mock 数据（后续替换为后端接口） ----
const currentPlan = reactive<PlanState>({
  level: 'pro',
  expireAt: null,
  isExpired: false,
})

// Mock: 当前用户是否为超级管理员
const currentUserIsAdmin = true

// 全局弹窗状态
const upgradeModalState = reactive<UpgradeModalState>({
  visible: false,
  featureKey: '',
  featureName: '',
  featureDescription: '',
  isAdmin: false,
})

/**
 * 服务版本门控 composable
 */
export function usePlan() {
  /** 当前生效版本（过期则视为 free） */
  const effectiveLevel = computed<PlanLevel>(() => {
    if (currentPlan.isExpired) return 'free'
    return currentPlan.level
  })

  /** 检查功能是否可用 */
  function canUse(featureKey: string): boolean {
    const requiredLevel = FEATURE_PLAN_MAP[featureKey]
    if (!requiredLevel || requiredLevel === 'free') return true
    return effectiveLevel.value === 'pro'
  }

  /** 触发升级提示弹窗（根据角色自动适配内容） */
  function showUpgradePrompt(featureKey: string) {
    const info = FEATURE_INFO[featureKey]
    upgradeModalState.visible = true
    upgradeModalState.featureKey = featureKey
    upgradeModalState.featureName = info?.name ?? '此功能'
    upgradeModalState.featureDescription = info?.description ?? ''
    upgradeModalState.isAdmin = currentUserIsAdmin
  }

  /** 关闭弹窗 */
  function closeUpgradeModal() {
    upgradeModalState.visible = false
  }

  /** 便捷方法：如果功能不可用则弹窗并返回 false */
  function guardFeature(featureKey: string): boolean {
    if (canUse(featureKey)) return true
    showUpgradePrompt(featureKey)
    return false
  }

  // ---- 开发调试用 ----
  function setPlanLevel(level: PlanLevel) {
    currentPlan.level = level
    currentPlan.isExpired = false
  }

  function setExpired(expired: boolean) {
    currentPlan.isExpired = expired
  }

  return {
    currentPlan,
    effectiveLevel,
    upgradeModalState,
    canUse,
    showUpgradePrompt,
    closeUpgradeModal,
    guardFeature,
    setPlanLevel,
    setExpired,
  }
}
