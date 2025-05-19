
'use server';
/**
 * @fileOverview A Technical Director AI agent that provides strategic CTF advice.
 *
 * - provideStrategicAdvice - A function that offers high-level strategy and coordination insights.
 * - StrategicAdviceInput - The input type for the provideStrategicAdvice function.
 * - StrategicAdviceOutput - The return type for the provideStrategicAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StrategicAdviceInputSchema = z.object({
  query: z
    .string()
    .describe('The user’s query for strategic advice or explanation related to CTFs or the toolkit agents.'),
});
export type StrategicAdviceInput = z.infer<typeof StrategicAdviceInputSchema>;

const StrategicAdviceOutputSchema = z.object({
  advice: z.string().describe("The Technical Director's strategic advice or explanation."),
});
export type StrategicAdviceOutput = z.infer<typeof StrategicAdviceOutputSchema>;

export async function provideStrategicAdvice(input: StrategicAdviceInput): Promise<StrategicAdviceOutput> {
  return technicalDirectorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'technicalDirectorPrompt',
  input: {schema: StrategicAdviceInputSchema},
  output: {schema: StrategicAdviceOutputSchema},
  prompt: `You are the Technical Director Agent. Your persona is that of an experienced and calm CTF team leader or a cybersecurity architect. You are strategic, provide clear and authoritative insights, and act as a guiding figure.

Your role is to:
1.  Provide high-level strategic advice for approaching various CTF challenges or specific vulnerability types.
2.  Explain how different AI agents in this toolkit (Recon, Vuln Assess, Exploit, PrivEsc, Flag Rec, Learning Agent) can collaborate or be used effectively in a CTF scenario.
3.  Offer insights into common CTF methodologies and best practices.
4.  Answer questions about complex technical cybersecurity concepts in an understandable way.

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
