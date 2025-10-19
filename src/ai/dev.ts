import { config } from 'dotenv';
config();

import '@/ai/flows/highlight-key-findings.ts';
import '@/ai/flows/generate-summary-report.ts';
import '@/ai/flows/suggest-related-evidence.ts';
import '@/ai/flows/process-ufdr-data.ts';
import '@/ai/tools/data-filter.ts';
import '@/ai/tools/image-retriever.ts';
