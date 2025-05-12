// This file uses server-side code.
'use server';

// Ensure .env variables are loaded. This might be handled by Next.js/Genkit already.
// import { config } from 'dotenv';
// config();

// Import the type from the central types file
import type { TavilySearchResult } from '@/ai/types';


interface TavilyAPIResponseResult {
  title: string;
  url: string;
  content: string; // Tavily API typically provides this
  score?: number;
  raw_content?: string; // if requested
}

interface TavilyAPIResponse {
  query?: string;
  response_time?: number;
  answer?: string | null;
  images?: string[] | null;
  results: TavilyAPIResponseResult[];
  error?: string;
}


export async function tavilySearch(query: string, maxResults: number = 3): Promise<TavilySearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;

  if (!apiKey) {
    console.error(
      'Tavily API key not found. Please set TAVILY_API_KEY in your .env file.' +
      ' Returning empty search results. The blog post will be generated using general knowledge only.'
    );
    return [];
  }

  console.log(`Performing Tavily search for: "${query}"`);

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: query,
        search_depth: 'advanced', // 'basic' or 'advanced'
        include_answer: false, // We don't need Tavily's AI answer, just search results
        include_images: false,
        include_raw_content: false, // For snippets, 'content' is usually enough. Set to true if full raw text is needed.
        max_results: maxResults,
        // include_domains: [],
        // exclude_domains: []
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Tavily API error: ${response.status} ${response.statusText}`, errorBody);
      // Fallback to empty results on API error to avoid breaking the flow
      return [];
    }

    const data = (await response.json()) as TavilyAPIResponse;

    if (data.error) {
      console.error('Tavily API returned an error in the response body:', data.error);
      return [];
    }
    
    if (!data.results || data.results.length === 0) {
      console.log(`Tavily search for "${query}" returned no results.`);
      return [];
    }

    // Map Tavily API results to our TavilySearchResult structure
    return data.results.map((result: TavilyAPIResponseResult) => ({
      title: result.title,
      url: result.url,
      content: result.content, // This is the snippet Tavily provides
      score: result.score,
    }));

  } catch (error) {
    console.error('Failed to fetch from Tavily API:', error);
    // Fallback to empty results on network or parsing error
    return [];
  }
}
