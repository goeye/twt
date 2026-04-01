export interface TranslationRequest {
  messageIds: string[];
  targetLang: string;
  sessionId: string;
}

export interface TranslationResult {
  messageId: string;
  status: 'completed' | 'failed';
  result?: string;
  error?: string;
}

const BATCH_SIZE = 50;
const MIN_DELAY = 1000;
const MAX_DELAY = 2000;
const FAILURE_RATE = 0.1;

function getRandomDelay(): number {
  return Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY + 1)) + MIN_DELAY;
}

function shouldFail(): boolean {
  return Math.random() < FAILURE_RATE;
}

function mockTranslateText(text: string, targetLang: string): string {
  return `${text}`;
}

export async function mockBatchTranslate(
  request: TranslationRequest,
  onProgress: (result: TranslationResult) => void,
  getMessageContent: (messageId: string) => string | undefined
): Promise<void> {
  const { messageIds, targetLang } = request;

  const reversedIds = [...messageIds].reverse();

  const batches: string[][] = [];
  for (let i = 0; i < reversedIds.length; i += BATCH_SIZE) {
    batches.push(reversedIds.slice(i, i + BATCH_SIZE));
  }

  for (const batch of batches) {
    await Promise.all(
      batch.map(async (messageId) => {
        await new Promise(resolve => setTimeout(resolve, getRandomDelay()));

        const content = getMessageContent(messageId);
        if (!content || content.trim() === '' || /^[\d\s]+$/.test(content) || /^[\p{Emoji}\s]+$/u.test(content)) {
          return;
        }

        if (shouldFail()) {
          onProgress({
            messageId,
            status: 'failed',
            error: '翻译服务暂时不可用'
          });
        } else {
          onProgress({
            messageId,
            status: 'completed',
            result: mockTranslateText(content, targetLang)
          });
        }
      })
    );
  }
}
