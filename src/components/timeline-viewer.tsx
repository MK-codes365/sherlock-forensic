'use client';

import { Card, CardContent } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

type TimelineEvent = {
  type: string;
  content: string;
  timestamp: string;
};

// A simple parser to extract events from the mock data format
const parseEventsFromData = (data: string): TimelineEvent[] => {
  const lines = data.trim().split('\n');
  const events: TimelineEvent[] = [];
  const regex = /-\s(.*?)\s\((.*?)\):\s"(.*?)"\s+at\s+(.*)/;

  for (const line of lines) {
    const match = line.match(regex);
    if (match) {
      const [, type, source, content, timestamp] = match;
      events.push({
        type: `${type} (${source})`,
        content,
        timestamp,
      });
    }
  }

  // Sort events by timestamp
  return events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

export function TimelineViewer({ data }: { data: string }) {
  const events = parseEventsFromData(data);

  if (events.length === 0) {
    return <p className="text-sm text-muted-foreground">No chronological data to display.</p>;
  }

  return (
    <ScrollArea className="h-[200px] w-full">
      <div className="relative pl-6">
        {/* Vertical line */}
        <div className="absolute left-2 top-0 h-full w-0.5 bg-border" />
        
        {events.map((event, index) => (
          <div key={index} className="mb-6 flex items-start">
            {/* Dot on the timeline */}
            <div className="absolute left-0 transform -translate-x-1/2 mt-1.5 h-4 w-4 rounded-full bg-primary border-4 border-card z-10" />

            <div className="w-full">
              <p className="text-xs text-muted-foreground mb-1">{new Date(event.timestamp).toLocaleString()}</p>
              <Card className="bg-secondary/50">
                  <CardContent className="p-3">
                      <p className="font-semibold text-sm">{event.type}</p>
                      <p className="text-sm text-muted-foreground">{event.content}</p>
                  </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
