/**
 * 实时聊天内容风控模块
 *
 * 两级检测策略：
 * 1. 本地关键词预筛（零成本，过滤 90%+ 无关消息）
 * 2. 模拟 LLM/第三方 API 精确判断（仅对命中预筛的消息调用）
 *
 * 仅检测文本消息 + 文件名，图片/语音/系统消息不检测。
 */

export type RiskCategory = "fund" | "contract" | "personal_info";

export interface RiskRule {
  id: string;
  category: RiskCategory;
  keywords: RegExp;
  alertMessage: string;
  enabled: boolean;
}

export interface RiskDetectionResult {
  hit: boolean;
  ruleId?: string;
  category?: RiskCategory;
  alertMessage?: string;
}

/** 统一风控提示文案 */
const RISK_ALERT_MESSAGE =
  "在聊天过程中，涉及合同汇款、转账、资金、中奖、回款等信息，请仔细核实对方身份，以避免被骗导致钱款损失。";

/** 风控规则定义 */
const riskRules: RiskRule[] = [
  {
    id: "fund_transfer",
    category: "fund",
    keywords:
      /转账|汇款|打款|付款|收款|付钱|打钱|银行卡|bank\s*card|wire\s*transfer|remittance|payment/i,
    alertMessage: RISK_ALERT_MESSAGE,
    enabled: true,
  },
  {
    id: "fund_deposit",
    category: "fund",
    keywords: /定金|预付款|押金|保证金|deposit|advance\s*payment|down\s*payment/i,
    alertMessage: RISK_ALERT_MESSAGE,
    enabled: true,
  },
  {
    id: "fund_account",
    category: "fund",
    keywords:
      /账号|账户|卡号|account\s*number|card\s*number|IBAN|SWIFT|收款码|支付宝|微信支付|PayPal/i,
    alertMessage: RISK_ALERT_MESSAGE,
    enabled: true,
  },
  {
    id: "contract_sign",
    category: "contract",
    keywords: /合同|签约|协议|签署|contract|agreement|sign/i,
    alertMessage: RISK_ALERT_MESSAGE,
    enabled: true,
  },
  {
    id: "personal_id",
    category: "personal_info",
    keywords: /身份证|护照|驾照|ID\s*card|passport|driver.?s?\s*licen[sc]e|SSN|社保号/i,
    alertMessage: RISK_ALERT_MESSAGE,
    enabled: true,
  },
];

/** 风险分类标签映射 */
export const riskCategoryLabels: Record<RiskCategory, string> = {
  fund: "资金类",
  contract: "合同类",
  personal_info: "个人信息类",
};

/**
 * 去重记录：同一会话中同一规则在冷却时间内不重复触发。
 * key = ruleId, value = 上次触发时间戳
 */
const recentAlerts = new Map<string, number>();
const COOLDOWN_MS = 5 * 60 * 1000; // 5 分钟冷却

function isInCooldown(ruleId: string): boolean {
  const lastTime = recentAlerts.get(ruleId);
  if (!lastTime) return false;
  return Date.now() - lastTime < COOLDOWN_MS;
}

function recordAlert(ruleId: string): void {
  recentAlerts.set(ruleId, Date.now());
}

/** 清空去重记录（会话重置时调用） */
export function resetRiskAlerts(): void {
  recentAlerts.clear();
}

/**
 * 第一级：本地关键词预筛
 */
function preFilter(text: string): RiskRule | null {
  for (const rule of riskRules) {
    if (!rule.enabled) continue;
    if (rule.keywords.test(text)) {
      return rule;
    }
  }
  return null;
}

/**
 * 第二级：模拟 LLM / 第三方 API 精确判断
 *
 * 在实际接入时，替换为真实的 API 调用。
 * 当前 MVP 阶段直接返回 true（即预筛命中即视为风险）。
 */
async function llmVerify(
  _text: string,
  _rule: RiskRule
): Promise<boolean> {
  // TODO: 接入真实 LLM / 第三方风控 API
  // const response = await fetch('/api/risk-check', { ... })
  // return response.json().then(r => r.isRisky)
  return true;
}

/**
 * 检测文本内容是否命中风控规则
 *
 * @param text - 消息文本内容
 * @returns 检测结果，hit=true 时附带规则信息和提醒文案
 */
export async function detectRisk(text: string): Promise<RiskDetectionResult> {
  if (!text || !text.trim()) {
    return { hit: false };
  }

  // 第一级：关键词预筛
  const matchedRule = preFilter(text);
  if (!matchedRule) {
    return { hit: false };
  }

  // 去重检查
  if (isInCooldown(matchedRule.id)) {
    return { hit: false };
  }

  // 第二级：LLM 精确判断
  const confirmed = await llmVerify(text, matchedRule);
  if (!confirmed) {
    return { hit: false };
  }

  // 记录触发，防止短时间重复提醒
  recordAlert(matchedRule.id);

  return {
    hit: true,
    ruleId: matchedRule.id,
    category: matchedRule.category,
    alertMessage: matchedRule.alertMessage,
  };
}
