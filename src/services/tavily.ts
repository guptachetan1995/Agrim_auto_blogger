// This file uses server-side code.
'use server';

export interface TavilySearchResult {
  title: string;
  url: string;
  content?: string; // Snippet or short content
}

export async function tavilySearch(query: string): Promise<TavilySearchResult[]> {
  console.log(`Simulating Tavily search for: ${query}`);
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Return dummy data matching the expected structure
  const queryTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
  const baseResults: TavilySearchResult[] = [
    {
      title: `Comprehensive Guide to ${queryTerms[0] || 'Key Topic'}`,
      url: `https://example.com/guide-${queryTerms[0] || 'key-topic'}`,
      content: `An in-depth guide to ${queryTerms[0] || 'the main subject'}. This article covers history, applications, and future outlook.`,
    },
    {
      title: `Exploring ${queryTerms[1] || 'Related Concept'} in Modern Times`,
      url: `https://example.com/exploring-${queryTerms[1] || 'related-concept'}`,
      content: `Discover the relevance of ${queryTerms[1] || 'this important concept'} today. Includes case studies and expert opinions.`,
    },
    {
      title: `The Impact of ${queryTerms[2] || 'Another Keyword'} on Global Trends`,
      url: `https://example.com/impact-${queryTerms[2] || 'another-keyword'}`,
      content: `A detailed analysis of how ${queryTerms[2] || 'this keyword'} is shaping industries and societies worldwide.`,
    },
    {
      title: `Top 5 Innovations in ${queryTerms[0] || 'Primary Field'} for ${new Date().getFullYear()}`,
      url: `https://example.com/innovations-${queryTerms[0] || 'primary-field'}`,
      content: `Stay updated with the latest breakthroughs in ${queryTerms[0] || 'the primary field of interest'}.`,
    },
  ];

  // Shuffle results for some variation if needed, or just return as is.
  return baseResults.sort(() => Math.random() - 0.5).slice(0, 3); // Return 3 random results
}
