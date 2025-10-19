
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  FileText,
  Lightbulb,
  Search,
  Sigma,
  AlertTriangle,
  Network,
  CalendarClock,
  Image as ImageIcon,
  Download,
} from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { HighlightKeyFindingsOutput } from '@/ai/flows/highlight-key-findings';
import { z } from 'zod';
import { TimelineViewer } from '../timeline-viewer';
import { NetworkGraph } from '../network-graph';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

const AIResultsSchema = z.object({
  keyFindings: z.custom<HighlightKeyFindingsOutput>(),
  summaryReport: z.string(),
  relatedEvidence: z.object({
    suggestions: z.array(z.string()),
    reasoning: z.string(),
  }),
});

type AIResults = z.infer<typeof AIResultsSchema>;

interface QueryResultsProps {
  results: AIResults | null;
  isLoading: boolean;
}

// Client-side image lookup function
const getClientSideImage = (filePath: string): string | null => {
    try {
        const storedImages: { path: string; dataUri: string }[] = JSON.parse(localStorage.getItem('ufdrImageData') || '[]');
        const image = storedImages.find(img => img.path.includes(filePath) || filePath.includes(img.path));
        return image ? image.dataUri : null;
    } catch (e) {
        console.error("Failed to get client-side image:", e);
        return null;
    }
};

const handleDownload = (e: React.MouseEvent, dataUri: string, fileName: string) => {
    if (dataUri.startsWith('data:')) {
        e.preventDefault();
        const link = document.createElement('a');
        link.href = dataUri;
        link.download = fileName.split('/').pop() || 'download.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    // For regular URLs, let the browser handle it (which might be opening in a new tab, but we can't force download without server-side help)
};


const LoadingSkeleton = () => (
  <div className="space-y-4">
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-2/5" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  </div>
);

export function QueryResults({ results: initialResults, isLoading }: QueryResultsProps) {
  const [results, setResults] = useState(initialResults);

  useEffect(() => {
    if (initialResults?.keyFindings?.mediaFindings) {
      const updatedMediaFindings = initialResults.keyFindings.mediaFindings.map(media => {
        if (media.hash?.startsWith('CLIENT_LOOKUP_REQUIRED:')) {
          const filePath = media.hash.split(':')[1];
          const dataUri = getClientSideImage(filePath);
          return { ...media, hash: dataUri || media.hash };
        }
        return media;
      });

      setResults({
        ...initialResults,
        keyFindings: {
          ...initialResults.keyFindings,
          mediaFindings: updatedMediaFindings
        }
      });
    } else {
      setResults(initialResults);
    }
  }, [initialResults]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!results) {
    return null;
  }
  
  const hasError = results.summaryReport.startsWith("Error:") || results.relatedEvidence.suggestions.some(s => s.startsWith("Error:"));

  if(hasError) {
    return (
        <Card className="border-destructive">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle />
                    Analysis Failed
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-destructive font-medium">The AI model may be unavailable or encountered an error.</p>
                <p className="text-sm text-muted-foreground mt-2">Please try your query again later. If the problem persists, check the server logs.</p>
                <div className="mt-4 space-y-2 text-xs bg-secondary/30 p-4 rounded-md">
                    {results.summaryReport.startsWith("Error:") && <p><strong>Summary:</strong> {results.summaryReport}</p>}
                    {results.relatedEvidence.reasoning.startsWith("An error occurred") && <p><strong>Suggestions:</strong> {results.relatedEvidence.reasoning}</p>}
                </div>
            </CardContent>
        </Card>
    )
  }

  const hasMediaFindings = results.keyFindings.mediaFindings && results.keyFindings.mediaFindings.length > 0;

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Network className="text-primary" /> Linked Entities</CardTitle>
                    <CardDescription>Visualizing connections between contacts, locations, and artifacts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <NetworkGraph />
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CalendarClock className="text-primary" /> Event Timeline</CardTitle>
                    <CardDescription>Chronological reconstruction of events from the data.</CardDescription>
                </CardHeader>
                <CardContent>
                    <TimelineViewer data={results.keyFindings.textFindings} />
                </CardContent>
            </Card>
        </div>

      <Accordion type="multiple" defaultValue={['summary', 'findings', hasMediaFindings ? 'media' : '']} className="w-full">
        <AccordionItem value="summary">
          <AccordionTrigger>
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <FileText className="text-primary" />
              Summary Report
            </h3>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-6">
                <div className="prose prose-sm max-w-none text-foreground">
                  <p>{results.summaryReport}</p>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="findings">
          <AccordionTrigger>
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Sigma className="text-primary" />
              Key Textual Findings
            </h3>
          </AccordionTrigger>
          <AccordionContent>
             <Card>
              <CardContent className="pt-6">
                 <div className="prose prose-sm max-w-none text-foreground">
                    <p>{results.keyFindings.textFindings}</p>
                 </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
        
        {hasMediaFindings && (
            <AccordionItem value="media">
            <AccordionTrigger>
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                <ImageIcon className="text-primary" />
                Media Findings
                </h3>
            </AccordionTrigger>
            <AccordionContent>
                <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {results.keyFindings.mediaFindings?.map((media, index) => {
                         const imageSrc = (media.hash && !media.hash.includes('CLIENT_LOOKUP_REQUIRED') && !media.hash.includes('not found')) ? media.hash : "https://picsum.photos/seed/evidence/300/300";
                         const isDataUri = imageSrc.startsWith('data:');
                        return (
                        <div key={index} className="group relative">
                            <div className="aspect-square relative w-full overflow-hidden rounded-lg bg-secondary">
                                <Image 
                                    src={imageSrc}
                                    alt={media.caption} 
                                    layout="fill" 
                                    className="object-contain"
                                    unoptimized={isDataUri}
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                             <a
                                                href={imageSrc}
                                                onClick={(e) => handleDownload(e, imageSrc, media.path)}
                                                download={isDataUri ? media.path.split('/').pop() || 'download.jpg' : undefined}
                                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 w-10 text-white hover:bg-white/20"
                                            >
                                                <Download className="h-6 w-6" />
                                            </a>
                                        </TooltipTrigger>
                                        <TooltipContent>Download Image</TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground truncate">{media.path}</p>
                            <p className="text-sm font-medium text-foreground truncate">{media.caption}</p>
                        </div>
                    )})}
                    </div>
                </CardContent>
                </Card>
            </AccordionContent>
            </AccordionItem>
        )}

        <AccordionItem value="related">
          <AccordionTrigger>
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Lightbulb className="text-primary" />
              Suggested Related Evidence
            </h3>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="prose prose-sm max-w-none text-foreground">
                  <p className="italic text-muted-foreground">{results.relatedEvidence.reasoning}</p>
                  <ul>
                    {results.relatedEvidence.suggestions.map((suggestion, index) => (
                      <li key={index}>
                        <button className="flex items-center gap-2 text-left hover:text-primary transition-colors">
                           <Search className="h-4 w-4 flex-shrink-0"/> <span>{suggestion}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

    