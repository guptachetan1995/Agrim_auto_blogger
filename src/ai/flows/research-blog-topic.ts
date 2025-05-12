// This needs to be in a separate file so that genkit can pick it up.
'use server';

/**
 * @fileOverview Conducts real-time web research based on input parameters (keywords, blog description).
 * The flow first uses an LLM to generate relevant search queries, then executes these queries
 * using a search service (Tavily) to find relevant source URLs and content snippets.
 *
 * - researchBlogTopic - A function that initiates the blog topic research flow.
 */

import {ai} from '@/ai/genkit';
import {tavilySearch, type TavilySearchResult} from '@/services/tavily';
import type {
  ResearchBlogTopicInput,
  ResearchBlogTopicOutput
} from '@/ai/types';
import {
  ResearchBlogTopicInputSchema,
  ResearchBlogTopicOutputSchema,
  ResearchBlogTopicPromptOutputSchema
} from '@/ai/types';


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
      console.warn('LLM did not return search queries. Using a default query based on primary keywords and description.');
      searchQueries.push(`${input.primaryKeywords} ${input.blogDescription}`);
    }

    // 2. Execute these search queries using Tavily
    console.log('Generated search queries:', searchQueries);
    const searchPromises = searchQueries.map(query => tavilySearch(query, 3)); // Fetch top 3 results per query
    const settledResults = await Promise.allSettled(searchPromises);

    const allFoundSources: TavilySearchResult[] = [];
    settledResults.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        allFoundSources.push(...result.value);
      } else if (result.status === 'rejected') {
        console.error(`Tavily search failed for query "${searchQueries[index]}":`, result.reason);
      }
    });

    // 3. Collect unique sources from the Tavily search results
    // (based on URL to avoid duplicates if multiple queries return the same source)
    const uniqueSources: TavilySearchResult[] = [];
    const seenUrls = new Set<string>();
    for (const source of allFoundSources) {
      if (source.url && !seenUrls.has(source.url)) {
        uniqueSources.push(source);
        seenUrls.add(source.url);
      }
    }
    
    console.log(`Found ${uniqueSources.length} unique relevant sources.`);

    return {
      searchQueries: searchQueries,
      relevantSources: uniqueSources,
    };
  }
);
