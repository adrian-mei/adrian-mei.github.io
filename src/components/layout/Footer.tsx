import React from 'react';
import { Compass, Gamepad2 } from 'lucide-react';

const Footer = () => {
  const triggerArcade = () => {
    window.dispatchEvent(new Event('launch-arcade'));
  };

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 py-8 px-6 text-center text-zinc-500 relative overflow-hidden">
      <div className="flex items-center justify-center gap-3 mb-2">
        <Compass className="w-5 h-5 text-blue-400 animate-spin" style={{ animationDuration: '10s' }} />
        <p className="text-zinc-400">Always learning. Always building. <span className="text-emerald-400 font-semibold">Always exploring.</span></p>
      </div>
      <p className="text-sm">© 2025 Adrian Mei. Built with passion in San Francisco.</p>

      {/* Hidden Gem Trigger */}
      <div 
        onClick={triggerArcade}
        className="mt-4 flex items-center justify-center gap-2 text-zinc-800 hover:text-purple-500 transition-colors cursor-pointer pb-4"
      >
        <span className="font-mono text-xs tracking-wider">
          ↑ ↑ ↓ ↓ ← → ← → B A
        </span>
        <Gamepad2 size={14} />
      </div>
    </footer>
  );
};

export default Footer;
