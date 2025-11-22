import { streamText } from 'ai';
import { getGoogleProvider, geminiModel } from '@/src/config/ai-config';
import { generateSystemPrompt } from '@/src/services/prompt-service';
import { logger } from '@/src/services/logger';

// Simple in-memory rate limiter (Token Bucket)
// Note: In serverless environments, this state might reset, but it's sufficient for basic burst protection.
class RateLimiter {
  private tokens: Map<string, number>;
  private lastRefill: Map<string, number>;
  private maxTokens: number;
  private refillRate: number; // tokens per second

  constructor(maxTokens: number, refillRate: number) {
    this.tokens = new Map();
    this.lastRefill = new Map();
    this.maxTokens = maxTokens;
    this.refillRate = refillRate;
  }

  check(key: string): boolean {
    const now = Date.now();
    const lastRefillTime = this.lastRefill.get(key) || now;
    let currentTokens = this.tokens.get(key) || this.maxTokens;

    // Refill tokens
    const timePassed = (now - lastRefillTime) / 1000;
    const newTokens = timePassed * this.refillRate;
    currentTokens = Math.min(this.maxTokens, currentTokens + newTokens);

    if (currentTokens >= 1) {
      this.tokens.set(key, currentTokens - 1);
      this.lastRefill.set(key, now);
      return true;
    }

    return false;
  }
}

// Allow 10 requests per minute (burst of 5)
const limiter = new RateLimiter(5, 10 / 60);

export async function POST(req: Request) {
  const start = Date.now();
  try {
    // Rate Limiting Check
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (!limiter.check(ip)) {
      logger.api('/api/chat', 'POST', 429, Date.now() - start, { ip });
      return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || '';
    logger.api('/api/chat', 'POST', 202, undefined, { 
      ip, 
      messageCount: messages.length,
      lastMessageSnippet: lastMessage.slice(0, 50) 
    });

    const google = getGoogleProvider();
    
    // Dynamically generate the system prompt (includes updated stories, persona, and context)
    const systemPrompt = generateSystemPrompt();

    const result = await streamText({
      model: google(geminiModel),
      system: systemPrompt,
      messages,
      onFinish: (completion) => {
         logger.api('/api/chat', 'STREAM_COMPLETE', 200, Date.now() - start, {
            completionLength: completion.text.length,
            finishReason: completion.finishReason
         });
      },
    });

    return result.toTextStreamResponse();
  } catch (error) {
    logger.error('Chat API Error', error, { endpoint: '/api/chat' });
    logger.api('/api/chat', 'POST', 500, Date.now() - start, { error: String(error) });
    return new Response(JSON.stringify({ error: 'Failed to process chat request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
