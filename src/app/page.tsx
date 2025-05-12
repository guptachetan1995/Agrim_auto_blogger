'use client';

import type { GenerateBlogPostOutput } from '@/ai/flows/generate-blog-post';
import { useState } from 'react';
import { BlogForm, type BlogFormValues } from '@/components/blog-form';
import { BlogDisplay }  from '@/components/blog-display';
import { handleGenerateBlog } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from 'lucide-react';

export default function Home() {
  const [blogOutput, setBlogOutput] = useState<GenerateBlogPostOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onGenerateBlog = async (data: BlogFormValues) => {
    setIsLoading(true);
    setError(null);
    setBlogOutput(null);
    try {
      const result = await handleGenerateBlog(data);
      if (result.title && result.content) {
        setBlogOutput(result);
      } else {
        setError('Failed to generate blog post. The AI returned an unexpected response.');
      }
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-3xl space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-primary tracking-tight">
            BlogSmith AI
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Generate human-like blogs with the power of AI.
          </p>
        </header>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Create Your Blog Post</CardTitle>
          </CardHeader>
          <CardContent>
            <BlogForm onSubmit={onGenerateBlog} isLoading={isLoading} />
          </CardContent>
        </Card>

        {isLoading && (
          <div className="flex items-center justify-center space-x-2 text-primary py-8">
            <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-lg">Generating your masterpiece...</span>
          </div>
        )}

        {error && (
           <Alert variant="destructive" className="shadow-lg">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error Generating Blog</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {blogOutput && !isLoading && (
          <BlogDisplay title={blogOutput.title} content={blogOutput.content} />
        )}
      </div>
      <footer className="mt-12 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} BlogSmith AI. All rights reserved.</p>
      </footer>
    </main>
  );
}
