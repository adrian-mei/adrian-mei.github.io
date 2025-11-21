import { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from '@/src/services/chat-service';

export const useChatUI = (messages: ChatMessage[]) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Persistence: Load isOpen state
  useEffect(() => {
    try {
      const savedOpen = localStorage.getItem('adrian_ai_is_open');
      if (savedOpen) setIsOpen(JSON.parse(savedOpen));
    } catch (e) {
      console.error('Failed to load chat UI state', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Persistence: Save isOpen state
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('adrian_ai_is_open', JSON.stringify(isOpen));
    }
  }, [isOpen, isInitialized]);

  // Notification Logic
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
       const timer = setTimeout(() => {
          // Only show badge if the last message is from assistant and it's "fresh" (not initial load if we can tell)
          // For now, simple logic: if closed and last is assistant, show badge.
          if (!isOpen && messages.length > 0 && messages[messages.length - 1].role === 'assistant') {
             setHasUnread(true);
          }
       }, 3000);
       return () => clearTimeout(timer);
    } else {
      setHasUnread(false);
    }
  }, [isOpen, messages]);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return {
    isOpen,
    toggleChat,
    hasUnread,
    isInitialized
  };
};
