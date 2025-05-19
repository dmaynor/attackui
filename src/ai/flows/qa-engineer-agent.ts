
'use server';
/**
 * @fileOverview A QA Engineer AI agent.
 *
 * - handleQATask - A function that handles QA-related tasks.
 * - QATaskInput - The input type for the handleQATask function.
 * - QATaskOutput - The return type for the handleQATask function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QATaskInputSchema = z.object({
  taskDescription: z.string().describe('The QA task to be performed, e.g., "Generate test cases for the login feature", "Suggest a testing strategy for a new API endpoint", "Review this code for potential bugs".'),
});
export type QATaskInput = z.infer<typeof QATaskInputSchema>;

const QATaskOutputSchema = z.object({
  response: z.string().describe("The QA Engineer Agent's response, which could be test cases, a testing strategy, bug suggestions, or an acknowledgement."),
  status: z.string().describe("Indicates the status of the task (e.g., 'Test cases generated', 'Strategy suggested', 'Task acknowledged')."),
});
export type QATaskOutput = z.infer<typeof QATaskOutputSchema>;

export async function handleQATask(input: QATaskInput): Promise<QATaskOutput> {
  return qaEngineerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'qaEngineerPrompt',
  input: {schema: QATaskInputSchema},
  output: {schema: QATaskOutputSchema},
  prompt: `You are the QA Engineer Agent. You are meticulous and detail-oriented, specializing in testing, validation, and verification.
Your duties include suggesting test harnesses, generating automated test suite ideas, verifying logic correctness, and identifying edge case behaviors.

For the given QA task: {{{taskDescription}}}

1. If asked to generate test cases, provide a list of relevant test cases (unit, integration, e2e as appropriate).
2. If asked for a testing strategy, outline a suitable approach.
3. If asked to review for bugs, analyze and suggest potential issues.
4. Acknowledge the task and its scope.

Respond with your findings in the 'response' field and a summary in the 'status' field.
Example for test cases:
Status: Test cases generated
Response:
- Test case 1: Valid login credentials. Expected: Success.
- Test case 2: Invalid username. Expected: Failure.
- ...

Example for strategy:
Status: Testing strategy suggested
Response: For the new API endpoint, I recommend: 1. Unit tests for individual components. 2. Integration tests for endpoint logic. 3. Contract testing. 4. Security testing (e.g., for injection flaws).
`,
});

const qaEngineerFlow = ai.defineFlow(
  {
    name: 'qaEngineerFlow',
    inputSchema: QATaskInputSchema,
    outputSchema: QATaskOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (output) {
      return output;
    }
    return {
      response: `Received QA task: "${input.taskDescription}". The AI QA Engineer is processing this. Full test harness generation is conceptual.`,
      status: "Task acknowledged",
    };
  }
);
