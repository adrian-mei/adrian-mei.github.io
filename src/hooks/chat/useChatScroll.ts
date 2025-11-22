import { useRef, useEffect } from 'react';
import { ChatMessage } from '@/src/types/chat';

export const useChatScroll = (messages: ChatMessage[], isLoading: boolean, isOpen: boolean) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      const behavior = isLoading ? 'smooth' : 'auto';
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  }, [messages, isLoading, isOpen]);

  return messagesEndRef;
};
