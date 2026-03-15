/** 功能统计 Mock 数据 */

export interface FeatureStatRow {
  key: string;
  rank: number;
  name: string;
  eventKey: string;
  count: number;
  ratio: string;
}

export const featureRanking: FeatureStatRow[] = [
  { key: "1",  rank: 1,  name: "快捷回复",        eventKey: "quick_reply",       count: 3_842, ratio: "20.5%" },
  { key: "2",  rank: 2,  name: "帮我润色",        eventKey: "polish",            count: 2_890, ratio: "15.4%" },
  { key: "3",  rank: 3,  name: "丰富内容",        eventKey: "enrich_content",    count: 2_456, ratio: "13.1%" },
  { key: "4",  rank: 4,  name: "精简内容",        eventKey: "simplify_content",  count: 2_108, ratio: "11.2%" },
  { key: "5",  rank: 5,  name: "Copilot推荐回复", eventKey: "copilot_suggest",   count: 1_832, ratio: "9.8%" },
  { key: "6",  rank: 6,  name: "远程协助",        eventKey: "remote_assist",     count: 1_124, ratio: "6.0%" },
  { key: "7",  rank: 7,  name: "添加客服",        eventKey: "add_agent",         count: 876,   ratio: "4.7%" },
  { key: "8",  rank: 8,  name: "转移会话",        eventKey: "transfer_session",  count: 754,   ratio: "4.0%" },
  { key: "9",  rank: 9,  name: "结束会话",        eventKey: "close_session",     count: 682,   ratio: "3.6%" },
  { key: "10", rank: 10, name: "发起聊天",        eventKey: "start_chat",        count: 612,   ratio: "3.3%" },
  { key: "11", rank: 11, name: "标记为待处理",    eventKey: "mark_pending",      count: 548,   ratio: "2.9%" },
  { key: "12", rank: 12, name: "移出待处理",      eventKey: "unmark_pending",    count: 421,   ratio: "2.2%" },
];

/** 功能趋势时间序列（近 7 天，前 5 功能） */
export const featureTrendDays = ["2026-03-09", "2026-03-10", "2026-03-11", "2026-03-12", "2026-03-13", "2026-03-14", "2026-03-15"];

export const featureTrends: Record<string, number[]> = {
  quick_reply:      [480, 540, 610, 520, 680, 560, 452],
  polish:           [350, 400, 460, 380, 520, 430, 350],
  enrich_content:   [280, 340, 410, 330, 470, 390, 236],
  simplify_content: [240, 290, 350, 280, 400, 320, 228],
  copilot_suggest:  [200, 250, 310, 260, 350, 280, 182],
};

export const featureTrendLabels: Record<string, string> = {
  quick_reply: "快捷回复",
  polish: "帮我润色",
  enrich_content: "丰富内容",
  simplify_content: "精简内容",
  copilot_suggest: "Copilot推荐回复",
};

export const featureTrendColors: Record<string, string> = {
  quick_reply: "#4e83fd",
  polish: "#eb2f96",
  enrich_content: "#fa8c16",
  simplify_content: "#722ed1",
  copilot_suggest: "#52c41a",
};
