// This needs to be in a separate file so that genkit can pick it up.
'use server';

/**
 * @fileOverview Conducts real-time web research based on input parameters (keywords, blog description).
 *
 * - researchBlogTopic - A function that initiates the blog topic research flow.
 * - ResearchBlogTopicInput - The input type for the researchBlogTopic function.
 * - ResearchBlogTopicOutput - The return type for the researchBlogTopic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResearchBlogTopicInputSchema = z.object({
  blogDescription: z.string().describe('A description of the blog topic.'),
  primaryKeywords: z.string().describe('Primary keywords related to the blog topic.'),
  secondaryKeywords: z.string().optional().describe('Secondary keywords for the blog topic.'),
  targetAudience: z.string().describe('The target audience for the blog post.'),
});

export type ResearchBlogTopicInput = z.infer<typeof ResearchBlogTopicInputSchema>;

const ResearchBlogTopicOutputSchema = z.object({
  searchQueries: z.array(z.string()).describe('List of search queries to use for research.'),
  relevantSources: z.array(z.string()).describe('List of URLs for relevant sources found during research.'),
});

export type ResearchBlogTopicOutput = z.infer<typeof ResearchBlogTopicOutputSchema>;

export async function researchBlogTopic(input: ResearchBlogTopicInput): Promise<ResearchBlogTopicOutput> {
  return researchBlogTopicFlow(input);
}

const tavilySearch = ai.defineTool(
  {
    name: 'tavilySearch',
    description: 'Uses Tavily API to conduct real-time web research based on keywords.',
    inputSchema: z.object({
      query: z.string().describe('The search query to use.'),
    }),
    outputSchema: z.array(z.string()).describe('A list of URLs for the search query.'),
  },
  async input => {
    // Replace with actual Tavily API call
    // For now, just return some dummy URLs
    console.log(`Running fake Tavily search for ${input.query}`);
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network latency
    return [
      `https://example.com/search?q=${input.query}`,
      `https://wikipedia.org/wiki/${input.query.replace(/ /g, '_')}`, // very basic
    ];
  }
);

const researchBlogTopicPrompt = ai.definePrompt({
  name: 'researchBlogTopicPrompt',
  input: {schema: ResearchBlogTopicInputSchema},
  output: {schema: ResearchBlogTopicOutputSchema},
  tools: [tavilySearch],
  prompt: `You are an AI research assistant helping to gather information for a blog post.

  Based on the following input parameters, generate a list of search queries to find relevant sources. Then, use the tavilySearch tool to find relevant sources based on the search queries. Return ONLY the URLs for the relevant sources found during research. 

Blog Description: {{{blogDescription}}}
Primary Keywords: {{{primaryKeywords}}}
Secondary Keywords: {{{secondaryKeywords}}}
Target Audience: {{{targetAudience}}}

Consider the target audience and blog description when generating search queries.


  `,
});

const researchBlogTopicFlow = ai.defineFlow(
  {
    name: 'researchBlogTopicFlow',
    inputSchema: ResearchBlogTopicInputSchema,
    outputSchema: ResearchBlogTopicOutputSchema,
  },
  async input => {
    const {output} = await researchBlogTopicPrompt(input);
    // Here, you can add logic to filter and refine the search results if needed.
    return output!;
  }
);
