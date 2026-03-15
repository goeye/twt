/**
 * 功能埋点工具模块
 * 开发环境打 console.log，同时存入 localStorage 用于统计
 */

export const TrackEvent = {
  SEND_MESSAGE: 'send_message',
  EMOJI: 'emoji',
  QUICK_REPLY: 'quick_reply',
  ATTACHMENT: 'attachment',
  POLISH: 'polish',
  TRANSLATE: 'translate',
  TRANSFER_SESSION: 'transfer_session',
  ADD_AGENT: 'add_agent',
  CLOSE_SESSION: 'close_session',
  TAKEOVER_AI: 'takeover_ai',
} as const;

export type TrackEventName = (typeof TrackEvent)[keyof typeof TrackEvent];

const STORAGE_KEY = 'twt_track_events';

function getStoredEvents(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function track(event: TrackEventName): void {
  if (import.meta.env.DEV) {
    console.log(`[tracker] ${event}`);
  }

  const stored = getStoredEvents();
  stored[event] = (stored[event] ?? 0) + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
}
