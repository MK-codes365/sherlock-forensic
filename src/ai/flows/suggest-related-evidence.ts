'use server';

/**
 * @fileOverview An AI agent to suggest related evidence from other forensic data sources.
 *
 * - suggestRelatedEvidence - A function that suggests related evidence based on a given query and context.
 * - SuggestRelatedEvidenceInput - The input type for the suggestRelatedEvidence function.
 * - SuggestRelatedEvidenceOutput - The return type for the suggestRelatedEvidence function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelatedEvidenceInputSchema = z.object({
  query: z.string().describe('The original natural language query performed by the analyst.'),
  context: z.string().describe('Context about the initial query results, including data types and sources.'),
  availableDataSources: z.array(z.string()).describe('A list of available forensic data sources.'),
});
export type SuggestRelatedEvidenceInput = z.infer<typeof SuggestRelatedEvidenceInputSchema>;

const SuggestRelatedEvidenceOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of suggestions for related evidence from other data sources.'),
  reasoning: z.string().describe('The AI reasoning behind the suggested related evidence.'),
});
export type SuggestRelatedEvidenceOutput = z.infer<typeof SuggestRelatedEvidenceOutputSchema>;

export async function suggestRelatedEvidence(input: SuggestRelatedEvidenceInput): Promise<SuggestRelatedEvidenceOutput> {
  return suggestRelatedEvidenceFlow(input);
}

const suggestRelatedEvidencePrompt = ai.definePrompt({
  name: 'suggestRelatedEvidencePrompt',
  input: {schema: SuggestRelatedEvidenceInputSchema},
  output: {schema: SuggestRelatedEvidenceOutputSchema},
  prompt: `You are an expert forensic analyst and an AI assistant designed to uncover hidden connections in complex cases. Your task is to suggest related evidence from other forensic data sources.

Based on the user's original query:
"""
{{query}}
"""

And the context of the initial query results from the primary evidence file:
"""
{{context}}
"""

Given the following available (but not yet analyzed) data sources:
{{#each availableDataSources}}
- {{{this}}}
{{/each}}

Your goal is to think one step ahead. Based on the initial findings, what other pieces of evidence should the investigator look for to build a stronger case? What connections might be missed if they only look at the current data?

Provide a list of concrete suggestions for the next steps and explain your reasoning clearly and concisely.

Example:
If the context contains a crypto address and a flight booking, you might suggest:
- "Cross-reference the flight passenger manifest with known associates of the primary suspect."
- "Analyze financial records for transactions related to the identified crypto address around the booking date."

Your reasoning should explain *why* these suggestions are relevant (e.g., "This could link the crypto activity to the travel plans and potentially uncover co-conspirators.").
`,
});

const suggestRelatedEvidenceFlow = ai.defineFlow(
  {
    name: 'suggestRelatedEvidenceFlow',
    inputSchema: SuggestRelatedEvidenceInputSchema,
    outputSchema: SuggestRelatedEvidenceOutputSchema,
  },
  async input => {
    const {output} = await suggestRelatedEvidencePrompt(input);
    return output!;
  }
);
