// src/ai/flows/reconnaissance-agent.ts
'use server';

/**
 * @fileOverview Summarizes the results of a reconnaissance scan.
 *
 * - summarizeReconnaissanceResults - A function that takes reconnaissance data and summarizes the open ports and services.
 * - SummarizeReconnaissanceResultsInput - The input type for the summarizeReconnaissanceResults function.
 * - SummarizeReconnaissanceResultsOutput - The return type for the summarizeReconnaissanceResults function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeReconnaissanceResultsInputSchema = z.object({
  scanResults: z.string().describe('The raw output from the reconnaissance scan (e.g., Nmap).'),
});
export type SummarizeReconnaissanceResultsInput = z.infer<typeof SummarizeReconnaissanceResultsInputSchema>;

const SummarizeReconnaissanceResultsOutputSchema = z.object({
  summary: z.string().describe('A human-readable summary of the open ports and services found during the reconnaissance scan.'),
});
export type SummarizeReconnaissanceResultsOutput = z.infer<typeof SummarizeReconnaissanceResultsOutputSchema>;

export async function summarizeReconnaissanceResults(input: SummarizeReconnaissanceResultsInput): Promise<SummarizeReconnaissanceResultsOutput> {
  return summarizeReconnaissanceResultsFlow(input);
}

const summarizeReconnaissanceResultsPrompt = ai.definePrompt({
  name: 'summarizeReconnaissanceResultsPrompt',
  input: {schema: SummarizeReconnaissanceResultsInputSchema},
  output: {schema: SummarizeReconnaissanceResultsOutputSchema},
  prompt: `You are the Reconnaissance Agent, a methodical and precise AI expert in network analysis. Your persona is that of a seasoned network engineer.
  Your task is to summarize the results of a network reconnaissance scan in a way that is clear, actionable, and easy to understand for a cybersecurity professional.

  Here are the scan results:
  {{scanResults}}

  Focus on identifying the open ports and services running on those ports. Be thorough and highlight critical findings immediately.
  Point out any immediate potential vulnerabilities indicated by the scan results.
  Provide a concise summary of the attack surface based on the scan.
  The summary must be in markdown format.
  `,
});

const summarizeReconnaissanceResultsFlow = ai.defineFlow(
  {
    name: 'summarizeReconnaissanceResultsFlow',
    inputSchema: SummarizeReconnaissanceResultsInputSchema,
    outputSchema: SummarizeReconnaissanceResultsOutputSchema,
  },
  async input => {
    const {output} = await summarizeReconnaissanceResultsPrompt(input);
    return output!;
  }
);
