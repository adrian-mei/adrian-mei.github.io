import Fuse from 'fuse.js';
import { KNOWLEDGE_BASE, KnowledgeTopic } from '../../../data/knowledgeBase';

// Configure Fuse.js for "Fuzzy Determinism"
const fuseOptions = {
  // Weighted Keys: Prioritize Triggers > Keywords > Text
  keys: [
    { name: 'triggers', weight: 1.0 },
    { name: 'keywords', weight: 0.6 },
    { name: 'text', weight: 0.05 } // Reduced from 0.1 to prevent noise from long descriptions
  ],
  includeScore: true,
  threshold: 0.4, // Relaxed (was 0.2) to allow natural language variations (thanks to Heuristics)
  ignoreLocation: true, // Match anywhere in the string
  useExtendedSearch: true
};

// Initialize the index
const fuse = new Fuse(KNOWLEDGE_BASE, fuseOptions);

const normalize = (str: string) => str.toLowerCase().replace(/[^\w\s]/g, '').trim();

// Heuristic: Convert third-person ("he") to second-person ("you") to match triggers
const heuristicNormalize = (str: string) => {
  let normalized = normalize(str);
  
  // Regex replacements for pronouns (word boundaries to avoid partial matches)
  normalized = normalized
    .replace(/\b(he|she|adrian)\b/g, 'you')
    .replace(/\b(his|her|adrian's|adrians)\b/g, 'your')
    .replace(/\b(him)\b/g, 'you')
    .replace(/\b(does)\b/g, 'do'); // "what does he" -> "what do you"
    
  return normalized;
};

// Map topics to their logical successor for "tell me more" flow
const TOPIC_FLOW: Record<string, string> = {
  'greeting': 'bio_intro',
  'bio_intro': 'bio_work_trueml',
  'bio_work_trueml': 'philosophy_leverage',
  'philosophy_leverage': 'projects_overview',
  'projects_overview': 'project_scaleops',
  'project_scaleops': 'project_owly',
  'project_owly': 'project_dapr',
  'project_dapr': 'project_kindly',
  'project_kindly': 'contact',
  'tech_backend': 'tech_infra',
  'tech_infra': 'tech_frontend',
  'tech_frontend': 'projects_overview',
  'hobbies_universal': 'contact'
};

const FOLLOW_UP_TRIGGERS = [
  'tell me more',
  'tell me more about him',
  'tell me more about that',
  'continue',
  'go on',
  'what else',
  'more details',
  'more info',
  'and then'
];

export function findBestMatch(input: string, lastTopicId?: string): KnowledgeTopic | null {
  if (!input.trim()) return null;

  const normalizedInput = normalize(input);
  const heuristicInput = heuristicNormalize(input);

  // 0. Contextual Follow-up: Handle "tell me more" flows
  if (lastTopicId && FOLLOW_UP_TRIGGERS.some(trigger => normalizedInput.includes(trigger))) {
    const nextTopicId = TOPIC_FLOW[lastTopicId];
    if (nextTopicId) {
      const nextTopic = KNOWLEDGE_BASE.find(t => t.id === nextTopicId);
      if (nextTopic) return nextTopic;
    }
  }

  // 1. Priority: Direct Trigger Match (Exact or Contained)
  // We check BOTH the raw input (for "Who is Adrian") and the heuristic input (for "What does he do")
  for (const topic of KNOWLEDGE_BASE) {
    for (const trigger of topic.triggers) {
      const normalizedTrigger = normalize(trigger);
      
      // Check Raw Input vs Trigger
      if (normalizedInput === normalizedTrigger) return topic;
      
      // Check Heuristic Input vs Trigger (e.g. "what does he do" -> "what do you do" == trigger)
      if (heuristicInput === normalizedTrigger) return topic;
    }
  }

  // 2. Fallback: Fuzzy Search
  // Prefer the heuristic input to capture "he" -> "you" mappings in the fuzzy search
  // But if the user typed "Who is Adrian", heuristic is "Who is you", which might fail against "Who is Adrian" trigger if fuzzy.
  // However, "Who is Adrian" should have been caught by Priority 1.
  // So using heuristicInput for Fuzzy Search is safer for generic questions.
  const results = fuse.search(heuristicInput);

  // If we have results, return the best one
  if (results.length > 0) {
    // You could add extra logic here to filter by score threshold if needed
    // e.g., if (results[0].score && results[0].score < 0.01) ...
    
    // TODO: Use lastTopicId to bias results if the score is close?
    // For now, the stricter threshold and direct match should solve the main issues.
    
    return results[0].item;
  }

  return null;
}

export const FALLBACK_RESPONSE = {
  text: "I'm tuned to discuss Adrian's **Professional Work**, his **Philosophy** on engineering, or his diverse **Background** and **Hobbies**. Try asking about his **'Go Slow to Move Fast'** mindset, his startup experience, or his motorcycle!",
  suggestions: ["Startup Philosophy", "Education", "Hobbies", "Projects"]
};
