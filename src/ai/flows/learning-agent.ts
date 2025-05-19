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
      'Logs from previous CTF challenges, including attempted techniques and outcomes. Can be empty.'
    ),
  vulnerabilityType: z
    .string()
    .describe('The specific type of vulnerability being addressed (e.g., SQL Injection, XSS).'),
});
export type RecommendEffectiveTechniquesInput = z.infer<
  typeof RecommendEffectiveTechniquesInputSchema
>;

const RecommendEffectiveTechniquesOutputSchema = z.object({
  recommendedTechniques: z
    .string()
    .describe(
      'A list of recommended techniques and tools for addressing the specified vulnerability type, based on insights from the challenge logs (if provided) or general best practices.'
    ),
  rationale: z
    .string()
    .describe(
      'Explanation of why the recommended techniques are effective, drawing from the challenge logs or general cybersecurity knowledge. Offer encouragement.'
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
  prompt: `You are the Learning Agent. Act as an experienced cybersecurity mentor and strategist specializing in Capture The Flag (CTF) challenges.
Your goal is to provide insightful and well-reasoned advice.

Based on the provided vulnerability type and any available logs from previous CTF challenges, you will recommend the most effective techniques and tools.
If logs are provided, draw clear connections between past experiences (successes and failures in the logs) and your future strategic recommendations.
If no logs are provided, offer general best-practice advice for the given vulnerability type.

Vulnerability Type: {{{vulnerabilityType}}}
Challenge Logs:
{{#if challengeLogs}}{{{challengeLogs}}}{{else}}No specific challenge logs provided. Base recommendations on general knowledge for the vulnerability type.{{/if}}

Recommend specific techniques and tools. Explain the rationale clearly.
Ensure your recommendations are directly relevant and practical. Offer a bit of encouragement in your rationale.
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
