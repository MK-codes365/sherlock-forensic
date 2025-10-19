'use server';

/**
 * @fileOverview A flow to highlight key findings from retrieved data based on a natural language query.
 *
 * - highlightKeyFindings - A function that takes a natural language query and data, then highlights the most important pieces of information.
 * - HighlightKeyFindingsInput - The input type for the highlightKeyFindings function.
 * - HighlightKeyFindingsOutput - The return type for the highlightKeyFindings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { dataFilter } from '../tools/data-filter';
import { imageRetriever } from '../tools/image-retriever';

const HighlightKeyFindingsInputSchema = z.object({
  query: z.string().describe('The natural language query to use for highlighting key findings.'),
  data: z.string().describe('The data to search for key findings within.'),
});
export type HighlightKeyFindingsInput = z.infer<typeof HighlightKeyFindingsInputSchema>;

const HighlightKeyFindingsOutputSchema = z.object({
  textFindings: z.string().describe('The key textual findings from the data, formatted as a string.'),
  mediaFindings: z.array(z.object({
    path: z.string().describe("The file path of the media file."),
    hash: z.string().optional().describe("A data URI for the image content, if the user asks for an image."),
    caption: z.string().describe("A brief caption for the media file."),
  })).optional().describe('A list of media files found in the data.'),
});
export type HighlightKeyFindingsOutput = z.infer<typeof HighlightKeyFindingsOutputSchema>;

export async function highlightKeyFindings(input: HighlightKeyFindingsInput): Promise<HighlightKeyFindingsOutput> {
  return highlightKeyFindingsFlow(input);
}

const highlightKeyFindingsPrompt = ai.definePrompt({
  name: 'highlightKeyFindingsPrompt',
  input: {schema: HighlightKeyFindingsInputSchema},
  output: {schema: HighlightKeyFindingsOutputSchema},
  tools: [dataFilter, imageRetriever],
  prompt: `You are an AI assistant behaving as an expert forensic investigator. Your primary task is to analyze forensic data based on a user's query, identify key findings, and retrieve relevant media.

The investigator has provided the following query:
"""{{query}}"""

And the following data:
"""{{data}}"""

Follow these steps precisely:

1.  **Analyze the Query for Filtering Criteria**: Carefully examine the user's query to identify specific filtering needs. Look for keywords (e.g., "WhatsApp," "payment," "crypto"), data types (e.g., "images," "calls," "chats"), and date ranges (e.g., "last month," "yesterday," "July 2024").

2.  **Apply Filters with the \`dataFilter\` Tool (If Necessary)**:
    *   If the query contains clear filtering criteria, you **MUST** use the \`dataFilter\` tool to narrow down the provided data.
    *   **Example 1 (Keywords & Type)**: For "Show me WhatsApp chats about bank accounts," call \`dataFilter({ data: '{{data}}', filters: { dataType: 'Chat Record', keywords: ['WhatsApp', 'bank account'] } })\`.
    *   **Example 2 (Date & Type)**: For "List all calls from last month," call \`dataFilter({ data: '{{data}}', filters: { dataType: 'Call Log', dateRange: 'last month' } })\`.
    *   **Example 3 (Media Type)**: For "Show me all photos," call \`dataFilter({ data: '{{data}}', filters: { dataType: 'File Record', keywords: ['jpg', 'png', 'jpeg'] } })\`.
    *   If the query is general (e.g., "summarize the data"), do not use the tool and proceed with the full dataset.

3.  **Analyze Data and Extract Findings**: Based on the original query and the **filtered data** (or the full data if no filter was applied), identify and extract key findings.
    *   **For Media Requests (Images/Videos)**:
        *   You **MUST** populate the 'mediaFindings' array.
        *   For each media file found, include its file path in the 'path' field and write a concise, descriptive 'caption'.
        *   **Crucially, for each image identified, you MUST then use the \`imageRetriever\` tool with the image's exact file path to get its data URI. For example: \`imageRetriever({ filePath: 'data/media/0/image.jpg' })\`.**
        *   Place the data URI returned by the tool into the 'hash' field of the corresponding mediaFinding object. This is non-negotiable for displaying the image to the user.
    *   **For Textual Findings**:
        *   Populate the 'textFindings' field with the most important text-based information.
        *   Format the output to be clear, concise, and easily readable for an investigator.
    *   If no findings of a particular type are present, leave the corresponding field empty or as an empty array.`,
});

const highlightKeyFindingsFlow = ai.defineFlow(
  {
    name: 'highlightKeyFindingsFlow',
    inputSchema: HighlightKeyFindingsInputSchema,
    outputSchema: HighlightKeyFindingsOutputSchema,
  },
  async input => {
    const {output} = await highlightKeyFindingsPrompt(input);
    return output!;
  }
);
