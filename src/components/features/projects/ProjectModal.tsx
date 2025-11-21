import React, { useEffect } from 'react';
import { X, Calendar, Building2, User } from 'lucide-react';

export type ProjectDetailItem = 
  | string 
  | { type: 'header'; content: string }
  | { type: 'paragraph'; content: string }
  | { type: 'code'; content: string; language?: string }
  | { type: 'list'; content: string[] };

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    tagline: string;
    description: string;
    role?: string;
    company?: string;
    timeline?: string;
    details?: ProjectDetailItem[];
    techStack: string[];
    impact: string;
    link?: string;
  } | null;
}

const ProjectModal = ({ isOpen, onClose, project }: ProjectModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-3xl bg-zinc-900 rounded-2xl border border-zinc-700 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-zinc-800 flex justify-between items-start bg-zinc-900/50">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              {project.title}
            </h2>
            <p className="text-lg text-zinc-300 font-medium">{project.tagline}</p>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close Project Modal"
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
          
          {/* Meta Info Grid */}
          {(project.role || project.company || project.timeline) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 p-4 bg-white/5 rounded-xl border border-white/5">
              {project.role && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Role</div>
                    <div className="text-zinc-200 text-sm">{project.role}</div>
                  </div>
                </div>
              )}
              {project.company && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Company</div>
                    <div className="text-zinc-200 text-sm">{project.company}</div>
                  </div>
                </div>
              )}
              {project.timeline && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Timeline</div>
                    <div className="text-zinc-200 text-sm">{project.timeline}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tech Stack */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, i) => (
                <span key={i} className="px-3 py-1 bg-blue-500/10 text-blue-300 text-sm rounded-full border border-blue-500/20 font-mono">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Impact */}
          <div className="mb-8 text-emerald-400 font-semibold text-lg flex items-center gap-2">
            {project.impact}
          </div>

          {/* Main Description */}
          <div className="space-y-6 text-zinc-300 leading-relaxed">
            <p className="text-lg">{project.description}</p>
            
            {project.details && project.details.length > 0 && (
              <div className="mt-8 border-t border-zinc-800 pt-8">
                <h3 className="text-xl font-bold text-white mb-6">The Story</h3>
                <div className="space-y-6">
                  {project.details.map((detail, i) => {
                    if (typeof detail === 'string') {
                      return (
                        <p key={i} className="text-zinc-300 leading-relaxed text-lg">
                          {detail}
                        </p>
                      );
                    }

                    switch (detail.type) {
                      case 'header':
                        return (
                          <h4 key={i} className="text-xl font-bold text-zinc-100 mt-8 mb-4">
                            {detail.content}
                          </h4>
                        );
                      case 'code':
                        return (
                          <div key={i} className="bg-black/50 rounded-lg p-4 border border-zinc-800 overflow-x-auto my-4">
                            <pre className="font-mono text-sm text-blue-300">
                              {detail.content}
                            </pre>
                          </div>
                        );
                      case 'list':
                        return (
                          <ul key={i} className="list-disc list-inside space-y-2 text-zinc-300 text-lg ml-4">
                            {(detail.content as string[]).map((item, j) => (
                              <li key={j} className="leading-relaxed">
                                <span className="text-zinc-300">{item}</span>
                              </li>
                            ))}
                          </ul>
                        );
                      case 'paragraph':
                      default:
                        return (
                          <p key={i} className="text-zinc-300 leading-relaxed text-lg">
                            {detail.content as string}
                          </p>
                        );
                    }
                  })}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
