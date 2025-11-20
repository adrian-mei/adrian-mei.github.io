import React, { useRef } from 'react';
import useIntersectionObserver from '../../../hooks/useIntersectionObserver';
import Bio from './Bio';
import Skills from './Skills';
import Contact from './Contact';

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.2 });

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="min-h-screen py-24 px-6 relative transition-colors duration-1000"
      style={{ 
        background: `linear-gradient(180deg, rgba(24, 24, 27, 0.5) 0%, rgba(16, 185, 129, ${isVisible ? '0.05' : '0'}) 100%)`
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400 bg-clip-text text-transparent">
          The Human Core
        </h2>
        <p className="text-zinc-400 text-center mb-20 text-xl">
          Where engineering meets adventure
        </p>
        
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <Bio />
          <Skills />
        </div>

        <Contact />
      </div>
    </section>
  );
};

export default About;
