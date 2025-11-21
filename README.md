# Adrian Mei - Personal Portfolio

A modern, interactive personal portfolio website featuring a 3D infrastructure map, procedurally generated audio, and an AI-powered concierge.

## Tech Stack

-   **Framework:** Next.js (App Router)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS
-   **3D Visualization:** Three.js
-   **AI:** Google Gemini (via Vercel AI SDK)
-   **Deployment:** Netlify / Vercel

## Features

-   **AI Concierge:** A "Live" AI chatbot (Aether) that can answer questions about my skills and experience.
-   **Infrastructure Map:** Interactive 3D visualization of my technical skills.
-   **Audio Engine:** Procedural audio generation using Web Audio API.
-   **Responsive Design:** Mobile-first architecture using Tailwind CSS.

## Development

### Prerequisites

-   Node.js (v18+)

### Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/adrian-mei/adrian-mei.github.io.git
    cd adrian-mei.github.io
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env.local` file in the root directory and add your Google Gemini API key:
    ```env
    GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
    ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    The site will be available at `http://localhost:3000`.

## Architecture

-   **App:** Located in `app/`. Uses Next.js App Router.
-   **Components:** Located in `src/components/`.
-   **API:** Located in `app/api/`. Handles server-side logic and AI integration.

## Scripts

-   `npm run dev`: Starts the Next.js development server.
-   `npm run build`: Builds the project for production.
-   `npm run lint`: Runs Next.js Lint.
