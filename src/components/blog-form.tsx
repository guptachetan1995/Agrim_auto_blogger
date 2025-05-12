'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

const blogFormSchema = z.object({
  blogDescription: z.string().min(10, {
    message: 'Blog description must be at least 10 characters.',
  }).max(1000, {
    message: 'Blog description must not exceed 1000 characters.'
  }),
  primaryKeywords: z.string().min(2, {
    message: 'Primary keywords must be at least 2 characters.',
  }).max(200, {
    message: 'Primary keywords must not exceed 200 characters.'
  }),
  secondaryKeywords: z.string().max(200, {
    message: 'Secondary keywords must not exceed 200 characters.'
  }).optional(),
  targetAudience: z.string().min(2, {
    message: 'Target audience must be at least 2 characters.',
  }).max(200, {
    message: 'Target audience must not exceed 200 characters.'
  }),
});

export type BlogFormValues = z.infer<typeof blogFormSchema>;

interface BlogFormProps {
  onSubmit: (data: BlogFormValues) => Promise<void>;
  isLoading: boolean;
}

export function BlogForm({ onSubmit, isLoading }: BlogFormProps) {
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      blogDescription: '',
      primaryKeywords: '',
      secondaryKeywords: '',
      targetAudience: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="blogDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blog Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g., A blog about the future of renewable energy technologies and their impact on climate change."
                  className="resize-y min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Describe the main topic and purpose of your blog.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="primaryKeywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Keywords</FormLabel>
              <FormControl>
                <Input placeholder="e.g., solar power, wind energy, battery storage" {...field} />
              </FormControl>
              <FormDescription>
                Main keywords or phrases, comma-separated.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="secondaryKeywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secondary Keywords (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., sustainable development, carbon footprint, green tech" {...field} />
              </FormControl>
              <FormDescription>
                Additional keywords to refine the topic.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="targetAudience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Audience</FormLabel>
              <FormControl>
                <Input placeholder="e.g., tech enthusiasts, environmentalists, policymakers" {...field} />
              </FormControl>
              <FormDescription>
                Who is this blog post for?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Blog Post'
          )}
        </Button>
      </form>
    </Form>
  );
}
