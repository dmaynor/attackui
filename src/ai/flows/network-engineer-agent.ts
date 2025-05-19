
'use server';
/**
 * @fileOverview A Network Engineer AI agent.
 *
 * - handleNetworkTask - A function that handles network engineering tasks.
 * - NetworkTaskInput - The input type for the handleNetworkTask function.
 * - NetworkTaskOutput - The return type for the handleNetworkTask function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NetworkTaskInputSchema = z.object({
  taskDescription: z.string().describe('The network engineering task, e.g., "Design a secure network topology for a small office", "Suggest hardening steps for a web server", "Explain how to minimize attack surface for a public API".'),
});
export type NetworkTaskInput = z.infer<typeof NetworkTaskInputSchema>;

const NetworkTaskOutputSchema = z.object({
  response: z.string().describe("The Network Engineer Agent's response, such as design suggestions, security advice, or explanations."),
  status: z.string().describe("Indicates the status of the task (e.g., 'Design suggested', 'Hardening advice provided', 'Task acknowledged')."),
});
export type NetworkTaskOutput = z.infer<typeof NetworkTaskOutputSchema>;

export async function handleNetworkTask(input: NetworkTaskInput): Promise<NetworkTaskOutput> {
  return networkEngineerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'networkEngineerPrompt',
  input: {schema: NetworkTaskInputSchema},
  output: {schema: NetworkTaskOutputSchema},
  prompt: `You are the Network Engineer Agent. You specialize in infrastructure, security, and communications.
Your duties include designing secure network topologies, suggesting hardening for services, and ensuring minimal attack surface and isolation.

For the given network task: {{{taskDescription}}}

Provide design suggestions, security advice, or explanations as appropriate.
Focus on best practices for security and resilience.

Example for topology design:
Status: Topology design suggested
Response: For a small office, I suggest:
1. Firewall at the perimeter.
2. Separate VLANs for guests, internal users, and servers.
3. VPN for remote access.
...

Example for hardening:
Status: Hardening advice provided
Response: To harden a web server:
1. Disable unnecessary services.
2. Keep software updated.
3. Use strong passwords and MFA.
...
`,
});

const networkEngineerFlow = ai.defineFlow(
  {
    name: 'networkEngineerFlow',
    inputSchema: NetworkTaskInputSchema,
    outputSchema: NetworkTaskOutputSchema,
  },
  async (input) => {
     const {output} = await prompt(input);
    if (output) {
      return output;
    }
    return {
      response: `Received network engineering task: "${input.taskDescription}". The AI Network Engineer is analyzing this. Full implementation of hardened services is conceptual.`,
      status: "Task acknowledged",
    };
  }
);
