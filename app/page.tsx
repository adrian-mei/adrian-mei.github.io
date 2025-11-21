"use client";

import React, { useState, useRef, useEffect } from 'react';
import Navigation from '../src/components/layout/Navigation';
import Hero from '../src/components/features/hero/Hero';
import Projects from '../src/components/features/projects/Projects';
import About from '../src/components/features/about/About';
import Footer from '../src/components/layout/Footer';
import ChatInterface from '../src/components/features/chat/ChatInterface';
import GameManager from '../src/components/features/arcade/GameManager';
import ErrorBoundary from '../src/components/ErrorBoundary';
import useIntersectionObserver from '../src/hooks/useIntersectionObserver';
import useExtensionDetector from '../src/hooks/useExtensionDetector';

const Home = () => {
  const { isDetected, extensionName } = useExtensionDetector();
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

  useEffect(() => {
    if (isDetected) {
      console.warn(`[Security] Dark Mode Extension Detected & Neutralized: ${extensionName}`);
    }
  }, [isDetected, extensionName]);

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
      <ErrorBoundary>
        <ChatInterface />
      </ErrorBoundary>
      <GameManager />
    </div>
  );
};

export default Home;
