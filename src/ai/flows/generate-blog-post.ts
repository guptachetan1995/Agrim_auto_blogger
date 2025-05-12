// This file uses server-side code.
'use server';

/**
 * @fileOverview A flow to generate a well-researched blog post based on user inputs.
 *
 * - generateBlogPost - A function that generates a blog post.
 */

import {ai} from '@/ai/genkit';
import type { TavilySearchResult } from '@/services/tavily';
import { researchBlogTopic } from '@/ai/flows/research-blog-topic';
import type {
  GenerateBlogPostInput,
  GenerateBlogPostOutput,
  ResearchBlogTopicOutput
} from '@/ai/types';
import {
  GenerateBlogPostFlowInputSchema,
  GenerateBlogPostOutputSchema,
  GenerateBlogPostPromptInputSchema
} from '@/ai/types';


const generateBlogPostPrompt = ai.definePrompt({
  name: 'generateBlogPostPrompt',
  input: {schema: GenerateBlogPostPromptInputSchema},
  output: {schema: GenerateBlogPostOutputSchema},
  prompt: `You are an expert blog writer and SEO specialist. Your goal is to generate a comprehensive, well-researched, engaging, and up-to-date blog post.
The blog post must be written in a human-like, fluent, and conversational style. It should incorporate information from the provided "Research Material" to ensure accuracy and recency.

Blog Description: {{{blogDescription}}}
Primary Keywords: {{{primaryKeywords}}}
Secondary Keywords: {{#if secondaryKeywords}}{{{secondaryKeywords}}}{{else}}None provided{{/if}}
Target Audience: {{{targetAudience}}}

Research Material (prioritize this information for accuracy and up-to-date content):
{{#if searchResults}}
  {{#each searchResults}}
- Source Title: {{{this.title}}}
  Source URL: {{{this.url}}}
  {{#if this.content}}Source Snippet: {{{this.content}}}{{/if}}
  {{#if this.score}}(Relevance Score: {{{this.score}}}){{/if}}
  {{/each}}
{{else}}
No specific research material provided. Rely on your general knowledge, but clearly state if information might not be the most current due to lack of specific sources.
{{/if}}

Instructions:
1.  **Content Generation**:
    *   Thoroughly analyze the Blog Description, Keywords, and Target Audience.
    *   **Critically use the "Research Material"**: The provided 'Research Material' is crucial for ensuring the blog post is current and well-supported. Weave information from these sources naturally into your writing. Synthesize information from these sources, especially the content snippets. Prioritize information from these sources over general knowledge, especially for facts, figures, or recent developments.
    *   If the Research Material is sparse or doesn't cover all aspects, you may use your general knowledge but clearly indicate where the information is from your general training data versus specific, up-to-date sources.
    *   The blog post should be at least 300 words, ideally 500-800 words for better engagement.
    *   Maintain a conversational yet authoritative tone suitable for the {{{targetAudience}}}. Strive for a narrative or engaging style that captivates the {{{targetAudience}}}.
    *   Ensure logical flow and clear structure. Organize the content with a clear introduction, several body paragraphs each focusing on a key aspect, and a concise conclusion. Use headings (h2, h3) to break up the text and improve readability.
    *   Avoid jargon unless explained or appropriate for the target audience.

2.  **Hyperlinking**:
    *   **Integrate multiple (at least 2-3 if distinct and relevant sources are available) relevant hyperlinks** to the provided source URLs from the "Research Material".
    *   Hyperlinks should be naturally embedded within the text (e.g., "According to <a href='URL_HERE'>this article on {Source Title}</a>..."). Do not just list links or create a "Sources" section.
    *   Use the source title or a relevant phrase from its content as the anchor text for the hyperlink. When hyperlinking, use the 'Source Snippet' (if available for a source: {{{this.content}}}) to understand the context of the source and craft relevant anchor text that flows naturally with your writing.
    *   Ensure links are to the actual URLs provided in the Research Material. Do not invent URLs or link to generic search pages.

3.  **Formatting**:
    *   Output valid HTML. Use \`<p>\` tags for paragraphs. Use \`<h2>\` or \`<h3>\` for section titles. Use \`<ul>\` or \`<ol>\` for lists where appropriate.
    *   Do NOT include \`<html>\`, \`<body>\`, \`<head>\`, or \`<title>\` tags.
    *   Do NOT include any images or image tags (\`<img>\`).
    *   Use bold (\`<strong>\`) or italics (\`<em>\`) sparingly for emphasis.

4.  **Quality**:
    *   Focus on creating high-quality, human-like content that is informative and engaging.
    *   Ensure the blog post is fluent, well-written, and free of grammatical errors.
    *   The content must be original and not a direct copy from the sources. Summarize, synthesize, and cite by linking.
    *   Start directly with the blog content (e.g., an \`<h2>\` for the title, followed by an introductory \`<p>\`). Do not add any preambles like "Here is your blog post:".
    *   Conclude with a summary or a call to action if appropriate for the topic.
`,
});

const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow',
    inputSchema: GenerateBlogPostFlowInputSchema, // User input schema
    outputSchema: GenerateBlogPostOutputSchema,
  },
  async (userInput: GenerateBlogPostInput): Promise<GenerateBlogPostOutput> => {
    // First, perform web research using the researchBlogTopic flow.
    console.log('Starting blog generation for:', userInput.blogDescription);
    const researchOutput: ResearchBlogTopicOutput = await researchBlogTopic(
      userInput
    );
    console.log(`Research completed. Found ${researchOutput.relevantSources.length} sources.`);

    // The relevantSources from researchOutput are already in TavilySearchResult[] format
    const searchResults: TavilySearchResult[] = researchOutput.relevantSources;

    // Then, pass the search results and the original input to the prompt.
    const promptInput = { ...userInput, searchResults };
    console.log('Generating blog post with prompt input:', { blogDescription: promptInput.blogDescription, primaryKeywords: promptInput.primaryKeywords, numSources: promptInput.searchResults.length });

    const {output} = await generateBlogPostPrompt(promptInput);
    
    if (!output || !output.title || !output.content) {
      console.error("AI failed to generate valid blog post content. Output:", output);
      throw new Error("AI failed to generate valid blog post content.");
    }
    console.log('Blog post generated successfully:', output.title);
    return output;
  }
);

export async function generateBlogPost(input: GenerateBlogPostInput): Promise<GenerateBlogPostOutput> {
  return generateBlogPostFlow(input);
}
