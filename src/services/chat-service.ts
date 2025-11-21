import { logger } from '@/src/services/logger';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Manually streams chat completion from the backend.
 * Adopted from Aether architecture.
 */
export async function streamChatCompletion(
  history: ChatMessage[],
  onChunk: (chunk: string) => void
): Promise<string> {
  logger.info('[ChatService] Sending request to LLM...');
  const start = Date.now();
  
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    if (!response.body) {
      throw new Error('No response body');
    }

    let assistantMessage = '';
    const stream = response.body;
    const reader = stream.getReader();
    const decoder = new TextDecoder();

    while(true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      const chunk = decoder.decode(value, { stream: true });
      assistantMessage += chunk;
      onChunk(chunk);
    }

    logger.info('[ChatService] Response finished', {
      textLength: assistantMessage.length,
      totalDurationMs: Date.now() - start,
    });

    return assistantMessage;
  } catch (e: any) {
    logger.error('[ChatService] Failed to send request', e, { error: e.message });
    throw e;
  }
}
