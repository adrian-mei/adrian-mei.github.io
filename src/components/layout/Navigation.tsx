import React from 'react';
import { AudioGenerator } from '../features/audio/AudioGenerator';

interface NavigationProps {
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
}

const Navigation = ({ activeSection, scrollToSection }: NavigationProps) => {
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
          <div className="pl-4 border-l border-zinc-700/50">
            <AudioGenerator />
          </div>
        </div>

        {/* Mobile Audio Control (No Menu) */}
        <div className="md:hidden z-50 relative">
           <AudioGenerator />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
