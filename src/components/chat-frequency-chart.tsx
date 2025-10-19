
'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';

type ChartData = { date: string; chats: number }[];

const chartConfig = {
  chats: {
    label: 'Chats',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function ChatFrequencyChart({ data }: { data: ChartData }) {
  if (data.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center">
        <p className="text-sm text-muted-foreground">No chat data to display.</p>
      </div>
    );
  }

  return (
    <div className="h-[250px] w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <AreaChart
          accessibilityLayer
          data={data}
          margin={{
            left: 12,
            right: 12,
            top: 10,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <defs>
            <linearGradient id="fillChats" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-chats)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-chats)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="chats"
            type="natural"
            fill="url(#fillChats)"
            fillOpacity={0.4}
            stroke="var(--color-chats)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
