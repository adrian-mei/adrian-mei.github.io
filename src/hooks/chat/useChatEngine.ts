import { useState, useCallback, useEffect } from 'react';
import { getHardcodedResponse } from '@/src/data/chat-scripts';
import { ChatMessage, streamChatCompletion } from '@/src/services/chat-service';
import { logger } from '@/src/services/logger';

const STORAGE_KEYS = {
  COUNT: 'chat_storage_count',
  LIMIT_REACHED_AT: 'chat_storage_limit_reached_at',
  MESSAGES: 'chat_storage_history'
};

const LIMITS = {
  MAX_MESSAGES: 20,
  MAX_CHARS: 500,
  COOLDOWN_MS: 4 * 60 * 60 * 1000 // 4 hours
};

export const useChatEngine = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Rate limiting state
  const [messageCount, setMessageCount] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);

  // Initialize state from localStorage
  useEffect(() => {
    // 1. Restore Rate Limit State
    const savedCount = parseInt(localStorage.getItem(STORAGE_KEYS.COUNT) || '0');
    const limitReachedAt = localStorage.getItem(STORAGE_KEYS.LIMIT_REACHED_AT);

    if (limitReachedAt) {
      const timePassed = Date.now() - parseInt(limitReachedAt);
      if (timePassed < LIMITS.COOLDOWN_MS) {
        setIsRateLimited(true);
        setMessageCount(LIMITS.MAX_MESSAGES);
      } else {
        // Cooldown expired, reset
        localStorage.removeItem(STORAGE_KEYS.LIMIT_REACHED_AT);
        localStorage.setItem(STORAGE_KEYS.COUNT, '0');
        setMessageCount(0);
        setIsRateLimited(false);
      }
    } else {
      setMessageCount(savedCount);
    }

    // 2. Restore Messages
    const savedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Failed to parse chat history:', e);
        localStorage.removeItem(STORAGE_KEYS.MESSAGES);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    }
  }, [messages]);

  // Manual Initialization of Welcome Message (Only if history is empty)
  useEffect(() => {
    // We check if localStorage has NO history, and messages are empty.
    // This prevents overwriting restored history with just the welcome message during the initial render cycle.
    const hasHistory = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    
    if (messages.length === 0 && !hasHistory) {
      const welcomeMsg: ChatMessage = {
        id: 'welcome',
        role: 'assistant', 
        content: "Hi there! I'm Adrian's AI. To help me tailor our conversation, could you tell me who I'm speaking with?"
      };
      setMessages([welcomeMsg]);
    }
  }, [messages.length]);

  // Unified Send Message Logic
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    // 1. Check Wall of Text
    if (content.length > LIMITS.MAX_CHARS) {
      const warningMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I appreciate your enthusiasm, but that message is a bit too long for me to process! Could you please condense it to under 500 characters?"
      };
      // Add user message but don't process it, just respond with warning
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content }, warningMsg]);
      setInput('');
      return;
    }

    // 2. Check Rate Limit
    if (isRateLimited || messageCount >= LIMITS.MAX_MESSAGES) {
      // If not already marked as limited in state (e.g. just hit the limit), update storage
      if (!isRateLimited) {
        setIsRateLimited(true);
        localStorage.setItem(STORAGE_KEYS.LIMIT_REACHED_AT, Date.now().toString());
      }

      const limitMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I've really enjoyed our chat! However, I need to take a short break. Please come back again later.\n\nPlease feel free to explore the other pages of the site to learn more about Adrian.\n\n(Psst... there's a hidden gem waiting for you at the very bottom of the page!)"
      };
      
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content }, limitMsg]);
      setInput('');
      return;
    }

    // Increment message count
    const newCount = messageCount + 1;
    setMessageCount(newCount);
    localStorage.setItem(STORAGE_KEYS.COUNT, newCount.toString());

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content
    };

    // Optimistic Update
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);
    setHasError(false);
    
    logger.chat('message_sent', { length: content.length, count: newCount });

    try {
      // 3. Check Hardcoded Response
      const hardcoded = getHardcodedResponse(content);
      if (hardcoded) {
        logger.chat('response_received', { source: 'hardcoded' });
        setTimeout(() => {
          const assistantMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: hardcoded
          };
          setMessages(prev => [...prev, assistantMsg]);
          setIsLoading(false);
        }, 600);
        return;
      }

      // 2. Stream from API
      const assistantMsgId = (Date.now() + 1).toString();
      const assistantPlaceholder: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: ''
      };
      
      // Add placeholder
      setMessages(prev => [...prev, assistantPlaceholder]);

      let fullResponse = '';
      
      await streamChatCompletion(newHistory, (chunk) => {
        fullResponse += chunk;
        setMessages(prev => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          // Ensure we update the last message which is our placeholder
          if (lastIndex >= 0 && updated[lastIndex].id === assistantMsgId) {
            updated[lastIndex] = { ...updated[lastIndex], content: fullResponse };
          }
          return updated;
        });
      });
      
      logger.chat('response_received', { source: 'llm', length: fullResponse.length });

    } catch (error) {
      console.error('Chat Error:', error);
      logger.chat('error', { error: String(error) });
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, messageCount, isRateLimited]);

  const clearChat = useCallback(() => {
    const welcomeMsg: ChatMessage = {
      id: 'welcome',
      role: 'assistant', 
      content: "Hi there! I'm Adrian's AI. To help me tailor our conversation, could you tell me who I'm speaking with?"
    };
    setMessages([welcomeMsg]);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    logger.chat('chat_cleared');
  }, []);

  const retryLastMessage = useCallback(() => {
    // Find last user message to retry
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      // Remove the failed assistant message if present?
      // Simpler: Just put text back in input.
      setInput(lastUserMsg.content);
      // Optionally remove the last user message from history to prevent dupe?
      // For now, let the user just send it again.
    }
  }, [messages]);

  return {
    messages,
    input,
    setInput,
    sendMessage,
    isLoading,
    hasError,
    retryLastMessage,
    clearChat,
    isRateLimited
  };
};
