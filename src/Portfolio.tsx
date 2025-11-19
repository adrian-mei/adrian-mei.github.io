import React, { useState, useRef, useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Projects from './components/Projects';
import About from './components/About';
import Footer from './components/Footer';
import { AudioGenerator } from './components/AudioGenerator';
import useIntersectionObserver from './hooks/useIntersectionObserver';

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');

  const heroRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  const isHeroVisible = useIntersectionObserver(heroRef, { threshold: 0.5 });
  const isProjectsVisible = useIntersectionObserver(projectsRef, { threshold: 0.5 });
  const isAboutVisible = useIntersectionObserver(aboutRef, { threshold: 0.5 });

  useEffect(() => {
    if (isHeroVisible) setActiveSection('home');
    else if (isProjectsVisible) setActiveSection('projects');
    else if (isAboutVisible) setActiveSection('about');
  }, [isHeroVisible, isProjectsVisible, isAboutVisible]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen relative">
      <Navigation activeSection={activeSection} scrollToSection={scrollToSection} />
      <main>
        <div ref={heroRef}>
          <Hero scrollToSection={scrollToSection} />
        </div>
        <div ref={projectsRef}>
          <Projects />
        </div>
        <div ref={aboutRef}>
          <About />
        </div>
      </main>
      <Footer />
      <AudioGenerator />
    </div>
  );
};

export default Portfolio;
