
'use server';
/**
 * @fileOverview AI agent that interprets a simplified text, explains the potential real-world scenario it implies with high accuracy, and suggests practical, culturally relevant next steps, especially for various Arabic dialects.
 *
 * - explainSimplification - A function that provides a situational explanation and next steps for a given simplified text.
 * - ExplainSimplificationInput - The input type for the explainSimplification function.
 * - ExplainSimplificationOutput - The return type for the explainSimplification function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ExplainSimplificationInputSchema = z.object({
  simplifiedText: z.string().describe('The simplified text that implies a real-world situation or problem.'),
  language: z.string().describe('The target language for the explanation and next steps. This can be a general language (e.g., "English", "Arabic") or a specific Arabic dialect (e.g., "Sudanese Arabic", "Egyptian Arabic", "Moroccan Darija").'),
});
export type ExplainSimplificationInput = z.infer<typeof ExplainSimplificationInputSchema>;

const ExplainSimplificationOutputSchema = z.object({
  scenarioExplanation: z
    .string()
    .describe(
      'A clear, concise, and culturally sensitive explanation of the potential real-world scenario implied by the simplified text, delivered in the target language/dialect. If the AI cannot provide a nuanced explanation for a highly specific dialect, it should explain this and offer the explanation in a more broadly understood form (e.g., MSA for Arabic dialects) with a note.'
    ),
  nextSteps: z
    .string()
    .describe(
      'Practical, actionable, and culturally appropriate next steps or advice for the user based on the scenario, delivered in the target language/dialect. This can be a paragraph or a list formatted with newlines (e.g., using "- " or "* " for list items). If the AI cannot provide nuanced advice for a highly specific dialect, it should explain this and offer advice in a more broadly understood form with a note.'
    ),
});
export type ExplainSimplificationOutput = z.infer<typeof ExplainSimplificationOutputSchema>;

export async function explainSimplification(
  input: ExplainSimplificationInput
): Promise<ExplainSimplificationOutput> {
  return explainSimplificationFlow(input);
}

const explainSimplificationPrompt = ai.definePrompt({
  name: 'explainSituationalGuidancePromptEnhanced',
  input: {
    schema: ExplainSimplificationInputSchema,
  },
  output: {
    schema: ExplainSimplificationOutputSchema,
  },
  prompt: `You are a highly skilled AI assistant empathetic to users needing to understand complex situations from simplified text. Your task is to provide an insightful interpretation and actionable advice.

Given the simplified text: "{{simplifiedText}}"
And the target language/dialect for your response: "{{language}}"

1.  **Interpret the Scenario (Scenario Explanation):**
    *   Analyze the "{{simplifiedText}}" deeply. What real-world situation, problem, or interaction does this text most likely represent or imply for someone who received or encountered it?
    *   Explain this implied scenario to the user in plain, easy-to-understand terms using the specified "{{language}}". Be direct and clear.
    *   Focus on the practical implications. For example, "Police need your documents now" implies an encounter with law enforcement, not a linguistic analysis of the sentence. "Entering this country is difficult. You should return to your country." implies an immigration or border issue.

2.  **Provide Actionable Advice (Next Steps):**
    *   Based on your interpretation, offer practical, actionable next steps, advice, or guidance for the user in this situation.
    *   The advice must be relevant to the implied scenario and helpful to someone genuinely facing it.
    *   Format these steps clearly. If a list is appropriate, use hyphens (-) or asterisks (*) at the start of each step within the string. The entire "nextSteps" field should be a single string.
    *   Deliver these next steps in the specified "{{language}}".

**Crucial Instructions for Language and Dialect Handling (Especially Arabic):**
*   **Accuracy is Paramount:** Your response (both explanation and next steps) MUST be in the "{{language}}" specified.
*   **Arabic Dialects:**
    *   If "{{language}}" is a specific Arabic dialect (e.g., "Sudanese Arabic", "Egyptian Arabic", "Levantine - Syrian", "Moroccan Darija", "Gulf - Kuwaiti"):
        *   You MUST make every effort to provide the response in that *exact* dialect, using appropriate vocabulary, grammar, and cultural nuances.
        *   If you are not highly confident in producing an accurate and nuanced response in the *exact* specified dialect for this particular scenario:
            1.  Attempt the specific dialect, but if you must generalize some phrases or vocabulary to a broader regional form, you can add a very brief parenthetical note in English at the end of the relevant field (scenarioExplanation or nextSteps), e.g., "(Note: Aimed for {{language}}; some phrasing may reflect broader regional Arabic.)".
            2.  If you have very low confidence in the specific dialect for this context, provide the response in Modern Standard Arabic (MSA) or a widely understood regional Arabic (e.g., general Egyptian or Levantine, if related) AND clearly state this choice at the beginning of the relevant field in English, e.g., "(Explanation provided in Modern Standard Arabic as specific advice for {{language}} in this context is challenging:) [followed by MSA explanation]". Do the same for "nextSteps" if needed.
    *   If "{{language}}" is just "Arabic" (without a dialect): Use clear Modern Standard Arabic (MSA) or a broadly understood colloquial Arabic.

**General Guidelines:**
*   **Be Empathetic and Helpful:** Your tone should be supportive and understanding.
*   **Avoid Generic Responses:** Tailor your explanation and advice to the specific "{{simplifiedText}}".
*   **Do Not Rephrase Linguistically:** Do not explain the linguistic simplification itself. Focus on the real-world meaning and actions.

Output the scenario explanation and the next steps as a JSON object.
`,
});

const explainSimplificationFlow = ai.defineFlow<
  typeof ExplainSimplificationInputSchema, 
  typeof ExplainSimplificationOutputSchema
>({
  name: 'explainSituationalGuidanceFlowEnhanced',
  inputSchema: ExplainSimplificationInputSchema,
  outputSchema: ExplainSimplificationOutputSchema,
},
async input => {
  const {output} = await explainSimplificationPrompt(input);
  if (!output || typeof output.scenarioExplanation !== 'string' || typeof output.nextSteps !== 'string') {
    console.error("AI output for explanation was not in the expected format:", output);
    return {
      scenarioExplanation: "(Error: The AI failed to generate an explanation. Please try again or use a different language.)",
      nextSteps: "(Error: The AI failed to generate next steps.)"
    };
  }
  return output;
});
