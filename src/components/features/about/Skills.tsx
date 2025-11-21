// src/components/about/Skills.tsx
import React from 'react';
import { skills } from '../../../data/portfolio';

const Skills = () => {
  // Group skills for better display
  const infra = skills.filter(s => s.category === 'infra');
  const core = skills.filter(s => s.category === 'core' || s.category === 'ai' || s.category === 'frontend');

  return (
    <div className="space-y-8">
      <div>
        <h4 className="text-xl font-semibold mb-4 text-blue-400 flex items-center gap-2">
          Building The Foundation (Infra)
        </h4>
        <div className="flex flex-wrap gap-3">
          {infra.map((skill) => (
            <span key={skill.name} className="px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-200 text-sm">
              {skill.name}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xl font-semibold mb-4 text-purple-400 flex items-center gap-2">
          Crafting The Intelligence (AI & Code)
        </h4>
        <div className="flex flex-wrap gap-3">
          {core.map((skill) => (
            <span key={skill.name} className="px-3 py-2 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-200 text-sm">
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
