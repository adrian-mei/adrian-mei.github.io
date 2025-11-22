import React from 'react';
import { ArrowUp, RefreshCw, AlertCircle } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  sendMessage: (content: string) => void;
  isLoading: boolean;
  hasError: boolean;
  onRetry: () => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  input, 
  setInput, 
  sendMessage, 
  isLoading, 
  hasError,
  onRetry,
  disabled = false
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled) {
      sendMessage(input);
    }
  };

  return (
    <div className="p-5 pt-2">
      {hasError && (
        <div className="mb-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-between animate-in slide-in-from-bottom-2 fade-in">
           <div className="flex items-center gap-2 text-red-200 text-sm">
             <AlertCircle className="w-4 h-4" />
             <span>Failed to send message.</span>
           </div>
           <button 
             onClick={onRetry}
             className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-100 px-2 py-1 rounded-md transition-colors flex items-center gap-1"
           >
             <RefreshCw className="w-3 h-3" /> Retry
           </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative flex items-center group">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled}
          placeholder={disabled ? "Chat limit reached. Come back later." : "Ask about projects, skills, or contact info..."}
          className="w-full bg-black/40 text-zinc-100 rounded-full py-4 pl-5 pr-14 border border-white/10 focus:border-white/20 focus:ring-0 outline-none placeholder:text-zinc-500 text-[15px] transition-all backdrop-blur-xl shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading || disabled}
          className="absolute right-2 p-2 bg-zinc-200 text-black hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-600 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg"
        >
          {isLoading ? (
             <div className="w-5 h-5 border-2 border-zinc-600 border-t-transparent rounded-full animate-spin" />
          ) : (
             <ArrowUp className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
};
