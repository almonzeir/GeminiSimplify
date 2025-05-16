'use server';

/**
 * @fileOverview Provides example input text or prompts for the simplification and translation tool.
 *
 * - suggestInputText - A function that returns a suggested input text.
 * - SuggestInputTextOutput - The return type for the suggestInputText function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestInputTextOutputSchema = z.object({
  suggestedText: z
    .string()
    .describe('A suggested input text for simplification and translation.'),
});
export type SuggestInputTextOutput = z.infer<typeof SuggestInputTextOutputSchema>;

export async function suggestInputText(): Promise<SuggestInputTextOutput> {
  return suggestInputTextFlow({});
}

const prompt = ai.definePrompt({
  name: 'suggestInputTextPrompt',
  output: {
    schema: z.object({
      suggestedText: z
        .string()
        .describe('A suggested input text for simplification and translation.'),
    }),
  },
  prompt: `You are an expert at generating example input texts for a simplification and translation tool.

  Generate a single example input text that demonstrates the capabilities of the tool.
  The text should be complex enough to showcase the simplification feature and diverse enough to be translated into other languages.
  The text should be between 20 and 50 words.

  Output the text in the following format:
  {"suggestedText": "your suggested text here"}
  `,
});

const suggestInputTextFlow = ai.defineFlow<z.ZodObject<{} extends z.ZodTypeAny ? {} : z.infer<z.ZodObject<{}>>>, typeof SuggestInputTextOutputSchema>(
  {
    name: 'suggestInputTextFlow',
    inputSchema: z.object({}), // Explicitly empty object schema for clarity
    outputSchema: SuggestInputTextOutputSchema,
  },
  async () => {
    const {output} = await prompt({});
    if (!output || typeof output.suggestedText !== 'string') {
      console.error("AI output for suggested text was not in the expected format:", output);
      // Provide a fallback or a more informative error structure
      return {
        suggestedText: "Error: Could not generate suggested text at this time. Please try again."
      };
    }
    return output;
  }
);
