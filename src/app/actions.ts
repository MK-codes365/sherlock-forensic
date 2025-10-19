
'use server';

import { highlightKeyFindings, HighlightKeyFindingsOutput } from '@/ai/flows/highlight-key-findings';
import { generateSummaryReport } from '@/ai/flows/generate-summary-report';
import { suggestRelatedEvidence } from '@/ai/flows/suggest-related-evidence';
import { processUfdrData } from '@/ai/flows/process-ufdr-data';
import { z } from 'zod';
import { dataFilter } from '@/ai/tools/data-filter';


// This mock data is kept as a fallback for the query page if no data has been uploaded.
const mockData = `
- Chat Record (WhatsApp): "Met with John at the usual spot. He has the crypto wallet details. Address is bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh." at 2024-07-15 10:30
- File Record (Device Storage): "contact_list.csv" at 2024-07-14 18:00
- File Record (Device Storage): "vacation_photo.jpg" at 2024-07-14 19:00
- Call Log (Phone Records): "Incoming call from +44 20 7946 0958 (2m 15s)" at 2024-07-15 11:05
- Chat Record (Telegram): "Received payment to 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa. Send the package." at 2024-07-16 09:00
`;

const availableDataSources = [
    'Call Logs',
    'Web History',
    'Financial Records',
    'Email Communications',
    'Geolocation Data',
];

const AIResultsSchema = z.object({
    keyFindings: z.custom<HighlightKeyFindingsOutput>(),
    summaryReport: z.string(),
    relatedEvidence: z.object({
        suggestions: z.array(z.string()),
        reasoning: z.string(),
    }),
});

export async function getAIDrivenInsights(query: string, caseData: string): Promise<z.infer<typeof AIResultsSchema>> {
    const validatedQuery = z.string().min(1, "Query cannot be empty.").safeParse(query);
    if (!validatedQuery.success) {
        throw new Error(validatedQuery.error.errors[0].message);
    }
    
    const relevantData = caseData || mockData;

    try {
        // Run all AI flows in parallel for efficiency
        const [keyFindingsResponse, summaryReportResponse, relatedEvidenceResponse] = await Promise.all([
            highlightKeyFindings({ query: validatedQuery.data, data: relevantData }),
            generateSummaryReport({ query: validatedQuery.data, relevantData: relevantData }),
            suggestRelatedEvidence({
                query: validatedQuery.data,
                context: 'Initial results from device UFDR include chat logs with cryptocurrency addresses and call history with foreign numbers.',
                availableDataSources: availableDataSources,
            }),
        ]);

        // A small delay to simulate network latency and show loading states
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
            keyFindings: keyFindingsResponse,
            summaryReport: summaryReportResponse.summaryReport,
            relatedEvidence: {
              suggestions: relatedEvidenceResponse.suggestions,
              reasoning: relatedEvidenceResponse.reasoning,
            },
        };
    } catch (error) {
        console.error("AI flow error:", error);
        // In a real app, you'd want more robust error handling and logging.
        return {
            keyFindings: {textFindings: "Error: Could not highlight key findings. The AI model may be unavailable.", mediaFindings: []},
            summaryReport: "Error: Could not generate a summary report. Please try again later.",
            relatedEvidence: {
                suggestions: ["Error: Could not suggest related evidence."],
                reasoning: "An error occurred while processing the AI request. Please check the server logs for more details.",
            }
        };
    }
}

const UfdrInputSchema = z.object({
  fileName: z.string(),
  reportXml: z.string().min(1, "report.xml content cannot be empty."),
  fileHash: z.string().min(1, "File hash is missing."),
  userId: z.string().min(1, "User ID is missing."),
});


export async function handleUfdrUpload(ufdrInput: z.infer<typeof UfdrInputSchema>) {
    const validatedUfdr = UfdrInputSchema.safeParse(ufdrInput);
    if (!validatedUfdr.success) {
        throw new Error(validatedUfdr.error.errors[0].message);
    }

    const { fileName, reportXml, fileHash, userId } = validatedUfdr.data;

    try {
        const response = await processUfdrData({ ufdrData: reportXml });
        
        // Mocking database interaction
        console.log("Mock case created:", {
            id: `CASE-${Date.now()}`,
            name: `Case from ${fileName}`,
            status: 'Active',
            date: new Date().toISOString().split('T')[0],
            evidenceCount: 1,
            userId: userId
        });

        console.log("Mock evidence saved:", {
            id: fileHash,
            fileName: fileName,
            extractedData: response.extractedData,
        });

        return {
            extractedData: response.extractedData,
            categories: ['Chats', 'Calls', 'Media', 'Files', 'Browser History'],
        };

    } catch (error) {
        console.error("UFDR processing error:", error);
        return {
            extractedData: "Error: Could not process the UFDR file. The AI model may be unavailable or the file format is not as expected.",
            categories: [],
        };
    }
}
