/** 预警提示 Mock 数据 */

export type AlertCategory = "fund" | "contract" | "personal_info";

export interface AlertRecord {
  id: number;
  sessionId: string;
  visitor: string;
  triggerRule: string;
  category: AlertCategory;
  triggerTime: string;
  alertContent: string;
}

export const alertCategoryOptions = [
  { label: "全部", value: "all" },
  { label: "资金类", value: "fund" },
  { label: "合同类", value: "contract" },
  { label: "个人信息类", value: "personal_info" },
];

export const alertCategoryLabelMap: Record<AlertCategory, string> = {
  fund: "资金类",
  contract: "合同类",
  personal_info: "个人信息类",
};

export const alertCategoryColorMap: Record<AlertCategory, string> = {
  fund: "red",
  contract: "orange",
  personal_info: "blue",
};

export const alertsData: AlertRecord[] = [
  {
    id: 1,
    sessionId: "S20260310001",
    visitor: "访客_A8x3k",
    triggerRule: "转账关键词检测",
    category: "fund",
    triggerTime: "2026-03-10 09:12:34",
    alertContent: '消息中包含"转账"相关敏感词',
  },
  {
    id: 2,
    sessionId: "S20260310002",
    visitor: "访客_B2m7p",
    triggerRule: "银行卡号检测",
    category: "fund",
    triggerTime: "2026-03-10 10:45:12",
    alertContent: '消息中包含"银行卡"相关敏感词',
  },
  {
    id: 3,
    sessionId: "S20260311001",
    visitor: "访客_C9n1z",
    triggerRule: "合同签署检测",
    category: "contract",
    triggerTime: "2026-03-11 14:23:08",
    alertContent: '消息中包含"合同"相关敏感词',
  },
  {
    id: 4,
    sessionId: "S20260311002",
    visitor: "访客_D4q8r",
    triggerRule: "身份证信息检测",
    category: "personal_info",
    triggerTime: "2026-03-11 16:05:41",
    alertContent: '消息中包含"身份证"相关敏感词',
  },
  {
    id: 5,
    sessionId: "S20260312001",
    visitor: "访客_E7w2t",
    triggerRule: "定金汇款检测",
    category: "fund",
    triggerTime: "2026-03-12 08:30:55",
    alertContent: '消息中包含"定金"相关敏感词',
  },
  {
    id: 6,
    sessionId: "S20260312002",
    visitor: "访客_F1y5h",
    triggerRule: "护照信息检测",
    category: "personal_info",
    triggerTime: "2026-03-12 11:18:29",
    alertContent: '消息中包含"护照"相关敏感词',
  },
  {
    id: 7,
    sessionId: "S20260313001",
    visitor: "访客_G3u6k",
    triggerRule: "支付账号检测",
    category: "fund",
    triggerTime: "2026-03-13 09:44:17",
    alertContent: '消息中包含"账号"相关敏感词',
  },
  {
    id: 8,
    sessionId: "S20260313002",
    visitor: "访客_H8i0m",
    triggerRule: "签约协议检测",
    category: "contract",
    triggerTime: "2026-03-13 13:56:03",
    alertContent: '消息中包含"签约"相关敏感词',
  },
  {
    id: 9,
    sessionId: "S20260314001",
    visitor: "访客_I2o4n",
    triggerRule: "押金保证金检测",
    category: "fund",
    triggerTime: "2026-03-14 10:22:48",
    alertContent: '消息中包含"押金"相关敏感词',
  },
  {
    id: 10,
    sessionId: "S20260314002",
    visitor: "访客_J5e9x",
    triggerRule: "驾照信息检测",
    category: "personal_info",
    triggerTime: "2026-03-14 15:07:36",
    alertContent: '消息中包含"驾照"相关敏感词',
  },
  {
    id: 11,
    sessionId: "S20260315001",
    visitor: "访客_K6a1w",
    triggerRule: "汇款转账检测",
    category: "fund",
    triggerTime: "2026-03-15 08:55:22",
    alertContent: '消息中包含"汇款"相关敏感词',
  },
  {
    id: 12,
    sessionId: "S20260315002",
    visitor: "访客_L0c3v",
    triggerRule: "合同条款检测",
    category: "contract",
    triggerTime: "2026-03-15 14:33:19",
    alertContent: '消息中包含"协议"相关敏感词',
  },
  {
    id: 13,
    sessionId: "S20260316001",
    visitor: "访客_M7b8s",
    triggerRule: "PayPal 账户检测",
    category: "fund",
    triggerTime: "2026-03-16 09:10:05",
    alertContent: '消息中包含"PayPal"相关敏感词',
  },
  {
    id: 14,
    sessionId: "S20260316002",
    visitor: "访客_N4d2f",
    triggerRule: "社保号信息检测",
    category: "personal_info",
    triggerTime: "2026-03-16 11:42:51",
    alertContent: '消息中包含"社保号"相关敏感词',
  },
  {
    id: 15,
    sessionId: "S20260316003",
    visitor: "访客_O9g5j",
    triggerRule: "预付款检测",
    category: "fund",
    triggerTime: "2026-03-16 14:28:37",
    alertContent: '消息中包含"预付款"相关敏感词',
  },
];
