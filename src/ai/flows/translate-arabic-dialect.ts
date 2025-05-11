
'use server';
/**
 * @fileOverview A flow for translating text between different Arabic dialects with enhanced accuracy and nuance.
 *
 * - translateArabicDialect - A function that translates text from a source Arabic dialect to a target Arabic dialect.
 * - TranslateArabicDialectInput - The input type for the translateArabicDialect function.
 * - TranslateArabicDialectOutput - The return type for the translateArabicDialect function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const TranslateArabicDialectInputSchema = z.object({
  inputText: z.string().describe('The Arabic text to translate.'),
  sourceDialect: z.string().describe('The source Arabic dialect of the input text (e.g., "Egyptian Arabic", "Levantine Arabic - Syrian", "Moroccan Darija").'),
  targetDialect: z.string().describe('The target Arabic dialect for the translation (e.g., "Gulf Arabic - Kuwaiti", "Sudanese Arabic", "Modern Standard Arabic").'),
});
export type TranslateArabicDialectInput = z.infer<typeof TranslateArabicDialectInputSchema>;

const TranslateArabicDialectOutputSchema = z.object({
  translatedText: z.string().describe('The translated text in the target Arabic dialect. If the AI cannot accurately translate to the specific target dialect, it should explain and provide the translation in the closest widely understood alternative (e.g., MSA or a broader regional dialect) along with a note.'),
});
export type TranslateArabicDialectOutput = z.infer<typeof TranslateArabicDialectOutputSchema>;

export async function translateArabicDialect(input: TranslateArabicDialectInput): Promise<TranslateArabicDialectOutput> {
  return translateArabicDialectFlow(input);
}

const translateArabicDialectPrompt = ai.definePrompt({
  name: 'translateArabicDialectPromptEnhanced',
  input: {
    schema: TranslateArabicDialectInputSchema,
  },
  output: {
    schema: TranslateArabicDialectOutputSchema,
  },
  prompt: `You are an expert linguist specializing in Arabic dialects. Your task is to translate the provided text with the highest possible accuracy from the source Arabic dialect to the target Arabic dialect.

**Key Objectives:**
1.  **Accuracy:** The translation must be precise.
2.  **Nuance Preservation:** Maintain the original meaning, tone, connotations, and subtleties of the input text.
3.  **Cultural Context:** Ensure the translation is culturally appropriate for the target dialect's speakers.
4.  **Fluency:** The output must be natural and fluent in the target dialect, as if spoken by a native speaker.
5.  **Idioms:** Correctly translate idiomatic expressions or find equivalent idioms in the target dialect. If a direct equivalent doesn't exist, rephrase to convey the same meaning.

Source Dialect: {{{sourceDialect}}}
Target Dialect: {{{targetDialect}}}

Input Text to Translate (in {{{sourceDialect}}}):
"{{{inputText}}}"

**Instructions for Output:**
*   Provide ONLY the translated text in the 'translatedText' field.
*   If you are highly confident in your translation into the *exact* specified '{{{targetDialect}}}', provide just the translation.
*   If the '{{{targetDialect}}}' is very specific (e.g., a sub-dialect of a major region) and you can provide a good translation but are not 100% certain it captures all nuances of that *specific* sub-dialect, provide the translation and you MAY add a brief, parenthetical note in English at the end of the 'translatedText' if you feel it's necessary (e.g., " (Note: This translation aims for {{{targetDialect}}}, some phrases might be more common in broader regional usage.)").
*   **Fallback Strategy:** If you have very low confidence in accurately translating to the *exact* specified '{{{targetDialect}}}' (perhaps it's too niche, or the input text is very complex idiomatically for that dialect pair), do the following:
    1.  Translate the text into the closest, widely understood alternative. This could be Modern Standard Arabic (MSA), or a major regional dialect (e.g., general Egyptian, Levantine, or Gulf Arabic) that is related to or commonly understood by speakers of the '{{{targetDialect}}}'.
    2.  In the 'translatedText' field, provide this alternative translation.
    3.  Crucially, at the BEGINNING of the 'translatedText' field, include a clear statement in English within parentheses, explaining the fallback. For example: "(Unable to provide a high-confidence translation for the specific {{{targetDialect}}}. Translated to Modern Standard Arabic instead:) [followed by MSA translation]" OR "(Translation to specific {{{targetDialect}}} is challenging for this input. Provided in general Gulf Arabic:) [followed by Gulf Arabic translation]".

Translated Text (in {{{targetDialect}}}, or with fallback explanation as per instructions):
`,
  config: {
    safetySettings: [ 
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
  name: 'translateArabicDialectFlowEnhanced',
  inputSchema: TranslateArabicDialectInputSchema,
  outputSchema: TranslateArabicDialectOutputSchema,
}, async input => {
  const {output} = await translateArabicDialectPrompt(input);
  if (!output || typeof output.translatedText !== 'string') {
    console.error("AI output for dialect translation was not in the expected format:", output);
    return {
      translatedText: "(Error: The AI failed to produce a translation. Please try again.)"
    };
  }
  return output;
});
