/** 数据看板 Mock 数据 */

export interface TotalCard {
  label: string;
  value: number;
  icon: string;
  color: string;
  bg: string;
}

/** 累计总量卡片 — 2 行 × 4 列 */
export const totalCards: TotalCard[] = [
  { label: "总项目数", value: 534, icon: "project", color: "#4e83fd", bg: "#eef3ff" },
  { label: "总客服数量", value: 653, icon: "headset", color: "#ff7d52", bg: "#fff2ed" },
  { label: "总有效项目", value: 173, icon: "check-circle", color: "#36cfc9", bg: "#e8fffe" },
  { label: "总付费项目", value: 141, icon: "pay", color: "#4e83fd", bg: "#eef3ff" },
  { label: "总访客数", value: 12_919, icon: "team", color: "#4e83fd", bg: "#eef3ff" },
  { label: "总客户数", value: 5_016, icon: "user", color: "#8c8c8c", bg: "#f5f5f5" },
  { label: "总会话数", value: 3_982, icon: "message", color: "#4e83fd", bg: "#eef3ff" },
  { label: "总聊天数", value: 5_616, icon: "chat", color: "#ff4d8b", bg: "#fff0f5" },
];

export interface OverviewCard {
  label: string;
  value: number;
  icon: string;
  color: string;
  bg: string;
}

/** 数据概览卡片 — 1 行 × 6 列 */
export const overviewCards: OverviewCard[] = [
  { label: "新增项目", value: 14, icon: "folder-add", color: "#4e83fd", bg: "#eef3ff" },
  { label: "有效项目", value: 4, icon: "check", color: "#333", bg: "#f5f5f5" },
  { label: "新增付费项目", value: 5, icon: "pay", color: "#4e83fd", bg: "#eef3ff" },
  { label: "会话数", value: 69, icon: "message", color: "#36cfc9", bg: "#e8fffe" },
  { label: "聊天数量", value: 44, icon: "chat", color: "#ff9c52", bg: "#fff6ed" },
  { label: "活跃客服", value: 37, icon: "headset", color: "#9270f0", bg: "#f3edff" },
];

/** 趋势分析 — 切换维度 */
export const trendTabs = ["会话数", "聊天数", "新增项目"];

/** 趋势数据（近 7 天） */
export const trendDays = [
  "2026-03-09",
  "2026-03-10",
  "2026-03-11",
  "2026-03-12",
  "2026-03-13",
  "2026-03-14",
  "2026-03-15",
];

/** 各维度趋势值 */
export const trendDataMap: Record<string, number[]> = {
  会话数: [38, 12, 9, 10, 8, 5, 2],
  聊天数: [45, 30, 22, 18, 14, 10, 6],
  新增项目: [8, 5, 4, 3, 2, 1, 1],
};
