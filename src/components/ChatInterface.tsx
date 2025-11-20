import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, ArrowUp } from 'lucide-react';
import { useMockLLM, Message } from '../hooks/useMockLLM';

const ChatInterface = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { messages, isTyping, sendMessage, currentSuggestions } = useMockLLM();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasUnread, setHasUnread] = useState(false);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Show notification badge after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) setHasUnread(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setHasUnread(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-6 w-[90vw] sm:w-[440px] h-[650px] max-h-[80vh] bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* Header */}
          <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl ring-1 ring-white/5">
                <Bot className="w-5 h-5 text-zinc-100" />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-100 text-base tracking-tight">Ask Me Anything</h3>
                <span className="text-xs text-zinc-400">About Adrian's experience & skills</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-zinc-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {messages.map((msg: Message) => (
              <div 
                key={msg.id} 
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-transparent hidden' : 'bg-transparent' 
                }`}>
                   {msg.role === 'assistant' && <Bot className="w-6 h-6 text-zinc-400" />}
                </div>
                
                <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`text-[15px] leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-zinc-800 text-zinc-100 px-5 py-3 rounded-2xl rounded-tr-sm shadow-lg' 
                      : 'text-zinc-200 px-0 py-1 font-light' // Cleaner text for AI
                  }`}>
                    {/* Simple markdown parsing for bold text */}
                    {msg.content.split('**').map((part, i) => 
                      i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : part
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-4">
                 <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-zinc-400" />
                </div>
                <div className="flex items-center gap-1.5 h-8 px-2">
                  <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          {!isTyping && (
             <div className="px-5 pb-3 flex gap-2 overflow-x-auto scrollbar-hide mask-linear-fade">
                {currentSuggestions.map((prompt: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(prompt)}
                    className="flex-shrink-0 text-xs font-medium px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-300 hover:text-white rounded-xl transition-all whitespace-nowrap backdrop-blur-md"
                  >
                    {prompt}
                  </button>
                ))}
             </div>
          )}

          {/* Input Area */}
          <div className="p-5 pt-2">
            <div className="relative flex items-center group">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about projects, skills, or contact info..."
                className="w-full bg-black/40 text-zinc-100 rounded-full py-4 pl-5 pr-14 border border-white/10 focus:border-white/20 focus:ring-0 outline-none placeholder:text-zinc-500 text-[15px] transition-all backdrop-blur-xl shadow-inner"
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="absolute right-2 p-2 bg-zinc-200 text-black hover:bg-white disabled:bg-zinc-800 disabled:text-zinc-600 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className="group relative h-16 w-16 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center hover:scale-105 active:scale-95 backdrop-blur-xl"
      >
        {isOpen ? (
          <X className="w-7 h-7 text-zinc-400" />
        ) : (
          <div className="relative">
             <MessageSquare className="w-7 h-7" />
             {hasUnread && (
               <span className="absolute top-0 right-0 flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
               </span>
             )}
          </div>
        )}
      </button>
    </div>
  );
};

export default ChatInterface;
