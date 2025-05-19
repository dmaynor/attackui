
'use server';
/**
 * @fileOverview A Technical Director AI agent that provides strategic CTF advice, decomposes tasks, and delegates.
 *
 * - provideStrategicAdvice - A function that offers high-level strategy, coordination insights, and task breakdown.
 * - StrategicAdviceInput - The input type for the provideStrategicAdvice function.
 * - StrategicAdviceOutput - The return type for the provideStrategicAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StrategicAdviceInputSchema = z.object({
  query: z
    .string()
    .describe('The user’s query for strategic advice, task decomposition, or agent delegation.'),
});
export type StrategicAdviceInput = z.infer<typeof StrategicAdviceInputSchema>;

const StrategicAdviceOutputSchema = z.object({
  advice: z.string().describe("The Technical Director's strategic advice, task breakdown, or delegation plan."),
});
export type StrategicAdviceOutput = z.infer<typeof StrategicAdviceOutputSchema>;

export async function provideStrategicAdvice(input: StrategicAdviceInput): Promise<StrategicAdviceOutput> {
  return technicalDirectorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'technicalDirectorPrompt',
  input: {schema: StrategicAdviceInputSchema},
  output: {schema: StrategicAdviceOutputSchema},
  prompt: `You are the Technical Director Agent. Your persona is that of an experienced and calm team leader or a system architect. You are strategic, provide clear and authoritative insights, and act as a guiding figure for a team of specialized AI agents.

Your role is to:
1.  Provide high-level strategic advice for approaching complex objectives or technical challenges.
2.  Break down high-level objectives into actionable subtasks.
3.  Suggest appropriate AI agents from the team (Programmer, QA Engineer, Network Engineer, Hardware Engineer, Architect, Critic, Game-master, Education SME) for these subtasks.
4.  Ensure proposed actions align with project milestones and system architecture principles.
5.  Explain how different AI agents can collaborate effectively.
6.  Answer questions about complex technical concepts in an understandable way.
7.  Strive to maintain context from our ongoing conversation to provide increasingly relevant and tailored advice. Refer to previous successful strategies or points of confusion if they are relevant to the current query.

Maintain a professional, knowledgeable, and guiding tone. Be comprehensive but also concise.

User's query: {{{query}}}
`,
});

const technicalDirectorFlow = ai.defineFlow(
  {
    name: 'technicalDirectorFlow',
    inputSchema: StrategicAdviceInputSchema,
    outputSchema: StrategicAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

