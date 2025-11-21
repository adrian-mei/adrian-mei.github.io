import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, Clock, Calendar, ChevronRight, Terminal, Hash } from 'lucide-react';
import { blogPosts, BlogPost } from '../../../data/blog';

interface BlogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const BlogDrawer = ({ isOpen, onClose }: BlogDrawerProps) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  // Handle closing animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setSelectedPost(null); // Reset on close
      onClose();
    }, 300);
  };

  // Reset state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end font-sans">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen && !isClosing ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div 
        className={`relative w-full max-w-2xl h-full bg-zinc-950/90 border-l border-blue-500/20 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col overflow-hidden ${
          isOpen && !isClosing ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* HUD Background Effects */}
        <div className="absolute inset-0 pointer-events-none opacity-10" 
             style={{ 
               backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)', 
               backgroundSize: '32px 32px' 
             }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

        {/* Header */}
        <div className="relative flex items-center justify-between p-6 border-b border-blue-500/20 bg-zinc-950/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            {selectedPost ? (
              <button 
                onClick={() => setSelectedPost(null)}
                className="group flex items-center gap-2 px-3 py-1.5 rounded-sm bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40 transition-all text-blue-400"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="font-mono text-xs tracking-wider">RETURN</span>
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-sm bg-blue-500/10 border border-blue-500/20">
                  <Terminal className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="font-mono font-bold text-zinc-100 tracking-wider flex items-center gap-2">
                    SYSTEM_LOGS
                    <span className="w-2 h-4 bg-blue-500 animate-pulse"/>
                  </h2>
                  <div className="text-[10px] text-blue-400/60 font-mono uppercase tracking-widest">
                    Archives // v2.4.0
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-sm transition-colors text-zinc-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="relative flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          {selectedPost ? (
            // Detail View
            <article className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <header className="mb-8 pb-8 border-b border-dashed border-zinc-800">
                <div className="flex gap-2 mb-6 flex-wrap">
                  {selectedPost.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-sm bg-blue-500/5 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                      <Hash className="w-3 h-3 opacity-50" />
                      {tag}
                    </span>
                  ))}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-zinc-100 mb-6 leading-tight tracking-tight">
                  {selectedPost.title}
                </h1>
                <div className="flex items-center gap-6 text-xs font-mono text-zinc-500 border-l-2 border-blue-500/30 pl-4">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {selectedPost.date}
                  </span>
                  <span className="text-zinc-700">|</span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {selectedPost.readTime}
                  </span>
                </div>
              </header>
              
              <div 
                className="prose prose-invert prose-zinc max-w-none 
                  prose-headings:font-bold prose-headings:tracking-tight
                  prose-h2:text-xl prose-h2:border-b prose-h2:border-zinc-800 prose-h2:pb-2 prose-h2:mt-8
                  prose-p:text-zinc-400 prose-p:leading-relaxed
                  prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-500/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:not-italic
                  prose-code:text-blue-300 prose-code:bg-zinc-900 prose-code:px-1 prose-code:py-0.5 prose-code:rounded-sm prose-code:font-mono prose-code:text-sm
                  prose-strong:text-zinc-200"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              />
            </article>
          ) : (
            // List View
            <div className="p-6 space-y-1">
              <div className="pl-4 pb-4 text-xs font-mono text-zinc-600 uppercase tracking-widest border-l border-dashed border-zinc-800 ml-[9px]">
                Wait for input...
              </div>
              
              {blogPosts.map((post, index) => (
                <div 
                  key={post.id}
                  className="relative group pl-8 pb-8 border-l border-zinc-800 last:border-l-0 last:pb-0 ml-2"
                >
                  {/* Timeline Node */}
                  <div className="absolute left-[-5px] top-0 w-[10px] h-[10px] rounded-full bg-zinc-900 border border-zinc-700 group-hover:border-blue-500 group-hover:bg-blue-500/20 transition-colors duration-300" />
                  
                  <div 
                    onClick={() => setSelectedPost(post)}
                    className="relative -top-1.5 p-5 rounded-sm bg-zinc-900/30 border border-transparent hover:border-blue-500/30 hover:bg-zinc-900/80 transition-all duration-300 cursor-pointer group-hover:translate-x-1"
                  >
                    {/* Header Meta */}
                    <div className="flex justify-between items-start mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
                      <div className="flex gap-3 text-xs font-mono text-blue-400/80">
                         <span>LOG_{index.toString().padStart(3, '0')}</span>
                         <span className="text-zinc-600">::</span>
                         <span>{post.date}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-zinc-300 group-hover:text-blue-400 transition-colors mb-2 flex items-center gap-2">
                      {post.title}
                      <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </h3>
                    
                    <p className="text-zinc-500 text-sm line-clamp-2 font-light mb-4">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex gap-2">
                      {post.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-zinc-800 text-zinc-400 border border-zinc-700 group-hover:border-blue-500/30 group-hover:text-blue-400/80 transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer Status Bar */}
        <div className="p-2 border-t border-blue-500/20 bg-zinc-950/80 backdrop-blur-md flex justify-between items-center text-[10px] font-mono text-blue-500/40 uppercase tracking-widest">
          <span>System Status: ONLINE</span>
          <span>{blogPosts.length} ENTRIES FOUND</span>
        </div>
      </div>
    </div>
  );
};

export default BlogDrawer;
