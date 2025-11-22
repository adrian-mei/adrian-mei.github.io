import React, { useState } from 'react';
import { X, ArrowLeft, Sparkles, Clock, Activity, Pause, Play, Volume2, ArrowUpRight, Zap, Hash } from 'lucide-react';
import { blogPosts } from '../../../data/blog';
import { useBlogDrawer } from '@/src/hooks/blog/useBlogDrawer';

interface BlogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const BlogDrawerGlass = ({ isOpen, onClose }: BlogDrawerProps) => {
  const {
    selectedPost,
    setSelectedPost,
    isClosing,
    scrollProgress,
    processedContent,
    isSpeaking,
    toggleSpeech,
    contentRef,
    handleScroll,
    handleClose
  } = useBlogDrawer({ isOpen, onClose });

  const [hoveredPost, setHoveredPost] = useState<number | null>(null);

  if (!isOpen && !isClosing) return null;

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@200;400;600&family=Geist:wght@100;300;400;500;600;700&display=swap');

          .glass-morphism {
            background: rgba(255, 255, 255, 0.01);
            backdrop-filter: blur(40px);
            -webkit-backdrop-filter: blur(40px);
            border: 1px solid rgba(255, 255, 255, 0.08);
          }

          .glass-card {
            background: linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.06) 0%,
              rgba(255, 255, 255, 0.01) 100%
            );
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.08);
          }

          .reading-gradient {
            background: linear-gradient(
              90deg,
              #60a5fa 0%,
              #a78bfa 50%,
              #f472b6 100%
            );
          }

          .glow-text {
            text-shadow: 0 0 30px rgba(96, 165, 250, 0.3);
          }

          .hover-glow {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .hover-glow:hover {
            box-shadow: 
              0 0 40px rgba(96, 165, 250, 0.15),
              inset 0 0 20px rgba(167, 139, 250, 0.05);
          }

          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }

          .floating-element {
            animation: float 6s ease-in-out infinite;
          }

          @keyframes pulse-glow {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.8; }
          }

          .pulse-glow {
            animation: pulse-glow 2s ease-in-out infinite;
          }

          .noise-overlay {
            opacity: 0.015;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          }

          .gradient-mesh {
            background-image: 
              radial-gradient(at 40% 20%, rgba(96, 165, 250, 0.1) 0px, transparent 50%),
              radial-gradient(at 80% 0%, rgba(167, 139, 250, 0.08) 0px, transparent 50%),
              radial-gradient(at 10% 50%, rgba(244, 114, 182, 0.05) 0px, transparent 50%);
          }

          /* Custom scrollbar */
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.2);
          }
        `}
      </style>

      <div className="fixed inset-0 z-[60] flex justify-end" style={{ fontFamily: 'Geist, sans-serif' }}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/80 transition-opacity duration-500 ${
            isOpen && !isClosing ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleClose}
        />

        {/* Drawer */}
        <div 
          className={`relative w-full max-w-[85vw] h-full glass-morphism transform transition-all duration-500 ease-out flex flex-col overflow-hidden ${
            isOpen && !isClosing ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{
            background: 'rgba(10, 10, 10, 0.85)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Background Effects */}
          <div className="absolute inset-0 gradient-mesh pointer-events-none" />
          <div className="absolute inset-0 noise-overlay pointer-events-none" />
          
          {/* Decorative orbs */}
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none floating-element" />
          <div className="absolute bottom-40 left-0 w-80 h-80 rounded-full bg-purple-500/10 blur-[100px] pointer-events-none floating-element" style={{ animationDelay: '2s' }} />

          {/* Header */}
          <div className="relative z-10 glass-card" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div className="flex items-center justify-between px-10 py-6">
              <div className="flex items-center gap-6">
                {selectedPost ? (
                  <button 
                    onClick={() => setSelectedPost(null)}
                    className="group flex items-center gap-3 px-5 py-2.5 rounded-full glass-card hover-glow"
                  >
                    <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-light text-zinc-300" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Back</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-2xl glass-card">
                      <Sparkles className="w-5 h-5 text-blue-400 pulse-glow" />
                    </div>
                    <div>
                      <h2 className="text-xl font-light text-white/90 tracking-wide">
                        Neural Archives
                      </h2>
                      <p className="text-xs text-zinc-500 mt-0.5" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        Thoughts & Experiments
                      </p>
                    </div>
                  </div>
                )}

                {selectedPost && (
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={toggleSpeech}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                        isSpeaking 
                          ? 'glass-card text-blue-400' 
                          : 'glass-card text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {isSpeaking ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span className="text-xs font-light">
                        {isSpeaking ? 'Pause' : 'Listen'}
                      </span>
                      {isSpeaking && <Volume2 className="w-3 h-3 ml-1 animate-pulse" />}
                    </button>
                  </div>
                )}
              </div>
              
              <button 
                onClick={handleClose}
                className="p-2.5 rounded-full glass-card hover:bg-white/5 transition-all text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Reading Progress */}
            {selectedPost && (
              <div className="h-[2px] w-full bg-white/5 overflow-hidden">
                <div 
                  className="h-full reading-gradient transition-all duration-300 ease-out"
                  style={{ 
                    width: `${scrollProgress}%`,
                    boxShadow: '0 0 20px rgba(96, 165, 250, 0.5)'
                  }}
                />
              </div>
            )}
          </div>

          {/* Content Area */}
          <div 
            ref={contentRef}
            onScroll={handleScroll}
            className="relative flex-1 overflow-y-auto custom-scrollbar"
          >
            {selectedPost ? (
              // Article View
              <div className="relative">
                {/* Hero Section */}
                <div className="relative h-[40vh] flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />
                  <div className="absolute inset-0 gradient-mesh opacity-30" />
                  
                  <div className="relative z-10 text-center px-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="flex items-center justify-center gap-2 mb-6">
                      <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/20" />
                      <span className="text-xs text-zinc-500 uppercase tracking-[0.2em]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        {selectedPost.tags[0]}
                      </span>
                      <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/20" />
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl font-thin text-white mb-6 glow-text" 
                        style={{ fontFamily: 'Instrument Serif, serif', lineHeight: '1.1' }}>
                      {selectedPost.title}
                    </h1>
                    
                    <p className="text-lg text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
                      {selectedPost.excerpt}
                    </p>

                    <div className="flex items-center justify-center gap-6 mt-8 text-xs text-zinc-500">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{selectedPost.date}</span>
                      </div>
                      <div className="w-1 h-1 rounded-full bg-zinc-600" />
                      <div className="flex items-center gap-2">
                        <Activity className="w-3 h-3" />
                        <span>5 min read</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Article Content */}
                <div className="relative px-8 py-12 md:px-12 lg:px-24">
                  <div className="max-w-3xl mx-auto">
                    <article 
                      className="prose prose-invert prose-lg max-w-none
                        prose-headings:font-light prose-headings:text-white
                        prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:tracking-wide
                        prose-h3:text-xl prose-h3:mt-12 prose-h3:mb-4 prose-h3:text-zinc-300
                        prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:font-light
                        prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300 prose-a:transition-colors
                        prose-blockquote:border-l-2 prose-blockquote:border-white/10 prose-blockquote:pl-6 prose-blockquote:text-zinc-500 prose-blockquote:italic
                        prose-code:text-blue-300 prose-code:bg-white/5 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                        prose-strong:text-white prose-strong:font-medium"
                      style={{ fontFamily: 'Geist, sans-serif' }}
                      dangerouslySetInnerHTML={{ __html: processedContent }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              // Grid View
              <div className="p-8 md:p-12">
                {/* Section Header */}
                <div className="mb-12 text-center">
                  <h3 className="text-sm text-zinc-500 uppercase tracking-[0.2em] mb-4" 
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    Recent Transmissions
                  </h3>
                  <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto" />
                </div>
                
                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {blogPosts.map((post, index) => (
                    <div 
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      onMouseEnter={() => setHoveredPost(index)}
                      onMouseLeave={() => setHoveredPost(null)}
                      className="group relative glass-card rounded-2xl p-6 cursor-pointer hover-glow transition-all duration-500 hover:-translate-y-1"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        transform: hoveredPost === index ? 'scale(1.02)' : 'scale(1)',
                      }}
                    >
                      {/* Card glow effect */}
                      {hoveredPost === index && (
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl -z-10" />
                      )}

                      {/* Card Content */}
                      <div className="flex flex-col h-full">
                        {/* Meta */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Zap className="w-3 h-3 text-blue-400/60" />
                            <span className="text-[10px] uppercase tracking-wider text-blue-400/60" 
                                  style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                              Entry_{String(index + 1).padStart(3, '0')}
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-600" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                            {post.date}
                          </span>
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-xl font-light text-white/90 mb-3 group-hover:text-blue-400/90 transition-colors leading-tight"
                            style={{ fontFamily: 'Instrument Serif, serif' }}>
                          {post.title}
                        </h3>
                        
                        {/* Excerpt */}
                        <p className="text-sm text-zinc-500 leading-relaxed mb-6 flex-1 font-light">
                          {post.excerpt}
                        </p>
                        
                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          <div className="flex gap-2">
                            {post.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="text-[10px] px-2 py-1 rounded-full glass-card text-zinc-400 uppercase tracking-wider">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Decoration */}
                <div className="mt-16 flex items-center justify-center">
                  <div className="flex items-center gap-3 text-xs text-zinc-600">
                    <Hash className="w-3 h-3" />
                    <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {blogPosts.length} thoughts compiled
                    </span>
                    <Hash className="w-3 h-3" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDrawerGlass;
