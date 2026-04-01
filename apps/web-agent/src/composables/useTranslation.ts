import type { MessageItem } from '@twt/ui-agent';
import { mockBatchTranslate } from '../lib/mockTranslationApi';

const STORAGE_KEY = 'twt:translation-session-switches';

function loadSessionSwitches(): Record<string, boolean> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveSessionSwitches(switches: Record<string, boolean>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(switches));
  } catch {
    // 静默失败
  }
}

export function useTranslation() {
  function getSessionSwitch(sessionId: string): boolean {
    const switches = loadSessionSwitches();
    return switches[sessionId] ?? true;
  }

  function setSessionSwitch(sessionId: string, enabled: boolean): void {
    const switches = loadSessionSwitches();
    switches[sessionId] = enabled;
    saveSessionSwitches(switches);
  }

  async function autoTranslateMessages(
    sessionId: string,
    messages: MessageItem[],
    targetLang: string,
    onUpdate: (messageId: string, translation: MessageItem['translation']) => void
  ): Promise<void> {
    const untranslatedIds = messages
      .filter(msg => msg.role === 'customer' && (!msg.translation || msg.translation.status === 'idle'))
      .map(msg => msg.id);

    if (untranslatedIds.length === 0) return;

    untranslatedIds.forEach(id => {
      onUpdate(id, { status: 'translating', targetLang });
    });

    const getMessageContent = (messageId: string) => {
      return messages.find(m => m.id === messageId)?.content;
    };

    await mockBatchTranslate(
      { messageIds: untranslatedIds, targetLang, sessionId },
      (result) => {
        if (result.status === 'completed') {
          onUpdate(result.messageId, {
            status: 'completed',
            result: result.result,
            targetLang
          });
        } else {
          onUpdate(result.messageId, {
            status: 'failed',
            error: result.error,
            targetLang
          });
        }
      },
      getMessageContent
    );
  }

  async function retryTranslation(
    messageId: string,
    content: string,
    targetLang: string,
    onUpdate: (translation: MessageItem['translation']) => void
  ): Promise<void> {
    onUpdate({ status: 'translating', targetLang });

    await mockBatchTranslate(
      { messageIds: [messageId], targetLang, sessionId: '' },
      (result) => {
        if (result.status === 'completed') {
          onUpdate({
            status: 'completed',
            result: result.result,
            targetLang
          });
        } else {
          onUpdate({
            status: 'failed',
            error: result.error,
            targetLang
          });
        }
      },
      () => content
    );
  }

  return {
    getSessionSwitch,
    setSessionSwitch,
    autoTranslateMessages,
    retryTranslation,
  };
}
