
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
  PlusCircle,
  Trash2,
  Edit,
  Save,
  XCircle,
  Book,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { SherlockForensicLogo } from '@/components/ui/sherlock-forensic-logo';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { PilotIcon } from '@/components/ui/pilot-icon';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';


interface Case {
    id: string;
    name: string;
    status: 'Active' | 'Closed';
    date: string;
    evidenceCount: number;
}


function CasesPageContent() {
    const [cases, setCases] = useState<Case[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingCaseId, setEditingCaseId] = useState<string | null>(null);
    const [editingCaseName, setEditingCaseName] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
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


    const loadCases = () => {
        setIsLoading(true);
        const storedCases = JSON.parse(localStorage.getItem('forensicCases') || '[]');
        setCases(storedCases);
        setIsLoading(false);
    };

    useEffect(() => {
        loadCases();
         // Listen for a custom event that we can dispatch from our app
        window.addEventListener('app-storage-change', loadCases);

        // Cleanup listener
        return () => {
            window.removeEventListener('app-storage-change', loadCases);
        };
    }, []);

    useEffect(() => {
        if (editingCaseId && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingCaseId]);

    const handleDeleteCase = (caseId: string) => {
        const updatedCases = cases.filter(c => c.id !== caseId);
        localStorage.setItem('forensicCases', JSON.stringify(updatedCases));
        setCases(updatedCases);
         window.dispatchEvent(new CustomEvent('app-storage-change'));
    };

    const handleEditCase = (caseItem: Case) => {
        setEditingCaseId(caseItem.id);
        setEditingCaseName(caseItem.name);
    };

    const handleSaveCase = (caseId: string) => {
        const updatedCases = cases.map(c =>
            c.id === caseId ? { ...c, name: editingCaseName } : c
        );
        localStorage.setItem('forensicCases', JSON.stringify(updatedCases));
        setCases(updatedCases);
        setEditingCaseId(null);
    };

     const handleCancelEdit = () => {
        setEditingCaseId(null);
        setEditingCaseName('');
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
              <SidebarMenuButton href="/cases" isActive tooltip="Cases">
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
        <header className="flex h-16 items-center justify-between border-b bg-background px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold font-headline">Cases</h1>
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
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Cases</CardTitle>
                    <CardDescription>Manage your forensic cases here.</CardDescription>
                </div>
                <Button asChild>
                    <Link href="/query">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Case
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Case ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Update</TableHead>
                    <TableHead className="text-center">Evidence Files</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell className="text-center"><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                        </TableRow>
                    ))}
                    {!isLoading && cases.map((caseItem) => (
                    <TableRow key={caseItem.id}>
                        <TableCell className="font-medium">{caseItem.id}</TableCell>
                        <TableCell>
                            {editingCaseId === caseItem.id ? (
                                <Input
                                    ref={inputRef}
                                    value={editingCaseName}
                                    onChange={(e) => setEditingCaseName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSaveCase(caseItem.id);
                                        if (e.key === 'Escape') handleCancelEdit();
                                    }}
                                    onBlur={() => handleSaveCase(caseItem.id)}
                                    className="h-8"
                                />
                            ) : (
                                caseItem.name
                            )}
                        </TableCell>
                        <TableCell>
                            <Badge variant={caseItem.status === 'Active' ? 'default' : 'secondary'}>
                                {caseItem.status}
                            </Badge>
                        </TableCell>
                        <TableCell>{caseItem.date}</TableCell>
                        <TableCell className="text-center">{caseItem.evidenceCount}</TableCell>
                        <TableCell className="text-right">
                            {editingCaseId === caseItem.id ? (
                                <div className="flex justify-end gap-2">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" onClick={() => handleSaveCase(caseItem.id)} className="h-8 w-8">
                                                <Save className="h-4 w-4 text-green-500" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Save Name</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" onClick={handleCancelEdit} className="h-8 w-8">
                                                <XCircle className="h-4 w-4 text-muted-foreground" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Cancel</TooltipContent>
                                    </Tooltip>
                                </div>
                            ) : (
                                <div className="flex justify-end gap-2">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" onClick={() => handleEditCase(caseItem)} className="h-8 w-8">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Edit Name</TooltipContent>
                                    </Tooltip>
                                    <AlertDialog>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                            </TooltipTrigger>
                                            <TooltipContent>Delete Case</TooltipContent>
                                        </Tooltip>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the case
                                                    and all associated evidence data from your local storage.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteCase(caseItem.id)}>
                                                    Continue
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            )}
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
                {!isLoading && cases?.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <File className="mx-auto h-12 w-12" />
                        <h3 className="mt-4 text-lg font-semibold">No cases found</h3>
                        <p className="mt-2 text-sm">Upload a UFDR file on the Natural Language Query page to create your first case.</p>
                    </div>
                )}
            </CardContent>
            </Card>
        </main>
      </SidebarInset>
    </>
  );
}

export default function CasesLayout() {
  return (
    <SidebarProvider>
      <CasesPageContent />
    </SidebarProvider>
  )
}
