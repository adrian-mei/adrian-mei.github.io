import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowLeft, Sparkles, Clock, ArrowUpRight, Pause, Play, Volume2, Layers, Zap, Code2, Brain, Cpu } from 'lucide-react';
import { blogPosts, BlogPost } from '../../../data/blog';

interface BlogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const BlogDrawerFluid = ({ isOpen, onClose }: BlogDrawerProps) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [processedContent, setProcessedContent] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  const contentRef = useRef<HTMLDivElement>(null);

  // Process content
  useEffect(() => {
    if (selectedPost) {
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
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = selectedPost.content;
      const text = tempDiv.textContent || '';
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      utterance.rate = 0.9;
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
      setSelectedPost(null);
      onClose();
    }, 400);
  };

  // Reset state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  // Get unique tags for filter
  const uniqueTags = Array.from(new Set(blogPosts.flatMap(post => post.tags)));

  if (!isOpen && !isClosing) return null;

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Mono:wght@300;400;500&family=Crimson+Pro:ital,wght@0,300;0,400;1,300;1,400&display=swap');

          .aurora-gradient {
            background: linear-gradient(
              135deg,
              rgba(120, 119, 198, 0.15) 0%,
              rgba(255, 119, 198, 0.1) 25%,
              rgba(120, 219, 255, 0.1) 50%,
              rgba(120, 119, 198, 0.15) 75%,
              rgba(255, 119, 198, 0.1) 100%
            );
            background-size: 400% 400%;
            animation: aurora 15s ease infinite;
          }

          @keyframes aurora {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }

          .fluid-glass {
            background: linear-gradient(
              120deg,
              rgba(255, 255, 255, 0.04) 0%,
              rgba(255, 255, 255, 0.02) 50%,
              rgba(255, 255, 255, 0.04) 100%
            );
            backdrop-filter: blur(40px) saturate(200%);
            -webkit-backdrop-filter: blur(40px) saturate(200%);
            border: 1px solid rgba(255, 255, 255, 0.06);
          }

          .orb {
            border-radius: 50%;
            filter: blur(40px);
            opacity: 0.4;
          }

          @keyframes float-slow {
            0%, 100% { 
              transform: translate(0, 0) rotate(0deg); 
            }
            33% { 
              transform: translate(30px, -30px) rotate(120deg); 
            }
            66% { 
              transform: translate(-20px, 20px) rotate(240deg); 
            }
          }

          @keyframes morph {
            0%, 100% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; }
            50% { border-radius: 30% 60% 70% 40%/50% 60% 30% 60%; }
          }

          .floating-orb {
            animation: float-slow 20s ease-in-out infinite;
          }

          .morphing-shape {
            animation: morph 8s ease-in-out infinite;
          }

          .liquid-border {
            position: relative;
            overflow: hidden;
          }

          .liquid-border::before {
            content: '';
            position: absolute;
            inset: -2px;
            background: linear-gradient(
              45deg,
              transparent,
              rgba(120, 119, 198, 0.3),
              transparent,
              rgba(255, 119, 198, 0.3)
            );
            animation: rotate-border 4s linear infinite;
            border-radius: inherit;
          }

          @keyframes rotate-border {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .liquid-border::after {
            content: '';
            position: absolute;
            inset: 1px;
            background: rgba(13, 13, 13, 0.95);
            border-radius: inherit;
            z-index: 1;
          }

          .liquid-border > * {
            position: relative;
            z-index: 2;
          }

          .glow-text-fluid {
            background: linear-gradient(
              90deg,
              #7877c6 0%,
              #ff77c6 25%,
              #78dbff 50%,
              #7877c6 75%,
              #ff77c6 100%
            );
            background-size: 200% 100%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: shimmer 3s ease-in-out infinite;
          }

          @keyframes shimmer {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }

          .cyber-grid {
            background-image: 
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 35px,
                rgba(120, 119, 198, 0.03) 35px,
                rgba(120, 119, 198, 0.03) 36px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 35px,
                rgba(120, 119, 198, 0.03) 35px,
                rgba(120, 119, 198, 0.03) 36px
              );
          }

          /* Fluid scrollbar */
          .fluid-scroll::-webkit-scrollbar {
            width: 8px;
          }
          
          .fluid-scroll::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.02);
            border-radius: 4px;
          }
          
          .fluid-scroll::-webkit-scrollbar-thumb {
            background: linear-gradient(
              180deg,
              rgba(120, 119, 198, 0.3),
              rgba(255, 119, 198, 0.3)
            );
            border-radius: 4px;
          }

          @keyframes pulse-soft {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.05); opacity: 1; }
          }

          .pulse-soft {
            animation: pulse-soft 4s ease-in-out infinite;
          }

          .card-hover {
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .card-hover:hover {
            transform: translateY(-4px) scale(1.02);
          }
        `}
      </style>

      <div className="fixed inset-0 z-[60] flex justify-end" style={{ fontFamily: 'Syne, sans-serif' }}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-500 ${
            isOpen && !isClosing ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleClose}
        />

        {/* Drawer */}
        <div 
          className={`relative w-full max-w-[85vw] h-full transform transition-all duration-500 ease-out flex flex-col overflow-hidden ${
            isOpen && !isClosing ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{
            background: 'rgba(13, 13, 13, 0.95)',
            backdropFilter: 'blur(40px)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          {/* Background Effects */}
          <div className="absolute inset-0 aurora-gradient pointer-events-none" />
          <div className="absolute inset-0 cyber-grid pointer-events-none opacity-30" />
          
          {/* Floating Orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 orb floating-orb pointer-events-none" />
          <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-cyan-500/20 orb floating-orb pointer-events-none" style={{ animationDelay: '5s' }} />
          <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-pink-500/20 orb floating-orb pointer-events-none" style={{ animationDelay: '10s' }} />

          {/* Header */}
          <header className="relative z-10 fluid-glass border-b border-white/5">
            <div className="px-10 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  {selectedPost ? (
                    <button 
                      onClick={() => setSelectedPost(null)}
                      className="group flex items-center gap-2 px-4 py-2 rounded-full fluid-glass hover:bg-white/5 transition-all"
                    >
                      <ArrowLeft className="w-4 h-4 text-purple-300 group-hover:-translate-x-1 transition-transform" />
                      <span className="text-sm text-purple-200" style={{ fontFamily: 'DM Mono, monospace' }}>back</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="relative w-10 h-10 rounded-full morphing-shape bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center">
                        <Brain className="w-5 h-5 text-purple-300" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold glow-text-fluid">
                          Synapse Archive
                        </h2>
                        <p className="text-xs text-purple-300/60 mt-1" style={{ fontFamily: 'DM Mono, monospace' }}>
                          AI Research & Thoughts
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedPost && (
                    <button 
                      onClick={toggleSpeech}
                      className={`liquid-border rounded-full ${
                        isSpeaking ? 'bg-purple-500/10' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2 px-4 py-2">
                        {isSpeaking ? <Pause className="w-4 h-4 text-purple-300" /> : <Play className="w-4 h-4 text-purple-300" />}
                        <span className="text-xs text-purple-200" style={{ fontFamily: 'DM Mono, monospace' }}>
                          {isSpeaking ? 'pause' : 'listen'}
                        </span>
                        {isSpeaking && <Volume2 className="w-3 h-3 text-purple-300 animate-pulse" />}
                      </div>
                    </button>
                  )}
                </div>
                
                <button 
                  onClick={handleClose}
                  className="p-2.5 rounded-full fluid-glass hover:bg-white/5 transition-all text-purple-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            {selectedPost && (
              <div className="h-[2px] w-full bg-white/5 overflow-hidden">
                <div 
                  className="h-full transition-all duration-300 ease-out"
                  style={{ 
                    width: `${scrollProgress}%`,
                    background: 'linear-gradient(90deg, #7877c6 0%, #ff77c6 50%, #78dbff 100%)',
                    boxShadow: '0 0 10px rgba(120, 119, 198, 0.5)'
                  }}
                />
              </div>
            )}
          </header>

          {/* Content */}
          <main 
            ref={contentRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto fluid-scroll"
          >
            {selectedPost ? (
              // Article View
              <article className="px-10 py-12 max-w-4xl mx-auto">
                <div className="mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedPost.tags.map(tag => (
                      <span 
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs fluid-glass text-purple-300 border border-purple-500/20"
                        style={{ fontFamily: 'DM Mono, monospace' }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-cyan-200 mb-6 leading-tight">
                    {selectedPost.title}
                  </h1>
                  
                  <p className="text-xl text-purple-100/80 leading-relaxed mb-8" style={{ fontFamily: 'Crimson Pro, serif' }}>
                    {selectedPost.excerpt}
                  </p>

                  <div className="flex items-center gap-6 text-sm text-purple-300/60">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span style={{ fontFamily: 'DM Mono, monospace' }}>{selectedPost.date}</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-purple-300/40" />
                    <span>5 min read</span>
                  </div>
                </div>

                <div 
                  className="prose prose-invert prose-lg max-w-none
                    prose-headings:font-bold prose-headings:text-transparent prose-headings:bg-clip-text prose-headings:bg-gradient-to-r prose-headings:from-purple-200 prose-headings:to-pink-200
                    prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                    prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                    prose-p:text-purple-100/70 prose-p:leading-relaxed
                    prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:text-cyan-300
                    prose-blockquote:border-l-2 prose-blockquote:border-purple-500/30 prose-blockquote:pl-6 prose-blockquote:text-purple-200/60
                    prose-code:text-pink-300 prose-code:bg-white/5 prose-code:px-2 prose-code:py-1 prose-code:rounded
                    prose-strong:text-purple-100"
                  style={{ fontFamily: 'Crimson Pro, serif' }}
                  dangerouslySetInnerHTML={{ __html: processedContent }}
                />
              </article>
            ) : (
              // Grid View
              <div className="px-10 py-12">
                {/* Filter Tags */}
                <div className="mb-10">
                  <div className="flex flex-wrap gap-2 mb-8">
                    <button
                      onClick={() => setActiveFilter(null)}
                      className={`px-4 py-2 rounded-full text-xs transition-all ${
                        activeFilter === null 
                          ? 'fluid-glass text-white border border-purple-500/50' 
                          : 'text-purple-300/60 hover:text-purple-200'
                      }`}
                      style={{ fontFamily: 'DM Mono, monospace' }}
                    >
                      all posts
                    </button>
                    {uniqueTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => setActiveFilter(tag)}
                        className={`px-4 py-2 rounded-full text-xs transition-all ${
                          activeFilter === tag 
                            ? 'fluid-glass text-white border border-purple-500/50' 
                            : 'text-purple-300/60 hover:text-purple-200'
                        }`}
                        style={{ fontFamily: 'DM Mono, monospace' }}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Posts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {blogPosts
                    .filter(post => !activeFilter || post.tags.includes(activeFilter))
                    .map((post, index) => (
                    <div 
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className="group liquid-border rounded-2xl card-hover cursor-pointer"
                    >
                      <div className="p-8 fluid-glass rounded-2xl">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex gap-2">
                            {index % 3 === 0 && <Cpu className="w-4 h-4 text-purple-400" />}
                            {index % 3 === 1 && <Code2 className="w-4 h-4 text-cyan-400" />}
                            {index % 3 === 2 && <Zap className="w-4 h-4 text-pink-400" />}
                            <span className="text-[10px] text-purple-400 uppercase tracking-wider" 
                                  style={{ fontFamily: 'DM Mono, monospace' }}>
                              Node_{String(index + 1).padStart(3, '0')}
                            </span>
                          </div>
                          <span className="text-xs text-purple-300/40" style={{ fontFamily: 'DM Mono, monospace' }}>
                            {post.date}
                          </span>
                        </div>
                        
                        <h3 className="text-2xl font-semibold text-purple-100 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-200 group-hover:to-cyan-200 transition-all">
                          {post.title}
                        </h3>
                        
                        <p className="text-purple-200/60 leading-relaxed mb-6" style={{ fontFamily: 'Crimson Pro, serif' }}>
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            {post.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-purple-300/60">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-purple-400/40 group-hover:text-cyan-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-16 text-center">
                  <Layers className="w-6 h-6 text-purple-400/30 mx-auto mb-2 pulse-soft" />
                  <p className="text-xs text-purple-400/40" style={{ fontFamily: 'DM Mono, monospace' }}>
                    {blogPosts.filter(post => !activeFilter || post.tags.includes(activeFilter)).length} synapses connected
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default BlogDrawerFluid;
