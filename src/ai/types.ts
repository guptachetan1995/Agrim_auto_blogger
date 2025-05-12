/**
 * @fileOverview Shared type definitions and Zod schemas for AI flows.
 */

import { z } from 'zod';
import type { TavilySearchResultSchema as TavilySchemaImport } from '@/services/tavily'; // Import for use in Zod

// Re-export TavilySearchResultSchema if it's directly used by other schemas here, or ensure it's defined/imported as needed.
// For this case, it seems TavilySearchResultSchema is used internally by research-blog-topic.ts and generate-blog-post.ts
// So we might not need to export it from here unless other parts of the app, outside flows, need it directly.
// Let's define it here for clarity if it's a common structure.

export const TavilySearchResultSchema = z.object({
  title: z.string().describe('The title of the search result.'),
  url: z.string().url().describe('The URL of the search result.'),
  content: z.string().optional().describe('A snippet or summary of the content from the search result.'),
  score: z.number().optional().describe('Tavily relevance score for the search result.')
});
export type TavilySearchResult = z.infer<typeof TavilySearchResultSchema>;


// --- generate-blog-post types ---
export const GenerateBlogPostFlowInputSchema = z.object({
  blogDescription: z.string().describe('The overall description of the blog.'),
  primaryKeywords: z.string().describe('The primary keywords for the blog.'),
  secondaryKeywords: z.string().optional().describe('The secondary keywords for the blog.'),
  targetAudience: z.string().describe('The target audience for the blog post.'),
});
export type GenerateBlogPostInput = z.infer<typeof GenerateBlogPostFlowInputSchema>;

export const GenerateBlogPostOutputSchema = z.object({
  title: z.string().describe('The title of the generated blog post.'),
  content: z.string().describe('The full content of the generated blog post, including HTML formatting and hyperlinks.'),
});
export type GenerateBlogPostOutput = z.infer<typeof GenerateBlogPostOutputSchema>;

// Internal schema for the input to the AI prompt (includes search results)
export const GenerateBlogPostPromptInputSchema = GenerateBlogPostFlowInputSchema.extend({
  searchResults: z.array(TavilySearchResultSchema).describe('Search results from web research to use as research material. Includes title, URL, and content snippet.'),
});


// --- research-blog-topic types ---
export const ResearchBlogTopicInputSchema = z.object({
  blogDescription: z.string().describe('A description of the blog topic.'),
  primaryKeywords: z.string().describe('Primary keywords related to the blog topic.'),
  secondaryKeywords: z.string().optional().describe('Secondary keywords for the blog topic.'),
  targetAudience: z.string().describe('The target audience for the blog post.'),
});
export type ResearchBlogTopicInput = z.infer<typeof ResearchBlogTopicInputSchema>;

// This is the final output schema for the entire research flow
export const ResearchBlogTopicOutputSchema = z.object({
  searchQueries: z.array(z.string()).describe('List of search queries used for research.'),
  relevantSources: z.array(TavilySearchResultSchema).describe('List of relevant sources (title, URL, content snippet) found during research.'),
});
export type ResearchBlogTopicOutput = z.infer<typeof ResearchBlogTopicOutputSchema>;

// Internal schema for the output of the researchBlogTopicPrompt (LLM part only)
export const ResearchBlogTopicPromptOutputSchema = z.object({
  searchQueries: z.array(z.string()).describe('A list of effective search queries to find relevant information.'),
});


// --- summarize-user-feedback types ---
export const SummarizeUserFeedbackInputSchema = z.object({
  feedback: z.array(z.string()).describe('An array of user feedback strings.'),
});
export type SummarizeUserFeedbackInput = z.infer<typeof SummarizeUserFeedbackInputSchema>;

export const SummarizeUserFeedbackOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the user feedback, highlighting key areas for improvement.'),
});
export type SummarizeUserFeedbackOutput = z.infer<typeof SummarizeUserFeedbackOutputSchema>;
