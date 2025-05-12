// This file uses server-side code.
'use server';

/**
 * @fileOverview A flow to generate a well-researched blog post based on user inputs.
 *
 * - generateBlogPost - A function that generates a blog post.
 * - GenerateBlogPostInput - The input type for the user submitting the form for generateBlogPost function.
 * - GenerateBlogPostOutput - The return type for the generateBlogPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { TavilySearchResult } from '@/services/tavily'; 
import { researchBlogTopic, type ResearchBlogTopicOutput } from '@/ai/flows/research-blog-topic';

// Schema for user input to the flow
const GenerateBlogPostFlowInputSchema = z.object({
  blogDescription: z.string().describe('The overall description of the blog.'),
  primaryKeywords: z.string().describe('The primary keywords for the blog.'),
  secondaryKeywords: z.string().optional().describe('The secondary keywords for the blog.'),
  targetAudience: z.string().describe('The target audience for the blog post.'),
});

export type GenerateBlogPostInput = z.infer<typeof GenerateBlogPostFlowInputSchema>;

// Schema for the output of the flow
const GenerateBlogPostOutputSchema = z.object({
  title: z.string().describe('The title of the generated blog post.'),
  content: z.string().describe('The full content of the generated blog post, including HTML formatting and hyperlinks.'),
});

export type GenerateBlogPostOutput = z.infer<typeof GenerateBlogPostOutputSchema>;


// Schema for the input to the AI prompt (includes search results)
const GenerateBlogPostPromptInputSchema = GenerateBlogPostFlowInputSchema.extend({
  searchResults: z.array(z.object({
    title: z.string(),
    url: z.string(),
    content: z.string().optional(), // Content is optional as Tavily mock might not provide it for all URLs
  })).describe('Search results from web research to use as research material.'),
});


const generateBlogPostPrompt = ai.definePrompt({
  name: 'generateBlogPostPrompt',
  input: {schema: GenerateBlogPostPromptInputSchema},
  output: {schema: GenerateBlogPostOutputSchema},
  prompt: `You are an expert blog writer and SEO specialist. Your goal is to generate a comprehensive, well-researched, engaging, and up-to-date blog post.
The blog post must be written in a human-like, fluent style. It should incorporate information from the provided "Research Material" to ensure accuracy and recency.

Blog Description: {{{blogDescription}}}
Primary Keywords: {{{primaryKeywords}}}
Secondary Keywords: {{#if secondaryKeywords}}{{{secondaryKeywords}}}{{else}}None provided{{/if}}
Target Audience: {{{targetAudience}}}

Research Material (prioritize this information):
{{#if searchResults}}
  {{#each searchResults}}
- Source Title: {{{this.title}}}
  Source URL: {{{this.url}}}
  {{#if this.content}}Source Snippet: {{{this.content}}}{{/if}}
  {{/each}}
{{else}}
No specific research material provided. Rely on your general knowledge, but clearly state if information might not be the most current due to lack of specific sources.
{{/if}}

Instructions:
1.  **Content Generation**:
    *   Thoroughly analyze the Blog Description, Keywords, and Target Audience.
    *   **Critically use the "Research Material"**: Synthesize information from these sources. Prioritize information from these sources over general knowledge, especially for facts, figures, or recent developments.
    *   If the Research Material is sparse or doesn't cover all aspects, you may use your general knowledge but clearly indicate where the information is from your general training data versus specific, up-to-date sources.
    *   The blog post should be at least 300 words, ideally 500-800 words for better engagement.
    *   Maintain a conversational yet authoritative tone suitable for the {{{targetAudience}}}.
    *   Ensure logical flow, clear structure with headings (h2, h3) and paragraphs (p).
    *   Avoid jargon unless explained or appropriate for the target audience.

2.  **Hyperlinking**:
    *   **Integrate multiple (at least 2-3 if sources are available and distinct) relevant hyperlinks** to the provided source URLs from the "Research Material".
    *   Hyperlinks should be naturally embedded within the text (e.g., "According to a <a href='URL'>recent study</a>..."). Do not just list links or create a "Sources" section.
    *   If a source provides a title, consider using it or a relevant phrase from its content as the anchor text.
    *   Ensure links are to the actual URLs provided in the Research Material.

3.  **Formatting**:
    *   Output valid HTML. Use \`<p>\` tags for paragraphs. Use \`<h2>\` or \`<h3>\` for section titles.
    *   Do NOT include \`<html>\`, \`<body>\`, \`<head>\`, or \`<title>\` tags.
    *   Do NOT include any images or image tags (\`<img>\`).
    *   Use bold (\`<strong>\`) or italics (\`<em>\`) sparingly for emphasis.

4.  **Quality**:
    *   Focus on creating high-quality, human-like content that is informative and engaging.
    *   Ensure the blog post is fluent, well-written, and free of grammatical errors.
    *   The content must be original and not a direct copy from the sources. Summarize and synthesize.
    *   Start directly with the blog content. Do not add any preambles like "Here is your blog post:".
    *   Conclude with a summary or a call to action if appropriate for the topic.
`,
});

const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow',
    inputSchema: GenerateBlogPostFlowInputSchema, // User input schema
    outputSchema: GenerateBlogPostOutputSchema,
  },
  async (userInput: GenerateBlogPostInput) => {
    // First, perform web research using the researchBlogTopic flow.
    const researchOutput: ResearchBlogTopicOutput = await researchBlogTopic(
      userInput
    );

    // Map the URLs from researchOutput to the TavilySearchResult structure expected by the prompt.
    // If the Tavily service (even mocked) could return titles/snippets, this mapping would be richer.
    const searchResults: TavilySearchResult[] = researchOutput.relevantSources.map(url => ({
      title: `Source: ${url.substring(0, 50)}...`, // Generic title based on URL
      url: url,
      // content: "Snippet if available from Tavily" // Add if Tavily can provide snippets
    }));

    // Then, pass the search results and the original input to the prompt.
    const promptInput = { ...userInput, searchResults };
    const {output} = await generateBlogPostPrompt(promptInput);
    
    if (!output || !output.title || !output.content) {
      throw new Error("AI failed to generate valid blog post content.");
    }
    return output;
  }
);

export async function generateBlogPost(input: GenerateBlogPostInput): Promise<GenerateBlogPostOutput> {
  return generateBlogPostFlow(input);
}
