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
import { tavilySearch, type TavilySearchResult } from '@/services/tavily'; // Ensure this path is correct

// Schema for user input to the flow
const GenerateBlogPostFlowInputSchema = z.object({
  blogDescription: z.string().describe('The overall description of the blog.'),
  primaryKeywords: z.string().describe('The primary keywords for the blog.'),
  secondaryKeywords: z.string().optional().describe('The secondary keywords for the blog.'),
  targetAudience: z.string().describe('The target audience for the blog.'),
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
    content: z.string().optional(),
  })).describe('Search results from Tavily API to use as research material.'),
});


const generateBlogPostPrompt = ai.definePrompt({
  name: 'generateBlogPostPrompt',
  input: {schema: GenerateBlogPostPromptInputSchema},
  output: {schema: GenerateBlogPostOutputSchema},
  prompt: `You are an expert blog writer. You will generate a well-researched, up-to-date, and fluent blog post with HTML formatting and hyperlinks to sources based on the user's input and the provided research material.

Blog Description: {{{blogDescription}}}
Primary Keywords: {{{primaryKeywords}}}
Secondary Keywords: {{{secondaryKeywords}}}
Target Audience: {{{targetAudience}}}

Research Material:
{% if searchResults && searchResults.length > 0 %}
{% each searchResults %}
- Title: {{{this.title}}}, URL: {{{this.url}}}{% if this.content %}, Snippet: {{{this.content}}}{% endif %}
{% endeach %}
{% else %}
No specific research material provided. Rely on general knowledge and the user's input.
{% endif %}

Instructions:
- Write a blog post based on the Blog Description, Keywords, Target Audience, and incorporate information from the Research Material.
- When using information from the Research Material, hyperlink relevant text to the source URL using <a href="URL">text</a>.
- Ensure the blog post is fluent, well-structured, and up-to-date.
- The output must be HTML. Use <p> tags for paragraphs. Use <h2> or <h3> for section titles if appropriate. Do not include <body> or <head> tags or a title tag.
- Do not include any images or image tags.
- Focus on creating high-quality, human-like content.
- The blog post should be at least 300 words.
- Start directly with the blog content. Do not add any preambles like "Here is your blog post:".`,
});

const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow',
    inputSchema: GenerateBlogPostFlowInputSchema, // User input schema
    outputSchema: GenerateBlogPostOutputSchema,
  },
  async (userInput: GenerateBlogPostInput) => {
    // First, perform web research using the Tavily API based on the keywords and blog description.
    const searchResults: TavilySearchResult[] = await tavilySearch(
      `${userInput.blogDescription} ${userInput.primaryKeywords} ${userInput.secondaryKeywords || ''}`
    );

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
