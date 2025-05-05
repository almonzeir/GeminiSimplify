'use server';
/**
 * @fileOverview AI agent that simplifies text and explains the simplification process.
 *
 * - explainSimplification - A function that simplifies and explains the simplification of input text.
 * - ExplainSimplificationInput - The input type for the explainSimplification function.
 * - ExplainSimplificationOutput - The return type for the explainSimplification function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ExplainSimplificationInputSchema = z.object({
  text: z.string().describe('The text to be simplified and explained.'),
  language: z.string().describe('The target language for translation.'),
});
export type ExplainSimplificationInput = z.infer<typeof ExplainSimplificationInputSchema>;

const ExplainSimplificationOutputSchema = z.object({
  simplifiedText: z.string().describe('The simplified text in the target language.'),
  explanation: z
    .string()
    .describe(
      'A brief explanation of how the AI simplified the text, highlighting the changes made and the reasons behind them.'
    ),
});
export type ExplainSimplificationOutput = z.infer<typeof ExplainSimplificationOutputSchema>;

export async function explainSimplification(
  input: ExplainSimplificationInput
): Promise<ExplainSimplificationOutput> {
  return explainSimplificationFlow(input);
}

const explainSimplificationPrompt = ai.definePrompt({
  name: 'explainSimplificationPrompt',
  input: {
    schema: z.object({
      text: z.string().describe('The text to be simplified and explained.'),
      language: z.string().describe('The target language for translation.'),
    }),
  },
  output: {
    schema: z.object({
      simplifiedText: z.string().describe('The simplified text in the target language.'),
      explanation:
        z.string().describe('Explanation of how the text was simplified.'),
    }),
  },
  prompt: `You are an AI expert in simplifying and translating text. A user will provide text, and a target language.

Simplify the text to be easily understood in the target language. Then, explain the changes you made during the simplification process, focusing on why these changes enhance clarity.

Here is the original text: {{{text}}}

Target language: {{{language}}}

Output the simplified text and a detailed explanation of the simplification process.`,
});

const explainSimplificationFlow = ai.defineFlow<
  typeof ExplainSimplificationInputSchema,
  typeof ExplainSimplificationOutputSchema
>({
  name: 'explainSimplificationFlow',
  inputSchema: ExplainSimplificationInputSchema,
  outputSchema: ExplainSimplificationOutputSchema,
},
async input => {
  const {output} = await explainSimplificationPrompt(input);
  return output!;
});
