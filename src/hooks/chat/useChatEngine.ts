import { useState, useCallback, useEffect } from 'react';
import { getHardcodedResponse } from '@/src/data/chat-scripts';
import { ChatMessage, streamChatCompletion } from '@/src/services/chat-service';
import { logger } from '@/src/services/logger';

export const useChatEngine = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Manual Initialization of Welcome Message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMsg: ChatMessage = {
        id: 'welcome',
        role: 'assistant', 
        content: "Hi there! I'm Adrian's AI. To help me tailor our conversation, could you tell me who I'm speaking with?"
      };
      setMessages([welcomeMsg]);
    }
  }, []);

  // Unified Send Message Logic
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

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
    
    logger.chat('message_sent', { length: content.length });

    try {
      // 1. Check Hardcoded Response
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
  }, [messages, isLoading]);

  const clearChat = useCallback(() => {
    setMessages([{
      id: 'welcome',
      role: 'assistant', 
      content: "Hi there! I'm Adrian's AI. To help me tailor our conversation, could you tell me who I'm speaking with?"
    }]);
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
    clearChat
  };
};
