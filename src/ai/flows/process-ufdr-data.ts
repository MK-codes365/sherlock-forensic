'use server';

/**
 * @fileOverview A flow to process UFDR data and extract relevant information.
 *
 * - processUfdrData - A function that takes UFDR data as input and extracts chat records, files, and call logs.
 * - ProcessUfdrDataInput - The input type for the processUfdrData function.
 * - ProcessUfdrDataOutput - The return type for the processUfdrData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProcessUfdrDataInputSchema = z.object({
  ufdrData: z.string().describe('The raw content of the UFDR file.'),
});
export type ProcessUfdrDataInput = z.infer<typeof ProcessUfdrDataInputSchema>;

const ProcessUfdrDataOutputSchema = z.object({
  extractedData: z.string().describe('The extracted and structured data from the UFDR file in a readable format.'),
});
export type ProcessUfdrDataOutput = z.infer<typeof ProcessUfdrDataOutputSchema>;

export async function processUfdrData(input: ProcessUfdrDataInput): Promise<ProcessUfdrDataOutput> {
  return processUfdrDataFlow(input);
}

const processUfdrDataPrompt = ai.definePrompt({
  name: 'processUfdrDataPrompt',
  input: {schema: ProcessUfdrDataInputSchema},
  output: {schema: ProcessUfdrDataOutputSchema},
  prompt: `You are a forensic analysis expert. You have been given the raw text content of a UFDR (Universal Forensic Data Report) file. Your task is to parse this data and extract key forensic artifacts.

Focus on extracting the following information:
- Chat messages (from any application like WhatsApp, Telegram, etc.)
- Call logs (incoming, outgoing, missed calls)
- File system records (interesting file names, paths, and modification dates)

Present the extracted data in a clear, structured, and human-readable format. Use markdown for formatting.

UFDR Data:
"""
{{{ufdrData}}}
"""

Extracted Forensic Artifacts:
`,
});

const processUfdrDataFlow = ai.defineFlow(
  {
    name: 'processUfdrDataFlow',
    inputSchema: ProcessUfdrDataInputSchema,
    outputSchema: ProcessUfdrDataOutputSchema,
  },
  async input => {
    // In a real application, you would parse the UFDR file here.
    // For this example, we will just pass the raw data to the LLM.
    const {output} = await processUfdrDataPrompt(input);
    return output!;
  }
);
