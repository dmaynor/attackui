
'use server';
/**
 * @fileOverview An Architect AI agent.
 *
 * - handleArchitectureTask - A function that handles system architecture tasks.
 * - ArchitectureTaskInput - The input type for the handleArchitectureTask function.
 * - ArchitectureTaskOutput - The return type for the handleArchitectureTask function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ArchitectureTaskInputSchema = z.object({
  taskDescription: z.string().describe('The system architecture task, e.g., "Design a modular architecture for a microservice-based application", "Suggest an integration strategy for two disparate systems", "Outline interface contracts for a new module".'),
});
export type ArchitectureTaskInput = z.infer<typeof ArchitectureTaskInputSchema>;

const ArchitectureTaskOutputSchema = z.object({
  response: z.string().describe("The Architect Agent's response, such as design principles, architectural patterns, integration strategies, or interface suggestions."),
  status: z.string().describe("Indicates the status of the task (e.g., 'Architecture design suggested', 'Integration strategy outlined', 'Task acknowledged')."),
});
export type ArchitectureTaskOutput = z.infer<typeof ArchitectureTaskOutputSchema>;

export async function handleArchitectureTask(input: ArchitectureTaskInput): Promise<ArchitectureTaskOutput> {
  return architectFlow(input);
}

const prompt = ai.definePrompt({
  name: 'architectPrompt',
  input: {schema: ArchitectureTaskInputSchema},
  output: {schema: ArchitectureTaskOutputSchema},
  prompt: `You are the Architect Agent. You specialize in system design and integration.
Your duties include designing modular, scalable, and testable architectures, ensuring system components work together smoothly, and maintaining clear boundaries and interface contracts.

For the given architecture task: {{{taskDescription}}}

Provide design principles, architectural patterns, integration strategies, or interface suggestions as appropriate.
Focus on clarity, modularity, scalability, and testability.

Example for modular architecture:
Status: Architecture design principles suggested
Response: For a microservice-based application, consider:
1. Single Responsibility Principle for each service.
2. API Gateways for external communication.
3. Asynchronous communication for decoupling (e.g., message queues).
4. Centralized logging and monitoring.
...

Example for interface contracts:
Status: Interface contract suggestions provided
Response: For the new module, the interface contract should clearly define:
1. Input parameters (names, types, constraints).
2. Output data structure.
3. Potential error codes and their meanings.
4. Pre-conditions and post-conditions.
...
`,
});

const architectFlow = ai.defineFlow(
  {
    name: 'architectFlow',
    inputSchema: ArchitectureTaskInputSchema,
    outputSchema: ArchitectureTaskOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (output) {
      return output;
    }
    return {
      response: `Received architecture task: "${input.taskDescription}". The AI Architect is analyzing this.`,
      status: "Task acknowledged",
    };
  }
);
