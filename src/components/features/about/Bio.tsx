// src/components/about/Bio.tsx
import React from 'react';

const Bio = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-3xl font-bold text-white">
        Engineer by Trade, <span className="text-emerald-400">Human by Design</span>
      </h3>
      
      <div className="text-zinc-400 space-y-6 leading-relaxed text-lg">
        <p>
          I build <strong className="text-blue-400">digital backbones</strong> to support real <strong className="text-purple-400">human connection</strong>.
        </p>
        <p>
          Smart engineering isn't just about code. It's about solving problems for people.
          When the screens go dark, I'm chasing sunsets, running trails, and breathing fresh air.
        </p>
        <p className="font-medium text-zinc-200 italic">
          Technologist by trade. Human by design.
        </p>
      </div>
    </div>
  );
};

export default Bio;
