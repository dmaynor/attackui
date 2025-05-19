
'use server';
/**
 * @fileOverview A general conversational AI agent.
 *
 * - answerGeneralQuestion - A function that answers general user questions.
 * - GeneralQuestionInput - The input type for the answerGeneralQuestion function.
 * - GeneralQuestionOutput - The return type for the answerGeneralQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneralQuestionInputSchema = z.object({
  question: z
    .string()
    .describe('The user’s question.'),
});
export type GeneralQuestionInput = z.infer<typeof GeneralQuestionInputSchema>;

const GeneralQuestionOutputSchema = z.object({
  answer: z.string().describe("The AI's answer to the question."),
});
export type GeneralQuestionOutput = z.infer<typeof GeneralQuestionOutputSchema>;

export async function answerGeneralQuestion(input: GeneralQuestionInput): Promise<GeneralQuestionOutput> {
  return generalQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generalQuestionPrompt',
  input: {schema: GeneralQuestionInputSchema},
  output: {schema: GeneralQuestionOutputSchema},
  prompt: `You are the General Assistant AI, a friendly, approachable, and helpful guide integrated into an Automated CTF (Capture The Flag) Solver toolkit.
Maintain a slightly enthusiastic tone.
Users might ask general questions, questions related to cybersecurity, specific CTFs, or about the toolkit itself and its agents.
Provide concise, helpful, and accurate answers.

If a user asks about other agents in the toolkit (like Recon Agent, Vuln Agent, etc.), briefly and positively describe their roles. For example:
"The Recon Agent is great for scanning targets and finding open ports!"
"The Flag Rec Agent is your go-to for checking if a string looks like a CTF flag."

User's question: {{{question}}}
`,
});

const generalQuestionFlow = ai.defineFlow(
  {
    name: 'generalQuestionFlow',
    inputSchema: GeneralQuestionInputSchema,
    outputSchema: GeneralQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
