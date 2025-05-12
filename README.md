# BlogSmith AI 📝🤖

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Genkit](https://img.shields.io/badge/Genkit-4A90E2?style=for-the-badge&logo=google&logoColor=white)](https://firebase.google.com/docs/genkit)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

BlogSmith AI is a cutting-edge Next.js application that leverages the power of Google's Generative AI (via Genkit) and the Tavily API to create human-like, well-researched blog posts. It's meticulously designed to produce content that is not only engaging but also up-to-date and authentic, thanks to real-time web research and dynamic hyperlinking of sources.

## 🌟 Core Features

-   **🤖 AI-Powered Blog Generation**: Crafts compelling blog posts from a simple description, relevant keywords, and defined target audience.
-   **🔍 Real-time Web Research**: Utilizes the Tavily API to conduct thorough, real-time web searches, gathering current information and credible sources.
-   **🔗 Dynamic Hyperlinking**: Intelligently embeds relevant hyperlinks from research material directly into the generated blog content, enhancing credibility and user experience.
-   **📈 SEO-Optimized Content**: The AI is prompted to generate content adhering to SEO best practices, aiming for improved search engine discoverability.
-   **✍️ Human-Like Writing Style**: Focuses on generating fluent, conversational, and engaging prose that resonates with readers.
-   **📱 Responsive & Modern UI**: Built with Next.js, React, Tailwind CSS, and ShadCN UI components for a seamless and aesthetically pleasing user experience across all devices.
-   **🛠️ Server-Side AI Logic with Genkit**: Employs Genkit for robust management of AI flows, sophisticated model interactions, and efficient tool usage (e.g., Tavily search integration).
-   **💬 User Feedback Mechanism**: Allows users to provide feedback on generated content, paving the way for future improvements and model fine-tuning.

## 🚀 Getting Started

Follow these instructions to set up and run BlogSmith AI on your local machine for development and testing.

### Prerequisites

Ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (v18.x or later recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   A **Google API Key** with access to a Gemini model (e.g., Gemini 1.5 Flash). You can obtain this from [Google AI Studio](https://aistudio.google.com/) or Google Cloud Console.
-   A **Tavily API Key** from [Tavily AI](https://tavily.com/) for web research capabilities.

### Environment Variables

1.  Create a `.env` file in the root of your project by copying the `.env.example` file:
    ```bash
    cp .env.example .env
    ```
2.  Populate the `.env` file with your API keys:

    ```env
    # Required for Genkit to connect to Google AI models (e.g., Gemini)
    GOOGLE_API_KEY="your_google_api_key_here"

    # Required for the Tavily search service to fetch research material
    TAVILY_API_KEY="your_tavily_api_key_here"

    # Optional: Specify a specific Google Cloud project for Genkit if needed
    # GCLOUD_PROJECT="your_gcloud_project_id"
    ```

    -   `GOOGLE_API_KEY`: Your API key for Google AI services (Gemini).
    -   `TAVILY_API_KEY`: Your API key for the Tavily search service.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd blogsmith-ai # Or your repository name
    ```

2.  **Install dependencies:**
    Using npm:
    ```bash
    npm install
    ```
    Or using yarn:
    ```bash
    yarn install
    ```

## ධ Running the Application

### Development Mode

To run BlogSmith AI in development mode, you need to start two separate processes: the Next.js frontend server and the Genkit development server.

1.  **Start the Genkit Development Server:**
    Open a terminal and run:
    ```bash
    npm run genkit:watch
    ```
    This command uses `tsx` to transpile and run your TypeScript AI flows and Genkit configuration. The `--watch` flag enables automatic reloading when you modify files in the `src/ai/` directory. This will typically start the Genkit development UI on `http://localhost:4000`, where you can inspect, trace, and test your AI flows.

2.  **Start the Next.js Development Server:**
    Open another terminal and run:
    ```bash
    npm run dev
    ```
    This will start the Next.js application, usually on `http://localhost:9002` (as configured in `package.json`).

You can now access BlogSmith AI in your browser at `http://localhost:9002`.

### Production Build

To build the application for production:

```bash
npm run build
```

This command transpiles your AI flows (if necessary for your deployment strategy) and creates an optimized Next.js production build in the `.next` folder.

### Starting the Production Server

After building, you can start the production server:

```bash
npm run start
```

This will serve the optimized application, typically on `http://localhost:3000` (or the port specified by the `PORT` environment variable).

**Important Note on Production Deployment:** In a true production environment, Genkit flows are ideally deployed as separate, scalable services (e.g., Google Cloud Functions, Cloud Run). The `genkit:watch` script is for local development convenience. For production, your build process should ensure the AI flows are correctly packaged or deployed, and your Next.js application should be configured to call these deployed flow endpoints (often via HTTP).

## 🗺️ User Journey

The user journey is designed to be simple and intuitive:

1.  **Input**: The user navigates to the BlogSmith AI application. They are presented with a clean form.
2.  **Parameters**: The user fills in the blog post parameters:
    *   **Blog Description**: A detailed overview of the desired blog topic.
    *   **Primary Keywords**: The main keywords the blog should focus on.
    *   **Secondary Keywords (Optional)**: Additional keywords for more nuanced content.
    *   **Target Audience**: Who the blog post is intended for.
3.  **Generation**: The user clicks the "Generate Blog Post" button.
4.  **Processing**: The application shows a loading state while:
    *   Genkit orchestrates the AI flows.
    *   The `researchBlogTopic` flow generates search queries and uses Tavily API to find relevant, up-to-date sources.
    *   The `generateBlogPost` flow takes the user input and research material to instruct the LLM.
    *   The LLM generates the blog title and content, incorporating research and hyperlinks.
5.  **Display**: The generated blog post (title and HTML content) is displayed on the page.
6.  **Feedback**: The user can provide feedback on the quality of the generated blog post using emoji ratings.

Below is a visual representation of the user journey:

![User Journey Placeholder](https://picsum.photos/800/400?random=1)
*<p align="center" data-ai-hint="user journey diagram">Placeholder for User Journey Diagram. Replace with an actual diagram.</p>*

## ⚙️ How BlogSmith AI Works: The Generation Pipeline

BlogSmith AI employs a sophisticated multi-step process, orchestrated by Genkit, to generate high-quality blog posts. This pipeline ensures that the content is not only AI-generated but also deeply researched and authentically hyperlinked.

![Workflow Diagram Placeholder](https://picsum.photos/800/600?random=2)
*<p align="center" data-ai-hint="workflow diagram">Placeholder for Workflow Diagram. Replace with an actual diagram.</p>*

**Mermaid Diagram of the Workflow:**
```mermaid
graph TD
    A[User Input: Topic, Keywords, Audience via UI] --> B(Next.js Frontend);
    B -- Server Action: handleGenerateBlog --> C{Genkit Orchestrator};

    C -- 1. Initiate Research --> D[Research Flow: researchBlogTopic];
    D -- 1a. Prompt LLM (researchBlogTopicPrompt) --> E[LLM: Generate Search Queries];
    E -- 1b. Search Queries (e.g., ["latest AI trends", "AI impact on healthcare"]) --> D;
    D -- 1c. Execute Queries --> F[Service: tavilySearch];
    F -- 1d. Tavily API Call with each query --> G[(Tavily AI API)];
    G -- 1e. Search Results (URLs, Titles, Snippets) --> F;
    F -- 1f. Processed & Unique Search Results (TavilySearchResult[]) --> D;
    D -- 1g. Research Output (original queries, list of TavilySearchResult objects) --> C;

    C -- 2. Initiate Content Generation --> H[Content Generation Flow: generateBlogPost];
    H -- 2a. Combine User Input + Research Results (TavilySearchResult[]) --> I[LLM: Generate Blog Post (generateBlogPostPrompt)];
    I -- Prompt includes detailed instructions for: <br/> - Human-like tone, fluency, authority <br/> - SEO optimization (keyword usage, structure) <br/> - Content structure (headings, paragraphs) <br/> - **Crucially: Synthesize info from 'Research Material' <br/> & embed 2-3 hyperlinks to source URLs** <br/> - HTML formatting (p, h2, h3, a) <br/> - Target audience adaptation <br/> - Originality (summarize, synthesize, cite by linking) --> I;
    I -- 2b. Generated Blog (Title, HTML Content with embedded links) --> H;
    H -- 2c. Final Blog Output (GenerateBlogPostOutput) --> C;

    C -- 3. Return Blog Post --> B;
    B -- Displays to User --> J[User Views Generated Blog with Text & Active Hyperlinks];
    J -- User Feedback --> K{Feedback Handling (Optional: summarizeUserFeedback flow)};


    style A fill:#f9f,stroke:#333,stroke-width:2px
    style J fill:#ccf,stroke:#333,stroke-width:2px
    style C fill:#bdf,stroke:#333,stroke-width:2px
    style F fill:#ffd,stroke:#333,stroke-width:2px
    style G fill:#ffd,stroke:#333,stroke-width:2px
    style E fill:#lightgrey,stroke:#333,stroke-width:1px
    style I fill:#lightgrey,stroke:#333,stroke-width:1px
    style K fill:#e6ffe6,stroke:#333,stroke-width:1px
```

**Step-by-Step Explanation:**

1.  **User Input**: The user provides a blog description, primary keywords, optional secondary keywords, and the target audience through the web interface (`BlogForm`).
2.  **Frontend Request**: The Next.js frontend captures this input and sends it to a Server Action (`handleGenerateBlog` in `src/app/actions.ts`).
3.  **Genkit Orchestration**: The Server Action invokes the main Genkit flow, `generateBlogPostFlow` (defined in `src/ai/flows/generate-blog-post.ts`).
4.  **Research Phase (`researchBlogTopicFlow`):**
    *   **Intelligent Query Generation**: The `generateBlogPostFlow` first calls the `researchBlogTopicFlow` (defined in `src/ai/flows/research-blog-topic.ts`). This sub-flow uses an LLM (via `researchBlogTopicPrompt`) to intelligently generate a set of 2-3 relevant search queries based on the user's input. This step ensures that the subsequent web search is targeted and effective.
    *   **Web Search via Tavily**: The generated search queries are then passed to the `tavilySearch` service (in `src/services/tavily.ts`). This service makes API calls to the Tavily API, requesting advanced search results (including content snippets, titles, and URLs).
    *   **Source Collection & Deduplication**: Tavily returns a list of relevant web pages. The `researchBlogTopicFlow` collects these sources and de-duplicates them based on URL to ensure variety.
    *   **Research Output**: This flow returns an object containing the search queries used and a list of unique, relevant `TavilySearchResult` objects (each containing title, URL, content snippet, and score) to the main `generateBlogPostFlow`.
5.  **Content Generation Phase (`generateBlogPostPrompt` within `generateBlogPostFlow`):**
    *   **Comprehensive Prompt Engineering**: The `generateBlogPostFlow` now prepares a detailed prompt for the primary LLM (Gemini). This prompt is critical and includes:
        *   The original user input (description, keywords, audience).
        *   The curated "Research Material" (the `searchResults` array of `TavilySearchResult` objects from the research phase).
        *   Specific, explicit instructions on how to write the blog post:
            *   **Tone & Style**: Human-like, fluent, conversational, authoritative, and tailored to the target audience.
            *   **Content Integration**: **Critically use and synthesize information** from the provided "Research Material". Prioritize these sources for facts and recent developments.
            *   **Structure & Length**: Logical flow, clear introduction, body paragraphs with headings (H2, H3), and a conclusion. Aim for a substantial word count (e.g., 500-800 words).
            *   **Hyperlinking**: **Naturally embed 2-3 relevant hyperlinks** to the source URLs from the "Research Material". Use the source titles or relevant phrases from the content as anchor text. This is crucial for authenticity and providing verifiable references. The prompt guides the LLM on how to format these as `<a>` tags.
            *   **Formatting**: Output valid HTML (paragraphs, headings, lists). Exclude `<html>`, `<body>`, etc. No `<img>` tags.
            *   **SEO**: Implicitly guided through keyword usage and good structure, but can be explicitly prompted.
            *   **Originality**: Emphasize summarizing, synthesizing, and citing (by linking); strictly avoid plagiarism.
    *   **LLM Invocation**: The meticulously crafted prompt is sent to the configured Gemini model via Genkit.
    *   **Blog Output**: The LLM generates the blog post title and its main content in HTML format, with research-backed information and embedded hyperlinks as instructed.
6.  **Response to Frontend**: The generated title and HTML content are returned by the Server Action to the Next.js frontend.
7.  **Display to User**: The frontend component (`BlogDisplay`) renders the HTML content using `dangerouslySetInnerHTML`, showcasing the AI-generated blog post with its research-backed insights and active hyperlinks.
8.  **User Feedback (Optional Enhancement)**: The user can interact with feedback buttons. This data could be sent to another Genkit flow like `summarizeUserFeedback` for analysis and potential future model fine-tuning or prompt adjustments.

This structured, research-first approach allows BlogSmith AI to move beyond simple text generation. It actively gathers relevant, up-to-date information and then strategically uses that information to craft a high-quality, authentic, and well-referenced blog post, significantly enhancing the "human-like" and "well-researched" qualities of the output.

## 🛠️ Key Technologies Used

-   **[Next.js](https://nextjs.org/)**: React framework for server-side rendering, static site generation, and a full-stack development experience (App Router).
-   **[React](https://reactjs.org/)**: JavaScript library for building user interfaces.
-   **[TypeScript](https://www.typescriptlang.org/)**: Superset of JavaScript that adds static typing, improving code quality and maintainability.
-   **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework for rapid UI development and consistent styling.
-   **[ShadCN UI](https://ui.shadcn.com/)**: Collection of re-usable UI components built with Radix UI and Tailwind CSS, providing a professional look and feel.
-   **[Genkit](https://firebase.google.com/docs/genkit)**: An open-source framework from Google for building AI-powered applications. It's used here for:
    -   Defining and orchestrating multi-step AI flows.
    -   Managing interactions with Large Language Models (LLMs).
    -   Integrating AI tools (like custom search functions).
    -   **[@genkit-ai/googleai](https://www.npmjs.com/package/@genkit-ai/googleai)**: Genkit plugin for integrating Google AI models (like Gemini).
-   **[Tavily API](https://tavily.com/)**: A specialized search API designed for LLMs, providing real-time, accurate, and relevant web research results.
-   **[Zod](https://zod.dev/)**: TypeScript-first schema declaration and validation library, used to ensure type safety for AI flow inputs and outputs.
-   **[Lucide React](https://lucide.dev/)**: A comprehensive library of simply beautiful open-source icons.
-   **[React Hook Form](https://react-hook-form.com/)**: Performant, flexible, and extensible forms with easy-to-use validation.

## 📂 Project Structure

The project follows a standard Next.js App Router structure with clear separation of concerns:

```
.
├── public/                 # Static assets (images, fonts, etc.)
├── src/
│   ├── ai/                 # Core AI logic managed by Genkit
│   │   ├── dev.ts          # Entry point for Genkit development server (genkit start)
│   │   ├── flows/          # Genkit flow definitions
│   │   │   ├── generate-blog-post.ts  # Main blog generation flow
│   │   │   ├── research-blog-topic.ts # Flow for web research using Tavily
│   │   │   └── summarize-user-feedback.ts # (Optional) Flow for processing feedback
│   │   ├── genkit.ts       # Global Genkit instance and plugin configuration (e.g., GoogleAI)
│   │   └── types.ts        # Shared Zod schemas and TypeScript types for AI flows
│   ├── app/                # Next.js App Router: pages, layouts, server actions
│   │   ├── page.tsx        # Main application page (/)
│   │   ├── actions.ts      # Server Actions for form submissions and AI flow invocations
│   │   ├── globals.css     # Global styles, Tailwind CSS base, and ShadCN UI theme variables
│   │   └── layout.tsx      # Root layout for the application
│   ├── components/         # React components
│   │   ├── ui/             # ShadCN UI components (Button, Card, Input, etc.)
│   │   ├── blog-display.tsx# Component to render the generated blog content
│   │   └── blog-form.tsx   # Form component for user input (topic, keywords, etc.)
│   ├── hooks/              # Custom React hooks (e.g., useToast for notifications)
│   ├── lib/                # Utility functions (e.g., cn for classnames)
│   └── services/           # Modules for interacting with external APIs
│       └── tavily.ts       # Service for making calls to the Tavily Search API
├── .env                    # Local environment variables (API Keys) - Not committed
├── .env.example            # Example environment variables file
├── components.json         # ShadCN UI configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Project dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 🤖 AI / Genkit Integration Details

The intelligence of BlogSmith AI is powered by its robust Genkit integration:

-   **`src/ai/genkit.ts`**: Initializes the global Genkit `ai` object. It configures essential plugins, notably `googleAI()`, enabling Genkit to communicate with Google's Gemini models. The default model (e.g., `gemini-2.0-flash` or `gemini-1.5-flash`) is set here.
-   **`src/ai/flows/`**: This directory contains the definitions for individual Genkit flows.
    -   **`research-blog-topic.ts`**:
        -   Defines `researchBlogTopicFlow`.
        -   Accepts `ResearchBlogTopicInput` (blog description, keywords, audience).
        -   Utilizes `researchBlogTopicPrompt` to instruct an LLM to generate targeted search queries.
        -   Calls the `tavilySearch` service (from `src/services/tavily.ts`) with these queries.
        -   Returns `ResearchBlogTopicOutput`, which includes the generated search queries and an array of `TavilySearchResult` objects (containing titles, URLs, content snippets, and relevance scores).
    -   **`generate-blog-post.ts`**:
        -   Defines `generateBlogPostFlow` (the main flow).
        -   Accepts `GenerateBlogPostInput` (user's initial request).
        -   **Crucially, it first invokes `researchBlogTopicFlow`** to obtain up-to-date research material.
        -   It then constructs `GenerateBlogPostPromptInputSchema` by combining the user's original input with the `searchResults` (an array of `TavilySearchResult`) from the research step.
        -   The `generateBlogPostPrompt` is heavily engineered with detailed instructions for the LLM. It specifies:
            -   Desired style, tone, length, and SEO considerations.
            -   HTML formatting requirements (paragraphs, headings, lists).
            -   **Explicit instructions on how to integrate the research material (titles, snippets) and embed hyperlinks (`<a>` tags) to the actual source URLs.** This is key for authenticity.
        -   Returns `GenerateBlogPostOutput` (blog title and the full HTML content).
-   **`src/ai/types.ts`**: Houses Zod schemas that define the expected structure and data types for inputs and outputs of all AI flows and prompts (e.g., `GenerateBlogPostInputSchema`, `TavilySearchResultSchema`, `GenerateBlogPostOutputSchema`). This ensures data integrity and provides strong typing throughout the AI logic.
-   **Server Actions (`src/app/actions.ts`)**: The Next.js frontend communicates with these Genkit flows via Server Actions. For example, `handleGenerateBlog` is a Server Action that takes validated form data, invokes the `generateBlogPostFlow`, and returns the AI-generated blog post to the client for display.

## 🌐 External Services Integration

-   **Tavily AI (`src/services/tavily.ts`)**: This module encapsulates the logic for interacting with the Tavily Search API. The `tavilySearch` function:
    -   Accepts a search query and an optional maximum number of results.
    -   Constructs the API request to Tavily, including the API key from environment variables.
    -   Specifies parameters like `search_depth: 'advanced'` for comprehensive results and `include_raw_content: false` (as content snippets are usually sufficient and more concise for the LLM).
    -   Handles API responses robustly, including potential errors.
    -   Transforms the Tavily API response into an array of `TavilySearchResult` objects, a standardized format used throughout the application.

## 🎨 Styling and UI

-   **Tailwind CSS**: The primary styling engine, configured in `tailwind.config.ts`. Utility classes are used extensively for rapid and consistent UI development.
-   **ShadCN UI Theme**: The application utilizes a custom theme for ShadCN UI components. This theme is defined using CSS HSL variables in `src/app/globals.css`. This allows for easy customization of the color palette (background, foreground, primary, accent, destructive, etc.) for both light and dark modes, adhering to the style guidelines (Neutral white/light gray, Light blue/green links, Teal accent).
-   **Google Fonts (Geist)**: The `Geist Sans` and `Geist Mono` fonts are used for clean and modern typography, configured in `src/app/layout.tsx`.
-   **Responsive Design**: The UI is designed to be responsive and adapt to various screen sizes, leveraging Tailwind's responsive prefixes (e.g., `sm:`, `md:`, `lg:`).
-   **Prose Styling**: The `@tailwindcss/typography` plugin is used to provide sensible default styling for the HTML content generated by the AI, ensuring readability (applied in `BlogDisplay` component).

## ✅ Linting and Type Checking

-   **ESLint**: Configured for code linting to maintain code quality and consistency. Run `npm run lint` to check for linting errors.
-   **TypeScript**: Used for static type checking across the project, enhancing code reliability. Run `npm run typecheck` to ensure type safety.

## 🚀 Deployment Considerations

To deploy this Next.js application effectively, consider the following:

-   **Platform Choice**:
    -   [Vercel](https://vercel.com/): Highly recommended for Next.js applications due to its seamless integration, optimization features, and support for Server Actions and Edge Functions.
    -   [Netlify](https://www.netlify.com/): Another excellent platform for modern web applications.
    -   [Google Cloud Run](https://cloud.google.com/run) / [Google Cloud Functions](https://cloud.google.com/functions): Suitable for deploying both the Next.js app and the Genkit flows as separate, scalable services.
    -   Self-hosting on a Node.js server or Docker container.
-   **Environment Variables**: Ensure all necessary environment variables (`GOOGLE_API_KEY`, `TAVILY_API_KEY`) are securely configured in your deployment environment's settings. **Do NOT commit your `.env` file to version control.** Use the `.env.example` as a template.
-   **Genkit Flow Deployment (Production)**:
    -   For production, Genkit flows should ideally be deployed as independent, callable HTTP endpoints (e.g., as Firebase Cloud Functions or Google Cloud Run services).
    -   Your Next.js application's Server Actions would then make authenticated HTTP requests to these deployed flow endpoints instead of calling them directly as local TypeScript functions. This decouples the AI backend from the frontend application and allows for independent scaling and management of the AI logic.
    -   The `genkit deploy` command (part of the Genkit CLI) can assist in deploying flows to supported platforms. Consult Genkit documentation for platform-specific deployment guides.
-   **Build Process**: Your deployment pipeline should include `npm run build` to create an optimized Next.js build. If deploying Genkit flows separately, ensure they are also built and deployed according to their respective platform requirements.
-   **Database (Optional for Future Extensions)**: If you plan to store generated blogs, user feedback, user accounts, or other persistent data, you'll need to integrate a database (e.g., Firebase Firestore, Supabase, PostgreSQL, MongoDB).

## 🤝 Contributing

Contributions are highly welcome and appreciated! If you have suggestions for improvements, find bugs, or want to add new features, please follow these steps:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or fix:
    ```bash
    git checkout -b feature/your-amazing-feature
    # or
    git checkout -b fix/issue-description
    ```
3.  **Make your changes**, adhering to the established coding style, architectural patterns, and best practices.
4.  **Commit your changes** with clear, descriptive commit messages (e.g., `feat: Add advanced research summarization module` or `fix: Correct hyperlink generation in complex lists`). Consider using [Conventional Commits](https://www.conventionalcommits.org/).
5.  **Push your branch** to your forked repository:
    ```bash
    git push origin feature/your-amazing-feature
    ```
6.  **Open a Pull Request (PR)** against the `main` branch of the original repository. Provide a detailed description of your changes in the PR.

Before submitting a PR, please ensure your code:
-   Passes linting checks: `npm run lint`
-   Passes type checks: `npm run typecheck`
-   Builds successfully: `npm run build`
-   Is well-documented where necessary.

## 📄 License

This project is licensed under the [MIT License](LICENSE.md). (You should create a `LICENSE.md` file, typically with MIT content, if one doesn't exist).

---

Happy Blogging with AI! 🎉 Let BlogSmith AI empower your content creation.
```