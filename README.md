# BlogSmith AI 📝🤖

BlogSmith AI is a Next.js application that leverages the power of Genkit and Generative AI to create human-like, well-researched blog posts. It uses the Tavily API for real-time web research to ensure content is up-to-date and authentic.

## ✨ Features

-   **AI-Powered Blog Generation**: Create engaging blog posts from a simple description, keywords, and target audience.
-   **Real-time Web Research**: Utilizes the Tavily API to gather current information and relevant sources for blog content.
-   **Dynamic Hyperlinking**: Automatically embeds relevant hyperlinks from research material into the generated blog.
-   **SEO-Friendly Content**: AI is prompted to generate content with SEO best practices in mind.
-   **Responsive UI**: Modern and clean user interface built with Next.js, React, Tailwind CSS, and ShadCN UI components.
-   **Server-Side Logic with Genkit**: Employs Genkit for managing AI flows and interactions with language models.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18.x or later recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   Access to a Google AI model (e.g., Gemini via Google AI Studio or Vertex AI)
-   A [Tavily API Key](https://tavily.com/) for web research capabilities.

### Environment Variables

Create a `.env` file in the root of your project and add the following environment variables:

```env
# Required for Genkit to connect to Google AI models (e.g., Gemini)
GOOGLE_API_KEY=your_google_api_key_here

# Required for the Tavily search service to fetch research material
TAVILY_API_KEY=your_tavily_api_key_here

# Optional: Specify a specific Google Cloud project for Genkit if needed
# GCLOUD_PROJECT=your_gcloud_project_id
```

-   `GOOGLE_API_KEY`: Your API key for Google AI services.
-   `TAVILY_API_KEY`: Your API key for the Tavily search service.

You can obtain these keys from their respective platforms.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-name>
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

To run the application in development mode with Next.js and Genkit concurrently:

1.  **Start the Genkit development server:**
    Open a terminal and run:
    ```bash
    npm run genkit:dev
    ```
    Or for auto-reloading on changes to AI flows:
    ```bash
    npm run genkit:watch
    ```
    This will typically start the Genkit development UI on `http://localhost:4000`.

2.  **Start the Next.js development server:**
    Open another terminal and run:
    ```bash
    npm run dev
    ```
    This will start the Next.js application, usually on `http://localhost:9002`.

You can now access the application in your browser at `http://localhost:9002`.

### Production Build

To build the application for production:

```bash
npm run build
```

This command creates an optimized production build in the `.next` folder.

### Starting the Production Server

After building, you can start the production server:

```bash
npm run start
```

This will serve the optimized application, typically on `http://localhost:3000` (or the port specified by the `PORT` environment variable). Note that for production, Genkit flows would typically be deployed as separate services (e.g., Cloud Functions, Cloud Run) that your Next.js backend can call. The `genkit:dev` or `genkit:watch` scripts are for local development.

## 🛠️ Key Technologies Used

-   **[Next.js](https://nextjs.org/)**: React framework for server-side rendering, static site generation, and more.
-   **[React](https://reactjs.org/)**: JavaScript library for building user interfaces.
-   **[TypeScript](https://www.typescriptlang.org/)**: Superset of JavaScript that adds static typing.
-   **[Tailwind CSS](https://tailwindcss.com/)**: Utility-first CSS framework for rapid UI development.
-   **[ShadCN UI](https://ui.shadcn.com/)**: Re-usable UI components built with Radix UI and Tailwind CSS.
-   **[Genkit](https://firebase.google.com/docs/genkit)**: Framework for building AI-powered applications, used here for orchestrating LLM calls.
    -   **[@genkit-ai/googleai](https://www.npmjs.com/package/@genkit-ai/googleai)**: Plugin for integrating Google AI models (like Gemini) with Genkit.
-   **[Tavily API](https://tavily.com/)**: Search API for real-time, accurate, and relevant web research.
-   **[Zod](https://zod.dev/)**: TypeScript-first schema declaration and validation library.
-   **[Lucide React](https://lucide.dev/)**: Simply beautiful open-source icons.

## 📂 Project Structure

```
.
├── public/                 # Static assets
├── src/
│   ├── ai/                 # Genkit AI flows, tools, and configurations
│   │   ├── dev.ts          # Genkit development server entry point
│   │   ├── flows/          # Genkit flow definitions (e.g., blog generation, research)
│   │   ├── genkit.ts       # Genkit global instance and plugin configuration
│   │   └── types.ts        # Shared Zod schemas and TypeScript types for AI flows
│   ├── app/                # Next.js App Router: pages, layouts, API routes
│   │   ├── (main)/         # Example route group for main application pages
│   │   │   └── page.tsx    # Main application page
│   │   ├── actions.ts      # Server Actions for form submissions, etc.
│   │   ├── globals.css     # Global styles and Tailwind CSS setup
│   │   └── layout.tsx      # Root layout for the application
│   ├── components/         # React components
│   │   ├── ui/             # ShadCN UI components
│   │   ├── blog-display.tsx# Component to display the generated blog
│   │   └── blog-form.tsx   # Form component for blog generation input
│   ├── hooks/              # Custom React hooks (e.g., use-toast, use-mobile)
│   ├── lib/                # Utility functions (e.g., cn for classnames)
│   └── services/           # Services for interacting with external APIs (e.g., Tavily)
├── .env.example            # Example environment variables file
├── components.json         # ShadCN UI configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Project dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 🤖 AI / Genkit Integration

The core AI functionality is managed through Genkit flows defined in `src/ai/flows/`.

-   **`generate-blog-post.ts`**: Defines the main flow for generating a blog post. It takes user input (description, keywords, audience), orchestrates research, and then prompts an LLM to write the blog content, including formatting and hyperlinking.
-   **`research-blog-topic.ts`**: Defines a flow that uses an LLM to generate relevant search queries based on the blog topic. It then uses the `tavilySearch` service to execute these queries and retrieve relevant source URLs and content snippets.
-   **`summarize-user-feedback.ts`**: (If implemented) A flow to process user feedback on generated blog posts.
-   **`genkit.ts`**: Initializes the Genkit `ai` object with necessary plugins, primarily the `googleAI` plugin to interact with Google's language models.
-   **`types.ts`**: Contains Zod schemas for validating inputs and outputs of the AI flows, ensuring type safety and structured data handling.

The Next.js frontend interacts with these Genkit flows via Server Actions (defined in `src/app/actions.ts`).

## ⚙️ Services

-   **`tavily.ts` (`src/services/tavily.ts`)**: This service module contains the `tavilySearch` function, which is responsible for making API calls to the Tavily API. It fetches search results based on queries provided by the `research-blog-topic` Genkit flow. The results include titles, URLs, and content snippets from web pages, which are then used as research material for blog generation.

## Linting and Type Checking

-   **ESLint**: Configured for code linting. Run `npm run lint` to check for linting errors.
-   **TypeScript**: Used for static type checking. Run `npm run typecheck` to perform a type check across the project.

## 🎨 Styling

-   **Tailwind CSS**: Provides utility classes for styling. Configuration is in `tailwind.config.ts`.
-   **ShadCN UI Theme**: The application uses a custom theme for ShadCN UI components, defined with CSS HSL variables in `src/app/globals.css`. This allows for easy customization of the color palette (background, foreground, primary, accent, etc.).
-   **Google Fonts (Geist)**: The `Geist` and `Geist_Mono` fonts are used for typography, configured in `src/app/layout.tsx`.

## 🚀 Deployment

To deploy this Next.js application, you can use platforms like:

-   [Vercel](https://vercel.com/) (Recommended for Next.js)
-   [Netlify](https://www.netlify.com/)
-   [Firebase Hosting](https://firebase.google.com/docs/hosting) (if you are using other Firebase services)
-   Self-hosting on a Node.js server or Docker.

When deploying, ensure that:
1.  All necessary environment variables (e.g., `GOOGLE_API_KEY`, `TAVILY_API_KEY`) are set in your deployment environment.
2.  The Genkit flows are accessible. For production, you would typically deploy Genkit flows as callable endpoints (e.g., Firebase Cloud Functions, Google Cloud Run services) and update your Next.js backend to call these deployed endpoints instead of running Genkit locally.

## 🤝 Contributing

Contributions are welcome! If you have suggestions or want to improve the application, please feel free to:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please ensure your code adheres to the existing coding style and passes linting and type checks.

## 📄 License

This project is licensed under the [MIT License](LICENSE.md) (assuming one, if not, specify or remove).

---

Happy Blogging! 🎉
