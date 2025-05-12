'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Smile, Frown, HelpCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface BlogDisplayProps {
  title: string;
  content: string;
}

export function BlogDisplay({ title, content }: BlogDisplayProps) {
  const handleFeedback = (feedbackType: string) => {
    // In a real app, you'd send this feedback to a server
    console.log(`Feedback received: ${feedbackType}`);
    // Potentially use useToast hook here
    // toast({ title: "Feedback Submitted", description: `You rated: ${feedbackType}` });
  };

  return (
    <Card className="shadow-xl mt-8">
      <CardHeader>
        <CardTitle className="text-3xl font-semibold text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none 
                     prose-headings:text-foreground prose-p:text-foreground 
                     prose-a:text-accent prose-strong:text-foreground"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </CardContent>
      <Separator className="my-6" />
      <CardFooter className="flex flex-col items-start space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <CardDescription>How was this blog post?</CardDescription>
        <div className="flex space-x-2">
          {[
            { icon: <ThumbsUp className="h-5 w-5" />, label: 'Helpful', type: 'helpful' },
            { icon: <Smile className="h-5 w-5" />, label: 'Good', type: 'good' },
            { icon: <HelpCircle className="h-5 w-5" />, label: 'Okay', type: 'okay' },
            { icon: <Frown className="h-5 w-5" />, label: 'Bad', type: 'bad' },
            { icon: <ThumbsDown className="h-5 w-5" />, label: 'Unhelpful', type: 'unhelpful' },
          ].map((feedback) => (
            <Button
              key={feedback.type}
              variant="outline"
              size="icon"
              aria-label={feedback.label}
              onClick={() => handleFeedback(feedback.type)}
              className="hover:bg-accent/20 hover:border-accent transition-colors"
            >
              {feedback.icon}
            </Button>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
