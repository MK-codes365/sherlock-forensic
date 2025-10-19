
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
  Download,
  Book,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { SherlockForensicLogo } from '@/components/ui/sherlock-forensic-logo';
import { Skeleton } from '@/components/ui/skeleton';
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
import jsPDF from 'jspdf';
import { generateSummaryReport } from '@/ai/flows/generate-summary-report';


function ReportsPageContent() {
    const [reports, setReports] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { state } = useSidebar();
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const email = localStorage.getItem('userEmail');
        setUserEmail(email || 'analyst@agency.gov');
    }, []);

    const handleLogout = () => {
        router.push('/');
    };

    const loadReports = () => {
        setIsLoading(true);
        const storedCases = JSON.parse(localStorage.getItem('forensicCases') || '[]');
        const generatedReports = storedCases.map((c: any) => ({
            id: `REP-${c.id.split('-')[1]}`,
            title: `AI Analysis for ${c.name}`,
            caseId: c.id,
            caseName: c.name,
            date: c.date,
            author: 'AI Assistant',
            caseData: c.extractedData,
            evidenceHash: c.evidenceHash
        }));

        setReports(generatedReports);
        setIsLoading(false);
    };

    useEffect(() => {
        loadReports();
        window.addEventListener('app-storage-change', loadReports);
        return () => {
            window.removeEventListener('app-storage-change', loadReports);
        };
    }, []);

    const handleDownload = async (report: any) => {
        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        let yPos = 20;

        // --- PDF Content ---

        // Header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('CONFIDENTIAL FORENSIC REPORT', pageWidth / 2, yPos, { align: 'center' });
        yPos += 8;

        doc.setLineWidth(0.5);
        doc.line(15, yPos, pageWidth - 15, yPos);
        yPos += 10;

        // Case Details
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Case Details', 15, yPos);
        yPos += 6;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`Case ID: ${report.caseId}`, 20, yPos);
        doc.text(`Report ID: ${report.id}`, pageWidth / 2, yPos);
        yPos += 5;
        doc.text(`Case Name: ${report.caseName}`, 20, yPos);
        doc.text(`Report Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPos);
        yPos += 5;
        doc.text(`Analyst: ${userEmail}`, 20, yPos);
        yPos += 10;

        doc.setFont('helvetica', 'bold');
        doc.text('Evidence Hash (SHA-256)', 15, yPos);
        yPos += 6;
        doc.setFont('courier', 'normal');
        doc.text(report.evidenceHash || 'N/A', 20, yPos);
        yPos += 15;


        // Generate AI summary
        const summaryResponse = await generateSummaryReport({
            query: `Summarize the key findings for case ${report.caseId}`,
            relevantData: report.caseData
        });
        const summary = summaryResponse.summaryReport;

        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('EXECUTIVE SUMMARY', 15, yPos);
        yPos += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        const summaryLines = doc.splitTextToSize(summary, pageWidth - 30);
        
        if (yPos + doc.getTextDimensions(summaryLines).h > pageHeight - 40) {
            doc.addPage();
            yPos = 20;
        }
        
        doc.text(summaryLines, 15, yPos);
        yPos += doc.getTextDimensions(summaryLines).h + 10;


        // Key Findings
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('KEY FINDINGS (Raw Data)', 15, yPos);
        yPos += 8;

        doc.setFont('courier', 'normal');
        doc.setFontSize(8);
        const rawDataLines = doc.splitTextToSize(report.caseData, pageWidth - 30);

        if (yPos + doc.getTextDimensions(rawDataLines).h > pageHeight - 40) {
            doc.addPage();
            yPos = 20;
        }

        doc.text(rawDataLines, 15, yPos);
        
        // Add footer and signature to all pages
        const pageCount = doc.internal.pages.length;
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(8);
            doc.text(`Page ${i} of ${pageCount}`, pageWidth - 25, pageHeight - 10);
            doc.text('This document is confidential and intended for authorized personnel only.', 15, pageHeight - 10);

            // Add signature on the last page only
            if (i === pageCount) {
                doc.line(15, pageHeight - 40, 80, pageHeight - 40);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
                doc.text('Analyst Signature', 15, pageHeight - 35);
            }
        }
        
        doc.save(`${report.id}_${report.caseId}.pdf`);
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
              <SidebarMenuButton href="/query" tooltip="Natural Language Query">
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
              <SidebarMenuButton href="/reports" isActive tooltip="Reports">
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
        <header className="flex h-16 items-center justify-between border-b bg-background px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold font-headline">Reports</h1>
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
          <Card>
            <CardHeader>
                <CardTitle>Generated Reports</CardTitle>
                <CardDescription>View and download AI-generated and manual reports for all cases.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Report ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Case ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && Array.from({length: 3}).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-8 w-8 rounded-full ml-auto" /></TableCell>
                            </TableRow>
                        ))}
                        {reports && reports.map((report) => (
                            <TableRow key={report.id}>
                                <TableCell className="font-medium">{report.id}</TableCell>
                                <TableCell>{report.title}</TableCell>
                                <TableCell>
                                <Badge variant="outline">{report.caseId}</Badge>
                                </TableCell>
                                <TableCell>{report.date}</TableCell>
                                <TableCell>{report.author}</TableCell>
                                <TableCell className="text-right">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" onClick={() => handleDownload(report)}>
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Download PDF</TooltipContent>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {!isLoading && reports?.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <Book className="mx-auto h-12 w-12" />
                        <h3 className="mt-4 text-lg font-semibold">No reports found</h3>
                        <p className="mt-2 text-sm">Upload a UFDR file and run an AI analysis to generate your first report.</p>
                    </div>
                )}
            </CardContent>
            </Card>
        </main>
      </SidebarInset>
    </>
  )
}

export default function ReportsLayout() {
    return (
        <SidebarProvider>
            <ReportsPageContent />
        </SidebarProvider>
    )
}
