'use server';
/**
 * @fileOverview A flag recognition AI agent.
 *
 * - validateFlagFormat - A function that validates the format of a potential flag and provides a confidence score.
 * - ValidateFlagFormatInput - The input type for the validateFlagFormat function.
 * - ValidateFlagFormatOutput - The return type for the validateFlagFormat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateFlagFormatInputSchema = z.object({
  potentialFlag: z
    .string()
    .describe('The potential flag to validate.'),
});
export type ValidateFlagFormatInput = z.infer<typeof ValidateFlagFormatInputSchema>;

const ValidateFlagFormatOutputSchema = z.object({
  isValidFlagFormat: z.boolean().describe('Whether or not the potential flag has a valid format.'),
  confidenceScore: z
    .number()
    .describe('A confidence score between 0 and 1 indicating the likelihood that the identified string is a valid flag.'),
});
export type ValidateFlagFormatOutput = z.infer<typeof ValidateFlagFormatOutputSchema>;

export async function validateFlagFormat(input: ValidateFlagFormatInput): Promise<ValidateFlagFormatOutput> {
  return validateFlagFormatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateFlagFormatPrompt',
  input: {schema: ValidateFlagFormatInputSchema},
  output: {schema: ValidateFlagFormatOutputSchema},
  prompt: `You are an expert cybersecurity analyst specializing in identifying valid flag formats in CTF competitions.

You will receive a potential flag and must determine if it is a valid flag format.

Based on the format of the flag, provide a confidence score between 0 and 1 indicating the likelihood that the identified string is a valid flag.

Potential Flag: {{{potentialFlag}}}`,
});

const validateFlagFormatFlow = ai.defineFlow(
  {
    name: 'validateFlagFormatFlow',
    inputSchema: ValidateFlagFormatInputSchema,
    outputSchema: ValidateFlagFormatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
