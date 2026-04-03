/**
 * 常见问题数据管理
 * 用于 AI Agent 常见问题页面和快捷入口功能的数据共享
 */

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  updatedAt: string;
  statusType: "success" | "pending" | "error";
  statusLabel: string;
}

const STORAGE_KEY = "twt_faq_list";

/**
 * 加载常见问题列表
 */
export function loadFaqList(): FaqItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load FAQ list:", error);
  }

  // 默认数据
  return [
    {
      id: 1,
      question: "退款吗?",
      answer: "不退款",
      updatedAt: "2026-03-17 15:12",
      statusType: "success",
      statusLabel: "已完成"
    }
  ];
}

/**
 * 保存常见问题列表
 */
export function saveFaqList(list: FaqItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (error) {
    console.error("Failed to save FAQ list:", error);
  }
}

/**
 * 删除常见问题
 */
export function deleteFaqById(id: number): FaqItem[] {
  const list = loadFaqList();
  const updated = list.filter((item) => item.id !== id);
  saveFaqList(updated);
  return updated;
}

/**
 * 检查常见问题是否存在
 */
export function isFaqExists(id: number | string): boolean {
  const list = loadFaqList();
  const numId = typeof id === "string" ? parseInt(id, 10) : id;
  return list.some((item) => item.id === numId);
}

/**
 * 获取常见问题选项（用于下拉选择）
 */
export function getFaqOptions(): Array<{ id: string; title: string }> {
  const list = loadFaqList();
  return list.map((item) => ({
    id: String(item.id),
    title: item.question
  }));
}
