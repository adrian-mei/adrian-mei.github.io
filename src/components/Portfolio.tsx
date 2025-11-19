import React, { useState, useEffect, useRef } from 'react';
import { Github, Linkedin, Mail, ExternalLink, ChevronDown, Mountain, Footprints, Dumbbell, BookOpen, Compass } from 'lucide-react';
import * as THREE from 'three';

// Interactive 3D Infrastructure Map Hero
const InfrastructureMap = () => {
  const mountRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create central hub (San Francisco)
    const hubGeometry = new THREE.OctahedronGeometry(2, 0);
    const hubMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x3b82f6,
      wireframe: true
    });
    const hub = new THREE.Mesh(hubGeometry, hubMaterial);
    scene.add(hub);

    // Create orbiting nodes (Projects/Destinations)
    const nodes = [];
    const nodeColors = [0x8b5cf6, 0x06b6d4, 0x10b981, 0xf59e0b];
    
    for (let i = 0; i < 4; i++) {
      const nodeGeometry = new THREE.TetrahedronGeometry(0.8, 0);
      const nodeMaterial = new THREE.MeshBasicMaterial({ 
        color: nodeColors[i],
        wireframe: true
      });
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      
      const angle = (i / 4) * Math.PI * 2;
      const radius = 8;
      node.position.x = Math.cos(angle) * radius;
      node.position.z = Math.sin(angle) * radius;
      node.position.y = Math.sin(i) * 2;
      
      scene.add(node);
      nodes.push({ mesh: node, angle, radius });
    }

    // Create connection lines
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x3b82f6, opacity: 0.3, transparent: true });
    nodes.forEach(node => {
      const points = [hub.position, node.mesh.position];
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(lineGeometry, lineMaterial);
      scene.add(line);
    });

    camera.position.z = 20;
    camera.position.y = 5;

    const handleMouseMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;
      
      // Rotate hub
      hub.rotation.x += 0.005;
      hub.rotation.y += 0.005;
      
      // Orbit nodes with pulsing effect
      nodes.forEach((node, i) => {
        node.angle += 0.005;
        node.mesh.position.x = Math.cos(node.angle) * node.radius;
        node.mesh.position.z = Math.sin(node.angle) * node.radius;
        node.mesh.position.y = Math.sin(time + i) * 2;
        node.mesh.rotation.x += 0.01;
        node.mesh.rotation.y += 0.01;
        
        // Pulsing effect
        const scale = 1 + Math.sin(time * 2 + i) * 0.2;
        node.mesh.scale.set(scale, scale, scale);
      });
      
      // Parallax effect
      camera.position.x += (mouseRef.current.x * 3 - camera.position.x) * 0.05;
      camera.position.y += (-mouseRef.current.y * 3 - camera.position.y + 5) * 0.05;
      camera.lookAt(scene.position);
      
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
};

// Enhanced Project Card with Tech Stack
const ProjectCard = ({ title, tagline, description, techStack, impact, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative bg-zinc-900/40 backdrop-blur-xl rounded-xl p-6 border border-zinc-700/50 hover:border-blue-500/50 transition-all duration-500 cursor-pointer group"
      style={{
        transform: isHovered ? 'translateY(-12px) translateZ(20px) rotateX(2deg)' : 'translateY(0) translateZ(0) rotateX(0)',
        boxShadow: isHovered 
          ? '0 25px 50px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
          : '0 4px 6px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        transformStyle: 'preserve-3d'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all">
          {title}
        </h3>
        <ExternalLink className="w-5 h-5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
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
      <div className="mb-3 text-emerald-400 text-sm font-semibold">
        {impact}
      </div>
      
      <div 
        className="overflow-hidden transition-all duration-500"
        style={{ 
          maxHeight: isHovered ? '500px' : '0',
          opacity: isHovered ? 1 : 0
        }}
      >
        <p className="text-zinc-300 text-sm leading-relaxed pt-2 border-t border-zinc-700/50">
          {description}
        </p>
      </div>
    </div>
  );
};

// Portfolio Component
const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = window.scrollY / totalHeight;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const projects = [
    {
      title: "Kindly-Lab",
      tagline: "Impact Layer: Scaling Good in SF",
      description: "Leading volunteer efforts to provide free technical consulting and development services to immigrant-owned small businesses. Built custom web solutions, automated business processes, and provided technical mentorship to help businesses grow their digital presence.",
      techStack: ["Python", "React", "AWS", "PostgreSQL"],
      impact: "💚 Empowered 15+ immigrant-owned businesses"
    },
    {
      title: "Owly-Live",
      tagline: "Real-Time Layer: Sub-Second Latency for Live Operations",
      description: "Developed a comprehensive event management platform with real-time updates, attendee tracking, and live communication tools. Built scalable backend infrastructure handling thousands of concurrent users with sub-second latency.",
      techStack: ["Golang", "Kubernetes", "WebSocket", "Redis"],
      impact: "⚡ Handled 10K+ concurrent users"
    },
    {
      title: "Zeneris",
      tagline: "Intelligence Layer: AI-Powered Habit Formation",
      description: "Created an AI-powered fitness app that integrates with calendar APIs to intelligently schedule workout sessions based on user availability and preferences. Implemented machine learning algorithms to optimize scheduling and improve user adherence.",
      techStack: ["TypeScript", "TensorFlow", "Node.js"],
      impact: "🎯 85% user retention rate"
    },
    {
      title: "DocuText",
      tagline: "Processing Layer: Enterprise-Grade OCR Pipeline",
      description: "Built a document processing application leveraging OCR technology to extract and analyze text from various document formats. Implemented efficient batch processing and provided a clean API for integration with other services.",
      techStack: ["Python", "Tesseract", "FastAPI", "S3"],
      impact: "📄 Processed 50K+ documents"
    }
  ];

  const skills = [
    { name: 'Python', category: 'core' },
    { name: 'Scala', category: 'core' },
    { name: 'Golang', category: 'core' },
    { name: 'TypeScript', category: 'core' },
    { name: 'AWS (EKS, EC2)', category: 'infra' },
    { name: 'Kubernetes', category: 'infra' },
    { name: 'Terraform', category: 'infra' },
    { name: 'ArgoCD', category: 'infra' },
    { name: 'GitOps', category: 'infra' }
  ];

  const interests = [
    { icon: Footprints, label: 'Running', color: 'text-blue-400' },
    { icon: Mountain, label: 'Hiking & Camping', color: 'text-emerald-400' },
    { icon: Dumbbell, label: 'Boxing', color: 'text-orange-400' },
    { icon: BookOpen, label: 'Learning at CCSF', color: 'text-purple-400' }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(sectionId);
  };

  // Color transition based on scroll
  const accentColor = scrollProgress > 0.5 ? 'rgb(16, 185, 129)' : 'rgb(59, 130, 246)';

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen relative">
      {/* Navigation with glassmorphism */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/60 backdrop-blur-xl border-b border-zinc-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            AM
          </div>
          <div className="flex gap-8">
            {['home', 'projects', 'about'].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`capitalize transition-all duration-300 ${
                  activeSection === section 
                    ? 'text-blue-400 scale-110' 
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {section}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <InfrastructureMap />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/50 to-zinc-950 pointer-events-none" />
        
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <h1 className="text-7xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Adrian Mei
          </h1>
          <p className="text-3xl md:text-4xl text-zinc-200 mb-4 font-light">
            Architecting Scale, Exploring The World
          </p>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            Senior Software Engineer specializing in <span className="text-blue-400 font-semibold">Distributed Systems</span> and <span className="text-purple-400 font-semibold">DevOps</span>, driven by impact in high-growth startups and the local community.
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

      {/* Projects Section */}
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
              <ProjectCard key={index} {...project} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* About & Contact Section with color transition */}
      <section 
        id="about" 
        className="min-h-screen py-24 px-6 relative transition-colors duration-1000"
        style={{ 
          background: `linear-gradient(180deg, rgba(24, 24, 27, 0.5) 0%, rgba(16, 185, 129, ${scrollProgress > 0.5 ? '0.05' : '0'}) 100%)`
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
            {/* Personal Bio with glassmorphism */}
            <div className="bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-8 border border-zinc-700/50 shadow-2xl">
              <h3 className="text-3xl font-bold text-transparent bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text mb-6">
                Who I Am
              </h3>
              
              <p className="text-zinc-300 leading-relaxed text-lg mb-8">
                I'm a software engineer who thrives on making an impact in small startup environments. 
                Outside of work, you can find me running, camping, hiking, or boxing. I'm passionate about 
                community and actively volunteer with a nonprofit helping immigrant-owned small businesses 
                in San Francisco. I'm always learning—whether it's taking classes at CCSF or teaching myself 
                how to cook.
              </p>

              {/* Interests with Icons */}
              <div className="grid grid-cols-2 gap-4">
                {interests.map((interest, i) => (
                  <div key={i} className="flex items-center gap-3 bg-zinc-800/50 rounded-lg p-3 backdrop-blur">
                    <interest.icon className={`w-6 h-6 ${interest.color}`} />
                    <span className="text-zinc-300 text-sm font-medium">{interest.label}</span>
                  </div>
                ))}
              </div>

              {/* Founder Mindset Section */}
              <div className="mt-8 pt-8 border-t border-zinc-700/50">
                <h4 className="text-xl font-bold text-blue-400 mb-3">💡 The Founder Mindset</h4>
                <p className="text-zinc-400 leading-relaxed">
                  I approach every engineering problem with the founder's lens: efficiency, rapid iteration, 
                  and ruthless prioritization—skills I've honed by launching solo projects and working in 
                  high-velocity startup environments.
                </p>
              </div>
            </div>

            {/* Skills & Experience */}
            <div className="bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-8 border border-zinc-700/50 shadow-2xl">
              <h3 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text mb-6">
                Technical Arsenal
              </h3>
              
              {/* Cloud Diagram Style Skills */}
              <div className="mb-8">
                <div className="flex flex-wrap gap-3 justify-center mb-6">
                  {skills.filter(s => s.category === 'core').map((skill, i) => (
                    <span
                      key={i}
                      className="px-5 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-xl text-base font-semibold border border-blue-500/30 hover:scale-110 transition-transform backdrop-blur"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {skills.filter(s => s.category === 'infra').map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-2 bg-purple-500/10 text-purple-300 rounded-lg text-sm font-medium border border-purple-500/20 hover:scale-105 transition-transform"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-2xl font-semibold text-zinc-200 mb-6 flex items-center gap-2">
                  <span className="text-2xl">🚀</span> Impact Highlights
                </h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 bg-zinc-800/50 rounded-lg p-4 backdrop-blur">
                    <span className="text-blue-400 text-xl">▹</span>
                    <span className="text-zinc-300 leading-relaxed">Built scalable distributed systems at high-growth startups</span>
                  </div>
                  <div className="flex items-start gap-3 bg-zinc-800/50 rounded-lg p-4 backdrop-blur">
                    <span className="text-purple-400 text-xl">▹</span>
                    <span className="text-zinc-300 leading-relaxed">Led infrastructure modernization and cloud migrations</span>
                  </div>
                  <div className="flex items-start gap-3 bg-zinc-800/50 rounded-lg p-4 backdrop-blur">
                    <span className="text-emerald-400 text-xl">▹</span>
                    <span className="text-zinc-300 leading-relaxed">Mentored junior engineers and led technical initiatives</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section with enhanced glassmorphism */}
          <div className="text-center bg-gradient-to-br from-zinc-900/60 to-zinc-800/40 backdrop-blur-xl rounded-2xl p-12 border border-zinc-700/50 shadow-2xl">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-4">
              Let's Connect
            </h3>
            <p className="text-zinc-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              I'm always open to discussing new projects, collaboration opportunities, or startup ideas. 
              Let's build something impactful together.
            </p>
            <div className="flex justify-center gap-6 mb-8">
              <a
                href="mailto:adrianzmei@gmail.com"
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full font-semibold transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/50"
              >
                <Mail className="w-5 h-5" />
                Get In Touch
              </a>
            </div>
            <div className="flex justify-center gap-6">
              <a
                href="https://linkedin.com/in/adrianmei"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-zinc-800/80 hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur"
              >
                <Linkedin className="w-7 h-7" />
              </a>
              <a
                href="https://github.com/adrianmei"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-zinc-800/80 hover:bg-gradient-to-br hover:from-purple-500 hover:to-purple-600 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur"
              >
                <Github className="w-7 h-7" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer with compass */}
      <footer className="bg-zinc-950 border-t border-zinc-800 py-8 px-6 text-center text-zinc-500">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Compass className="w-5 h-5 text-blue-400 animate-spin" style={{ animationDuration: '10s' }} />
          <p className="text-zinc-400">Always learning. Always building. <span className="text-emerald-400 font-semibold">Always exploring.</span></p>
        </div>
        <p className="text-sm">© 2025 Adrian Mei. Built with passion in San Francisco.</p>
      </footer>
    </div>
  );
};

export default Portfolio;
