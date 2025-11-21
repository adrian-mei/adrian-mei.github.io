import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, Clock, Calendar, ChevronRight } from 'lucide-react';
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
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen && !isClosing ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div 
        className={`relative w-full max-w-2xl h-full bg-zinc-900/95 border-l border-zinc-800 shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
          isOpen && !isClosing ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800/50">
          <div className="flex items-center gap-4">
            {selectedPost ? (
              <button 
                onClick={() => setSelectedPost(null)}
                className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-zinc-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Journal
              </h2>
            )}
          </div>
          
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-zinc-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {selectedPost ? (
            // Detail View
            <article className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <header className="mb-8">
                <div className="flex gap-2 mb-4 flex-wrap">
                  {selectedPost.tags.map(tag => (
                    <span key={tag} className="text-xs font-medium px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {tag}
                    </span>
                  ))}
                </div>
                <h1 className="text-3xl font-bold text-zinc-100 mb-4 leading-tight">
                  {selectedPost.title}
                </h1>
                <div className="flex items-center gap-6 text-sm text-zinc-500">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {selectedPost.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {selectedPost.readTime}
                  </span>
                </div>
              </header>
              
              <div 
                className="prose prose-invert prose-zinc max-w-none prose-headings:text-zinc-100 prose-p:text-zinc-300 prose-a:text-blue-400 hover:prose-a:text-blue-300"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              />
            </article>
          ) : (
            // List View
            <div className="p-6 space-y-4">
              {blogPosts.map((post) => (
                <div 
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="group p-6 rounded-2xl bg-zinc-800/30 border border-zinc-800 hover:border-blue-500/30 hover:bg-zinc-800/50 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-2">
                      {post.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs font-medium px-2 py-1 rounded-full bg-zinc-800 text-zinc-400 group-hover:text-blue-400 transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-zinc-500">{post.date}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-zinc-100 mb-2 group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-zinc-400 text-sm line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center text-blue-400 text-sm font-medium opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    Read Article <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDrawer;
