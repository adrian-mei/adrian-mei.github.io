import React from 'react';
import { ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  tagline: string;
  description: string;
  techStack: string[];
  impact: string;
  link?: string;
  onClick?: () => void;
}

const ProjectCard = ({ title, tagline, description, techStack, impact, link, onClick }: ProjectCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`relative bg-zinc-900/40 backdrop-blur-xl rounded-xl p-6 border border-zinc-700/50 hover:border-blue-500/50 transition-all duration-300 group hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all">
          {link ? (
            <a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:underline decoration-blue-400/30 underline-offset-4"
              onClick={(e) => e.stopPropagation()}
            >
              {title}
            </a>
          ) : (
            title
          )}
        </h3>
        {link ? (
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-1 hover:bg-white/5 rounded-full transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-5 h-5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
          </a>
        ) : (
          <div className="p-1">
            <ExternalLink className="w-5 h-5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
          </div>
        )}
      </div>
      
      <p className="text-zinc-300 mb-4 font-medium text-sm">{tagline}</p>
      
      {/* Tech Stack Blueprint */}
      <div className="mb-4 flex flex-wrap gap-2">
        {techStack.map((tech, i) => (
          <span key={i} className="px-2 py-1 bg-blue-500/10 text-blue-300 text-xs rounded border border-blue-500/20 font-mono">
            {tech}
          </span>
        ))}
      </div>
      
      {/* Impact Metrics */}
      <div className="mb-4 text-emerald-400 text-sm font-semibold">
        {impact}
      </div>
      
      <p className="text-zinc-300 text-sm leading-relaxed pt-4 border-t border-zinc-700/50">
        {description}
      </p>
    </div>
  );
};

export default ProjectCard;
