import React, { useState } from 'react';
import { AudioGenerator } from '../features/audio/AudioGenerator';
import { Menu, X } from 'lucide-react';

interface NavigationProps {
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
  onOpenBlog: () => void;
  onOpenGallery: () => void;
}

const Navigation = ({ activeSection, scrollToSection, onOpenBlog, onOpenGallery }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/60 backdrop-blur-xl border-b border-zinc-700/50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent z-50 relative">
          AM
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {['home', 'projects', 'about'].map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className={`capitalize transition-all duration-300 ${
                activeSection === section 
                  ? 'text-blue-400 scale-110' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {section}
            </button>
          ))}
          <button
            onClick={onOpenBlog}
            className="capitalize transition-all duration-300 text-zinc-400 hover:text-blue-400 hover:scale-105"
          >
            Writing
          </button>
          <button
            onClick={onOpenGallery}
            className="capitalize transition-all duration-300 text-zinc-400 hover:text-pink-400 hover:scale-105"
          >
            Photos
          </button>
          <div className="pl-4 border-l border-zinc-700/50">
            <AudioGenerator />
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden z-50 relative flex items-center gap-4">
           <AudioGenerator />
           <button 
             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             className="p-2 text-zinc-400 hover:text-white transition-colors"
           >
             {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
           </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-zinc-900/95 backdrop-blur-xl border-b border-zinc-800 md:hidden animate-in slide-in-from-top-5 duration-200">
          <div className="flex flex-col p-6 gap-4">
            {['home', 'projects', 'about'].map((section) => (
              <button
                key={section}
                onClick={() => {
                  scrollToSection(section);
                  setIsMobileMenuOpen(false);
                }}
                className={`capitalize text-left py-3 px-4 rounded-lg transition-all ${
                  activeSection === section 
                    ? 'bg-blue-500/10 text-blue-400' 
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                }`}
              >
                {section}
              </button>
            ))}
            <div className="h-px bg-zinc-800 my-2" />
            <button
              onClick={() => {
                onOpenBlog();
                setIsMobileMenuOpen(false);
              }}
              className="capitalize text-left py-3 px-4 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-blue-400 transition-all"
            >
              Writing
            </button>
            <button
              onClick={() => {
                onOpenGallery();
                setIsMobileMenuOpen(false);
              }}
              className="capitalize text-left py-3 px-4 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-pink-400 transition-all"
            >
              Photos
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
