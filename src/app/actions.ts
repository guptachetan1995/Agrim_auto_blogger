// This file uses server-side code.
'use server';

import { generateBlogPost } from '@/ai/flows/generate-blog-post';
import type { GenerateBlogPostInput, GenerateBlogPostOutput } from '@/ai/types';

export async function handleGenerateBlog(data: GenerateBlogPostInput): Promise<GenerateBlogPostOutput> {
  try {
    const result = await generateBlogPost(data);
    if (!result || !result.title || !result.content) {
      throw new Error('AI failed to generate a valid blog post structure.');
    }
    return result;
  } catch (error) {
    console.error('Error in handleGenerateBlog:', error);
    // It's better to throw the error so the client can handle it specifically
    // or return a structured error response. For simplicity, re-throwing.
    if (error instanceof Error) {
      throw new Error(`Failed to generate blog: ${error.message}`);
    }
    throw new Error('An unknown error occurred while generating the blog post.');
  }
}
