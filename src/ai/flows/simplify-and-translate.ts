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
  targetLanguage: z.string().describe('The language to translate the text to. Can also specify an Arabic dialect, e.g., "Sudanese Arabic".'),
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
    schema: SimplifyAndTranslateInputSchema, 
  },
  output: {
    schema: SimplifyAndTranslateOutputSchema,
  },
  prompt: `You are a helpful assistant that simplifies text and then translates the simplified text.

First, simplify the following text to make it very easy to understand, using basic vocabulary and short sentences.
Original Text:
"{{{text}}}"

After simplifying, translate the SIMPLIFIED text into the language specified by '{{targetLanguage}}'.

IMPORTANT - ARABIC LANGUAGE: If the '{{targetLanguage}}' is 'Arabic' or specifies an Arabic dialect (e.g., 'Sudanese Arabic', 'Egyptian Arabic', 'Levantine Arabic'), please translate the simplified text into clear, widely understandable Arabic. If '{{targetLanguage}}' explicitly names a specific dialect (e.g., 'Sudanese Arabic'), prioritize using that dialect for the translation. If '{{targetLanguage}}' is just 'Arabic', use Modern Standard Arabic (MSA) or a broadly understood colloquial Arabic for the translation.

Output only the simplified text (in the original language of the input) and the translated version of the simplified text.
Example output format:
{
  "simplifiedText": "The simplified version of the input text.",
  "translatedText": "The translation of the simplified text into the target language."
}
`,
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
