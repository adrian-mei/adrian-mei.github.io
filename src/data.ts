// src/data.ts
import { BookOpen, Compass, Dumbbell, Heart, Server, Cpu, Code2, Users } from 'lucide-react';

export const projects = [
  {
    // INFRASTRUCTURE (The "Senior" Hook)
    title: "Scale-Ops Core",
    tagline: "Infra Layer: Monolith to Microservices Migration",
    description: "Architected the complete migration of legacy EC2 monoliths to a distributed EKS Kubernetes ecosystem. Designed GitOps workflows with ArgoCD, implemented Terraform for IaC, and reduced deployment friction by 60% across the engineering organization.",
    techStack: ["Scala", "Kubernetes", "AWS EKS", "Terraform", "ArgoCD"],
    impact: "🚀 Zero-downtime Migration"
  },
  {
    // ARTIFICIAL INTELLIGENCE (The "Future" Hook)
    title: "Dapr-LLM Agent",
    tagline: "AI Layer: Conversational Intelligence",
    description: "Engineered a prototype integration using Dapr's Conversation API to weave LLM capabilities into backend services. Focused on creating state-aware AI agents capable of handling complex customer service queries with context retention.",
    techStack: ["Python", "Dapr", "LLMs", "Docker", "FastAPI"],
    impact: "🤖 Context-Aware Agents"
  },
  {
    // COMMUNITY / FULL STACK (The "Heart" Hook)
    title: "Kindly-Lab",
    tagline: "Community Layer: Tech for Social Good",
    description: "Leading volunteer engineering efforts to digitalize immigrant-owned small businesses in SF. Built custom React/Python web solutions and provided technical mentorship to bridge the digital divide for underrepresented entrepreneurs.",
    techStack: ["React", "Python", "PostgreSQL", "Mentorship"],
    impact: "💚 Empowered 15+ Businesses"
  },
  {
    // FULL STACK / REAL TIME (The "Builder" Hook)
    title: "Owly-Live",
    tagline: "Real-Time Layer: Event Streaming",
    description: "Built a high-concurrency event management platform handling thousands of simultaneous users. Optimized WebSocket connections for sub-second latency and implemented Redis caching strategies for live attendee tracking.",
    techStack: ["Golang", "WebSockets", "Redis", "React"],
    impact: "⚡ 10K+ Concurrent Users"
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
  { icon: Compass, label: 'Traveling', color: 'text-blue-400' },
  { icon: Dumbbell, label: 'Boxing & Fitness', color: 'text-orange-400' },
  { icon: BookOpen, label: 'Continuous Learning', color: 'text-purple-400' }
];
