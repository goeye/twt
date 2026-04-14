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

export interface QuickAccessEntry {
  id: string;
  label: string;
  faqId: string;
}

const STORAGE_KEY = "twt_faq_list";
const QUICK_ACCESS_STORAGE_KEY = "twt_quick_access_items";

export function loadFaqList(): FaqItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to load FAQ list:", error);
  }
  return [{ id: 1, question: "退款吗?", answer: "不退款", updatedAt: "2026-03-17 15:12", statusType: "success", statusLabel: "已完成" }];
}

export function saveFaqList(list: FaqItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (error) {
    console.error("Failed to save FAQ list:", error);
  }
}

export function deleteFaqById(id: number): FaqItem[] {
  const list = loadFaqList();
  const updated = list.filter((item) => item.id !== id);
  saveFaqList(updated);
  return updated;
}

export function isFaqExists(id: number | string): boolean {
  const list = loadFaqList();
  const numId = typeof id === "string" ? parseInt(id, 10) : id;
  return list.some((item) => item.id === numId);
}

export function getFaqOptions(): Array<{ id: string; title: string }> {
  return loadFaqList().map((item) => ({ id: String(item.id), title: item.question }));
}

export function saveQuickAccessEntries(entries: QuickAccessEntry[]): void {
  try {
    localStorage.setItem(QUICK_ACCESS_STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error("Failed to save quick access entries:", error);
  }
}

export function getQuickAccessByFaqId(faqId: number | string): QuickAccessEntry[] {
  try {
    const stored = localStorage.getItem(QUICK_ACCESS_STORAGE_KEY);
    if (!stored) return [];
    const entries: QuickAccessEntry[] = JSON.parse(stored);
    return entries.filter((e) => e.faqId === String(faqId));
  } catch {
    return [];
  }
}
