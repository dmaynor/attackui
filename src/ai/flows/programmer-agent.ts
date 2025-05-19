
'use server';
/**
 * @fileOverview A Programmer AI agent.
 *
 * - handleProgrammingTask - A function that handles programming-related tasks.
 * - ProgrammingTaskInput - The input type for the handleProgrammingTask function.
 * - ProgrammingTaskOutput - The return type for the handleProgrammingTask function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProgrammingTaskInputSchema = z.object({
  taskDescription: z.string().describe('The programming task to be performed, e.g., "Write a Python script to parse a log file", "Debug this JavaScript function", "Optimize this SQL query".'),
});
export type ProgrammingTaskInput = z.infer<typeof ProgrammingTaskInputSchema>;

const ProgrammingTaskOutputSchema = z.object({
  response: z.string().describe("The Programmer Agent's response, which could be generated code, debugging suggestions, optimization advice, or an acknowledgement of a complex task."),
  status: z.string().describe("Indicates the status of the task (e.g., 'Code generated', 'Suggestions provided', 'Task acknowledged - complex implementation required')."),
});
export type ProgrammingTaskOutput = z.infer<typeof ProgrammingTaskOutputSchema>;

export async function handleProgrammingTask(input: ProgrammingTaskInput): Promise<ProgrammingTaskOutput> {
  return programmerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'programmerPrompt',
  input: {schema: ProgrammingTaskInputSchema},
  output: {schema: ProgrammingTaskOutputSchema},
  prompt: `You are the Programmer Agent. You are a skilled full-stack software developer AI.
Your duties include writing, debugging, and discussing optimization of code across various languages.
You should follow production-grade best practices in your suggestions and code generation.

For the given task: {{{taskDescription}}}

1. If the task is to write code, attempt to generate the code.
2. If the task is to debug, analyze the problem and offer suggestions.
3. If the task is to optimize, provide optimization advice.
4. If the task is highly complex or requires external libraries/modules not readily available, acknowledge the task and state that a more detailed implementation plan or human oversight might be needed.

Respond with the generated code/suggestions in the 'response' field and a summary of the action taken in the 'status' field.
Example for code generation:
Status: Code generated
Response:
\`\`\`python
# Python code here
\`\`\`

Example for complex task:
Status: Task acknowledged - complex implementation required
Response: The task to 'implement a full e-commerce backend' is highly complex and requires significant design and development effort. I can help break this down or work on specific modules.
`,
});

const programmerFlow = ai.defineFlow(
  {
    name: 'programmerFlow',
    inputSchema: ProgrammingTaskInputSchema,
    outputSchema: ProgrammingTaskOutputSchema,
  },
  async (input: ProgrammingTaskInput) => {
    // For now, complex tasks that require actual file system access, library installations,
    // or full project scaffolding are beyond the direct execution capabilities of this agent.
    // The LLM can generate code snippets or discuss approaches.
    
    // A more sophisticated implementation might involve tools for file I/O, running linters, etc.
    // For this version, we rely on the LLM's ability to generate or discuss.

    if (input.taskDescription.toLowerCase().includes("write") || input.taskDescription.toLowerCase().includes("generate") || input.taskDescription.toLowerCase().includes("create")) {
       const {output} = await prompt(input);
       return output!;
    }
    
    // Placeholder for more complex logic or direct tool use.
    // For now, let the LLM handle based on the prompt.
    const {output} = await prompt(input);
    if (output) {
      return output;
    }
    
    // Fallback if LLM output is not as expected
    return {
      response: `Received programming task: "${input.taskDescription}". The AI Programmer is analyzing the request. Full code generation for very complex tasks may be high-level.`,
      status: "Task acknowledged",
    };
  }
);
