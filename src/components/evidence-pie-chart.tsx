
'use client';

import { TrendingUp } from 'lucide-react';
import { Pie, PieChart, Cell } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export type ChartData = { name: string; value: number }[];

const CHART_COLORS = ['#fb923c', '#f87171', '#60a5fa', '#a78bfa', '#fde047', '#4ade80'];

export function EvidencePieChart({ data }: { data: ChartData }) {
    if (data.length === 0) {
        return (
            <div className="h-[250px] flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No data to display.</p>
            </div>
        );
    }
  const chartConfig = data.reduce((acc, item, index) => {
    acc[item.name] = {
      label: item.name,
      color: `hsl(var(--chart-${index + 1}))`,
    };
    return acc;
  }, {} as any);

  const totalValue = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="h-[250px] w-full">
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-full"
    >
      <PieChart>
        <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel nameKey="value" />}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          strokeWidth={5}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={chartConfig[entry.name]?.color} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
    </div>
  );
}

    