// src/data/portfolio.ts
import { BookOpen, Compass, Dumbbell, Heart, Server, Cpu, Code2, Users, Camera, Utensils } from 'lucide-react';

export const personal = {
  name: "Adrian Mei",
  role: "Senior Software Engineer",
  location: "San Francisco",
  about: "I'm a software engineer who thrives on making an impact in small startup environments. Outside of work, you can find me running, camping, hiking, or boxing. I'm passionate about community and actively volunteer with a nonprofit helping immigrant-owned small businesses in San Francisco. I'm always learning—whether it's taking classes at CCSF or teaching myself how to cook.",
  currentFocus: "Agentic AI patterns",
  funFact: "I once fixed a server while camping. I enjoy going outdoor with hotspot where I can hike and camp, cook delicious food and enjoy mountains and lakes. all that and I can code while doing it.",
  vibe: {
    tone: "Enthusiastic and tech-savvy",
    audienceAdjustment: "Ask who I am speaking with (Recruiters, Founders, Engineers, Friends). Pivot to technical depth for engineers and high-level impact for recruiters."
  },
  hero: {
    tagline: "Infra. AI. Community.",
    description: "Building systems for scale. Cultivating community for impact. Living for the moments in between.",
    primaryAction: "Explore My Work"
  }
};

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
    impact: "🚀 Zero-downtime Migration",
    story: "A few months into my first role, we were tasked with breaking a huge analytics module out of a monolith into its own microservice. I was excited—until I realized the module had literally hundreds of hidden dependencies scattered across the codebase. One service was calling another indirectly through a cache layer, which itself triggered batch jobs that mutated the DB in unexpected ways. The real chaos hit during testing: our microservice was passing all unit tests, but integration tests started failing in bizarre ways. Reports weren't generating, dashboards were empty, and errors were popping in services we didn't even touch. I spent days tracing events through Kafka, Redis, and database triggers, learning to read logs like a detective reads crime scenes. Eventually, we introduced feature flags, added observability, and decoupled the dependencies step by step. The module finally ran independently—and fast. That experience hammered home the lesson that splitting a monolith isn't just refactoring code, it's untangling a living, breathing system."
  },
  {
    // ARTIFICIAL INTELLIGENCE (The "Future" Hook)
    title: "Aether",
    tagline: "AI Layer: Empathetic Voice Companion",
    description: "A voice-first empathetic AI companion that listens actively and tracks mood. Bridged the gap between static backends and generative AI, transforming simple queries into intelligent, emotional conversations.",
    techStack: ["Next.js", "React", "Vercel AI SDK", "Google Gemini", "Web Speech API"],
    impact: "🤖 Empathetic Voice AI",
    link: "https://aether-beige.vercel.app/",
    details: [
      {
        type: 'header' as const,
        content: '1. The "Opinionated" Prompt Architecture'
      },
      {
        type: 'paragraph' as const,
        content: 'We use a Component-Based Prompting strategy. Instead of one giant block of text, we construct the prompt from strict modules.'
      },
      {
        type: 'header' as const,
        content: 'Core Philosophies (The "Opinion"):'
      },
      {
        type: 'list' as const,
        content: [
          'Anti-Solutionism: The AI is strictly forbidden from fixing problems.',
          'Mirroring > Answering: The AI must reflect the user\'s emotion back to them (mirroring) rather than answering questions about itself.',
          'Spoken-Word Optimization: The output must be designed for TTS (Text-to-Speech) no bullet points, no markdown, no emojis, short breathable sentences.'
        ]
      },
      {
        type: 'header' as const,
        content: '2. Implementation Evolution (What Changed)'
      },
      {
        type: 'list' as const,
        content: [
          'Gemini Model: Upgraded from 1.5-flash to **gemini-2.0-flash** for lower latency and better reasoning.',
          'System Prompt: Moved from monolithic to a **Static + Dynamic split**. We cache a large static persona definition and inject lightweight mood/context updates on each turn.',
          'Backend Streaming: Replaced standard streams with a **Custom ReadableStream** that interleaves text deltas with real-time Token Usage & Cost metadata.'
        ]
      },
      {
        type: 'header' as const,
        content: '3. Decision: Real-Time Voice Synthesis Strategy'
      },
      {
        type: 'paragraph' as const,
        content: 'Aether requires a voice interaction experience that feels natural and conversational. The target Time-To-First-Audio (TTFA) is under 2.0 seconds (ideally <1.0s) to avoid the "robotic pause".'
      },
      {
        type: 'header' as const,
        content: 'The Solution: WebGPU + Sentence-Level Streaming'
      },
      {
        type: 'list' as const,
        content: [
          'Engine: kokoro-js running on onnxruntime-web with the WebGPU backend.',
          'Pipeline: Sentence-level streaming from LLM -> Session Manager -> TTS Worker.',
          'Model: fp32 precision Kokoro-82M ONNX model.'
        ]
      },
      {
        type: 'header' as const,
        content: 'Key Rationale'
      },
      {
        type: 'list' as const,
        content: [
          'WebGPU vs WASM: WASM inference was ~1.2s/sentence. WebGPU dropped this to ~80-150ms, eliminating the generation bottleneck.',
          'Sentence-Streaming: We buffer text chunks until a sentence is complete, then immediately generate audio. TTFA drops to ~500ms.',
          'Precision (fp32 vs int8): Quantized q8 models caused audio artifacts on WebGPU. We stuck with fp32 (~300MB) for stability, using browser caching to mitigate download size.',
          'Buffer Management: We explicitly copy audio buffers before transferring from the worker to prevent memory heap detachment issues.',
          'UI Continuity: The useVoiceAgent hook maintains "speaking" state during micro-pauses between sentences to prevent UI flickering.'
        ]
      }
    ]
  },
  {
    // COMMUNITY / FULL STACK (The "Heart" Hook)
    title: "Kindly-Labs",
    tagline: "Community Layer: Tech for Social Good",
    description: "Leading the charge to bridge the digital divide. We build custom web solutions for immigrant-owned businesses, empowering 15+ entrepreneurs to thrive in the digital economy.",
    techStack: ["React", "Python", "PostgreSQL", "Mentorship", "Volunteering"],
    impact: "💚 Empowered 15+ Businesses",
    link: "https://www.kindly-labs.org/",
    motivation: "I grew up in an immigrant family—my parents worked multiple part-time jobs, seven days a week. I see the same hustle in local immigrant-owned businesses: owners wearing every hat, too busy to keep up with the world. Meanwhile, AI hype is booming, but it mostly benefits those in tech bubbles. I'm passionate about bringing tools to these businesses so they can step out of the grind and compete on a level playing field."
  },
  {
    // FULL STACK / REAL TIME (The "Builder" Hook)
    title: "Owly-Live",
    tagline: "Real-Time Layer: Event Streaming",
    description: "Engineered for the massive scale of live events. Optimized WebSockets and Redis caching to handle 10k+ concurrent users with sub-second latency.",
    techStack: ["Golang", "WebSockets", "Redis", "React", "Flutter"],
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
