import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowLeft, Clock, Calendar, ChevronRight, Terminal, Hash, Play, Pause, Volume2 } from 'lucide-react';
import { blogPosts, BlogPost } from '../../../data/blog';

interface BlogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const BlogDrawer = ({ isOpen, onClose }: BlogDrawerProps) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [processedContent, setProcessedContent] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);

  // Process content (Simple ID injection for potential deep links, but no ToC)
  useEffect(() => {
    if (selectedPost) {
      // Reset states
      setIsSpeaking(false);
      window.speechSynthesis.cancel();
      
      setProcessedContent(selectedPost.content);
    }
  }, [selectedPost]);

  // Handle TTS
  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else if (selectedPost) {
      // Strip HTML for speech
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = selectedPost.content;
      const text = tempDiv.textContent || '';
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      utterance.rate = 0.9; // Slightly slower for reading
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Clean up speech on close
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Handle scroll progress
  const handleScroll = () => {
    if (!contentRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollProgress(Math.min(100, Math.max(0, progress)));
  };

  // Reset progress when post changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
      setScrollProgress(0);
    }
  }, [selectedPost]);

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
        className={`relative w-full max-w-[90vw] h-full bg-zinc-950/95 border-l border-blue-500/20 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col overflow-hidden ${
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

        {/* Header (Sticky) */}
        <div className="relative z-10 flex flex-col border-b border-blue-500/20 bg-zinc-950/80 backdrop-blur-xl shadow-lg">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              {selectedPost ? (
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedPost(null)}
                    className="group flex items-center gap-2 px-3 py-1.5 rounded-sm bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 hover:border-blue-500/40 transition-all text-blue-400"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-mono text-xs tracking-wider">RETURN</span>
                  </button>
                  
                  {/* Audio Control */}
                  <button 
                    onClick={toggleSpeech}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border transition-all ${
                      isSpeaking 
                        ? 'bg-blue-500/20 border-blue-500/40 text-blue-400 animate-pulse' 
                        : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {isSpeaking ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span className="font-mono text-xs tracking-wider hidden sm:inline">
                      {isSpeaking ? 'PAUSE AUDIO' : 'READ ALOUD'}
                    </span>
                    {isSpeaking && <Volume2 className="w-3 h-3 ml-1" />}
                  </button>
                </div>
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

          {/* Reading Progress Bar */}
          {selectedPost && (
            <div className="h-1 w-full bg-zinc-800/50">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-100 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
          )}
        </div>

        {/* Content Area */}
        <div 
          ref={contentRef}
          onScroll={handleScroll}
          className="relative flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent scroll-smooth bg-zinc-950/50"
        >
          {selectedPost ? (
            // Detail View (Sidebar Layout)
            <div className="w-full max-w-[1600px] mx-auto p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24">
                {/* Main Content */}
                <div className="lg:col-span-8">
                  <article className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <header className="mb-20">
                        <h1 className="text-6xl md:text-8xl font-bold text-zinc-100 leading-tight tracking-tight mb-10 font-sans">
                          {selectedPost.title}
                        </h1>
                        
                        <p className="text-4xl text-zinc-400 mb-12 leading-relaxed font-serif border-l-4 border-blue-500/50 pl-6">
                          {selectedPost.excerpt}
                        </p>
                    </header>
                    
                  <div 
                      className="prose prose-2xl prose-invert prose-zinc max-w-none font-serif
                      prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-zinc-100
                      prose-h2:text-6xl prose-h2:mt-28 prose-h2:mb-10
                      prose-h3:text-5xl prose-h3:mt-20 prose-h3:mb-8
                      prose-p:text-zinc-300 prose-p:leading-[2.2] prose-p:text-4xl prose-p:font-light prose-p:mb-16
                      prose-li:text-zinc-300 prose-li:leading-[2.2] prose-li:text-4xl
                      prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-a:no-underline hover:prose-a:underline prose-a:transition-colors
                      prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-8 prose-blockquote:italic prose-blockquote:text-5xl prose-blockquote:text-zinc-400 prose-blockquote:my-20
                      prose-code:text-blue-300 prose-code:bg-zinc-900 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-code:font-mono prose-code:text-2xl prose-code:border prose-code:border-zinc-800
                      prose-strong:text-white prose-strong:font-semibold"
                      dangerouslySetInnerHTML={{ __html: processedContent }}
                  />
                  </article>
                </div>

                {/* Sticky Sidebar */}
                <aside className="hidden lg:block lg:col-span-4">
                  <div className="sticky top-8 space-y-12">
                    {/* Meta Info */}
                    <div className="p-6 rounded-xl bg-zinc-900/30 border border-zinc-800/50 backdrop-blur-sm">
                      <h3 className="text-sm font-mono uppercase tracking-wider text-zinc-500 mb-4">Metadata</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400">Date</span>
                          <span className="font-mono text-zinc-200">{selectedPost.date}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-zinc-400">Read Time</span>
                          <span className="font-mono text-zinc-200">{selectedPost.readTime}</span>
                        </div>
                        <div className="pt-4 border-t border-zinc-800/50">
                          <div className="flex flex-wrap gap-2">
                            {selectedPost.tags.map(tag => (
                              <span key={tag} className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono uppercase">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Author */}
                    <div className="p-6 rounded-xl bg-zinc-900/30 border border-zinc-800/50 backdrop-blur-sm">
                      <h3 className="text-sm font-mono uppercase tracking-wider text-zinc-500 mb-4">Author</h3>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 text-zinc-400 font-mono text-lg">
                          AM
                        </div>
                        <div>
                          <div className="font-bold text-zinc-200">Adrian Mei</div>
                          <div className="text-sm text-zinc-500">System Architect</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          ) : (
            // List View (Grid)
            <div className="p-8 md:p-12">
              <div className="mb-8 flex items-center gap-4">
                  <div className="h-px flex-1 bg-zinc-800/50"></div>
                  <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                    Select a Data Log to Decrypt
                  </div>
                  <div className="h-px flex-1 bg-zinc-800/50"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {blogPosts.map((post, index) => (
                    <div 
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="group relative flex flex-col h-full p-6 rounded-xl bg-zinc-900/20 border border-zinc-800/50 hover:border-blue-500/30 hover:bg-zinc-900/60 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/5"
                    >
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-zinc-700 group-hover:border-blue-500/50 transition-colors opacity-0 group-hover:opacity-100" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-zinc-700 group-hover:border-blue-500/50 transition-colors opacity-0 group-hover:opacity-100" />

                    {/* Header Meta */}
                    <div className="flex justify-between items-center mb-4 opacity-60 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-2 text-[10px] font-mono text-blue-400/80 bg-blue-500/5 px-2 py-1 rounded">
                            <span>LOG_{index.toString().padStart(3, '0')}</span>
                        </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-zinc-200 group-hover:text-blue-400 transition-colors mb-3 leading-tight">
                        {post.title}
                    </h3>
                    
                    <p className="text-zinc-500 text-sm leading-relaxed mb-6 flex-1">
                        {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800/50 group-hover:border-blue-500/10 transition-colors">
                        <div className="flex gap-2">
                        {post.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 group-hover:border-blue-500/20 group-hover:text-blue-400/80 transition-colors">
                            {tag}
                            </span>
                        ))}
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    </div>
                ))}
              </div>
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
