
'use server';
/**
 * @fileOverview A Hardware Engineer AI agent.
 *
 * - handleHardwareTask - A function that handles hardware engineering tasks.
 * - HardwareTaskInput - The input type for the handleHardwareTask function.
 * - HardwareTaskOutput - The return type for the handleHardwareTask function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HardwareTaskInputSchema = z.object({
  taskDescription: z.string().describe('The hardware engineering task, e.g., "Explain the basics of FPGA design flow", "What are common challenges in SDR development?", "Discuss RTL for a simple ALU".'),
});
export type HardwareTaskInput = z.infer<typeof HardwareTaskInputSchema>;

const HardwareTaskOutputSchema = z.object({
  response: z.string().describe("The Hardware Engineer Agent's response, typically explanations or high-level design discussions."),
  status: z.string().describe("Indicates the status of the task (e.g., 'Explanation provided', 'Discussion initiated', 'Task acknowledged - complex implementation conceptual')."),
});
export type HardwareTaskOutput = z.infer<typeof HardwareTaskOutputSchema>;

export async function handleHardwareTask(input: HardwareTaskInput): Promise<HardwareTaskOutput> {
  return hardwareEngineerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'hardwareEngineerPrompt',
  input: {schema: HardwareTaskInputSchema},
  output: {schema: HardwareTaskOutputSchema},
  prompt: `You are the Hardware Engineer Agent. You have knowledge in FPGA, SDR, and low-level systems.
Your duties include discussing RTL development, driver concepts, signal processing chains, and hardware simulation/emulation.

For the given hardware task: {{{taskDescription}}}

Provide explanations, discuss concepts, or outline high-level approaches.
Actual development of RTL or drivers is conceptual for this AI.

Example for FPGA design flow:
Status: Explanation provided
Response: The FPGA design flow typically involves:
1. Design Entry (HDL coding like VHDL/Verilog).
2. Synthesis (Converting HDL to a netlist).
3. Implementation (Place and Route).
4. Bitstream Generation.
5. On-chip verification.

Example for RTL discussion:
Status: Discussion initiated
Response: For a simple ALU, RTL for an adder could involve using the '+' operator in Verilog/VHDL within a clocked process or always block, handling carry bits appropriately.
`,
});

const hardwareEngineerFlow = ai.defineFlow(
  {
    name: 'hardwareEngineerFlow',
    inputSchema: HardwareTaskInputSchema,
    outputSchema: HardwareTaskOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
     if (output) {
      return output;
    }
    return {
      response: `Received hardware task: "${input.taskDescription}". The AI Hardware Engineer can discuss concepts. Actual RTL/driver development is conceptual.`,
      status: "Task acknowledged - conceptual discussion",
    };
  }
);
