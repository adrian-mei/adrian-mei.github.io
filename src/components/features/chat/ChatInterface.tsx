import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, ArrowUp } from 'lucide-react';
import { useMockLLM, Message } from './useMockLLM';

const ChatInterface = () => {
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem('adrian_ai_is_open');
    return saved ? JSON.parse(saved) : false;
  });
  
  // Persist open state
  useEffect(() => {
    localStorage.setItem('adrian_ai_is_open', JSON.stringify(isOpen));
  }, [isOpen]);

  const [inputValue, setInputValue] = useState('');
  const { messages, isTyping, sendMessage, currentSuggestions } = useMockLLM();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasUnread, setHasUnread] = useState(false);

  // Auto-scroll to bottom of chat on new message or typing
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Force scroll to bottom on open/load (without smooth behavior to be instant)
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
    }
  }, [isOpen]);

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

  // Handle clicks on internal links (e.g. /contact) to scroll instead of navigate
  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    // Check if clicked element is a link
    if (target.tagName === 'A') {
      const href = target.getAttribute('href');
      if (href && href.startsWith('/')) {
        e.preventDefault();
        const sectionId = href.replace('/', ''); // e.g. /contact -> contact
        // Handle 'contact?type=...' by splitting query params if needed, but for now simple IDs
        const cleanId = sectionId.split('?')[0]; 
        
        const element = document.getElementById(cleanId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          // Optional: Close chat on navigation? User might want to keep reading.
          // setIsOpen(false); 
        }
      }
    }
  };

  // Helper to parse simple markdown and return HTML
  const parseContent = (text: string) => {
    // 1. Handle Bold (**text**)
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
    
    // 2. Handle Links is automatic if they are in HTML format in the source
    // No extra processing needed for <a href="...">...</a>
    
    return { __html: html };
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 w-full h-[100dvh] sm:static sm:w-[440px] sm:h-[800px] sm:max-h-[85vh] sm:mb-6 bg-zinc-900/95 sm:bg-zinc-900/60 backdrop-blur-2xl sm:border border-white/10 rounded-none sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 z-[60] sm:z-auto">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/5 flex justify-between items-center bg-white/5 backdrop-blur-sm pt-safe-top">
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
          <div 
            className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            onClick={handleContentClick} // Intercept clicks
          >
            {messages.map((msg: Message) => (
              <div 
                key={msg.id} 
                className={`flex gap-4 animate-in slide-in-from-bottom-2 duration-300 fade-in ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-transparent hidden' : 'bg-white/5 ring-1 ring-white/10' 
                }`}>
                   {msg.role === 'assistant' && <Bot className="w-5 h-5 text-blue-400" />}
                </div>
                
                <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div 
                    className={`text-[15px] leading-relaxed shadow-lg backdrop-blur-sm ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white px-5 py-3 rounded-2xl rounded-tr-sm border border-white/10' 
                        : 'bg-white/5 border border-white/5 text-zinc-100 px-5 py-3 rounded-2xl rounded-tl-sm' 
                    }`}
                    // Use dangerouslySetInnerHTML for Rich Text support
                    dangerouslySetInnerHTML={parseContent(msg.content)}
                  />
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-4 animate-in slide-in-from-bottom-2 duration-300 fade-in">
                 <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 ring-1 ring-white/10 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-blue-400 animate-pulse" />
                </div>
                <div className="flex items-center gap-1.5 h-auto px-4 py-3 bg-white/5 border border-white/5 rounded-2xl rounded-tl-sm">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          {!isTyping && (
             <div className="px-5 pb-3 flex gap-2 overflow-x-auto scrollbar-hide mask-linear-fade pt-2">
                {currentSuggestions.map((prompt: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(prompt)}
                    className="group flex-shrink-0 flex items-center gap-2 text-xs font-medium px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 border border-indigo-500/30 hover:border-indigo-400 text-indigo-200 hover:text-white rounded-xl transition-all whitespace-nowrap backdrop-blur-md hover:scale-105 active:scale-95 animate-in fade-in zoom-in duration-300 shadow-lg shadow-indigo-500/5 hover:shadow-indigo-500/20"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <Sparkles className="w-3 h-3 text-indigo-400 group-hover:text-indigo-300 group-hover:animate-spin-slow" />
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
