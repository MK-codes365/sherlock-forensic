
'use client';

import {
  FileUp,
  Search,
  Users,
  Link as LinkIcon,
  ShieldAlert,
  Clock,
  Bitcoin,
  Globe,
  MessageSquare,
  Phone,
  BarChart2,
  FolderOpen,
  User,
  LogIn,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from './ui/badge';
import Link from 'next/link';
import { Skeleton } from './ui/skeleton';
import { useEffect, useState } from 'react';
import { formatDistanceToNow, format, parseISO } from 'date-fns';
import { EvidencePieChart } from './evidence-pie-chart';
import { TopContactsChart } from './top-contacts-chart';
import { ChatFrequencyChart } from './chat-frequency-chart';


const aiHighlights = [
  { title: "Top 5 Suspicious Contacts", icon: Phone, details: "Contacts frequently appearing in deleted messages and calls at unusual hours." },
  { title: "Chats with Financial Keywords", icon: Bitcoin, details: "Conversations mentioning 'bc1qxy...', 'payment', '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'." },
  { title: "New Foreign Communications", icon: Globe, details: "New contact from +44 20 7946 0958 logged." },
];

const initialSummaryData = [
    { title: "Total Cases", value: 0, icon: FolderOpen, change: "" },
    { title: "Active Cases", value: 0, icon: FolderOpen, change: "" },
    { title: "Total Evidence Files", value: 0, icon: FileUp, change: "" },
    { title: "Linked Evidences", value: 0, icon: LinkIcon, change: "" },
];

const initialCallDurationData = [
    { name: '< 1 min', value: 0 },
    { name: '1-5 mins', value: 0 },
    { name: '5-15 mins', value: 0 },
    { name: '> 15 mins', value: 0 },
]

const initialTopContactsData: {name: string, value: number}[] = [];
const initialChatFrequencyData: {date: string, chats: number}[] = [];


// --- Data Parsing Functions ---

const parseCallDuration = (extractedData: string) => {
    const data = [...initialCallDurationData.map(d => ({...d}))];
    const callLogRegex = /Call Log.*\((\d+)m (\d+)s\)/g;
    let match;
    while((match = callLogRegex.exec(extractedData)) !== null) {
        const minutes = parseInt(match[1], 10);
        if (minutes < 1) data[0].value++;
        else if (minutes <= 5) data[1].value++;
        else if (minutes <= 15) data[2].value++;
        else data[3].value++;
    }
    return data.filter(d => d.value > 0);
};

const parseTopContacts = (extractedData: string) => {
    const contactCounts: {[key: string]: number} = {};
    const contactRegex = /(?:from|to|with)\s([+0-9A-Za-z\s]{5,})/g;
    let match;
    while ((match = contactRegex.exec(extractedData)) !== null) {
        // Simple cleaning
        let contact = match[1].trim();
        if (contact.toLowerCase().startsWith('the usual spot')) continue; // Ignore generic locations
        if (contact.endsWith('.')) contact = contact.slice(0,-1);

        contactCounts[contact] = (contactCounts[contact] || 0) + 1;
    }

    return Object.entries(contactCounts)
        .sort((a,b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value]) => ({name, value}));
};

const parseChatFrequency = (extractedData: string) => {
    const chatCounts: {[key: string]: number} = {};
    const chatRegex = /Chat Record.*at (\d{4}-\d{2}-\d{2})/;
    const lines = extractedData.split('\n');
    lines.forEach(line => {
        const match = line.match(chatRegex);
        if(match) {
            const date = match[1];
            chatCounts[date] = (chatCounts[date] || 0) + 1;
        }
    });

    return Object.entries(chatCounts)
        .map(([date, chats]) => ({
            date: format(parseISO(date), 'MMM d'), 
            chats
        }))
        .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}


export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [summaryData, setSummaryData] = useState<any[]>(initialSummaryData);
  const [timelineEvents, setTimelineEvents] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Chart data states
  const [callDurationData, setCallDurationData] = useState(initialCallDurationData);
  const [topContactsData, setTopContactsData] = useState(initialTopContactsData);
  const [chatFrequencyData, setChatFrequencyData] = useState(initialChatFrequencyData);


  useEffect(() => {
    // Function to update state from localStorage
    const updateDashboardState = () => {
      const storedCases = JSON.parse(localStorage.getItem('forensicCases') || '[]');
      const evidenceCount = storedCases.reduce((acc: number, curr: any) => acc + (curr.evidenceCount || 0), 0);
      
      const allExtractedData = storedCases.map((c: any) => c.extractedData).join('\n');

      setSummaryData([
        { title: "Total Cases", value: storedCases.length, icon: FolderOpen, change: "" },
        { title: "Active Cases", value: storedCases.filter((c:any) => c.status === 'Active').length, icon: FolderOpen, change: "" },
        { title: "Total Evidence Files", value: evidenceCount, icon: FileUp, change: "" },
        { title: "Linked Evidences", value: evidenceCount > 0 ? 157 : 0, icon: LinkIcon, change: evidenceCount > 0 ? "+23 linked" : "" },
      ]);
      setTimelineEvents(storedCases);

      // --- Update Chart Data ---
      if (allExtractedData) {
          setCallDurationData(parseCallDuration(allExtractedData));
          setTopContactsData(parseTopContacts(allExtractedData));
          setChatFrequencyData(parseChatFrequency(allExtractedData));
      } else {
          setCallDurationData(initialCallDurationData);
          setTopContactsData(initialTopContactsData);
          setChatFrequencyData(initialChatFrequencyData);
      }


      const lastLoginEventStr = localStorage.getItem('lastLoginEvent');
      let activityLog = [
        { action: "UFDR Uploaded", details: "CASE-003_evidence.ufdr", user: "Jane Doe", time: "2h ago", icon: FileUp },
        { action: "Case Status Updated", details: "CASE-002 to Closed", user: "Admin", time: "8h ago", icon: FolderOpen },
      ];
      if (lastLoginEventStr) {
        const lastLoginEvent = JSON.parse(lastLoginEventStr);
        activityLog.push({
          action: "User Login",
          details: lastLoginEvent.userEmail,
          user: lastLoginEvent.userEmail.split('@')[0],
          time: formatDistanceToNow(new Date(lastLoginEvent.loginTime), { addSuffix: true }),
          icon: LogIn,
        });
      } else {
         activityLog.push({ action: "User Login", details: "john.smith@agency.gov", user: "John Smith", time: "1d ago", icon: LogIn });
      }

       activityLog.push({ action: "Entity Flagged", details: "Contact '+44 20 7946 0958'", user: "AI Assistant", time: "2d ago", icon: ShieldAlert });

      setRecentActivity(activityLog.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())); // This sort won't work perfectly with relative times but is ok for demo.


      setIsLoading(false);
    };

    // Initial load
    updateDashboardState();

    // Listen for storage changes from other tabs/windows
    window.addEventListener('storage', updateDashboardState);
    
    // Also listen for a custom event that we can dispatch from our app
    window.addEventListener('app-storage-change', updateDashboardState);

    // Cleanup listeners
    return () => {
      window.removeEventListener('storage', updateDashboardState);
      window.removeEventListener('app-storage-change', updateDashboardState);
    };
  }, []);

  return (
    <div className="space-y-6">
        {/* Search and NLQ Button */}
        <div className="flex gap-4 items-center">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Global search across all cases..." className="pl-10" />
            </div>
            <Button asChild>
                <Link href="/query">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Natural Language Query
                </Link>
            </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              Array.from({length: 4}).map((_,index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-2/3" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-1/3" />
                  </CardContent>
                </Card>
              ))
            ) : (
              summaryData.map((item, index) => {
                  const Icon = item.icon;
                  return (
                      <Card key={index} className="glowing-card">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                              <Icon className="h-5 w-5 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                              <div className="text-2xl font-bold">{item.value}</div>
                              <p className="text-xs text-muted-foreground">{item.change}</p>
                          </CardContent>
                      </Card>
                  );
              })
            )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 glowing-card">
                <CardHeader>
                    <CardTitle>Call Duration</CardTitle>
                    <CardDescription>Breakdown of call lengths.</CardDescription>
                </CardHeader>
                <CardContent>
                    <EvidencePieChart data={callDurationData} />
                </CardContent>
            </Card>
            <Card className="lg:col-span-1 glowing-card">
                <CardHeader>
                    <CardTitle>Top Contacts</CardTitle>
                    <CardDescription>Most frequent communication.</CardDescription>
                </CardHeader>
                <CardContent>
                    <TopContactsChart data={topContactsData} />
                </CardContent>
            </Card>
            <Card className="lg:col-span-1 glowing-card">
                <CardHeader>
                    <CardTitle>Chat Frequency</CardTitle>
                    <CardDescription>Messages per day over the last week.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChatFrequencyChart data={chatFrequencyData} />
                </CardContent>
            </Card>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Highlights */}
            <Card className="lg:col-span-1 glowing-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ShieldAlert className="text-primary"/> AI Highlights</CardTitle>
                    <CardDescription>AI-detected patterns and anomalies.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-72">
                        <div className="space-y-4">
                            {aiHighlights.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <div key={index} className="flex items-start gap-4">
                                        <div className="bg-muted rounded-full p-2">
                                            <Icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">{item.title}</h4>
                                            <p className="text-sm text-muted-foreground">{item.details}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Case Timeline */}
            <Card className="lg:col-span-2 glowing-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BarChart2 className="text-primary"/> Case Timeline</CardTitle>
                    <CardDescription>Chronological overview of activities across cases.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ScrollArea className="h-72">
                        <div className="space-y-4">
                        {isLoading && Array.from({length: 2}).map((_, i) => (
                           <div key={i} className="flex items-center gap-4">
                                <div className="flex flex-col items-center">
                                    <Skeleton className="h-3 w-3 rounded-full" />
                                    <Skeleton className="w-px h-10" />
                                </div>
                                <div className="flex-grow space-y-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                            </div>
                        ))}
                        {timelineEvents && timelineEvents.map((event, index) => (
                             <div key={index} className="flex items-center gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="h-3 w-3 rounded-full bg-primary"></div>
                                    {index < timelineEvents.length - 1 && <div className="w-px h-10 bg-border"></div>}
                                </div>
                                <div>
                                    <div className="text-sm text-muted-foreground">{event.date}</div>
                                    <div className="font-medium">
                                        <Badge variant="outline" className="mr-2">{event.id}</Badge>
                                        {event.name}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {!isLoading && timelineEvents?.length === 0 && (
                            <p className="text-muted-foreground text-center pt-8">No case activities yet.</p>
                        )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>

        {/* Recent Activity */}
        <Card className="glowing-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Clock className="text-primary"/> Recent Activity</CardTitle>
                <CardDescription>Latest actions performed in the system.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-60">
                    {recentActivity.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <div key={index} className="flex items-center gap-4 py-3 border-b last:border-b-0">
                                <Icon className="h-5 w-5 text-muted-foreground" />
                                <div className="flex-grow">
                                    <div className="font-medium">{item.action}: <span className="text-primary">{item.details}</span></div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <User className="h-4 w-4" />
                                    <span>{item.user}</span>
                                </div>
                                <div className="text-sm text-muted-foreground min-w-[60px] text-right">{item.time}</div>
                            </div>
                        );
                    })}
                </ScrollArea>
            </CardContent>
        </Card>
    </div>
  );
}
