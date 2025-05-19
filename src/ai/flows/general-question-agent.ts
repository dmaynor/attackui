
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
  prompt: `You are a helpful AI assistant integrated into a CTF (Capture The Flag) toolkit.
Users might ask general questions or questions related to cybersecurity, CTFs, or the toolkit itself.
Provide concise and helpful answers.

User's question: {{{question}}}`,
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
