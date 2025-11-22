import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Bot, User } from 'lucide-react';
import { ChatMessage } from '@/src/types/chat';
import { logger } from '@/src/services/logger';

// Styles for syntax highlighting
import 'highlight.js/styles/atom-one-dark.css'; 

interface ChatBubbleProps {
  message: ChatMessage;
  onLinkClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onLinkClick }) => {
  const isUser = message.role === 'user';

  React.useEffect(() => {
    // Only log empty or partial messages from assistant to debug streaming
    if (!isUser && (!message.content || message.content.length < 50)) {
       logger.debug('[ChatBubble] Rendering Assistant Message', { 
         contentLength: message.content?.length,
         preview: message.content?.slice(0, 20)
       });
    }
  }, [message.content, isUser]);

  return (
    <div 
      className={`flex gap-4 animate-in slide-in-from-bottom-2 duration-300 fade-in ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-transparent hidden' : 'bg-white/5 ring-1 ring-white/10' 
      }`}>
         {!isUser && <Bot className="w-5 h-5 text-blue-400" />}
      </div>
      
      <div className={`flex flex-col max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div 
          className={`text-[15px] leading-relaxed shadow-lg backdrop-blur-sm overflow-hidden break-words ${
            isUser 
              ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white px-5 py-3 rounded-2xl rounded-tr-sm border border-white/10' 
              : 'bg-white/5 border border-white/5 text-zinc-100 px-5 py-3 rounded-2xl rounded-tl-sm' 
          }`}
          onClick={onLinkClick}
        >
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                // Customize Markdown Elements
                p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                a: ({node, ...props}) => <a className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/30 hover:decoration-blue-300" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                li: ({node, ...props}) => <li className="pl-1" {...props} />,
                code: ({node, className, children, ...props}: any) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !match;
                  return isInline ? (
                    <code className="bg-black/30 px-1.5 py-0.5 rounded text-sm font-mono text-purple-300" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                pre: ({node, ...props}) => <pre className="bg-black/40 p-3 rounded-lg overflow-x-auto mb-2 border border-white/10 text-sm scrollbar-thin scrollbar-thumb-white/10" {...props} />,
                h1: ({node, ...props}) => <h1 className="text-lg font-bold text-white mb-2 mt-1" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-base font-bold text-zinc-200 mb-2 mt-1" {...props} />,
                strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />,
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
};
