
'use server';

/**
 * @fileOverview A flow for simplifying and translating text with improved accuracy and dialect handling.
 *
 * - simplifyAndTranslate - A function that simplifies and translates text.
 * - SimplifyAndTranslateInput - The input type for the simplifyAndTranslate function.
 * - SimplifyAndTranslateOutput - The return type for the simplifyAndTranslate function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SimplifyAndTranslateInputSchema = z.object({
  text: z.string().describe('The text to simplify and translate.'),
  targetLanguage: z.string().describe('The language to translate the text to. Can also specify a specific Arabic dialect, e.g., "Sudanese Arabic", "Egyptian Arabic", "Moroccan Darija".'),
});
export type SimplifyAndTranslateInput = z.infer<typeof SimplifyAndTranslateInputSchema>;

const SimplifyAndTranslateOutputSchema = z.object({
  simplifiedText: z.string().describe('The simplified text, in the original language of the input.'),
  translatedText: z.string().describe('The translated version of the simplified text, in the target language/dialect.'),
});
export type SimplifyAndTranslateOutput = z.infer<typeof SimplifyAndTranslateOutputSchema>;

export async function simplifyAndTranslate(input: SimplifyAndTranslateInput): Promise<SimplifyAndTranslateOutput> {
  return simplifyAndTranslateFlow(input);
}

const simplifyAndTranslatePrompt = ai.definePrompt({
  name: 'simplifyAndTranslatePromptEnhanced',
  input: {
    schema: SimplifyAndTranslateInputSchema, 
  },
  output: {
    schema: SimplifyAndTranslateOutputSchema,
  },
  prompt: `You are an expert linguistic assistant. Your primary goal is to make text easier to understand and then translate it accurately.

Process Overview:
1.  **Simplify**: Take the "Original Text" and rephrase it using very basic vocabulary, short sentences, and clear structures. The simplified text MUST remain in the SAME language as the original input text. Preserve the core meaning and all essential information.
2.  **Translate**: Translate ONLY the SIMPLIFIED text (from step 1) into the specified '{{targetLanguage}}'.

Original Text:
"{{{text}}}"

Target Language/Dialect for Translation: "{{targetLanguage}}"

**Detailed Instructions for Simplification (Step 1):**
*   Aim for clarity suitable for a beginner learner of the original language or someone with reading difficulties.
*   Break down complex sentences.
*   Replace jargon or difficult words with common equivalents.
*   Ensure the simplified text is factually accurate and retains the full nuance of the original message.

**Detailed Instructions for Translation (Step 2):**
*   Translate the SIMPLIFIED text accurately and naturally into '{{targetLanguage}}'.
*   Pay close attention to grammar, idioms, and cultural context of '{{targetLanguage}}'.

**IMPORTANT - ARABIC LANGUAGE & DIALECTS:**
*   If '{{targetLanguage}}' specifies an Arabic dialect (e.g., "Sudanese Arabic", "Egyptian Arabic", "Levantine Arabic", "Moroccan Darija", "Gulf Arabic"):
    *   You MUST prioritize translating into that specific dialect. Use vocabulary, grammar, and expressions characteristic of that dialect.
    *   If you are not confident in producing an accurate translation in the *exact* specified dialect, you may:
        1.  Attempt the specific dialect but add a very brief note (in English, within parentheses at the end of the translatedText field if necessary, e.g., "(Note: Attempted specified dialect; some phrases may be closer to a broader regional form.)") if you had to generalize.
        2.  If the specified dialect is too niche or you have very low confidence, translate into Modern Standard Arabic (MSA) or a widely understood regional Arabic (e.g., general Levantine or Egyptian if appropriate for the region of the specified dialect) AND clearly state that you've used MSA or a broader form because the specific dialect was too challenging (e.g., "Translated to MSA as requested dialect is highly specific.").
*   If '{{targetLanguage}}' is just "Arabic" (without a dialect specified): Translate into clear Modern Standard Arabic (MSA) or a broadly understood colloquial Arabic.

Output Format:
Provide your response as a JSON object with two keys: "simplifiedText" (containing the simplified version of the input text in its original language) and "translatedText" (containing the translation of the simplified text into the '{{targetLanguage}}').
Example:
{
  "simplifiedText": "The original text, but much easier to read and understand.",
  "translatedText": "The translation of that easy-to-read text into the target language."
}
`,
});

const simplifyAndTranslateFlow = ai.defineFlow<
  typeof SimplifyAndTranslateInputSchema,
  typeof SimplifyAndTranslateOutputSchema
>({
  name: 'simplifyAndTranslateFlowEnhanced',
  inputSchema: SimplifyAndTranslateInputSchema,
  outputSchema: SimplifyAndTranslateOutputSchema,
}, async input => {
  const {output} = await simplifyAndTranslatePrompt(input);
  // Basic validation or fallback if output is not as expected
  if (!output || typeof output.simplifiedText !== 'string' || typeof output.translatedText !== 'string') {
    console.error("AI output was not in the expected format:", output);
    // Fallback to avoid crashing the app, though this indicates an issue with the LLM or prompt.
    return {
      simplifiedText: "Error: Could not process the text simplification.",
      translatedText: "Error: Could not process the text translation."
    };
  }
  return output;
});

