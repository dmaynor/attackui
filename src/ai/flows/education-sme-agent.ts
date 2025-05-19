
'use server';
/**
 * @fileOverview An Education SME (Subject Matter Expert) AI agent.
 *
 * - handleEducationTask - A function that handles tasks related to instructional design and educational optimization.
 * - EducationTaskInput - The input type for the handleEducationTask function.
 * - EducationTaskOutput - The return type for the handleEducationTask function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EducationTaskInputSchema = z.object({
  context: z.string().describe('The scenario, output, or content to be enhanced for learning.'),
  learningGoal: z.string().describe('The specific learning goal or skill to be addressed.'),
  targetAudience: z.string().optional().describe('The target audience for the educational content (e.g., "beginners", "intermediate developers").'),
});
export type EducationTaskInput = z.infer<typeof EducationTaskInputSchema>;

const EducationTaskOutputSchema = z.object({
  suggestions: z.string().describe("The Education SME Agent's suggestions for enhancing the content for learning, scaffolding difficulty, or aligning with training goals."),
  status: z.string().describe("Indicates the status of the task (e.g., 'Enhancements suggested', 'Learning gaps identified', 'Task acknowledged')."),
});
export type EducationTaskOutput = z.infer<typeof EducationTaskOutputSchema>;

export async function handleEducationTask(input: EducationTaskInput): Promise<EducationTaskOutput> {
  return educationSmeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'educationSmePrompt',
  input: {schema: EducationTaskInputSchema},
  output: {schema: EducationTaskOutputSchema},
  prompt: `You are the Education SME (Subject Matter Expert) Agent. You specialize in instructional design and educational optimization.
Your duties include enhancing scenarios and outputs for learning, scaffolding difficulty, aligning with training goals, and identifying gaps in skill progression.

Context/Content to enhance:
\`\`\`
{{{context}}}
\`\`\`
Specific learning goal: {{{learningGoal}}}
{{#if targetAudience}}Target audience: {{{targetAudience}}}{{/if}}

Analyze the provided context with the learning goal in mind. Provide specific suggestions to:
1.  Make the content more educational.
2.  Scaffold the difficulty appropriately for the target audience (if specified, otherwise assume general technical audience).
3.  Better align the content with the stated training goals.
4.  Identify any gaps in skill progression this content might create or fail to address.

Respond with your suggestions in the 'suggestions' field and a summary in the 'status' field.
Example:
Status: Enhancements suggested for SQL Injection tutorial
Suggestions:
- The tutorial currently shows a complex SQL injection payload. For beginners, start with a simpler example like ' OR 1=1 --.
- Add an explanation of *why* the injection works, detailing how the SQL query is modified.
- Include a section on common prevention techniques (e.g., parameterized queries).
- To bridge to the next skill, add a follow-up challenge involving blind SQL injection.
`,
});

const educationSmeFlow = ai.defineFlow(
  {
    name: 'educationSmeFlow',
    inputSchema: EducationTaskInputSchema,
    outputSchema: EducationTaskOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (output) {
      return output;
    }
    return {
      suggestions: `Received education task regarding: "${input.learningGoal}". The AI Education SME is reviewing the context.`,
      status: "Task acknowledged",
    };
  }
);
