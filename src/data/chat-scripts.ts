import { personal, projects, skills } from './portfolio';
import { ChatMessage } from '../services/chat-service';
import { logger } from '../services/logger';

// Helper: Pick random N items from an array
const pickRandom = (arr: string[], n: number): string[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
};

// 1. Suggestion Engine
export const getSuggestions = (messages: ChatMessage[]): string[] => {
  if (messages.length === 0 || messages.length === 1) {
    // Start / Welcome State
    return ["Recruiter", "Founder", "Engineer", "Just browsing"];
  }

  // Analyze Context from History
  const userMessages = messages.filter(m => m.role === 'user');
  const lastUserMsg = userMessages.length > 0 ? userMessages[userMessages.length - 1].content.toLowerCase() : "";
  const allUserText = userMessages.map(m => m.content.toLowerCase()).join(" ");
  
  // Create a combined text of recent interactions (last 5 messages) to detect "Cool Downs"
  // We check both user questions and AI responses (implicitly, by checking what topics were likely discussed)
  const recentHistory = messages.slice(-5).map(m => m.content.toLowerCase()).join(" ");

  // DETECT PERSONA (Persistent across session)
  const isRecruiter = allUserText.includes("recruiter") || allUserText.includes("hiring") || allUserText.includes("talent");
  const isEngineer = allUserText.includes("engineer") || allUserText.includes("developer") || allUserText.includes("code") || allUserText.includes("stack");
  const isFounder = allUserText.includes("founder") || allUserText.includes("startup") || allUserText.includes("product");
  const isBrowser = lastUserMsg.includes("browsing") || lastUserMsg.includes("curious") || lastUserMsg.includes("passing through");

  // DETECT COOLDOWNS (Topics discussed recently)
  const hasDiscussedWarStories = recentHistory.includes("war story") || recentHistory.includes("hardest bug") || recentHistory.includes("scale-ops");
  const hasDiscussedTechStack = recentHistory.includes("tech stack") || recentHistory.includes("technologies") || recentHistory.includes("skills");
  const hasDiscussedContact = recentHistory.includes("contact") || recentHistory.includes("email") || recentHistory.includes("linkedin");
  const hasDiscussedProjects = recentHistory.includes("view projects") || recentHistory.includes("show projects") || recentHistory.includes("portfolio");

  logger.debug('[SuggestionEngine] Analyzing Context', {
    lastUserMsg,
    detectedPersona: { isRecruiter, isEngineer, isFounder, isBrowser },
    cooldowns: { hasDiscussedWarStories, hasDiscussedTechStack, hasDiscussedContact }
  });

  // Helper to filter out cooled-down topics
  const filterCooldowns = (pool: string[]) => {
    return pool.filter(option => {
      const lower = option.toLowerCase();
      if (hasDiscussedWarStories && (lower.includes("war stor") || lower.includes("hardest bug"))) return false;
      if (hasDiscussedTechStack && (lower.includes("tech stack") || lower.includes("skills"))) return false;
      if (hasDiscussedContact && (lower.includes("contact") || lower.includes("hire"))) return false;
      if (hasDiscussedProjects && (lower.includes("view projects") || lower.includes("show projects"))) return false;
      return true;
    });
  };

  // --- 1. Immediate Context Reactions (Highest Priority) ---
  // Note: These override cooldowns because they are direct responses to the VERY last message
  
  // A. Just identified
  if (lastUserMsg.includes("recruiter")) return ["Key Impacts", "Leadership Style", "Download Resume"];
  if (lastUserMsg.includes("engineer")) return ["Tech Stack", "System Architecture", "Hardest Bug"];
  if (lastUserMsg.includes("founder")) return ["Product Velocity", "0 to 1 Mindset", "Contact Info"];
  if (isBrowser) return ["Show Projects", "Tell me a Story", "What's your 'Vibe'?"];

  // B. Specific Project Context
  if (lastUserMsg.includes("scale-ops")) return ["The \"War Story\"", "Tech Stack", "Back to Projects"];
  if (lastUserMsg.includes("aether")) return ["Opinionated Prompting", "Hidden Chain of Thought", "Back to Projects"];

  // --- 2. Persona-based Sticky Pools (Randomized & Filtered) ---
  
  if (isRecruiter) {
     const pool = ["View Projects", "Leadership Experience", "Contact Info", "Team Culture", "Mentorship", "Process Optimization"];
     return pickRandom(filterCooldowns(pool), 3);
  }
  if (isEngineer) {
     const pool = ["View GitHub", "Cloud Architecture", "Frontend Skills", "Backend Patterns", "DevOps Philosophy", "Code Quality"];
     return pickRandom(filterCooldowns(pool), 3);
  }
  if (isFounder) {
     const pool = ["Rapid Prototyping", "Business Alignment", "Contact Info", "MVP Strategy", "Scaling Lessons", "User Focus"];
     return pickRandom(filterCooldowns(pool), 3);
  }

  // --- 3. Default / Fallback (Randomized & Filtered) ---
  const defaultPool = [
    "Show Projects", "My Skills", "About Me", "Contact", "War Stories", 
    "Tech Stack", "My Philosophy", "What drives me?", "Hobbies"
  ];
  
  // If we filtered everything out (rare), fall back to a safety set
  const filteredDefault = filterCooldowns(defaultPool);
  if (filteredDefault.length < 2) {
      return ["Show Projects", "About Me", "Contact"];
  }
  
  return pickRandom(filteredDefault, 3);
};

// 2. Hardcoded Response Engine (Hybrid)
export const getHardcodedResponse = (input: string): string | null => {
  const lower = input.toLowerCase();

  // Helper for Regex Matching
  const match = (pattern: RegExp) => pattern.test(lower);

  // --- SKILLS / TECH STACK ---
  if (match(/(tech stack|technologies|languages|what do you use|skills|capabilities)/)) {
    const core = skills.filter(s => s.category === 'core' || s.category === 'infra').map(s => s.name).join(", ");
    const frontend = skills.filter(s => s.category === 'frontend').map(s => s.name).join(", ");
    return `**Adrian's Tech Stack:**\n\n**Core & Infra:** ${core}\n**Frontend & AI:** ${frontend}\n\nHe believes in using the right tool for the job, but he's deepest in the Kubernetes/Scala ecosystem.`;
  }

  // --- WAR STORIES ---
  if (match(/(war story|hardest bug|biggest challenge|analytics module)/)) {
    const scaleOps = projects.find(p => p.title === "Scale-Ops Core");
    return scaleOps?.story || "He has a few insane stories, but the Scale-Ops migration was a defining moment. Ask me about the 'Analytics Module Chaos'.";
  }

  // --- CONTACT (SAFE) ---
  if (match(/(contact|email|reach out|hire you|resume|cv)/)) {
    return `He's always open to discussing new opportunities. You should definitely **connect with him on LinkedIn** or use the **Contact Form** below to get in touch.`;
  }

  // --- ABOUT ME ---
  if (match(/(about (me|you)|who are you|background|experience)/)) {
    return "Adrian is a Senior Software Engineer who thrives in the chaos of early-stage startups. When he's not shipping zero-downtime migrations, he's usually boxing, hiking, or helping immigrant-owned businesses get online. He's basically a tech wizard with a huge heart for community.";
  }

  // --- EDUCATION ---
  if (match(/(education|degree|university|college)/)) {
    return "He studied Computer Science at **University of California, Irvine (UCI)**.";
  }

  // --- LOCATION ---
  if (match(/(location|where are you|located|based)/)) {
    return "He's currently based in **Irvine, California**.";
  }

  return null; // No hardcoded response, use LLM
};
