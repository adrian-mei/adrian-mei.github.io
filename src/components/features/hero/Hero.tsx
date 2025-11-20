import React from 'react';
import { ChevronDown } from 'lucide-react';
import InfrastructureMap from './InfrastructureMap';

interface HeroProps {
  scrollToSection: (sectionId: string) => void;
}

const Hero = ({ scrollToSection }: HeroProps) => {
  return (
    <section id="home" className="relative h-screen flex flex-col justify-center md:justify-between gap-12 md:gap-0 py-20 md:py-32 overflow-hidden">
      <InfrastructureMap />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/50 to-zinc-950 pointer-events-none md:hidden" />
      
      {/* Top Section: Name */}
      <div className="relative z-10 text-center px-6 w-full">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400 bg-clip-text text-transparent drop-shadow-2xl">
          Adrian Mei
        </h1>
      </div>

      {/* Middle Section is empty to reveal animation */}
      
      {/* Bottom Section: Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto w-full">
        <div className="mb-6 space-y-2">
          <p className="text-xl md:text-4xl text-zinc-200 font-light tracking-wide">
            Infra. AI. Community.
          </p>
          <p className="text-lg md:text-2xl text-zinc-500 font-light tracking-wider uppercase">
            Based in San Francisco
          </p>
        </div>
        
        <p className="text-base md:text-xl text-zinc-400 max-w-3xl mx-auto mb-12 leading-relaxed">
          Building systems for <span className="text-blue-400 font-semibold">scale</span>. 
          Cultivating community for <span className="text-emerald-400 font-semibold">impact</span>. 
          Living for the moments in between.
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
