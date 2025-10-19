import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { parse, isWithinInterval, subDays, subMonths, startOfMonth, endOfMonth, startOfYesterday, endOfYesterday, startOfDay, endOfDay } from 'date-fns';

const DataFilterInputSchema = z.object({
  keywords: z.array(z.string()).optional().describe('A list of keywords to filter the data by. The filter is case-insensitive and matches lines containing any of the keywords.'),
  dataType: z.string().optional().describe('The type of data to filter (e.g., "Chat Record", "Call Log", "File Record"). Only lines matching this type will be returned.'),
  startDate: z.string().optional().describe('The start date for filtering, in YYYY-MM-DD format. Only data on or after this date will be returned.'),
  endDate: z.string().optional().describe('The end date for filtering, in YYYY-MM-DD format. Only data on or before this date will be returned.'),
  dateRange: z.enum(['today', 'yesterday', 'last 7 days', 'last 30 days', 'last month']).optional().describe("A predefined date range to filter the data by."),
});

export const dataFilter = ai.defineTool(
  {
    name: 'dataFilter',
    description: 'Filters raw text data based on keywords, data type, and date range. Used to narrow down evidence before analysis.',
    inputSchema: z.object({
        data: z.string().describe("The raw string data to be filtered."),
        filters: DataFilterInputSchema.describe("The filtering criteria to apply."),
    }),
    outputSchema: z.string(),
  },
  async ({ data, filters }) => {
    const { keywords, dataType, dateRange } = filters;
    let { startDate, endDate } = filters;
    const lines = data.trim().split('\n');

    let filteredLines = lines;

    // Handle predefined date ranges
    const now = new Date();
    if (dateRange) {
        if (dateRange === 'today') {
            const today = startOfDay(now);
            startDate = today.toISOString().split('T')[0];
            endDate = startDate;
        } else if (dateRange === 'yesterday') {
            const yesterday = startOfYesterday();
            startDate = yesterday.toISOString().split('T')[0];
            endDate = startDate;
        } else if (dateRange === 'last 7 days') {
            const sevenDaysAgo = startOfDay(subDays(now, 6));
            startDate = sevenDaysAgo.toISOString().split('T')[0];
            endDate = endOfDay(now).toISOString().split('T')[0];
        } else if (dateRange === 'last 30 days') {
            const thirtyDaysAgo = startOfDay(subDays(now, 29));
            startDate = thirtyDaysAgo.toISOString().split('T')[0];
            endDate = endOfDay(now).toISOString().split('T')[0];
        } else if (dateRange === 'last month') {
            const lastMonthStart = startOfMonth(subMonths(now, 1));
            const lastMonthEnd = endOfMonth(subMonths(now, 1));
            startDate = lastMonthStart.toISOString().split('T')[0];
            endDate = lastMonthEnd.toISOString().split('T')[0];
        }
    }


    // Filter by data type
    if (dataType) {
      filteredLines = filteredLines.filter(line =>
        line.toLowerCase().includes(dataType.toLowerCase())
      );
    }

    // Filter by keywords
    if (keywords && keywords.length > 0) {
      const lowercasedKeywords = keywords.map(k => k.toLowerCase());
      filteredLines = filteredLines.filter(line =>
        lowercasedKeywords.some(keyword => line.toLowerCase().includes(keyword))
      );
    }

    // Filter by date range
    const dateRegex = /at (\d{4}-\d{2}-\d{2} \d{2}:\d{2})/;
    const sDate = startDate ? new Date(startDate) : null;
    if (sDate) sDate.setHours(0, 0, 0, 0); // Set to start of the day
    const eDate = endDate ? new Date(endDate) : null;
    if (eDate) eDate.setHours(23, 59, 59, 999); // Set to end of the day

    if (sDate || eDate) {
        filteredLines = filteredLines.filter(line => {
            const match = line.match(dateRegex);
            if (!match) return false;
            
            try {
                const lineDate = parse(match[1], 'yyyy-MM-dd HH:mm', new Date());
                if (sDate && eDate) {
                    return isWithinInterval(lineDate, { start: sDate, end: eDate });
                }
                if (sDate) {
                    return lineDate >= sDate;
                }
                if (eDate) {
                    return lineDate <= eDate;
                }
                return false;
            } catch (error) {
                // Ignore lines with un-parseable dates
                return false;
            }
        });
    }

    return filteredLines.join('\n') || 'No matching data found for the specified filters.';
  }
);
