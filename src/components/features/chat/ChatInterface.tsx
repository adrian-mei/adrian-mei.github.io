import React from 'react';
import { MessageSquare, X, Bot } from 'lucide-react';
import { useChatLogic } from '../../../hooks/useChatLogic';
import { ChatBubble } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { SuggestionChips } from './SuggestionChips';

const ChatInterface = () => {
  const {
    isOpen,
    toggleChat,
    messages,
    input,
    setInput,
    sendMessage,
    isLoading,
    hasUnread,
    messagesEndRef,
    hasError,
    retryLastMessage
  } = useChatLogic();

  // Handle clicks on internal links (e.g. /contact) to scroll instead of navigate
  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    // Check if clicked element is a link (or inside a link)
    const link = target.closest('a');
    if (link) {
      const href = link.getAttribute('href');
      if (href && href.startsWith('/')) {
        e.preventDefault();
        const sectionId = href.replace('/', ''); // e.g. /contact -> contact
        const cleanId = sectionId.split('?')[0]; 
        
        const element = document.getElementById(cleanId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
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
              id="chat-close-btn"
              onClick={toggleChat}
              aria-label="Close Chat"
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-zinc-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div 
            className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
          >
            {messages.map((msg, index) => {
              // Hide empty assistant messages (except if loading, which is handled by loading indicator below, or if we want to show partial stream)
              // Actually, stream updates the content live, so it won't be empty for long. 
              // But initial empty state might cause a flash.
              if (msg.role === 'assistant' && !msg.content && !isLoading) return null;
              // If content is empty and we ARE loading, we might want to hide it and show the dots instead?
              // But our stream logic updates in real-time.
              
              return (
                <ChatBubble 
                  key={index} 
                  message={msg} 
                  onLinkClick={handleContentClick}
                />
              );
            })}
            
            {/* Loading Indicator (Only show if we are waiting for the first chunk or between user send and AI start) */}
            {isLoading && (!messages.length || (messages[messages.length - 1].role === 'assistant' && !messages[messages.length - 1].content)) && (
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

            <SuggestionChips 
              messages={messages} 
              onSelect={sendMessage} 
              isLoading={isLoading} 
            />

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <ChatInput 
            input={input} 
            setInput={setInput} 
            sendMessage={sendMessage} 
            isLoading={isLoading}
            hasError={hasError}
            onRetry={retryLastMessage}
          />
        </div>
      )}

      {/* Toggle Button */}
      <button
        id="chat-toggle-btn"
        onClick={toggleChat}
        aria-label={isOpen ? "Close Chat" : "Open Chat"}
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
