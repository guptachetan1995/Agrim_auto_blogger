// Summarizes user feedback on blog posts to improve future content.

'use server';

import {ai} from '@/ai/genkit';
import type {
  SummarizeUserFeedbackInput,
  SummarizeUserFeedbackOutput
} from '@/ai/types';
import {
  SummarizeUserFeedbackInputSchema,
  SummarizeUserFeedbackOutputSchema
} from '@/ai/types';


export async function summarizeUserFeedback(
  input: SummarizeUserFeedbackInput
): Promise<SummarizeUserFeedbackOutput> {
  return summarizeUserFeedbackFlow(input);
}

const summarizeUserFeedbackPrompt = ai.definePrompt({
  name: 'summarizeUserFeedbackPrompt',
  input: {schema: SummarizeUserFeedbackInputSchema},
  output: {schema: SummarizeUserFeedbackOutputSchema},
  prompt: `You are an AI assistant helping to improve blog post quality.
  Summarize the following user feedback to identify key areas for improvement in future blog posts:

  {% each feedback %}
  - {{{this}}}
  {% endeach %}
  `,
});

const summarizeUserFeedbackFlow = ai.defineFlow(
  {
    name: 'summarizeUserFeedbackFlow',
    inputSchema: SummarizeUserFeedbackInputSchema,
    outputSchema: SummarizeUserFeedbackOutputSchema,
  },
  async input => {
    const {output} = await summarizeUserFeedbackPrompt(input);
    return output!;
  }
);
