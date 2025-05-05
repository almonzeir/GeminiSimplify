'use server';

/**
 * @fileOverview A flow for simplifying and translating text.
 *
 * - simplifyAndTranslate - A function that simplifies and translates text.
 * - SimplifyAndTranslateInput - The input type for the simplifyAndTranslate function.
 * - SimplifyAndTranslateOutput - The return type for the simplifyAndTranslate function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SimplifyAndTranslateInputSchema = z.object({
  text: z.string().describe('The text to simplify and translate.'),
  targetLanguage: z.string().describe('The language to translate the text to.'),
});
export type SimplifyAndTranslateInput = z.infer<typeof SimplifyAndTranslateInputSchema>;

const SimplifyAndTranslateOutputSchema = z.object({
  simplifiedText: z.string().describe('The simplified text.'),
  translatedText: z.string().describe('The translated text.'),
});
export type SimplifyAndTranslateOutput = z.infer<typeof SimplifyAndTranslateOutputSchema>;

export async function simplifyAndTranslate(input: SimplifyAndTranslateInput): Promise<SimplifyAndTranslateOutput> {
  return simplifyAndTranslateFlow(input);
}

const simplifyAndTranslatePrompt = ai.definePrompt({
  name: 'simplifyAndTranslatePrompt',
  input: {
    schema: z.object({
      text: z.string().describe('The text to simplify and translate.'),
      targetLanguage: z.string().describe('The language to translate the text to.'),
    }),
  },
  output: {
    schema: z.object({
      simplifiedText: z.string().describe('The simplified text.'),
      translatedText: z.string().describe('The translated text in the target language.'),
    }),
  },
  prompt: `You are a helpful assistant that simplifies and translates text.

  Simplify the following text and translate it to {{targetLanguage}}.

  Text: {{{text}}}

  Output the simplified and translated text.`,
});

const simplifyAndTranslateFlow = ai.defineFlow<
  typeof SimplifyAndTranslateInputSchema,
  typeof SimplifyAndTranslateOutputSchema
>({
  name: 'simplifyAndTranslateFlow',
  inputSchema: SimplifyAndTranslateInputSchema,
  outputSchema: SimplifyAndTranslateOutputSchema,
}, async input => {
  const {output} = await simplifyAndTranslatePrompt(input);
  return output!;
});
