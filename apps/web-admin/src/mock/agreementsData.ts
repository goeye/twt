/** 协议管理 Mock 数据 */

export interface AgreementRecord {
  id: number;
  type: string;
  language: string;
  creator: string;
  createdAt: string;
}

export const languageOptions = [
  { label: "简体中文", value: "zh-CN" },
  { label: "繁体中文", value: "zh-TW" },
  { label: "English", value: "en" },
  { label: "日本語", value: "ja" },
  { label: "한국어", value: "ko" },
];

export const typeOptions = [
  { label: "全部", value: "all" },
  { label: "用户协议", value: "user" },
  { label: "隐私政策", value: "privacy" },
  { label: "服务条款", value: "service" },
  { label: "Cookie 政策", value: "cookie" },
];

export const agreementsData: AgreementRecord[] = [
  { id: 1, type: "用户协议", language: "简体中文", creator: "张三", createdAt: "2026-02-10 14:30:00" },
  { id: 2, type: "隐私政策", language: "简体中文", creator: "张三", createdAt: "2026-02-10 15:00:00" },
  { id: 3, type: "服务条款", language: "简体中文", creator: "李四", createdAt: "2026-02-12 09:20:00" },
  { id: 4, type: "Cookie 政策", language: "简体中文", creator: "李四", createdAt: "2026-02-12 10:00:00" },
  { id: 5, type: "用户协议", language: "English", creator: "王五", createdAt: "2026-02-15 11:30:00" },
  { id: 6, type: "隐私政策", language: "English", creator: "王五", createdAt: "2026-02-15 12:00:00" },
  { id: 7, type: "服务条款", language: "English", creator: "张三", createdAt: "2026-02-18 16:45:00" },
  { id: 8, type: "用户协议", language: "繁体中文", creator: "李四", createdAt: "2026-02-20 10:10:00" },
  { id: 9, type: "隐私政策", language: "繁体中文", creator: "张三", createdAt: "2026-02-20 10:30:00" },
  { id: 10, type: "用户协议", language: "日本語", creator: "王五", createdAt: "2026-03-01 09:00:00" },
  { id: 11, type: "隐私政策", language: "日本語", creator: "王五", createdAt: "2026-03-01 09:30:00" },
  { id: 12, type: "服务条款", language: "日本語", creator: "李四", createdAt: "2026-03-05 14:00:00" },
];
