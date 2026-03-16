/** 敏感词管理 Mock 数据 */

export type SensitiveCategory = "fund" | "contract" | "personal_info";

export interface SensitiveWordRecord {
  id: number;
  word: string;
  category: SensitiveCategory;
  creator: string;
  createdAt: string;
}

export const categoryOptions = [
  { label: "全部", value: "all" },
  { label: "资金类", value: "fund" },
  { label: "合同类", value: "contract" },
  { label: "个人信息类", value: "personal_info" },
];

export const categoryLabelMap: Record<SensitiveCategory, string> = {
  fund: "资金类",
  contract: "合同类",
  personal_info: "个人信息类",
};

/** 关键词从 riskControl.ts 提取 */
export const sensitiveWordsData: SensitiveWordRecord[] = [
  { id: 1, word: "转账", category: "fund", creator: "傅晓康", createdAt: "2026-01-10 10:00:00" },
  { id: 2, word: "汇款", category: "fund", creator: "傅晓康", createdAt: "2026-01-10 10:05:00" },
  { id: 3, word: "打款", category: "fund", creator: "傅晓康", createdAt: "2026-01-10 10:10:00" },
  { id: 4, word: "银行卡", category: "fund", creator: "傅晓康", createdAt: "2026-01-10 10:15:00" },
  { id: 5, word: "定金", category: "fund", creator: "马素强", createdAt: "2026-01-15 14:30:00" },
  { id: 6, word: "预付款", category: "fund", creator: "马素强", createdAt: "2026-01-15 14:30:00" },
  { id: 7, word: "押金", category: "fund", creator: "马素强", createdAt: "2026-01-15 14:35:00" },
  { id: 8, word: "保证金", category: "fund", creator: "马素强", createdAt: "2026-01-15 14:35:00" },
  { id: 9, word: "账号", category: "fund", creator: "傅晓康", createdAt: "2026-01-10 10:20:00" },
  { id: 10, word: "支付宝", category: "fund", creator: "李四", createdAt: "2026-02-01 09:00:00" },
  { id: 11, word: "微信支付", category: "fund", creator: "李四", createdAt: "2026-02-01 09:00:00" },
  { id: 12, word: "PayPal", category: "fund", creator: "李四", createdAt: "2026-02-01 09:05:00" },
  { id: 13, word: "合同", category: "contract", creator: "傅晓康", createdAt: "2026-01-10 10:25:00" },
  { id: 14, word: "签约", category: "contract", creator: "傅晓康", createdAt: "2026-01-10 10:30:00" },
  { id: 15, word: "协议", category: "contract", creator: "傅晓康", createdAt: "2026-01-10 10:35:00" },
  { id: 16, word: "签署", category: "contract", creator: "马素强", createdAt: "2026-01-20 11:00:00" },
  { id: 17, word: "身份证", category: "personal_info", creator: "傅晓康", createdAt: "2026-01-10 10:40:00" },
  { id: 18, word: "护照", category: "personal_info", creator: "傅晓康", createdAt: "2026-01-10 10:45:00" },
  { id: 19, word: "驾照", category: "personal_info", creator: "傅晓康", createdAt: "2026-01-10 10:50:00" },
  { id: 20, word: "社保号", category: "personal_info", creator: "王五", createdAt: "2026-02-10 16:00:00" },
];
