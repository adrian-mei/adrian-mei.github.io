export type KnowledgeTopic = {
  id: string;
  keywords: string[];   // Words to watch for
  triggers: string[];   // Natural language training phrases (High Priority)
  text: string | string[]; // The response (supports arrays for variation)
  priority?: number;    // Tie-breaker (optional)
  suggestions: string[]; // Follow-up buttons for the user
  action?: 'contact_form'; // Optional: Triggers a special UI/Logic flow
};

export const KNOWLEDGE_BASE: KnowledgeTopic[] = [
  // --- 1. CORE PROFILE & GREETINGS ---
  {
    id: 'greeting',
    keywords: ['hello', 'hi', 'hey', 'greetings', 'yo', 'sup'],
    triggers: [
      "hello there", 
      "hi adrian", 
      "hey bot",
      "greetings",
      "hi",
      "how r u",
      "how are you",
      "how are u",
      "how r you",
      "how do you do",
      "what's up",
      "how is it going",
      "how are things"
    ],
    text: [
      "Hello! I'm AdrianAI. I can tell you about Adrian's engineering work, his philosophy, or even his motorcycles. What's on your mind?",
      "Hi there! I'm here to help you get to know Adrian better. Ask me about his projects, skills, or contact info.",
      "Greetings! I'm functioning perfectly and ready to chat. What would you like to know about Adrian?"
    ],
    suggestions: ["View Projects", "Philosophy", "Contact"]
  },
  {
    id: 'user_status_positive',
    keywords: ['good', 'great', 'well', 'fine', 'awesome', 'happy'],
    triggers: [
      "i am good",
      "doing well",
      "i'm great",
      "everything is good",
      "i am fine",
      "im doing good",
      "i'm doing well"
    ],
    text: [
      "That's great to hear! Since you're in a good mood, maybe you'd like to see some of Adrian's latest projects?",
      "Glad to hear it! I'm ready to answer any questions you have about Adrian's work.",
      "Awesome. Let me know if you want to dive into Adrian's tech stack or background."
    ],
    suggestions: ["View Projects", "Tech Stack", "Philosophy"]
  },
  {
    id: 'user_status_negative',
    keywords: ['bad', 'sad', 'tired', 'stress', 'unhappy', 'bored'],
    triggers: [
      "i am tired",
      "not good",
      "feeling down",
      "stressed out",
      "bored"
    ],
    text: "I'm sorry to hear that. Hopefully, exploring some cool engineering projects or listening to the generative audioscapes here can provide a nice distraction.",
    suggestions: ["Listen to Audio", "View Projects", "Tell me a joke"] // Joke intent not implemented but funny fallback
  },
  {
    id: 'affirmation',
    keywords: ['cool', 'nice', 'okay', 'ok', 'wow', 'interesting'],
    triggers: [
      "that is cool",
      "nice work",
      "okay sounds good",
      "wow that's impressive",
      "very interesting",
      "sounds good"
    ],
    text: [
      "Glad you think so! Adrian puts a lot of thought into his work.",
      "It really is! Would you like to know more about it?",
      "Thanks! There's plenty more to explore if you're interested."
    ],
    suggestions: ["View Projects", "Background", "Contact"]
  },
  {
    id: 'help',
    keywords: ['help', 'menu', 'options', 'start', 'restart', 'guide'],
    triggers: [
      "help me",
      "what can you do",
      "show me the menu",
      "what are my options",
      "i am lost"
    ],
    text: "I can help you navigate Adrian's portfolio. Try asking about:\n\n• **Projects** (Scale-Ops, Owly-Live)\n• **Skills** (React, Go, Kubernetes)\n• **Background** (TrueML, Philosophy)\n• **Contact** (Email, Resume)",
    suggestions: ["View Projects", "Tech Stack", "Contact"]
  },
  {
    id: 'gratitude',
    keywords: ['thanks', 'thank', 'thx', 'appreciate'],
    triggers: [
      "thank you so much", 
      "thanks for help", 
      "appreciate it",
      "thanks"
    ],
    text: [
      "You're very welcome! Is there anything else I can help you with?",
      "Happy to help! Let me know if you need anything else.",
      "No problem at all. I'm here to serve."
    ],
    suggestions: ["View Projects", "Contact"]
  },
  {
    id: 'bye',
    keywords: ['bye', 'goodbye', 'see', 'later'],
    triggers: [
      "goodbye", 
      "see you later", 
      "ending chat",
      "bye"
    ],
    text: "Goodbye! Feel free to come back if you have more questions. Adrian's digital door is always open.",
    suggestions: []
  },

  // --- 2. PROFILE & IDENTITY ---
  {
    id: 'bio_intro',
    keywords: ['who', 'adrian', 'bio', 'background', 'yourself', 'intro', 'me', 'summary', 'profile'],
    triggers: [
      "Who is Adrian?",
      "Tell me about yourself",
      "What is your background?",
      "Give me a summary of your profile",
      "Who are you?",
      "Tell me about his background"
    ],
    text: "I'm Adrian, a Full Stack Engineer specializing in scalable web architectures. I have a passion for React, Node.js, and cloud infrastructure. I combine the discipline of formal theory with the adaptability of a startup veteran.",
    suggestions: ["What is his philosophy?", "View Projects", "Tech Stack"]
  },
  {
    id: 'bio_identity',
    keywords: ['background', 'chinese', 'asian', 'american', 'origin', 'culture'],
    triggers: [
      "What is your cultural background?",
      "Tell me about your origin"
    ],
    text: "Based in **San Francisco**, Adrian is a proud **Chinese Asian American**. This cultural perspective shapes his inclusive approach to community and tech. He thrives in the vibrant, diverse energy of the Bay Area, utilizing his background to bridge gaps and foster collaboration in high-performance teams.",
    suggestions: ["What is his philosophy?", "Community Work", "Hobbies"]
  },
  {
    id: 'location',
    keywords: ['location', 'where', 'based', 'live', 'city', 'sf', 'san francisco'],
    triggers: [
      "Where are you from?",
      "Where is Adrian based?",
      "Are you from San Francisco?",
      "Where do you live?"
    ],
    text: "Adrian is based in **San Francisco**. He loves the tech scene, the food, and the access to nature (especially for motorcycle rides!).",
    suggestions: ["Contact", "Hobbies"]
  },

  // --- 3. WORK & EXPERIENCE ---
  {
    id: 'bio_work_trueml',
    keywords: ['work', 'job', 'career', 'experience', 'trueml', 'trueaccord', 'fintech', 'history', 'resume', 'role', 'position', 'current'],
    triggers: [
      "Where do you work?",
      "What is your current role?",
      "Tell me about your experience at TrueML",
      "What is your work history?",
      "How long have you been an engineer?"
    ],
    text: "For the past 6 years, Adrian has been a key engineer at **TrueML (formerly TrueAccord)**. As a backend-leaning engineer with a fintech background, he wears multiple hats—building backend systems, internal tools, and automation. His focus is stepping into ambiguous problems and turning them into scalable, repeatable solutions.",
    suggestions: ["What is his philosophy?", "Tell me about Automation", "Tech Stack"]
  },
  {
    id: 'leadership',
    keywords: ['lead', 'leader', 'leadership', 'mentor', 'mentorship', 'team', 'management', 'senior', 'guide', 'coaching'],
    triggers: [
      "Are you a leader?",
      "Do you mentor others?",
      "What is your leadership style?",
      "Have you managed teams?",
      "Tell me about your mentorship experience",
      "is he a good person",
      "what are his values",
      "what is his character",
      "tell me about his ethics"
    ],
    text: "Adrian approaches leadership as **service**. Whether mentoring junior engineers or leading volunteer initiatives, he believes in empowering others to do their best work. He fosters psychological safety and clarity, ensuring that his team isn't just shipping code, but growing as engineers.",
    suggestions: ["Community Work", "Philosophy", "Contact"]
  },

  // --- 4. PHILOSOPHY & VALUES ---
  {
    id: 'philosophy_leverage',
    keywords: ['philosophy', 'mindset', 'calm', 'meditation', 'focus', 'fast', 'speed', 'values', 'culture', 'startup', 'leverage', 'automation', 'friction', 'principle'],
    triggers: [
      "What is your philosophy?",
      "How do you approach work?",
      "What does 'Go Slow to Move Fast' mean?",
      "Tell me about your values",
      "What is your engineering mindset?"
    ],
    text: [
      "Adrian is big on **creating leverage**. He transforms friction into systems that accelerate the entire organization. By automating recurring, messy tasks, he gives the team back the mental bandwidth to iterate and innovate. It's about 'Going Slow to Move Fast'—building deliberate tools that prevent the need to fight the same fires every week.",
      "He believes in **'Calm Engineering'**. Panic and speed often lead to technical debt. By slowing down to architect the *right* solution, you actually move faster in the long run. It's about precise, high-leverage moves rather than frantic activity."
    ],
    suggestions: ["What internal tools?", "View Projects", "Contact"]
  },
  {
    id: 'focus_internal_tools',
    keywords: ['internal tools', 'workflow', 'onboarding', 'offboarding', 'overhead', 'operational', 'process', 'efficiency'],
    triggers: [
      "What are internal tools?",
      "Ways you improve efficiency?",
      "Tell me about your workflow improvements",
      "What is operational overhead?",
      "Tell me about the onboarding process",
      "Internal process improvements"
    ],
    text: "Recently, Adrian has focused on building internal workflow tools to reduce operational overhead. He's improved **onboarding/offboarding** processes and streamlined communication between engineering and non-technical teams. He loves modernizing backend stacks to ensure the machinery of the business runs as smoothly as the product itself.",
    suggestions: ["What tech stack?", "Work History", "Philosophy"]
  },

  // --- 5. PROJECTS ---
  {
    id: 'projects_overview',
    keywords: ['project', 'projects', 'work', 'portfolio', 'app', 'build', 'view projects', 'showcase', 'case study'],
    triggers: [
      "Show me your projects",
      "What have you built?",
      "Can I see your portfolio?",
      "Tell me about your work",
      "What are your key projects?"
    ],
    text: "I've worked on several key projects: **Scale-Ops Core** (Infrastructure), **Owly-Live** (Real-time events), **Aether** (Voice AI), and **Kindly-Lab** (Social Good). Which one would you like to know more about?",
    suggestions: ["Scale-Ops Core", "Owly-Live", "Aether", "Kindly-Lab"]
  },
  {
    id: 'project_scaleops',
    keywords: ['scale-ops', 'scaleops', 'scale', 'ops', 'kubernetes', 'eks', 'infra', 'terraform', 'aws', 'cloud', 'migration', 'devops'],
    triggers: [
      "Tell me about Scale-Ops Core",
      "What did you do with Kubernetes?",
      "How do you handle infrastructure?",
      "What is your experience with AWS?",
      "Tell me about the migration"
    ],
    text: "With **Scale-Ops Core**, Adrian was a key part of a multi-year transformation. He collaborated on the shift to a **GitOps-driven EKS ecosystem**, helping the team replace manual firefighting with automated precision. It was about contributing to a **resilient foundation** that allows the organization to ship fearlessly.",
    suggestions: ["What tech stack?", "Other Projects", "Backend Skills"]
  },
  {
    id: 'project_owly',
    keywords: ['owly', 'owly-live', 'live', 'event', 'websocket', 'real time', 'redis', 'golang', 'scale', 'streaming', 'concurrency'],
    triggers: [
      "Tell me about Owly-Live",
      "How do you handle real-time events?",
      "What is your experience with WebSockets?",
      "How do you scale for high concurrency?",
      "Tell me about the streaming project"
    ],
    text: "**Owly-Live** showcases Adrian's ability to engineer for high concurrency. He leveraged the raw performance of **Golang** and **WebSockets** to handle thousands of simultaneous users with sub-second latency. By implementing strategic **Redis** caching, he ensured the system remained responsive under heavy load, prioritizing user experience above all.",
    suggestions: ["See Dapr-LLM", "Frontend Skills", "Philosophy"]
  },
  {
    id: 'project_aether',
    keywords: ['aether', 'voice', 'ai', 'companion', 'empathy', 'llm', 'agent', 'intelligence', 'machine learning', 'gpt'],
    triggers: [
      "Tell me about Aether",
      "What is your experience with AI?",
      "How do you build AI agents?",
      "Tell me about the voice bot",
      "What is Aether?"
    ],
    text: "**Aether** is a voice-first empathetic AI companion. It bridges the gap between static backends and generative AI, listening actively and tracking mood to transform simple queries into intelligent, emotional conversations.",
    suggestions: ["What about Owly-Live?", "Tech Stack", "Contact"]
  },
  {
    id: 'project_kindly',
    keywords: ['kindly', 'kindly-lab', 'social', 'good', 'volunteer', 'community', 'impact', 'mentorship', 'non-profit'],
    triggers: [
      "Tell me about Kindly-Lab",
      "Do you do volunteer work?",
      "What is your social impact?",
      "Tell me about the non-profit project",
      "How do you help the community?"
    ],
    text: "**Kindly-Lab** represents the 'Heart' of Adrian's work. Leading volunteer engineering efforts, he helped digitalize immigrant-owned small businesses in SF. It’s not just about code; it’s about **empowerment**. He mentors underrepresented entrepreneurs, ensuring technology serves everyone, not just the tech-savvy.",
    suggestions: ["Philosophy", "Background", "Contact"]
  },

  // --- 6. TECH STACK ---
  {
    id: 'tech_stack_overview',
    keywords: ['tech', 'stack', 'technology', 'react', 'astro', 'code', 'open source'],
    triggers: [
      "what tech do you use", 
      "how is this built", 
      "can i see the code",
      "what is your stack",
      "view code"
    ],
    text: "This site runs on a modern stack: **React v18**, **Vite**, and **Tailwind CSS**. It uses **Three.js** for the 3D visualizations and the native **Web Audio API** for the generative soundscapes. The chat you're using now is powered by a client-side Fuzzy Logic engine (**Fuse.js**).",
    suggestions: ["Frontend Skills", "Backend Skills", "View Code"]
  },
  {
    id: 'tech_frontend',
    keywords: ['frontend', 'ui', 'ux', 'typescript', 'javascript', 'css', 'nextjs', 'component', 'design'],
    triggers: [
      "What are your frontend skills?",
      "Tell me about your UI experience"
    ],
    text: "On the frontend, Adrian is a specialist in **React** and **TypeScript**. He loves the precision of strongly-typed component architectures and uses **Tailwind CSS** for rapid, beautiful UI development. He frames frontend work not just as 'views', but as robust client-side applications.",
    suggestions: ["Backend Skills", "Infrastructure", "View Projects"]
  },
  {
    id: 'tech_backend',
    keywords: ['backend', 'api', 'server', 'database', 'sql', 'postgres', 'golang', 'go', 'scala', 'python', 'node', 'nodejs', 'rest', 'graphql'],
    triggers: [
      "What are your backend skills?",
      "Tell me about your API experience",
      "what is he good at",
      "what are his strengths",
      "what is his specialty"
    ],
    text: "The backend is Adrian's home turf. He prefers **strongly typed, concurrent systems** like **Golang** and **Scala** for their reliability at scale. He creates resilient APIs and data pipelines, often using **Python** for flexibility and **PostgreSQL** for rock-solid data integrity.",
    suggestions: ["Infrastructure", "Frontend Skills", "Philosophy"]
  },
  {
    id: 'tech_infra',
    keywords: ['infra', 'infrastructure', 'cloud', 'aws', 'devops', 'ci/cd', 'kubernetes', 'k8s', 'docker', 'container', 'terraform', 'pipeline'],
    triggers: [
      "What are your infrastructure skills?",
      "Tell me about your cloud experience"
    ],
    text: "Adrian treats infrastructure as code. He builds self-healing cloud environments using **Kubernetes (EKS)** and **Terraform**. He believes that good DevOps isn't just about tools, but about creating a 'Golden Path' for developers to ship code safely and quickly.",
    suggestions: ["Backend Skills", "View Projects", "Contact"]
  },
  
  // --- 7. HOBBIES & CONTACT ---
  {
    id: 'hobbies_universal',
    keywords: ['hobby', 'fun', 'interest', 'life', 'run', 'swim', 'box', 'gym', 'lift', 'weight', 'moto', 'bike', 'ride', 'cook', 'chef', 'photo', 'video', 'creative'],
    triggers: [
      "What are your hobbies?",
      "What do you do for fun?",
      "Do you box?",
      "Tell me about your interests",
      "Do you ride motorcycles?"
    ],
    text: [
      "For Adrian, discipline is a lifestyle. Whether he's **boxing** in the ring or debugging a race condition, the mindset is the same: stay calm, see the patterns, and execute. His love for **motorcycles** isn't just about speed—it's about the hyper-focus required to navigate a complex environment safely.",
      "Outside of code, Adrian loves to **cook** and create content. He believes that creativity is a muscle that needs to be exercised in different ways, whether that's plating a dish or editing a video."
    ],
    suggestions: ["Tell me about his background", "View Projects", "Contact"]
  },
  {
    id: 'availability',
    keywords: ['hire', 'hiring', 'job', 'work', 'available', 'availability', 'resume', 'cv', 'contract', 'freelance', 'rate', 'free', 'cost'],
    triggers: [
      "Are you hiring?",
      "Are you available for work?",
      "Can I see your resume?",
      "Are you open to freelance?",
      "I want to hire you",
      "Are you free?",
      "What is your rate?"
    ],
    text: "Adrian is currently open to discussing strategic engineering roles that require a blend of technical depth and product vision. He brings maturity, leadership, and a 'shipping' mindset to any team. You can request his full resume via email below.",
    suggestions: ["Contact Info", "View Projects", "Philosophy"]
  },
  {
    id: 'contact',
    keywords: ['contact', 'email', 'reach', 'connect', 'social', 'linkedin', 'github', 'twitter', 'x', 'message', 'form'],
    triggers: [
      "How do I contact you?",
      "What is your email?",
      "Can I send you a message?",
      "Connect with me",
      "Where can I find you online?"
    ],
    text: "I can send a message directly to Adrian's inbox. To get started, **what is your name?**",
    suggestions: ["Cancel"],
    action: 'contact_form'
  }
];
