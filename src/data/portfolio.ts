// src/data.ts
import { BookOpen, Compass, Dumbbell, Heart, Server, Cpu, Code2, Users, Camera, Utensils } from 'lucide-react';

export const projects = [
  {
    // INFRASTRUCTURE (The "Senior" Hook)
    title: "Scale-Ops Core",
    tagline: "Infra Layer: Monolith to Microservices Migration",
    description: "Collaborated on a multi-year team initiative to migrate legacy monoliths to a distributed Kubernetes ecosystem. Helped drive 60% faster deployments and a resilient, zero-downtime infrastructure.",
    role: "Senior Software Engineer",
    company: "TrueML Products LLC",
    timeline: "2019 - Present",
    details: [
      "I was right on the front lines of our shift to Kubernetes. Partnering with the DevEx team, I built and deployed the organization's first production microservices on EKS. This wasn't just a pilot, it was the proof of concept that paved the way for our entire migration off legacy EC2.",
      "When our monorepo hit a wall, I helped break through the gridlock. I implemented the GitOps workflows and ArgoCD pipelines that allowed us to split into independent services. We went from waiting in deployment queues to shipping code autonomously, a massive unlock for team velocity.",
      "I took ownership of critical infrastructure and compliance layers. Using Terraform and Atlantis, I codified our cloud resources, eliminating manual fragility. Simultaneously, I developed the Scala API endpoints needed for state-specific debt collection compliance, ensuring our data pipelines adhered to strict regulations.",
      "Beyond backend systems, I bridged the gap to data science. I engineered pipelines to unify voice and email data for auditability and built the internal tooling that accelerated ML model training. It was about giving our data scientists the velocity they needed to innovate."
    ],
    techStack: ["Scala", "Kubernetes", "AWS EKS", "Terraform", "ArgoCD"],
    impact: "🚀 Zero-downtime Migration"
  },
  {
    // ARTIFICIAL INTELLIGENCE (The "Future" Hook)
    title: "Aether",
    tagline: "AI Layer: Empathetic Voice Companion",
    description: "A voice-first empathetic AI companion that listens actively and tracks mood. Bridged the gap between static backends and generative AI, transforming simple queries into intelligent, emotional conversations.",
    techStack: ["Next.js", "React", "Web Speech API", "OpenAI", "Tailwind CSS"],
    impact: "🤖 Empathetic Voice AI"
  },
  {
    // COMMUNITY / FULL STACK (The "Heart" Hook)
    title: "Kindly-Labs",
    tagline: "Community Layer: Tech for Social Good",
    description: "Leading the charge to bridge the digital divide. We build custom web solutions for immigrant-owned businesses, empowering 15+ entrepreneurs to thrive in the digital economy.",
    techStack: ["React", "Python", "PostgreSQL", "Mentorship"],
    impact: "💚 Empowered 15+ Businesses",
    link: "https://www.kindly-labs.org/"
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
