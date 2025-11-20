// src/data.ts
import { BookOpen, Compass, Dumbbell, Heart, Server, Cpu, Code2, Users, Camera, Utensils } from 'lucide-react';

export const projects = [
  {
    // INFRASTRUCTURE (The "Senior" Hook)
    title: "Scale-Ops Core",
    tagline: "Infra Layer: Monolith to Microservices Migration",
    description: "Architected the shift from legacy monoliths to a distributed Kubernetes ecosystem. The result? 60% faster deployments and a resilient, zero-downtime infrastructure.",
    techStack: ["Scala", "Kubernetes", "AWS EKS", "Terraform", "ArgoCD"],
    impact: "🚀 Zero-downtime Migration"
  },
  {
    // ARTIFICIAL INTELLIGENCE (The "Future" Hook)
    title: "Dapr-LLM Agent",
    tagline: "AI Layer: Conversational Intelligence",
    description: "Bridged the gap between static backends and generative AI. Built state-aware agents that retain context, transforming simple queries into intelligent conversations.",
    techStack: ["Python", "Dapr", "LLMs", "Docker", "FastAPI"],
    impact: "🤖 Context-Aware Agents"
  },
  {
    // COMMUNITY / FULL STACK (The "Heart" Hook)
    title: "Kindly-Lab",
    tagline: "Community Layer: Tech for Social Good",
    description: "Leading the charge to bridge the digital divide. We build custom web solutions for immigrant-owned businesses, empowering 15+ entrepreneurs to thrive in the digital economy.",
    techStack: ["React", "Python", "PostgreSQL", "Mentorship"],
    impact: "💚 Empowered 15+ Businesses"
  },
  {
    // FULL STACK / REAL TIME (The "Builder" Hook)
    title: "Owly-Live",
    tagline: "Real-Time Layer: Event Streaming",
    description: "Engineered for the massive scale of live events. Optimized WebSockets and Redis caching to handle 10k+ concurrent users with sub-second latency.",
    techStack: ["Golang", "WebSockets", "Redis", "React"],
    impact: "⚡ 10K+ Concurrent Users",
    link: "https://owlylive.netlify.app/"
  }
];

export const skills = [
  { name: 'Kubernetes & EKS', category: 'infra', icon: Server },
  { name: 'Terraform & IaC', category: 'infra', icon: Server },
  { name: 'Scala & Golang', category: 'core', icon: Code2 },
  { name: 'Python & AI/ML', category: 'ai', icon: Cpu },
  { name: 'React & TypeScript', category: 'frontend', icon: Code2 },
  { name: 'Community Leadership', category: 'soft', icon: Users },
];

export const interests = [
  { icon: Heart, label: 'Community Volunteering', color: 'text-red-400' },
  { icon: Compass, label: 'Traveling & Moto', color: 'text-blue-400' },
  { icon: Dumbbell, label: 'Boxing, Swim & Run', color: 'text-orange-400' },
  { icon: Camera, label: 'Photo & Video', color: 'text-pink-400' },
  { icon: Utensils, label: 'Culinary Arts', color: 'text-yellow-400' },
  { icon: BookOpen, label: 'Continuous Learning', color: 'text-purple-400' }
];
