import { KNOWLEDGE_BASE, KnowledgeTopic } from '../data/knowledgeBase';

interface ScoredTopic extends KnowledgeTopic {
  score: number;
}

export function findBestMatch(input: string): KnowledgeTopic | null {
  const lowerInput = input.toLowerCase();

  // 1. Map every topic to a score
  const scored: ScoredTopic[] = KNOWLEDGE_BASE.map((topic) => {
    let score = 0;

    topic.keywords.forEach((keyword) => {
      // Basic Match: Input contains keyword
      if (lowerInput.includes(keyword.toLowerCase())) {
        score += 1;
      }
      
      // Bonus: Exact match (prevents "React" matching "Reaction" - though unlikely with includes, it helps prioritize)
      // For now, we stick to simple inclusion scoring, but this loop is where advanced logic lives.
    });

    return { ...topic, score };
  });

  // 2. Filter out zero scores
  const candidates = scored.filter(t => t.score > 0);

  // 3. Sort: Highest Score first.
  candidates.sort((a, b) => b.score - a.score);

  // 4. Return the winner, or null if no matches
  return candidates.length > 0 ? candidates[0] : null;
}

export const FALLBACK_RESPONSE = {
  text: "I'm tuned to discuss Adrian's **Professional Work**, his **Philosophy** on engineering, or his diverse **Background** and **Hobbies**. Try asking about his **'Go Slow to Move Fast'** mindset, his startup experience, or his motorcycle!",
  suggestions: ["Startup Philosophy", "Education", "Hobbies", "Projects"]
};
