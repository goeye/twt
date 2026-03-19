export interface NavItem {
  key: string;
  label: string;
  icon?: string;
  badge?: number;
}

export type ChannelType = 'web' | 'email';

export interface SessionItem {
  id: string;
  customerName: string;
  preview: string;
  updatedAt: string;
  unreadCount?: number;
  channel?: string;
  channelType?: ChannelType;
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
  role: "agent" | "customer" | "system" | "bot";
  sender: string;
  content: string;
  time: string;
  contentType?: 'text' | 'html';
  subject?: string;
  fromEmail?: string;
  toEmail?: string;
}

export interface TableColumn<T = Record<string, unknown>> {
  key: keyof T | string;
  title: string;
  width?: string;
}
