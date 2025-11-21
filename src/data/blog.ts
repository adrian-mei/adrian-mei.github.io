export interface BlogPost {
  id: string;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: 'go-slow-to-go-fast',
    title: 'Go Slow to Go Fast',
    date: 'April 02, 2024',
    readTime: '4 min read',
    excerpt: 'Why rushing leads to ruin, and how careful deliberation today creates velocity tomorrow.',
    tags: ['Philosophy', 'Productivity', 'Health'],
    content: `
      <h2>The Velocity Paradox</h2>
      <p>In the startup world, speed is everything. "Move fast and break things" was the motto of a generation. But there's a difference between <em>speed</em> and <em>velocity</em>. Speed is just distance over time. Velocity has a direction.</p>
      
      <p>If you're moving at 100mph in the wrong direction, you're not making progress—you're just getting lost faster.</p>

      <h3>The Cost of Rushing</h3>
      <p>When we rush, we make mistakes. We skip the design phase. We ignore the edge cases. We burn out.</p>
      <ul>
        <li><strong>Technical Debt:</strong> The "quick hack" becomes the load-bearing legacy code that slows down every future feature.</li>
        <li><strong>Health Debt:</strong> Pulling all-nighters borrows energy from tomorrow (with high interest). Eventually, the debt collector comes calling.</li>
      </ul>

      <h3>Deliberate Practice</h3>
      <p>To truly go fast in the long run, we must go slow now. We must be deliberate. We must measure twice and cut once. By building a solid foundation—in our code, in our teams, and in our bodies—we create the capacity for sustained, high-velocity work.</p>
    `
  },
  {
    id: 'system-design-philosophy',
    title: 'The Art of Invisible Systems',
    date: 'March 21, 2024',
    readTime: '5 min read',
    excerpt: 'Why the best infrastructure is the kind you never notice, and how to build for silence.',
    tags: ['Engineering', 'Systems', 'Philosophy'],
    content: `
      <h2>The Silence of Good Code</h2>
      <p>In a world obsessed with metrics and dashboards, we often forget that the ultimate goal of infrastructure is to be invisible. When a system works perfectly, it disappears.</p>
      
      <p>This isn't just about uptime; it's about cognitive load. The best tools don't demand your attention—they empower your intention.</p>

      <h3>Building for "Zero Friction"</h3>
      <p>When I architect a solution, I start with the "user zero" experience. How much friction does the developer encounter? Every configuration flag, every manual step, every vague error message is a crack in the invisibility cloak.</p>

      <blockquote>"Complexity is the enemy of execution."</blockquote>

      <p>We must strive for elegance, not just function. Elegance means doing more with less. It means understanding the problem so deeply that the solution feels obvious in retrospect.</p>
    `
  },
  {
    id: 'digital-gardening',
    title: 'Tending the Digital Garden',
    date: 'February 15, 2024',
    readTime: '4 min read',
    excerpt: 'Moving from "shipping code" to "growing software". A perspective shift.',
    tags: ['Growth', 'Career', 'Metaphor'],
    content: `
      <h2>Software is Alive</h2>
      <p>We often talk about "building" software like it's a bridge or a skyscraper. But unlike concrete, code is organic. It rots if left unattended. It grows wild if not pruned.</p>
      
      <p>I prefer the metaphor of a garden. A gardener doesn't "build" a tomato; they create the conditions for the tomato to thrive. Similarly, an engineering leader creates the environment where great software can emerge.</p>

      <h3>The Role of the Gardener</h3>
      <ul>
        <li><strong>Weeding:</strong> Removing technical debt before it chokes the feature.</li>
        <li><strong>Watering:</strong> Providing resources and encouragement to the team.</li>
        <li><strong>Pruning:</strong> Cutting features that no longer serve the core purpose.</li>
      </ul>
    `
  },
  {
    id: 'react-server-components',
    title: 'Rethinking State on the Edge',
    date: 'January 10, 2024',
    readTime: '6 min read',
    excerpt: 'Deep dive into how Server Components are changing the mental model of frontend dev.',
    tags: ['React', 'Tech', 'Performance'],
    content: `
      <h2>The Pendulum Swings Back</h2>
      <p>For a decade, we pushed everything to the client. Now, with React Server Components (RSC), the pendulum is swinging back—but it's not returning to the PHP days of old. It's settling somewhere new, somewhere hybrid.</p>
      
      <p>RSC allows us to keep our heavy dependencies on the server, shipping zero-bundle-size components to the browser. This isn't just a performance win; it's a security win.</p>

      <h3>What this means for DX</h3>
      <p>The mental model shift is significant. We now have to think about the network boundary as a first-class citizen in our component tree. It forces us to be intentional about what is interactive and what is static.</p>
    `
  }
];
