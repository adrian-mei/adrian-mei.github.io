import React from 'react';
import { projects } from '../../../data';
import ProjectCard from './ProjectCard';

const Projects = () => {
  return (
    <section id="projects" className="min-h-screen py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 to-zinc-900/50" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Infrastructure Layers
        </h2>
        <p className="text-zinc-400 text-center mb-16 text-xl">
          Systems engineered for <span className="text-blue-400">scale</span>, built for <span className="text-purple-400">impact</span>
        </p>
        
        <div className="grid md:grid-cols-2 gap-8" style={{ perspective: '1000px' }}>
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
