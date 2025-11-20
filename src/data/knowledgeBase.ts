export type KnowledgeTopic = {
  id: string;
  keywords: string[];   // Words to watch for
  text: string;         // The response
  priority?: number;    // Tie-breaker (optional)
  suggestions: string[]; // Follow-up buttons for the user
  action?: 'contact_form'; // Optional: Triggers a special UI/Logic flow
};

export const KNOWLEDGE_BASE: KnowledgeTopic[] = [
  // --- BIO & IDENTITY ---
  {
    id: 'bio_intro',
    keywords: ['who', 'adrian', 'bio', 'background', 'yourself', 'intro', 'me', 'summary', 'profile'],
    text: "I'm Adrian, a Full Stack Engineer specializing in scalable web architectures. I have a passion for React, Node.js, and cloud infrastructure. I combine the discipline of formal theory with the adaptability of a startup veteran.",
    suggestions: ["What is his philosophy?", "View Projects", "Tech Stack"]
  },
  {
    id: 'bio_identity',
    keywords: ['background', 'chinese', 'asian', 'american', 'origin', 'from', 'sf', 'san francisco', 'bay area', 'culture', 'location', 'live', 'based', 'where'],
    text: "Based in **San Francisco**, Adrian is a proud **Chinese Asian American**. This cultural perspective shapes his inclusive approach to community and tech. He thrives in the vibrant, diverse energy of the Bay Area, utilizing his background to bridge gaps and foster collaboration in high-performance teams.",
    suggestions: ["What is his philosophy?", "Community Work", "Hobbies"]
  },
  {
    id: 'bio_education',
    keywords: ['csulb', 'university', 'college', 'degree', 'education', 'school', '2018', 'study', 'grad', 'major', 'computer science'],
    text: "Adrian is a 2018 graduate of **CSULB (California State University, Long Beach)**. While his academic foundation provided the rigor for his engineering career, his true education came from the fast-paced, hands-on demands of the San Francisco tech scene.",
    suggestions: ["What is his philosophy?", "Tell me about his background", "View Projects"]
  },
  {
    id: 'bio_work_trueml',
    keywords: ['work', 'job', 'career', 'experience', 'trueml', 'trueaccord', 'fintech', 'history', 'resume', 'role', 'position', 'current'],
    text: "For the past 6 years, Adrian has been a key engineer at **TrueML (formerly TrueAccord)**. As a backend-leaning engineer with a fintech background, he wears multiple hats—building backend systems, internal tools, and automation. His focus is stepping into ambiguous problems and turning them into scalable, repeatable solutions.",
    suggestions: ["What is his philosophy?", "Tell me about Automation", "Tech Stack"]
  },

  // --- PHILOSOPHY & FOCUS ---
  {
    id: 'philosophy_leverage',
    keywords: ['philosophy', 'mindset', 'calm', 'meditation', 'focus', 'fast', 'speed', 'values', 'culture', 'startup', 'leverage', 'automation', 'friction', 'principle'],
    text: "Adrian is big on **creating leverage**. He transforms friction into systems that accelerate the entire organization. By automating recurring, messy tasks, he gives the team back the mental bandwidth to iterate and innovate. It's about 'Going Slow to Move Fast'—building deliberate tools that prevent the need to fight the same fires every week.",
    suggestions: ["What internal tools?", "View Projects", "Contact"]
  },
  {
    id: 'focus_internal_tools',
    keywords: ['internal tools', 'workflow', 'onboarding', 'offboarding', 'overhead', 'operational', 'process', 'efficiency'],
    text: "Recently, Adrian has focused on building internal workflow tools to reduce operational overhead. He's improved **onboarding/offboarding** processes and streamlined communication between engineering and non-technical teams. He loves modernizing backend stacks to ensure the machinery of the business runs as smoothly as the product itself.",
    suggestions: ["What tech stack?", "Work History", "Philosophy"]
  },
  {
    id: 'leadership',
    keywords: ['lead', 'leader', 'leadership', 'mentor', 'mentorship', 'team', 'management', 'senior', 'guide', 'coaching'],
    text: "Adrian approaches leadership as **service**. Whether mentoring junior engineers or leading volunteer initiatives, he believes in empowering others to do their best work. He fosters psychological safety and clarity, ensuring that his team isn't just shipping code, but growing as engineers.",
    suggestions: ["Community Work", "Philosophy", "Contact"]
  },

  // --- PROJECTS ---
  {
    id: 'projects_overview',
    keywords: ['project', 'projects', 'work', 'portfolio', 'app', 'build', 'view projects', 'showcase', 'case study'],
    text: "I've worked on several key projects: **Scale-Ops Core** (Infrastructure), **Owly-Live** (Real-time events), **Dapr-LLM Agent** (AI), and **Kindly-Lab** (Social Good). Which one would you like to know more about?",
    suggestions: ["Scale-Ops Core", "Owly-Live", "Dapr-LLM Agent", "Kindly-Lab"]
  },
  {
    id: 'project_scaleops',
    keywords: ['scale-ops', 'scaleops', 'scale', 'ops', 'kubernetes', 'eks', 'infra', 'terraform', 'aws', 'cloud', 'migration', 'devops'],
    text: "With **Scale-Ops Core**, Adrian didn't just migrate servers; he transformed the engineering culture. By architecting a **GitOps-driven EKS ecosystem**, he replaced manual firefighting with automated precision. It wasn't about the tools—it was about creating a **resilient foundation** that allowed the team to ship fearlessly for years to come.",
    suggestions: ["What tech stack?", "Other Projects", "Backend Skills"]
  },
  {
    id: 'project_owly',
    keywords: ['owly', 'owly-live', 'live', 'event', 'websocket', 'real time', 'redis', 'golang', 'scale', 'streaming', 'concurrency'],
    text: "**Owly-Live** showcases Adrian's ability to engineer for high concurrency. He leveraged the raw performance of **Golang** and **WebSockets** to handle thousands of simultaneous users with sub-second latency. By implementing strategic **Redis** caching, he ensured the system remained responsive under heavy load, prioritizing user experience above all.",
    suggestions: ["See Dapr-LLM", "Frontend Skills", "Philosophy"]
  },
  {
    id: 'project_dapr',
    keywords: ['dapr', 'dapr-llm', 'llm', 'ai', 'agent', 'python', 'bot', 'intelligence', 'machine learning', 'gpt'],
    text: "The **Dapr-LLM Agent** is Adrian's foray into the future of backend logic. He engineered a prototype using **Python** and **Dapr's Conversation API** to create state-aware AI agents. These agents can handle complex customer service queries with context retention, bridging the gap between static code and dynamic, human-like intelligence.",
    suggestions: ["What about Owly-Live?", "Tech Stack", "Contact"]
  },
  {
    id: 'project_kindly',
    keywords: ['kindly', 'kindly-lab', 'social', 'good', 'volunteer', 'community', 'impact', 'mentorship', 'non-profit'],
    text: "**Kindly-Lab** represents the 'Heart' of Adrian's work. Leading volunteer engineering efforts, he helped digitalize immigrant-owned small businesses in SF. It’s not just about code; it’s about **empowerment**. He mentors underrepresented entrepreneurs, ensuring technology serves everyone, not just the tech-savvy.",
    suggestions: ["Philosophy", "Background", "Contact"]
  },

  // --- TECH STACK (Granular) ---
  {
    id: 'tech_frontend',
    keywords: ['frontend', 'ui', 'ux', 'react', 'typescript', 'javascript', 'css', 'tailwind', 'nextjs', 'component', 'design'],
    text: "On the frontend, Adrian is a specialist in **React** and **TypeScript**. He loves the precision of strongly-typed component architectures and uses **Tailwind CSS** for rapid, beautiful UI development. He frames frontend work not just as 'views', but as robust client-side applications.",
    suggestions: ["Backend Skills", "Infrastructure", "View Projects"]
  },
  {
    id: 'tech_backend',
    keywords: ['backend', 'api', 'server', 'database', 'sql', 'postgres', 'golang', 'go', 'scala', 'python', 'node', 'nodejs', 'rest', 'graphql'],
    text: "The backend is Adrian's home turf. He prefers **strongly typed, concurrent systems** like **Golang** and **Scala** for their reliability at scale. He creates resilient APIs and data pipelines, often using **Python** for flexibility and **PostgreSQL** for rock-solid data integrity.",
    suggestions: ["Infrastructure", "Frontend Skills", "Philosophy"]
  },
  {
    id: 'tech_infra',
    keywords: ['infra', 'infrastructure', 'cloud', 'aws', 'devops', 'ci/cd', 'kubernetes', 'k8s', 'docker', 'container', 'terraform', 'pipeline'],
    text: "Adrian treats infrastructure as code. He builds self-healing cloud environments using **Kubernetes (EKS)** and **Terraform**. He believes that good DevOps isn't just about tools, but about creating a 'Golden Path' for developers to ship code safely and quickly.",
    suggestions: ["Backend Skills", "View Projects", "Contact"]
  },
  
  // --- HOBBIES & CONTACT ---
  {
    id: 'hobbies_universal',
    keywords: ['hobby', 'fun', 'interest', 'life', 'run', 'swim', 'box', 'gym', 'lift', 'weight', 'moto', 'bike', 'ride', 'cook', 'chef', 'photo', 'video', 'creative'],
    text: "For Adrian, discipline is a lifestyle. Whether he's **boxing** in the ring or debugging a race condition, the mindset is the same: stay calm, see the patterns, and execute. His love for **motorcycles** isn't just about speed—it's about the hyper-focus required to navigate a complex environment safely.",
    suggestions: ["Tell me about his background", "View Projects", "Contact"]
  },
  {
    id: 'availability',
    keywords: ['hire', 'hiring', 'job', 'work', 'available', 'availability', 'resume', 'cv', 'contract', 'freelance'],
    text: "Adrian is currently open to discussing strategic engineering roles that require a blend of technical depth and product vision. He brings maturity, leadership, and a 'shipping' mindset to any team. You can request his full resume via email below.",
    suggestions: ["Contact Info", "View Projects", "Philosophy"]
  },
  {
    id: 'contact',
    keywords: ['contact', 'email', 'reach', 'connect', 'social', 'linkedin', 'github', 'twitter', 'x', 'message', 'form'],
    text: "I can send a message directly to Adrian's inbox. To get started, **what is your name?**",
    suggestions: ["Cancel"],
    action: 'contact_form'
  }
];
