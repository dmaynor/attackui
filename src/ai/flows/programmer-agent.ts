
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

// Conceptual Tool: Log activity to a dedicated database for the Programmer Agent
const logProgrammerActivityTool = ai.defineTool(
  {
    name: 'logProgrammerActivity',
    description: 'Logs an activity or event to the Programmer Agent\'s dedicated database. Used for recording tasks, decisions, or significant actions taken.',
    inputSchema: z.object({
      activityDescription: z.string().describe('A clear description of the activity to log.'),
      details: z.record(z.any()).optional().describe('Optional structured details about the event.'),
    }),
    outputSchema: z.object({
      status: z.string().describe('Status of the logging operation (e.g., "Log successful").'),
      logId: z.string().describe('A mock ID for the log entry.'),
    }),
  },
  async (input) => {
    console.log(`[ProgrammerAgent LOG]: ${input.activityDescription}`, input.details || '');
    // In a real implementation, this would write to a database (e.g., Firestore)
    return {
      status: 'Log successfully recorded (simulated).',
      logId: `prog_log_${Date.now()}`,
    };
  }
);

// Conceptual Tool: Save a file to a dedicated storage area for the Programmer Agent
const saveProgrammerFileTool = ai.defineTool(
  {
    name: 'saveProgrammerFile',
    description: 'Saves a file (e.g., generated code, documentation) to the Programmer Agent\'s dedicated storage area.',
    inputSchema: z.object({
      fileName: z.string().describe('The name of the file to save (e.g., "script.py", "README.md").'),
      fileContent: z.string().describe('The content of the file.'),
      metadata: z.record(z.any()).optional().describe('Optional metadata for the file.'),
    }),
    outputSchema: z.object({
      status: z.string().describe('Status of the file saving operation (e.g., "File saved successfully").'),
      filePath: z.string().describe('A mock path or reference to the saved file.'),
    }),
  },
  async (input) => {
    console.log(`[ProgrammerAgent SAVE FILE]: ${input.fileName} (Content length: ${input.fileContent.length})`, input.metadata || '');
    // In a real implementation, this would write to cloud storage (e.g., Firebase Storage, GCS)
    return {
      status: `File "${input.fileName}" saved successfully (simulated).`,
      filePath: `agent_storage/programmer/${input.fileName}`,
    };
  }
);


const ProgrammingTaskInputSchema = z.object({
  taskDescription: z.string().describe('The programming task to be performed, e.g., "Write a Python script to parse a log file", "Debug this JavaScript function", "Optimize this SQL query".'),
});
export type ProgrammingTaskInput = z.infer<typeof ProgrammingTaskInputSchema>;

const ProgrammingTaskOutputSchema = z.object({
  response: z.string().describe("The Programmer Agent's response, which could be generated code, debugging suggestions, optimization advice, or an acknowledgement of a complex task. It may also mention logging or file saving actions taken."),
  status: z.string().describe("Indicates the status of the task (e.g., 'Code generated', 'Suggestions provided', 'Task acknowledged - complex implementation required')."),
});
export type ProgrammingTaskOutput = z.infer<typeof ProgrammingTaskOutputSchema>;

export async function handleProgrammingTask(input: ProgrammingTaskInput): Promise<ProgrammingTaskOutput> {
  return programmerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'programmerPrompt',
  tools: [logProgrammerActivityTool, saveProgrammerFileTool],
  input: {schema: ProgrammingTaskInputSchema},
  output: {schema: ProgrammingTaskOutputSchema},
  prompt: `You are the Programmer Agent. You are a skilled full-stack software developer AI.
Your duties include writing, debugging, and discussing optimization of code across various languages.
You should follow production-grade best practices in your suggestions and code generation.

Operational Procedures:
1.  **Log Activity**: Upon receiving a task, first, use the 'logProgrammerActivity' tool to record a summary of the task and your intended approach. Include the original taskDescription in the details.
2.  **Perform Task**:
    *   If the task is to write code, attempt to generate the code.
    *   If the task is to debug, analyze the problem and offer suggestions.
    *   If the task is to optimize, provide optimization advice.
    *   If the task is highly complex or requires external libraries/modules not readily available, acknowledge the task and state that a more detailed implementation plan or human oversight might be needed.
3.  **Save Generated Code**: If you generate any significant code, use the 'saveProgrammerFile' tool to "save" the generated code to a file. Choose an appropriate filename (e.g., 'solution.py', 'component.tsx').
4.  **Report to User**: Respond with the generated code/suggestions in the 'response' field. Briefly mention that you have logged your activity and "saved" any generated files, including the mock log ID or file path if available from the tool. Summarize the action taken in the 'status' field.

User Task: {{{taskDescription}}}

Example for code generation:
Status: Code generated
Response:
Okay, I've logged this task. Here is the Python script you requested:
\`\`\`python
# Python code here
print("Hello from Programmer Agent!")
\`\`\`
I've also "saved" this script as 'script.py' (mock path: agent_storage/programmer/script.py). (Activity logged: prog_log_12345)

Example for complex task:
Status: Task acknowledged - complex implementation required
Response: I've logged this complex task. The request to 'implement a full e-commerce backend' is highly complex and requires significant design and development effort. I can help break this down or work on specific modules. (Activity logged: prog_log_67890)
`,
});

const programmerFlow = ai.defineFlow(
  {
    name: 'programmerFlow',
    inputSchema: ProgrammingTaskInputSchema,
    outputSchema: ProgrammingTaskOutputSchema,
  },
  async (input: ProgrammingTaskInput) => {
    const {output} = await prompt(input);
    
    if (output) {
      // The LLM's response should ideally include mentions of logging/saving if tools were called.
      // We trust the LLM to follow the prompt instructions.
      return output;
    }
    
    // Fallback if LLM output is not as expected or tool use failed in a way not caught by the prompt.
    return {
      response: `Received programming task: "${input.taskDescription}". The AI Programmer is analyzing the request. Full code generation for very complex tasks may be high-level.`,
      status: "Task acknowledged",
    };
  }
);
