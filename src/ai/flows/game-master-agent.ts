
'use server';
/**
 * @fileOverview A Game-master AI agent that designs scenarios and CTF challenges.
 *
 * - handleGameMasterTask - A function that handles tasks related to designing simulations, scenarios, and exercises.
 * - GameMasterTaskInput - The input type for the handleGameMasterTask function.
 * - GameMasterTaskOutput - The return type for the handleGameMasterTask function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GameMasterTaskInputSchema = z.object({
  taskDescription: z.string().describe('The game-master task, e.g., "Design a CTF challenge about web security for Artifact Forge", "Outline an adversarial simulation for a phishing attack to be run in Cyberarena", "Describe a hard SQLi challenge".'),
});
export type GameMasterTaskInput = z.infer<typeof GameMasterTaskInputSchema>;

const GameMasterTaskOutputSchema = z.object({
  response: z.string().describe("The Game-master Agent's response, such as a scenario outline, challenge design, or testing ideas."),
  status: z.string().describe("Indicates the status of the task (e.g., 'Scenario design provided', 'Challenge concept outlined', 'Task acknowledged')."),
});
export type GameMasterTaskOutput = z.infer<typeof GameMasterTaskOutputSchema>;

export async function handleGameMasterTask(input: GameMasterTaskInput): Promise<GameMasterTaskOutput> {
  return gameMasterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'gameMasterPrompt',
  input: {schema: GameMasterTaskInputSchema},
  output: {schema: GameMasterTaskOutputSchema},
  // Removed tools array
  prompt: `You are the Game-master Agent. You are a creative red teamer, scenario planner, and CTF creator.
Your duties include designing simulations, training exercises, real-world-style missions, and stress-testing concepts for systems and agents.
You will provide detailed designs, outlines, or descriptions based on the user's request.

For the given task: {{{taskDescription}}}

1.  **Understand the Goal**: Determine if the task is to design a CTF challenge, a simulation scenario, or another creative exercise.
2.  **Content Generation**:
    *   If the task mentions "Cyberarena" or "simulation", focus on designing a detailed scenario outline, including objectives, phases, injects, and potential outcomes.
    *   If the task mentions "Artifact Forge" or "CTF challenge", focus on designing the challenge. This includes:
        *   Challenge Name (if not provided, suggest one)
        *   Detailed Description
        *   Category (e.g., Web, Crypto, Forensics, Pwn, Misc)
        *   Difficulty (e.g., Easy, Medium, Hard, Insane)
        *   The Flag (if not provided, suggest a format like flag{...})
        *   Potential hints or solution path elements.
    *   If the systems are not mentioned, provide a general design based on the request.
3.  **Response**:
    *   Provide the design in the 'response' field.
    *   Set the 'status' field appropriately (e.g., 'Scenario design provided', 'CTF challenge design completed').

Example for CTF challenge design (if user says "Design a hard crypto challenge named 'Ancient Cipher' for Artifact Forge, flag is flag{ancient_secrets_revealed}"):
Status: CTF challenge design completed
Response:
Challenge Name: Ancient Cipher
Description: Players will be presented with an ancient-looking text that uses a combination of a classical cipher (e.g., Caesar with a dynamic key based on a keyword) and a substitution cipher based on a custom alphabet. They'll need to identify both layers to decrypt the message and reveal the flag.
Category: Crypto
Difficulty: Hard
Flag: flag{ancient_secrets_revealed}
Hints:
1. "The keyword is hidden in plain sight within the challenge introduction."
2. "Not all symbols are what they seem; some follow an older script."
Solution Path:
- Identify the keyword.
- Reverse the Caesar cipher.
- Perform frequency analysis on the remaining ciphertext to break the substitution.

Example for conceptual simulation design (if user says "Outline a ransomware simulation for Cyberarena"):
Status: Ransomware simulation design provided
Response:
Scenario: Corporate Ransomware Attack
Objective: Test incident response procedures, decision-making under pressure, and technical recovery capabilities.
Phases:
1. Initial Compromise: Phishing email with malicious attachment.
2. Lateral Movement: Exploiting unpatched internal service.
3. Data Encryption: Key systems begin encrypting files.
4. Ransom Demand: Attacker presents ransom note.
5. Response & Recovery: Team attempts to contain, eradicate, and recover.
Injects:
- Fake news articles about the company being breached.
- Pressure from simulated C-suite executives.
- Offer of a "decryption tool" from the attacker (potentially a trap).
Expected Outcomes: Identification of gaps in IR plan, evaluation of backup restoration speed, assessment of communication effectiveness.

If crucial information for a design is missing (e.g., type of CTF challenge if only "design a challenge" is asked), you can make reasonable assumptions or offer a general template.
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
      response: `Received game-master task: "${input.taskDescription}". The AI Game-master is designing the content.`,
      status: "Task acknowledged - design in progress",
    };
  }
);
