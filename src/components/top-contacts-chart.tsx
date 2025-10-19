
'use client';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { ChartData } from './evidence-pie-chart';

export function TopContactsChart({ data }: { data: ChartData }) {
    if (data.length === 0) {
        return (
            <div className="h-[250px] flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No contact data.</p>
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

  return (
    <div className="h-[250px] w-full">
    <ChartContainer config={chartConfig} className='h-full w-full'>
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{
          left: 10,
          right:10,
        }}
      >
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 10) + (value.length > 10 ? '...' : '')}
        />
        <XAxis dataKey="value" type="number" hide />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="value" layout="vertical" radius={5} fill="hsl(var(--primary))"/>
      </BarChart>
    </ChartContainer>
    </div>
  );
}

    