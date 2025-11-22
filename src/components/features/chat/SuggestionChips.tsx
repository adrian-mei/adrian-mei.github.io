import React from 'react';
import { getSuggestions } from '../../../data/chat-scripts';
import { ChatMessage } from '@/src/types/chat';
import { logger } from '@/src/services/logger';

interface SuggestionChipsProps {
  messages: ChatMessage[];
  onSelect: (suggestion: string) => void;
  isLoading: boolean;
}

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({ messages, onSelect, isLoading }) => {
  // 1. Calculate Suggestions (Must be unconditional / before any return)
  const suggestions = React.useMemo(() => getSuggestions(messages), [messages]);

  // 2. Determine Visibility
  const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null;
  const shouldShow = !isLoading && messages.length > 0 && lastMsg?.role === 'assistant';
  
  React.useEffect(() => {
    logger.debug('[SuggestionChips] Visibility Check', {
      shouldShow,
      isLoading,
      messageCount: messages.length,
      lastRole: lastMsg?.role
    });
  }, [shouldShow, isLoading, messages, lastMsg]);

  // 3. Early Return (Safe now because hooks are already called)
  if (!shouldShow) return null;

  return (
    <div className="flex flex-wrap justify-end gap-2 mt-2 animate-in slide-in-from-bottom-2 duration-500 fade-in">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          onClick={() => onSelect(suggestion)}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-sm text-zinc-300 hover:text-white transition-all hover:scale-105 active:scale-95"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};
