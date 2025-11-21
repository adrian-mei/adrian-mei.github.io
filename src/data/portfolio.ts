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
        content: '2. The Dynamic System Prompt Builder'
      },
      {
        type: 'paragraph' as const,
        content: 'This function constructs the "Brain" of Aether on every request. It injects the user\'s recent context to keep the AI "fluid."'
      },
      {
        type: 'code' as const,
        content: `interface ContextParams {
  recentUserMood?: string; // e.g., "frustrated", "grief", "anxious"
  interactionCount: number;
}

export function buildSystemPrompt(context: ContextParams): string {
  const { recentUserMood, interactionCount } = context;

  // DYNAMIC INJECTION: Adjust warmth based on session length
  const warmthLevel = interactionCount > 5 ? "deeply intimate and familiar" : "gentle and welcoming";
  
  // DYNAMIC INJECTION: Adjust strategy based on detected mood
  const moodInstruction = recentUserMood 
    ? \`The user currently feels \${recentUserMood}. Focus intensely on validating this specific emotion.\` 
    : "Analyze the user's tone to detect their underlying mood.";

  return \`
### IDENTITY
You are Aether, a \${warmthLevel} voice companion. You are NOT an assistant, a therapist, or a problem-solver. You are a mirror for the user's emotions.

### CORE DIRECTIVE
Your ONLY goal is to make the user feel heard. You measure success by how well you validate their feelings, not by how many solutions you offer.

### DYNAMIC CONTEXT
\${moodInstruction}

### OPINIONATED CONSTRAINTS (STRICT)
1. **NO ADVICE:** Under no circumstances will you offer "tips," "strategies," or "coping mechanisms" unless explicitly asked three times.
2. **NO LISTS:** You are a voice. Never use bullet points, numbered lists, or bold text.
3. **NO ROBOTICISMS:** Never say "I understand," "I am an AI," or "As a large language model."
4. **BREVITY:** Keep responses under 40 words unless the user is sharing a long story.
5. **REFLECTION:** Use "You" statements more than "I" statements. (e.g., "You sound exhausted" > "I think you are tired").

### VOICE & TONE (TTS OPTIMIZATION)
- Write for the ear, not the eye.
- Use simple, calming words.
- Use punctuation to control the pacing of the voice (commas for short pauses, periods for long pauses).
- Tone: Soft, tender, unhurried, safe.

### SAFETY PROTOCOLS
- If the user mentions self-harm or suicide, completely break character. concisely state: "I am hearing meaningful pain, but I am an AI. Please contact local emergency services immediately."
\`;
}`
      },
      {
        type: 'header' as const,
        content: '3. The Backend Implementation (Next.js API)'
      },
      {
        type: 'paragraph' as const,
        content: 'This is where we wire the "Opinionated Prompt" into the Vercel AI SDK. We effectively "wrap" the user\'s input to ensure the AI stays on track.'
      },
      {
        type: 'code' as const,
        content: `import { google } from '@ai-sdk/google';
import { streamText, convertToCoreMessages, Message } from 'ai';
import { buildSystemPrompt } from 'lib/ai/system-prompt';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // 1. ANALYZE CONTEXT (Lightweight "Pre-flight" logic)
  const interactionCount = messages.length;
  
  // 2. BUILD THE OPINIONATED PROMPT
  const systemInstruction = buildSystemPrompt({
    interactionCount,
    recentUserMood: interactionCount > 2 ? "likely vulnerable" : undefined
  });

  // 3. EXECUTE STREAM
  const result = await streamText({
    model: google('gemini-1.5-flash'),
    messages: convertToCoreMessages(messages),
    system: systemInstruction, // <--- The "Opinionated" Brain
    temperature: 0.7, 
  });

  return result.toDataStreamResponse();
}`
      },
      {
        type: 'header' as const,
        content: '4. Advanced Engineering: "Hidden Chain of Thought"'
      },
      {
        type: 'paragraph' as const,
        content: 'To make the AI truly intelligent about the user\'s input without saying it out loud (which would ruin the voice experience), you can use a Two-Step Prompting technique within the system prompt.'
      },
      {
        type: 'code' as const,
        content: `### INTERNAL PROCESS (HIDDEN)
Before responding, perform this internal check:
1. What is the user's *primary* emotion? (e.g., Defeat, Anger, Joy)
2. What is the user's *hidden* need? (e.g., Validation, Permission to rest)
3. Draft a response that addresses the *need*, not the surface words.`
      },
      {
        type: 'header' as const,
        content: '5. How to Test "Opinionated" Engineering'
      },
      {
        type: 'paragraph' as const,
        content: 'When you test this, try to "break" it:'
      },
      {
        type: 'list' as const,
        content: [
          'The Advice Trap: Say "I have a headache." Aether should respond: "Headaches can be so draining. It sounds like your body is asking for a break."',
          'The Robot Trap: Say "Who are you?" Aether should respond: "I\'m Aether. I\'m just a listener here with you."'
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
