
'use server';
/**
 * @fileOverview A Game-master AI agent that designs scenarios, CTF challenges, and can interact with external systems like Cyberarena and Artifact Forge.
 *
 * - handleGameMasterTask - A function that handles tasks related to building simulations, scenarios, and exercises.
 * - GameMasterTaskInput - The input type for the handleGameMasterTask function.
 * - GameMasterTaskOutput - The return type for the handleGameMasterTask function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GameMasterTaskInputSchema = z.object({
  taskDescription: z.string().describe('The game-master task, e.g., "Design a CTF challenge about web security", "Outline an adversarial simulation for a phishing attack", "Create a hard SQLi challenge in Artifact Forge", "Run a ransomware simulation in Cyberarena".'),
});
export type GameMasterTaskInput = z.infer<typeof GameMasterTaskInputSchema>;

const GameMasterTaskOutputSchema = z.object({
  response: z.string().describe("The Game-master Agent's response, such as a scenario outline, challenge design, tool execution result, or testing ideas."),
  status: z.string().describe("Indicates the status of the task (e.g., 'Scenario designed', 'Challenge created in Artifact Forge', 'Simulation initiated in Cyberarena', 'Task acknowledged')."),
});
export type GameMasterTaskOutput = z.infer<typeof GameMasterTaskOutputSchema>;

// Tool for running table-top simulations in Cyberarena
const runTableTopSimulationTool = ai.defineTool(
  {
    name: 'runTableTopSimulation',
    description: 'Initiates a table-top simulation in the Cyberarena system. Requires a detailed scenario description.',
    inputSchema: z.object({
      scenario: z.string().describe('A detailed description of the simulation scenario to be run in Cyberarena.'),
      targetSystem: z.literal("Cyberarena").describe("Must be 'Cyberarena' to indicate the target system for the simulation.")
    }),
    outputSchema: z.object({
      simulationId: z.string().describe('The ID of the initiated simulation.'),
      statusMessage: z.string().describe('A message confirming the simulation status.'),
    }),
  },
  async (input) => {
    // Placeholder for actual Firebase Admin SDK interaction with Cyberarena
    console.log(`Simulating runTableTopSimulation for Cyberarena with scenario: ${input.scenario}`);
    return {
      simulationId: `sim-${Date.now()}`,
      statusMessage: `Simulation scenario '${input.scenario.substring(0,30)}...' successfully initiated in Cyberarena.`,
    };
  }
);

// Tool for creating CTF challenges in Artifact Forge
const createCtfChallengeTool = ai.defineTool(
  {
    name: 'createCtfChallenge',
    description: 'Creates a new CTF (Capture The Flag) challenge in the Artifact Forge system. Requires challenge name, description, category, difficulty, and the flag.',
    inputSchema: z.object({
      name: z.string().describe('The name of the CTF challenge.'),
      description: z.string().describe('A detailed description of the CTF challenge.'),
      category: z.string().describe('The category of the challenge (e.g., Web, Crypto, Forensics, Pwn).'),
      difficulty: z.string().describe('The difficulty level (e.g., Easy, Medium, Hard).'),
      flag: z.string().describe('The flag for the challenge.'),
      targetSystem: z.literal("ArtifactForge").describe("Must be 'ArtifactForge' to indicate the target system for challenge creation.")
    }),
    outputSchema: z.object({
      challengeId: z.string().describe('The ID of the created challenge.'),
      statusMessage: z.string().describe('A message confirming the challenge creation status.'),
    }),
  },
  async (input) => {
    // Placeholder for actual Firebase Admin SDK interaction with Artifact Forge
    console.log(`Simulating createCtfChallenge for Artifact Forge: ${input.name}`);
    return {
      challengeId: `ctf-${Date.now()}`,
      statusMessage: `CTF challenge '${input.name}' successfully created in Artifact Forge.`,
    };
  }
);

export async function handleGameMasterTask(input: GameMasterTaskInput): Promise<GameMasterTaskOutput> {
  return gameMasterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'gameMasterPrompt',
  input: {schema: GameMasterTaskInputSchema},
  output: {schema: GameMasterTaskOutputSchema},
  tools: [runTableTopSimulationTool, createCtfChallengeTool],
  prompt: `You are the Game-master Agent. You are a creative red teamer, scenario planner, and CTF creator.
Your duties include building simulations, designing training exercises, creating real-world-style missions, and stress-testing systems and agents.
You have access to specialized tools:
- 'runTableTopSimulation': Use this tool to initiate simulations in the 'Cyberarena' system. You'll need a scenario description.
- 'createCtfChallenge': Use this tool to create CTF challenges in the 'Artifact Forge' system. You'll need the challenge name, description, category, difficulty, and flag.

For the given task: {{{taskDescription}}}

1.  **Understand the Goal**: Determine if the task is to design something conceptually, run a simulation in Cyberarena, or create a CTF challenge in Artifact Forge.
2.  **Use Tools if Applicable**:
    *   If the task is to "run a simulation" or similar and mentions "Cyberarena", use the 'runTableTopSimulation' tool. Ensure you have a scenario description. If not, ask for it.
    *   If the task is to "create a CTF challenge" or similar and mentions "Artifact Forge", use the 'createCtfChallenge' tool. Ensure you have all required details (name, description, category, difficulty, flag). If not, ask for them.
3.  **Conceptual Design**: If the task is to design or outline something without specifying Cyberarena or Artifact Forge, provide creative and practical ideas for scenarios, challenges, or tests. Focus on realism, engagement, and achieving the intended objectives.
4.  **Response**:
    *   If a tool is used, incorporate the tool's output (e.g., simulation ID, challenge ID, status message) into your 'response' field. Set the 'status' field appropriately (e.g., 'Simulation initiated in Cyberarena', 'Challenge created in Artifact Forge').
    *   If designing conceptually, provide the design in the 'response' field and set 'status' to something like 'Scenario design provided'.

Example for tool use (creating CTF in Artifact Forge):
Task: "create a hard crypto challenge named 'Ancient Cipher' in Artifact Forge, flag is flag{ancient_secrets_revealed}"
(You would then call 'createCtfChallengeTool' with appropriate parameters, including a generated description and category if not provided)
Status: Challenge created in Artifact Forge
Response: Successfully created CTF challenge 'Ancient Cipher' in Artifact Forge. Challenge ID: ctf-12345. Details: [brief summary of challenge description, category, difficulty, flag].

Example for conceptual CTF challenge design:
Task: "Design a CTF challenge about web security"
Status: CTF challenge ideas provided
Response: For a web security CTF challenge:
1.  Vulnerability: SQL Injection in a login form.
2.  Objective: Bypass login and retrieve a flag from the admin dashboard.
3.  Hints: Provide an Nmap scan showing an open web port.
4.  Difficulty: Intermediate.
...

If essential information for a tool is missing from the task description, you MUST ask for it. For example, if asked to create a challenge in Artifact Forge but the flag is missing, respond with:
Status: Awaiting Details
Response: I can create that challenge in Artifact Forge, but I need the flag for it. What is the flag?
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
      // The LLM's response should ideally include the tool's output if a tool was called.
      return output;
    }
    // Fallback if LLM doesn't produce expected output (e.g. if it doesn't call a tool when it should)
    return {
      response: `Received game-master task: "${input.taskDescription}". The AI Game-master is analyzing the request. If this involves Cyberarena or Artifact Forge, please ensure you provide all necessary details or I will ask for them.`,
      status: "Task acknowledged",
    };
  }
);
