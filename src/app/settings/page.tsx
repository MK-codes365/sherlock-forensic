
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  Settings as SettingsIcon,
  BotMessageSquare,
  Book,
} from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { SherlockForensicLogo } from '@/components/ui/sherlock-forensic-logo';
import { useSidebar } from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { PilotIcon } from '@/components/ui/pilot-icon';
import { useEffect, useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


const settingsSchema = z.object({
  model: z.string(),
  temperature: z.array(z.number()).min(1).max(1),
  maxOutput: z.array(z.number()).min(1).max(1),
  profileName: z.string().optional(),
  profileEmail: z.string().email().optional(),
  notifications: z.boolean().optional(),
  theme: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const defaultValues: Partial<SettingsFormValues> = {
  model: 'gemini-2.5-flash',
  temperature: [0.7],
  maxOutput: [2048],
  notifications: true,
  theme: "dark",
  profileName: 'Analyst',
  profileEmail: 'analyst@agency.gov',
};

function SettingsPageContent() {
  const { toast } = useToast();
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

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues,
  });

   useEffect(() => {
    if (userEmail) {
      form.setValue('profileEmail', userEmail);
    }
  }, [userEmail, form]);

  function onSubmit(data: SettingsFormValues) {
    console.log(data);
    toast({
      title: 'Settings Saved',
      description: 'Your preferences have been updated successfully.',
    });
  }

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
              <SidebarMenuButton href="/reports" tooltip="Reports">
                <Book />
                <span>Reports</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/settings" isActive tooltip="Settings">
                <SettingsIcon />
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
            <h1 className="text-xl font-semibold font-headline">Settings</h1>
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
            <Tabs defaultValue="ai" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ai">AI Model</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="appearance">Appearance & Notifications</TabsTrigger>
            </TabsList>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                <TabsContent value="ai">
                    <Card>
                    <CardHeader>
                        <CardTitle>AI Model Configuration</CardTitle>
                        <CardDescription>
                        Adjust parameters for the generative AI models.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <FormField
                            control={form.control}
                            name="model"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Model</FormLabel>
                                <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                >
                                <FormControl>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Select a model" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="gemini-2.5-flash">
                                    Gemini 2.5 Flash
                                    </SelectItem>
                                    <SelectItem value="gemini-1.5-pro-latest">
                                    Gemini 1.5 Pro
                                    </SelectItem>
                                </SelectContent>
                                </Select>
                                <FormDescription>
                                The base model to use for generation.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="temperature"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Temperature: {field.value[0]}</FormLabel>
                                <FormControl>
                                <Slider
                                    min={0}
                                    max={1}
                                    step={0.1}
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
                                />
                                </FormControl>
                                <FormDescription>
                                Controls randomness. Lower values are more deterministic.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="maxOutput"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Maximum Output: {field.value[0]} tokens</FormLabel>
                                <FormControl>
                                <Slider
                                    min={256}
                                    max={8192}
                                    step={256}
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
                                />
                                </FormControl>
                                <FormDescription>
                                The maximum number of tokens to generate in a response.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="profile">
                    <Card>
                    <CardHeader>
                        <CardTitle>User Profile</CardTitle>
                        <CardDescription>
                        Manage your personal information.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <FormField
                            control={form.control}
                            name="profileName"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                <Input placeholder="Your full name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="profileEmail"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                <Input type="email" placeholder="Your email address" {...field} disabled />
                                </FormControl>
                                <FormDescription>
                                You cannot change your login email.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="appearance">
                    <Card>
                    <CardHeader>
                        <CardTitle>Appearance & Notifications</CardTitle>
                        <CardDescription>
                        Customize the look and feel and notification preferences.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <FormField
                        control={form.control}
                        name="theme"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Theme</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a theme" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="light" disabled>Light (Coming Soon)</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Choose your preferred interface theme.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Separator />
                        <FormField
                        control={form.control}
                        name="notifications"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                Enable Notifications
                                </FormLabel>
                                <FormDescription>
                                Receive notifications for case updates and report generation.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            </FormItem>
                        )}
                        />
                    </CardContent>
                    </Card>
                </TabsContent>
                <div className="mt-6 flex justify-end">
                    <Button type="submit">Save All Settings</Button>
                </div>
                </form>
            </Form>
            </Tabs>
        </main>
      </SidebarInset>
    </>
  )
}

export default function SettingsLayout() {
    return (
        <SidebarProvider>
            <SettingsPageContent />
        </SidebarProvider>
    )
}
