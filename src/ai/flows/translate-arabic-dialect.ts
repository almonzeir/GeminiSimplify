'use server';
/**
 * @fileOverview A flow for translating text between different Arabic dialects.
 *
 * - translateArabicDialect - A function that translates text from a source Arabic dialect to a target Arabic dialect.
 * - TranslateArabicDialectInput - The input type for the translateArabicDialect function.
 * - TranslateArabicDialectOutput - The return type for the translateArabicDialect function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const TranslateArabicDialectInputSchema = z.object({
  inputText: z.string().describe('The Arabic text to translate.'),
  sourceDialect: z.string().describe('The source Arabic dialect of the input text (e.g., "Egyptian Arabic", "Levantine Arabic").'),
  targetDialect: z.string().describe('The target Arabic dialect for the translation (e.g., "Gulf Arabic", "Sudanese Arabic").'),
});
export type TranslateArabicDialectInput = z.infer<typeof TranslateArabicDialectInputSchema>;

const TranslateArabicDialectOutputSchema = z.object({
  translatedText: z.string().describe('The translated text in the target Arabic dialect.'),
});
export type TranslateArabicDialectOutput = z.infer<typeof TranslateArabicDialectOutputSchema>;

export async function translateArabicDialect(input: TranslateArabicDialectInput): Promise<TranslateArabicDialectOutput> {
  return translateArabicDialectFlow(input);
}

const translateArabicDialectPrompt = ai.definePrompt({
  name: 'translateArabicDialectPrompt',
  input: {
    schema: TranslateArabicDialectInputSchema,
  },
  output: {
    schema: TranslateArabicDialectOutputSchema,
  },
  prompt: `You are an expert linguist specializing in Arabic dialects. Your task is to accurately translate the provided text from the source Arabic dialect to the target Arabic dialect.
Focus on preserving the meaning, nuance, and cultural context as much as possible.
Ensure the output is natural and fluent in the target dialect.
Only output the translated text.

Source Dialect: {{{sourceDialect}}}
Target Dialect: {{{targetDialect}}}

Input Text to Translate:
"{{{inputText}}}"

Translated Text (in {{{targetDialect}}}):
`,
  config: {
    safetySettings: [ // General safety settings, adjust if needed
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  }
});

const translateArabicDialectFlow = ai.defineFlow<
  typeof TranslateArabicDialectInputSchema,
  typeof TranslateArabicDialectOutputSchema
>({
  name: 'translateArabicDialectFlow',
  inputSchema: TranslateArabicDialectInputSchema,
  outputSchema: TranslateArabicDialectOutputSchema,
}, async input => {
  const {output} = await translateArabicDialectPrompt(input);
  return output!;
});