export interface NavItem {
  key: string;
  label: string;
  icon?: string;
  badge?: number;
}

export type ChannelType = 'web' | 'widget' | 'email';

export interface MessageTranslation {
  status: 'idle' | 'translating' | 'completed' | 'failed';
  result?: string;
  targetLang?: string;
  error?: string;
}

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

export interface SessionQueueGroupAction {
  key: string;
  label: string;
  icon?: string;
  text?: string;
}

export interface SessionQueueGroup {
  key: string;
  title: string;
  items: SessionQueueItem[];
  actions?: SessionQueueGroupAction[];
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
  sendStatus?: 'sending' | 'failed' | 'sent';
  translation?: MessageTranslation;
  isNote?: boolean;
}

export interface TableColumn<T = Record<string, unknown>> {
  key: keyof T | string;
  title: string;
  width?: string;
}

export interface QuickReplyImage {
  url: string;
  name: string;
}

export interface QuickReplyItem {
  id: string;
  tag: string;
  reply: string;
  images: QuickReplyImage[];
}

export interface QuickReplyCategory {
  key: string;
  label: string;
  type: 'group' | 'tag';
  items: QuickReplyItem[];
}
