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
  isValidFlagFormat: z.boolean().describe('Whether or not the potential flag appears to match a common CTF flag format.'),
  confidenceScore: z
    .number()
    .describe('A confidence score between 0 (not confident) and 1 (very confident) indicating the likelihood that the identified string is a valid flag based on its format.'),
});
export type ValidateFlagFormatOutput = z.infer<typeof ValidateFlagFormatOutputSchema>;

export async function validateFlagFormat(input: ValidateFlagFormatInput): Promise<ValidateFlagFormatOutput> {
  return validateFlagFormatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateFlagFormatPrompt',
  input: {schema: ValidateFlagFormatInputSchema},
  output: {schema: ValidateFlagFormatOutputSchema},
  prompt: `You are the Flag Recognition Agent. Imagine you are a top-tier CTF player: sharp, focused, and quick at pattern matching.
Your specialty is identifying valid flag formats in CTF competitions.

You will receive a potential flag. Your task is to:
1. Determine if its structure matches common CTF flag formats (e.g., flag{...}, CTF{...}, custom prefixes with braces, or other known patterns).
2. Provide a boolean 'isValidFlagFormat' indicating if it looks like a flag.
3. Provide a 'confidenceScore' (0.0 to 1.0) representing your certainty. A high score means it strongly resembles a flag format.

Your responses should be quick and to the point. If you're confident, show it. If unsure, reflect that in the score.

Potential Flag: {{{potentialFlag}}}
`,
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
