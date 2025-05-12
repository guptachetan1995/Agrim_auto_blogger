// This needs to be in a separate file so that genkit can pick it up.
'use server';

/**
 * @fileOverview Conducts real-time web research based on input parameters (keywords, blog description).
 * The flow first uses an LLM to generate relevant search queries, then executes these queries
 * using a search service (Tavily) to find relevant source URLs.
 *
 * - researchBlogTopic - A function that initiates the blog topic research flow.
 * - ResearchBlogTopicInput - The input type for the researchBlogTopic function.
 * - ResearchBlogTopicOutput - The return type for the researchBlogTopic function, including search queries and found source URLs.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {tavilySearch, type TavilySearchResult} from '@/services/tavily';

const ResearchBlogTopicInputSchema = z.object({
  blogDescription: z.string().describe('A description of the blog topic.'),
  primaryKeywords: z.string().describe('Primary keywords related to the blog topic.'),
  secondaryKeywords: z.string().optional().describe('Secondary keywords for the blog topic.'),
  targetAudience: z.string().describe('The target audience for the blog post.'),
});

export type ResearchBlogTopicInput = z.infer<typeof ResearchBlogTopicInputSchema>;

// This is the final output schema for the entire flow
const ResearchBlogTopicOutputSchema = z.object({
  searchQueries: z.array(z.string()).describe('List of search queries used for research.'),
  relevantSources: z.array(z.string()).describe('List of URLs for relevant sources found during research.'),
});

export type ResearchBlogTopicOutput = z.infer<typeof ResearchBlogTopicOutputSchema>;

// Internal schema for the output of the researchBlogTopicPrompt (LLM part only)
const ResearchBlogTopicPromptOutputSchema = z.object({
  searchQueries: z.array(z.string()).describe('A list of effective search queries to find relevant information.'),
});

export async function researchBlogTopic(input: ResearchBlogTopicInput): Promise<ResearchBlogTopicOutput> {
  return researchBlogTopicFlow(input);
}

const researchBlogTopicPrompt = ai.definePrompt({
  name: 'researchBlogTopicPrompt',
  input: {schema: ResearchBlogTopicInputSchema},
  output: {schema: ResearchBlogTopicPromptOutputSchema}, // LLM only outputs search queries
  prompt: `You are an AI research assistant. Your task is to generate a list of effective search queries to gather information for a blog post.

  Based on the following input parameters, generate a list of 2-3 distinct search queries.
  Focus on queries that would yield up-to-date and authoritative sources.

  Blog Description: {{{blogDescription}}}
  Primary Keywords: {{{primaryKeywords}}}
  Secondary Keywords: {{#if secondaryKeywords}}{{{secondaryKeywords}}}{{else}}None provided{{/if}}
  Target Audience: {{{targetAudience}}}

  Consider the target audience and blog description when generating search queries.
  Return ONLY the search queries in the specified JSON format.

  Example Output:
  \`\`\`json
  {
    "searchQueries": [
      "latest trends in {{primaryKeywords}} for {{targetAudience}}",
      "impact of {{primaryKeywords}} on {{blogDescription}}",
      "{{secondaryKeywords}} and {{primaryKeywords}} advancements"
    ]
  }
  \`\`\`
  `,
});

const researchBlogTopicFlow = ai.defineFlow(
  {
    name: 'researchBlogTopicFlow',
    inputSchema: ResearchBlogTopicInputSchema,
    outputSchema: ResearchBlogTopicOutputSchema, // The flow's final output
  },
  async (input: ResearchBlogTopicInput): Promise<ResearchBlogTopicOutput> => {
    // 1. Get search queries from the LLM
    const llmResponse = await researchBlogTopicPrompt(input);
    const searchQueries = llmResponse.output?.searchQueries || [];

    if (!searchQueries.length) {
      // Fallback if LLM fails to provide queries, or provide a default query
      console.warn('LLM did not return search queries. Using a default query.');
      searchQueries.push(`${input.primaryKeywords} ${input.blogDescription}`);
    }

    // 2. Execute these search queries using Tavily (mocked)
    const searchPromises = searchQueries.map(query => tavilySearch(query));
    const settledResults = await Promise.allSettled(searchPromises);

    const allFoundSources: TavilySearchResult[] = [];
    settledResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allFoundSources.push(...result.value);
      } else {
        console.error(`Tavily search failed for query "${searchQueries[index]}":`, result.reason);
        // Optionally, handle this error, e.g., by trying a different service or logging
      }
    });

    // 3. Collect unique URLs from the Tavily search results
    const relevantSourceUrls = Array.from(new Set(allFoundSources.map(source => source.url).filter(url => !!url)));

    return {
      searchQueries: searchQueries,
      relevantSources: relevantSourceUrls,
    };
  }
);
