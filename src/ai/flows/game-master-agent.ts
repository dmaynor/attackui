
'use server';
/**
 * @fileOverview A Game-master AI agent.
 *
 * - handleGameMasterTask - A function that handles tasks related to building simulations, scenarios, and exercises.
 * - GameMasterTaskInput - The input type for the handleGameMasterTask function.
 * - GameMasterTaskOutput - The return type for the handleGameMasterTask function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GameMasterTaskInputSchema = z.object({
  taskDescription: z.string().describe('The game-master task, e.g., "Design a CTF challenge about web security", "Outline an adversarial simulation for a phishing attack", "Suggest ways to stress-test our system".'),
});
export type GameMasterTaskInput = z.infer<typeof GameMasterTaskInputSchema>;

const GameMasterTaskOutputSchema = z.object({
  response: z.string().describe("The Game-master Agent's response, such as a scenario outline, challenge design, or testing ideas."),
  status: z.string().describe("Indicates the status of the task (e.g., 'Scenario designed', 'Challenge ideas provided', 'Task acknowledged')."),
});
export type GameMasterTaskOutput = z.infer<typeof GameMasterTaskOutputSchema>;

export async function handleGameMasterTask(input: GameMasterTaskInput): Promise<GameMasterTaskOutput> {
  return gameMasterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'gameMasterPrompt',
  input: {schema: GameMasterTaskInputSchema},
  output: {schema: GameMasterTaskOutputSchema},
  prompt: `You are the Game-master Agent. You are a creative red teamer, scenario planner, and CTF creator.
Your duties include building simulations, designing training exercises, creating real-world-style missions, and stress-testing systems and agents.

For the given task: {{{taskDescription}}}

Provide creative and practical ideas for scenarios, challenges, or tests.
Focus on realism, engagement, and achieving the intended objectives (e.g., training, system testing).

Example for CTF challenge design:
Status: CTF challenge ideas provided
Response: For a web security CTF challenge:
1.  Vulnerability: SQL Injection in a login form.
2.  Objective: Bypass login and retrieve a flag from the admin dashboard.
3.  Hints: Provide an Nmap scan showing an open web port.
4.  Difficulty: Intermediate.
...

Example for adversarial simulation:
Status: Phishing simulation outlined
Response: To simulate a phishing attack:
1.  Target: Employees of 'ACME Corp'.
2.  Vector: Email with a fake login link to a cloned internal portal.
3.  Objective: Measure click-through rate and credential submission.
4.  Debrief: Educate users who fell for the phish.
...
`,
});

const gameMasterFlow = ai.defineFlow(
  {
    name: 'gameMasterFlow',
    inputSchema: GameMasterTaskInputSchema,
    outputSchema: GameMasterTaskOutputSchema,
  },
  async (input) => {
     const {output} = await prompt(input);
    if (output) {
      return output;
    }
    return {
      response: `Received game-master task: "${input.taskDescription}". The AI Game-master is brainstorming.`,
      status: "Task acknowledged",
    };
  }
);
