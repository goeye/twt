import { loadStoredAiAgentSettings, resolveAiAgentProfile } from "./aiAgentSettings";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface StaffAgent {
  name: string;
  avatarText: string;
  avatarColor: string;
  avatarUrl?: string;
  role?: string;
}

export interface ArchiveAgent {
  id: string;
  name: string;
  online: boolean;
  avatarText: string;
  avatarColor: string;
}

export interface ArchivePreviewMessage {
  id: string;
  role: "agent" | "customer" | "system";
  sender: string;
  content: string;
  time: string;
  avatarText?: string;
  avatarColor?: string;
  avatarUrl?: string;
}

/* ------------------------------------------------------------------ */
/*  AI Agent profile (resolved once at module level)                    */
/* ------------------------------------------------------------------ */

const aiAgentProfile = resolveAiAgentProfile(loadStoredAiAgentSettings());
export const aiAgentArchiveName = aiAgentProfile.name;

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

export const archiveAgentPool: ArchiveAgent[] = [
  { id: "ag-1", name: "客服主管", online: true, avatarText: "主", avatarColor: "linear-gradient(135deg, #2f6bff 0%, #69a1ff 100%)" },
  { id: "ag-2", name: "王珂", online: true, avatarText: "王", avatarColor: "linear-gradient(135deg, #7f6bff 0%, #a259ff 100%)" },
  { id: "ag-3", name: "刘昊", online: true, avatarText: "刘", avatarColor: "linear-gradient(135deg, #ff7d00 0%, #ffb15d 100%)" },
  { id: "ag-4", name: "陈悦", online: true, avatarText: "陈", avatarColor: "linear-gradient(135deg, #00c2b8 0%, #00a0cc 100%)" },
  { id: "ag-5", name: "李想", online: true, avatarText: "李", avatarColor: "linear-gradient(135deg, #00b578 0%, #00a66f 100%)" },
  { id: "ag-6", name: "张明", online: false, avatarText: "张", avatarColor: "#a7b0c0" },
  { id: "ag-7", name: "林晓", online: false, avatarText: "林", avatarColor: "#a7b0c0" }
];

export const ownerPool = ["客服主管", "王珂", "刘昊", "陈悦", "李想"];

/* ------------------------------------------------------------------ */
/*  Functions                                                          */
/* ------------------------------------------------------------------ */

export const getArchiveAgentProfile = (name: string) => {
  if (name === aiAgentArchiveName) {
    return {
      avatarText: aiAgentProfile.avatarText,
      avatarColor: aiAgentProfile.avatarColor,
      avatarUrl: aiAgentProfile.avatarUrl
    };
  }

  const agent = archiveAgentPool.find((item) => item.name === name);
  const fallbackText = name.slice(0, 1) || "客";
  return {
    avatarText: agent?.avatarText ?? fallbackText,
    avatarColor: agent?.avatarColor ?? "linear-gradient(135deg, #2f6bff 0%, #69a1ff 100%)",
    avatarUrl: ""
  };
};

export const formatDateTime = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hour}:${minute}`;
};

export const formatDuration = (minutes: number, seconds?: number) => {
  if (seconds && seconds > 0) {
    return `${seconds}秒`;
  }

  const days = Math.floor(minutes / (24 * 60));
  const hours = Math.floor((minutes % (24 * 60)) / 60);
  const remainMinutes = minutes % 60;
  const parts: string[] = [];

  if (days > 0) parts.push(`${days}天`);
  if (hours > 0) parts.push(`${hours}小时`);
  if (remainMinutes > 0 || parts.length === 0) parts.push(`${remainMinutes}分`);

  return parts.join(" ");
};

export const buildDurationPayload = (index: number) => {
  if (index % 11 === 0) {
    return { minutes: 11 * 24 * 60 + 49 };
  }
  if (index % 9 === 0) {
    return { minutes: 29 * 24 * 60 + 7 * 60 + 46 };
  }
  if (index % 7 === 0) {
    return { minutes: 31 * 24 * 60 + 60 + 6 };
  }
  if (index % 5 === 0) {
    return { minutes: 0, seconds: 20 };
  }
  if (index % 4 === 0) {
    return { minutes: 0, seconds: 4 };
  }
  if (index % 3 === 0) {
    return { minutes: 0, seconds: 3 };
  }
  return { minutes: 11 * 24 * 60 + 3 * 60 + 58 };
};

export interface KWICResult {
  snippet: string;
  hasPrefix: boolean;
  hasSuffix: boolean;
  keywordStart: number;
  keywordEnd: number;
}

export const extractKWIC = (
  text: string,
  keyword: string,
  contextLength: number = 30
): KWICResult => {
  const lowerText = text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase();
  const index = lowerText.indexOf(lowerKeyword);

  if (index === -1) {
    return {
      snippet: text.slice(0, contextLength * 2),
      hasPrefix: false,
      hasSuffix: text.length > contextLength * 2,
      keywordStart: -1,
      keywordEnd: -1,
    };
  }

  const start = Math.max(0, index - contextLength);
  const end = Math.min(text.length, index + keyword.length + contextLength);

  return {
    snippet: text.slice(start, end),
    hasPrefix: start > 0,
    hasSuffix: end < text.length,
    keywordStart: index - start,
    keywordEnd: index - start + keyword.length,
  };
};
