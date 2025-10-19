
'use client';

import { Dashboard } from '@/components/dashboard';
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
import Link from 'next/link';
import { SherlockForensicLogo } from '@/components/ui/sherlock-forensic-logo';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { PilotIcon } from '@/components/ui/pilot-icon';
import { useEffect, useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


function DashboardPageContent() {
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
              <SidebarMenuButton href="/dashboard" isActive tooltip="Dashboard">
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
            <h1 className="text-xl font-semibold font-headline">Dashboard</h1>
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
          <Dashboard />
        </main>
      </SidebarInset>
    </>
  );
}

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardPageContent />
    </SidebarProvider>
  );
}
