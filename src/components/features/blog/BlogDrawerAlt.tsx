import React, { useState } from 'react';
import { X, ArrowLeft, Sparkles, Clock, ChevronRight, Pause, Play, Volume2, Dot, Minus, Plus } from 'lucide-react';
import { blogPosts } from '../../../data/blog';
import { useBlogDrawer } from '@/src/hooks/blog/useBlogDrawer';

interface BlogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const BlogDrawerAlt = ({ isOpen, onClose }: BlogDrawerProps) => {
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
  } = useBlogDrawer({ isOpen, onClose, closeDelay: 400 });

  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  // Font size classes
  const getFontSizeClass = () => {
    switch(fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };

  if (!isOpen && !isClosing) return null;

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Space+Mono:wght@400;700&family=Manrope:wght@200;300;400;500;600&display=swap');

          .minimal-glass {
            background: rgba(250, 250, 250, 0.97);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
          }

          .minimal-glass-dark {
            background: rgba(18, 18, 18, 0.97);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
          }

          .ai-grid {
            background-image: 
              linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px);
            background-size: 50px 50px;
            background-position: -1px -1px;
          }

          .neural-pattern {
            background-image: radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
                              radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.05) 0%, transparent 50%);
          }

          @keyframes scan {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }

          .scan-line {
            background: linear-gradient(to bottom, 
              transparent, 
              rgba(59, 130, 246, 0.1), 
              transparent);
            height: 100px;
            animation: scan 8s linear infinite;
          }

          .reading-mode {
            font-family: 'EB Garamond', serif;
            letter-spacing: 0.01em;
            line-height: 1.7;
          }

          .mono-ui {
            font-family: 'Space Mono', monospace;
            letter-spacing: -0.02em;
          }

          /* Minimal scrollbar */
          .minimal-scroll::-webkit-scrollbar {
            width: 2px;
          }
          
          .minimal-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          
          .minimal-scroll::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 1px;
          }
          
          .minimal-scroll-dark::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
          }

          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }

          .cursor-blink {
            animation: blink 1s infinite;
          }

          .hover-underline {
            position: relative;
          }

          .hover-underline::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0;
            height: 1px;
            background: currentColor;
            transition: width 0.3s ease;
          }

          .hover-underline:hover::after {
            width: 100%;
          }

          /* Content animations */
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .fade-up {
            animation: fadeUp 0.6s ease-out forwards;
          }

          .stagger-1 { animation-delay: 0.1s; }
          .stagger-2 { animation-delay: 0.2s; }
          .stagger-3 { animation-delay: 0.3s; }
        `}
      </style>

      <div className="fixed inset-0 z-[60] flex justify-end" style={{ fontFamily: 'Manrope, sans-serif' }}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 transition-all duration-500 ${
            isOpen && !isClosing ? 'opacity-100 bg-white/60 backdrop-blur-sm' : 'opacity-0'
          }`}
          onClick={handleClose}
        />

        {/* Drawer */}
        <div 
          className={`relative w-full max-w-[1000px] h-full minimal-glass-dark transform transition-transform duration-400 ease-out flex flex-col overflow-hidden ${
            isOpen && !isClosing ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 ai-grid pointer-events-none opacity-50" />
          <div className="absolute inset-0 neural-pattern pointer-events-none" />
          
          {/* Scanning effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
            <div className="scan-line" />
          </div>

          {/* Header */}
          <header className="relative z-10 border-b border-white/10">
            <div className="flex items-center justify-between px-8 py-5">
              <div className="flex items-center gap-6">
                {selectedPost ? (
                  <>
                    <button 
                      onClick={() => setSelectedPost(null)}
                      className="mono-ui text-xs text-gray-400 hover:text-white transition-colors hover-underline"
                    >
                      ← index
                    </button>

                    <div className="flex items-center gap-4 text-gray-500">
                      <button 
                        onClick={toggleSpeech}
                        className={`mono-ui text-xs transition-colors ${
                          isSpeaking ? 'text-blue-400' : 'hover:text-white'
                        }`}
                      >
                        {isSpeaking ? '[■]' : '[▶]'} audio
                      </button>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setFontSize('small')}
                          className={`text-xs transition-colors ${fontSize === 'small' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                        >
                          A
                        </button>
                        <button 
                          onClick={() => setFontSize('medium')}
                          className={`text-sm transition-colors ${fontSize === 'medium' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                        >
                          A
                        </button>
                        <button 
                          onClick={() => setFontSize('large')}
                          className={`text-base transition-colors ${fontSize === 'large' ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                        >
                          A
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                    </div>
                    <h2 className="mono-ui text-sm text-white">
                      NEURAL_ARCHIVE<span className="cursor-blink">_</span>
                    </h2>
                  </div>
                )}
              </div>
              
              <button 
                onClick={handleClose}
                className="mono-ui text-xs text-gray-400 hover:text-white transition-colors"
              >
                [×] close
              </button>
            </div>

            {/* Progress indicator */}
            {selectedPost && (
              <div className="absolute bottom-0 left-0 h-[1px] bg-white/10 w-full">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transition-all duration-300"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>
            )}
          </header>

          {/* Content */}
          <main 
            ref={contentRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto minimal-scroll minimal-scroll-dark"
          >
            {selectedPost ? (
              // Article View
              <article className="px-8 md:px-16 py-12 max-w-3xl mx-auto">
                <div className="fade-up">
                  <div className="mb-8">
                    <div className="mono-ui text-[10px] text-blue-400 mb-4 tracking-wider">
                      {selectedPost.tags.map((tag, i) => (
                        <span key={tag}>
                          {i > 0 && ' · '}
                          #{tag.toUpperCase()}
                        </span>
                      ))}
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight tracking-tight stagger-1 fade-up">
                      {selectedPost.title}
                    </h1>
                    
                    <div className="text-lg text-gray-400 mb-8 leading-relaxed stagger-2 fade-up">
                      {selectedPost.excerpt}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 mono-ui stagger-3 fade-up">
                      <span>{selectedPost.date}</span>
                      <Dot className="w-3 h-3" />
                      <span>5 MIN READ</span>
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-12" />

                  <div 
                    className={`reading-mode ${getFontSizeClass()} text-gray-300 
                      prose prose-invert max-w-none
                      prose-headings:font-light prose-headings:text-white prose-headings:tracking-tight
                      prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
                      prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                      prose-p:text-gray-300 prose-p:mb-6
                      prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                      prose-blockquote:border-l-2 prose-blockquote:border-white/20 prose-blockquote:pl-4 prose-blockquote:text-gray-400
                      prose-code:text-purple-400 prose-code:bg-white/5 prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:text-sm`}
                    dangerouslySetInnerHTML={{ __html: processedContent }}
                  />
                </div>
              </article>
            ) : (
              // List View - Minimal Cards
              <div className="px-8 py-12">
                <div className="mb-12">
                  <div className="mono-ui text-[10px] text-gray-500 tracking-wider mb-8">
                    SHOWING {blogPosts.length} ENTRIES // SORTED BY DATE_DESC
                  </div>
                </div>

                <div className="space-y-1">
                  {blogPosts.map((post, index) => (
                    <div 
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className="group relative bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] hover:border-white/10 rounded-lg p-8 cursor-pointer transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-8">
                          <div className="mono-ui text-[10px] text-gray-500 mb-3">
                            ENTRY_{String(index + 1).padStart(3, '0')} // {post.date}
                          </div>
                          
                          <h3 className="text-xl text-white mb-3 group-hover:text-blue-400 transition-colors">
                            {post.title}
                          </h3>
                          
                          <p className="text-sm text-gray-400 leading-relaxed mb-4">
                            {post.excerpt}
                          </p>
                          
                          <div className="flex gap-2">
                            {post.tags.map(tag => (
                              <span key={tag} className="mono-ui text-[10px] px-2 py-1 rounded bg-white/5 text-gray-500">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-center w-12 h-12 rounded-full border border-white/10 group-hover:border-blue-400/50 transition-all">
                          <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-all group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-16 text-center">
                  <div className="mono-ui text-[10px] text-gray-600">
                    END_OF_ARCHIVE // NULL_TERMINATED
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default BlogDrawerAlt;
