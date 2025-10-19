'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a concise summary report from natural language queries.
 *
 * The flow takes a natural language query and relevant data as input and generates a summary report.
 * @file
 * - generateSummaryReport - A function that generates a summary report.
 * - GenerateSummaryReportInput - The input type for the generateSummaryReport function.
 * - GenerateSummaryReportOutput - The return type for the generateSummaryReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const GenerateSummaryReportInputSchema = z.object({
  query: z.string().describe('The natural language query.'),
  relevantData: z.string().describe('The relevant data retrieved based on the query.'),
});
export type GenerateSummaryReportInput = z.infer<typeof GenerateSummaryReportInputSchema>;

// Define the output schema
const GenerateSummaryReportOutputSchema = z.object({
  summaryReport: z.string().describe('The concise summary report.'),
});
export type GenerateSummaryReportOutput = z.infer<typeof GenerateSummaryReportOutputSchema>;

// Define the wrapper function
export async function generateSummaryReport(input: GenerateSummaryReportInput): Promise<GenerateSummaryReportOutput> {
  return generateSummaryReportFlow(input);
}

// Define the prompt
const generateSummaryReportPrompt = ai.definePrompt({
  name: 'generateSummaryReportPrompt',
  input: {schema: GenerateSummaryReportInputSchema},
  output: {schema: GenerateSummaryReportOutputSchema},
  prompt: `You are an expert forensic analyst. Generate a concise, easy-to-understand report summarizing the key findings from the natural language query and relevant data provided. The report should be suitable for sharing with non-technical stakeholders.\n\nQuery: {{{query}}}\n\nRelevant Data: {{{relevantData}}}\n\nSummary Report:`, // Removed type specification
});

// Define the flow
const generateSummaryReportFlow = ai.defineFlow(
  {
    name: 'generateSummaryReportFlow',
    inputSchema: GenerateSummaryReportInputSchema,
    outputSchema: GenerateSummaryReportOutputSchema,
  },
  async input => {
    const {output} = await generateSummaryReportPrompt(input);
    return output!;
  }
);
