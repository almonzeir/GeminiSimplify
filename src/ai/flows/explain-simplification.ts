
'use server';
/**
 * @fileOverview AI agent that interprets a simplified text, explains the potential real-world scenario it implies, and suggests next steps.
 *
 * - explainSimplification - A function that provides a situational explanation and next steps for a given simplified text.
 * - ExplainSimplificationInput - The input type for the explainSimplification function.
 * - ExplainSimplificationOutput - The return type for the explainSimplification function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ExplainSimplificationInputSchema = z.object({
  simplifiedText: z.string().describe('The simplified text that implies a real-world situation.'),
  language: z.string().describe('The target language for the explanation and next steps.'),
});
export type ExplainSimplificationInput = z.infer<typeof ExplainSimplificationInputSchema>;

const ExplainSimplificationOutputSchema = z.object({
  scenarioExplanation: z
    .string()
    .describe(
      'An explanation of the potential real-world scenario implied by the simplified text, in the target language.'
    ),
  nextSteps: z
    .string()
    .describe(
      'Actionable next steps or advice for the user based on the scenario, in the target language. This can be a paragraph or a list formatted with newlines.'
    ),
});
export type ExplainSimplificationOutput = z.infer<typeof ExplainSimplificationOutputSchema>;

export async function explainSimplification(
  input: ExplainSimplificationInput
): Promise<ExplainSimplificationOutput> {
  return explainSimplificationFlow(input);
}

const explainSimplificationPrompt = ai.definePrompt({
  name: 'explainSituationalGuidancePrompt', // Renamed for clarity
  input: {
    schema: ExplainSimplificationInputSchema,
  },
  output: {
    schema: ExplainSimplificationOutputSchema,
  },
  prompt: `You are a helpful AI assistant. A user has received a simplified piece of text. Your task is to:
1. Interpret this simplified text as a potential real-world situation or problem the user might be facing.
2. Explain this situation to the user in plain terms, in the target language: {{{language}}}.
3. Provide practical, actionable next steps or advice for the user in this situation, also in the target language: {{{language}}}.

Focus on being helpful and providing guidance. Avoid merely rephrasing the text or explaining linguistic changes.
Think about what this message implies if someone received it in real life. For example, if the text is "Entering this country is difficult. You should return to your country.", it might imply an immigration or border control issue.

Here is the simplified text you need to interpret:
"{{{simplifiedText}}}"

Target language for your response (explanation and next steps): {{{language}}}

IMPORTANT: If the target language is 'Arabic', you MUST provide the explanation and next steps in the Sudanese Arabic dialect.

Output the scenario explanation and the next steps. Format next steps clearly, perhaps using bullet points if appropriate (e.g., using '-' or '*' at the start of each step within the string).`,
});

const explainSimplificationFlow = ai.defineFlow<
  typeof ExplainSimplificationInputSchema, // Input schema type
  typeof ExplainSimplificationOutputSchema // Output schema type
>({
  name: 'explainSituationalGuidanceFlow', // Renamed for clarity
  inputSchema: ExplainSimplificationInputSchema,
  outputSchema: ExplainSimplificationOutputSchema,
},
async input => {
  // The input 'input.simplifiedText' comes from the user (via OutputDisplay component)
  // The input 'input.language' also comes from the user
  const {output} = await explainSimplificationPrompt(input);
  return output!;
});

