'use server';

/**
 * @fileOverview A learning agent that analyzes logs from previous CTF challenges and recommends effective techniques.
 *
 * - recommendEffectiveTechniques - A function that recommends effective techniques based on previous CTF challenge logs.
 * - RecommendEffectiveTechniquesInput - The input type for the recommendEffectiveTechniques function.
 * - RecommendEffectiveTechniquesOutput - The return type for the recommendEffectiveTechniques function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendEffectiveTechniquesInputSchema = z.object({
  challengeLogs: z
    .string()
    .describe(
      'Logs from previous CTF challenges, including attempted techniques and outcomes.'
    ),
  vulnerabilityType: z
    .string()
    .describe('The specific type of vulnerability being addressed.'),
});
export type RecommendEffectiveTechniquesInput = z.infer<
  typeof RecommendEffectiveTechniquesInputSchema
>;

const RecommendEffectiveTechniquesOutputSchema = z.object({
  recommendedTechniques: z
    .string()
    .describe(
      'A list of recommended techniques and tools for addressing the specified vulnerability type, based on the challenge logs.'
    ),
  rationale: z
    .string()
    .describe(
      'Explanation of why the recommended techniques are effective, based on the challenge logs.'
    ),
});
export type RecommendEffectiveTechniquesOutput = z.infer<
  typeof RecommendEffectiveTechniquesOutputSchema
>;

export async function recommendEffectiveTechniques(
  input: RecommendEffectiveTechniquesInput
): Promise<RecommendEffectiveTechniquesOutput> {
  return recommendEffectiveTechniquesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendEffectiveTechniquesPrompt',
  input: {schema: RecommendEffectiveTechniquesInputSchema},
  output: {schema: RecommendEffectiveTechniquesOutputSchema},
  prompt: `You are an expert cybersecurity analyst specializing in Capture The Flag (CTF) challenges. Based on the logs from previous CTF challenges and the specified vulnerability type, you will recommend the most effective techniques and tools for addressing the vulnerability.

Vulnerability Type: {{{vulnerabilityType}}}
Challenge Logs:
{{#if challengeLogs}}{{{challengeLogs}}}{{else}}No challenge logs provided.{{/if}}

Based on the provided challenge logs, recommend specific techniques and tools that have proven effective for this type of vulnerability. Explain why these techniques are effective, drawing from the insights in the logs.  If no logs are provided, provide general advice.

Ensure that the recommended techniques are directly relevant to the vulnerability type and are supported by evidence from the challenge logs.
`,
});

const recommendEffectiveTechniquesFlow = ai.defineFlow(
  {
    name: 'recommendEffectiveTechniquesFlow',
    inputSchema: RecommendEffectiveTechniquesInputSchema,
    outputSchema: RecommendEffectiveTechniquesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
