export interface NavItem {
  key: string;
  label: string;
  icon?: string;
  badge?: number;
}

export interface SessionItem {
  id: string;
  customerName: string;
  preview: string;
  updatedAt: string;
  unreadCount?: number;
  channel?: string;
  active?: boolean;
}

export interface SessionQueueItem {
  key: string;
  label: string;
  count?: number;
  leadingEmoji?: string;
  icon?: string;
}

export interface SessionQueueGroup {
  key: string;
  title: string;
  items: SessionQueueItem[];
}

export interface MessageItem {
  id: string;
  role: "agent" | "customer" | "system";
  sender: string;
  content: string;
  time: string;
}

export interface TableColumn<T = Record<string, unknown>> {
  key: keyof T | string;
  title: string;
  width?: string;
}
