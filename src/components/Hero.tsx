import React from 'react';
import { ChevronDown } from 'lucide-react';
import InfrastructureMap from './InfrastructureMap';

interface HeroProps {
  scrollToSection: (sectionId: string) => void;
}

const Hero = ({ scrollToSection }: HeroProps) => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      <InfrastructureMap />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/50 to-zinc-950 pointer-events-none md:hidden" />
      
      <div className="relative z-10 text-center px-6 max-w-5xl">
        <h1 className="text-7xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400 bg-clip-text text-transparent drop-shadow-2xl">
          Adrian Mei
        </h1>
        
        <p className="text-2xl md:text-4xl text-zinc-200 mb-6 font-light tracking-wide">
          Infra. AI. Community.
        </p>
        
        <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto mb-12 leading-relaxed">
          A Full-Stack Engineer bridging the gap between <span className="text-blue-400 font-semibold">cutting-edge technology</span> and <span className="text-emerald-400 font-semibold">social impact</span>. 
          Building scalable distributed systems by day, empowering communities by night.
        </p>
        <button
          onClick={() => scrollToSection('projects')}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-10 py-5 rounded-full font-semibold transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/50 inline-flex items-center gap-3 text-lg"
        >
          Explore My Work
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
