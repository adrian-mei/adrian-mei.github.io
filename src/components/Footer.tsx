import React from 'react';
import { Compass } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 py-8 px-6 text-center text-zinc-500">
      <div className="flex items-center justify-center gap-3 mb-2">
        <Compass className="w-5 h-5 text-blue-400 animate-spin" style={{ animationDuration: '10s' }} />
        <p className="text-zinc-400">Always learning. Always building. <span className="text-emerald-400 font-semibold">Always exploring.</span></p>
      </div>
      <p className="text-sm">© 2025 Adrian Mei. Built with passion in San Francisco.</p>
    </footer>
  );
};

export default Footer;
