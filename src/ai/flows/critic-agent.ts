
'use server';
/**
 * @fileOverview A Critic AI agent.
 *
 * - handleCritiqueTask - A function that handles code and logic auditing tasks.
 * - CritiqueTaskInput - The input type for the handleCritiqueTask function.
 * - CritiqueTaskOutput - The return type for the handleCritiqueTask function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CritiqueTaskInputSchema = z.object({
  itemToReview: z.string().describe('The code, logic, design document, or output to be reviewed.'),
  reviewFocus: z.string().optional().describe('Specific aspects to focus on during the review (e.g., "security vulnerabilities", "code clarity", "logical correctness", "potential regressions").'),
});
export type CritiqueTaskInput = z.infer<typeof CritiqueTaskInputSchema>;

const CritiqueTaskOutputSchema = z.object({
  critique: z.string().describe("The Critic Agent's review, identifying flaws, gaps, or areas for improvement."),
  status: z.string().describe("Indicates the status of the task (e.g., 'Review complete', 'Suggestions provided', 'Task acknowledged')."),
});
export type CritiqueTaskOutput = z.infer<typeof CritiqueTaskOutputSchema>;

export async function handleCritiqueTask(input: CritiqueTaskInput): Promise<CritiqueTaskOutput> {
  return criticFlow(input);
}

const prompt = ai.definePrompt({
  name: 'criticPrompt',
  input: {schema: CritiqueTaskInputSchema},
  output: {schema: CritiqueTaskOutputSchema},
  prompt: `You are the Critic Agent. You are a meticulous auditor of code, logic, and system outputs.
Your role is to review the outputs of other agents or system components, identify flaws, gaps, or regressions, and push for robustness, correctness, and clarity.

Item to review:
\`\`\`
{{{itemToReview}}}
\`\`\`

{{#if reviewFocus}}Specific focus for this review: {{{reviewFocus}}}{{/if}}

Analyze the provided item. Identify potential issues such as:
- Logical errors
- Security vulnerabilities
- Performance bottlenecks
- Lack of clarity or maintainability
- Deviations from best practices
- Potential regressions if compared to a previous state (if context is given)

Provide your critique, highlighting specific areas of concern and suggesting improvements.
Be constructive but firm in your assessment.

Respond with your findings in the 'critique' field and a summary in the 'status' field.
Example:
Status: Review complete - suggestions provided
Critique:
- The provided Python script for user authentication does not sanitize input for SQL injection (lines 15-17).
- The error handling in the 'process_payment' function is insufficient; it should catch specific exceptions and log more details.
- The variable naming 'x' and 'y' in module 'data_transformer' is unclear; consider more descriptive names.
`,
});

const criticFlow = ai.defineFlow(
  {
    name: 'criticFlow',
    inputSchema: CritiqueTaskInputSchema,
    outputSchema: CritiqueTaskOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (output) {
      return output;
    }
    return {
      critique: `Received critique task for: "${input.itemToReview.substring(0, 50)}...". The AI Critic is analyzing this.`,
      status: "Task acknowledged",
    };
  }
);
