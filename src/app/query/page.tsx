
'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  LogoutIcon,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  File,
  LayoutDashboard,
  Settings,
  BotMessageSquare,
  Book,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SherlockForensicLogo } from '@/components/ui/sherlock-forensic-logo';
import { z } from 'zod';
import { getAIDrivenInsights } from '../actions';
import { HighlightKeyFindingsOutput } from '@/ai/flows/highlight-key-findings';
import { QueryForm } from '@/components/query/query-form';
import { QueryResults } from '@/components/query/query-results';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UfdrUpload } from '@/components/query/ufdr-upload';
import { useSidebar } from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { PilotIcon } from '@/components/ui/pilot-icon';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const AIResultsSchema = z.object({
  keyFindings: z.custom<HighlightKeyFindingsOutput>(),
  summaryReport: z.string(),
  relatedEvidence: z.object({
    suggestions: z.array(z.string()),
    reasoning: z.string(),
  }),
});

type AIResults = z.infer<typeof AIResultsSchema>;

function NLQueryPageContent() {
  const [results, setResults] = useState<AIResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [caseData, setCaseData] = useState<string>('');
  const [activeTab, setActiveTab] = useState('upload');
  const [initialGraphData, setInitialGraphData] = useState(null);
  const router = useRouter();
  const { state } = useSidebar();
  const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const email = localStorage.getItem('userEmail');
        setUserEmail(email);
    }, []);

  const handleLogout = () => {
    router.push('/');
  };

  const handleQuerySubmit = async (query: string, data: string) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    try {
      const aiResults = await getAIDrivenInsights(query, data);
      setResults(aiResults);
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = (extractedData: string, graphData: any) => {
    setCaseData(extractedData);
    setInitialGraphData(graphData);
    setActiveTab('query');
    setResults({
      keyFindings: { textFindings: extractedData, mediaFindings: [] },
      summaryReport: 'This is the raw extracted data. Ask a question to generate a detailed summary.',
      relatedEvidence: { suggestions: [], reasoning: '' },
    });
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-14 w-14 shrink-0">
              <SherlockForensicLogo className="h-12 w-12" />
            </Button>
            <span className="text-xl font-semibold text-primary font-headline">
              Sherlock Forensic
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/dashboard" tooltip="Dashboard">
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/query" isActive tooltip="Natural Language Query">
                <BotMessageSquare />
                <span>Natural Language Query</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/cases" tooltip="Cases">
                <File />
                <span>Cases</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/reports" tooltip="Reports">
                <Book />
                <span>Reports</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/settings" tooltip="Settings">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Tooltip>
              <TooltipTrigger asChild>
                  <Button
                      variant="ghost"
                      className={cn(
                          "w-full h-auto flex-col items-center justify-center gap-1 p-2",
                          state === 'collapsed' && 'size-14'
                      )}
                      onClick={handleLogout}
                  >
                      <LogoutIcon className="h-10 w-10" />
                      <span className={cn('font-semibold text-sm', state === 'collapsed' && 'hidden')}>Log Out</span>
                  </Button>
              </TooltipTrigger>
              <TooltipContent side="right" align="center" hidden={state !== 'collapsed'}>
                  Log Out
              </TooltipContent>
          </Tooltip>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold font-headline">
              Natural Language Query
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <PilotIcon className="h-10 w-10 text-primary" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Logged In As</h4>
                            <p className="text-sm text-muted-foreground">
                                {userEmail || "analyst@agency.gov"}
                            </p>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
          </div>
        </header>
        <main className="p-4 md:p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">New Case / UFDR Upload</TabsTrigger>
                <TabsTrigger value="query">Natural Language Query</TabsTrigger>
            </TabsList>
            <TabsContent value="query" className="mt-4">
                <div className="space-y-6">
                <QueryForm onSubmit={handleQuerySubmit} isLoading={isLoading} caseData={caseData} />
                {error && <p className="text-destructive">{error}</p>}
                <QueryResults results={results} isLoading={isLoading} />
                </div>
            </TabsContent>
            <TabsContent value="upload" className="mt-4">
                <UfdrUpload onUploadSuccess={handleUploadSuccess} />
            </TabsContent>
            </Tabs>
        </main>
      </SidebarInset>
    </>
  );
}

export default function QueryLayout() {
  return (
    <SidebarProvider>
      <NLQueryPageContent />
    </SidebarProvider>
  )
}
