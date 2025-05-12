// Summarizes user feedback on blog posts to improve future content.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeUserFeedbackInputSchema = z.object({
  feedback: z.array(z.string()).describe('An array of user feedback strings.'),
});

export type SummarizeUserFeedbackInput = z.infer<
  typeof SummarizeUserFeedbackInputSchema
>;

const SummarizeUserFeedbackOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the user feedback, highlighting key areas for improvement.'),
});

export type SummarizeUserFeedbackOutput = z.infer<
  typeof SummarizeUserFeedbackOutputSchema
>;

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
