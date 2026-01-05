'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

export const description = 'Attendance trends over the last 3 months';

const chartData = [
  { date: '2024-04-01', present: 222, absent: 15 },
  { date: '2024-04-02', present: 230, absent: 7 },
  { date: '2024-04-03', present: 215, absent: 22 },
  { date: '2024-04-04', present: 242, absent: 10 },
  { date: '2024-04-05', present: 373, absent: 12 },
  { date: '2024-04-06', present: 301, absent: 8 },
  { date: '2024-04-07', present: 245, absent: 18 },
  { date: '2024-04-08', present: 409, absent: 5 },
  { date: '2024-04-09', present: 59, absent: 2 },
  { date: '2024-04-10', present: 261, absent: 14 },
  { date: '2024-04-11', present: 327, absent: 9 },
  { date: '2024-04-12', present: 292, absent: 11 },
  { date: '2024-04-13', present: 342, absent: 6 },
  { date: '2024-04-14', present: 137, absent: 4 },
  { date: '2024-04-15', present: 120, absent: 3 },
  { date: '2024-04-16', present: 138, absent: 7 },
  { date: '2024-04-17', present: 446, absent: 12 },
  { date: '2024-04-18', present: 364, absent: 15 },
  { date: '2024-04-19', present: 243, absent: 10 },
  { date: '2024-04-20', present: 89, absent: 5 },
  { date: '2024-04-21', present: 137, absent: 8 },
  { date: '2024-04-22', present: 224, absent: 12 },
  { date: '2024-04-23', present: 138, absent: 6 },
  { date: '2024-04-24', present: 387, absent: 14 },
  { date: '2024-04-25', present: 215, absent: 9 },
  { date: '2024-04-26', present: 75, absent: 3 },
  { date: '2024-04-27', present: 383, absent: 11 },
  { date: '2024-04-28', present: 122, absent: 5 },
  { date: '2024-04-29', present: 315, absent: 13 },
  { date: '2024-04-30', present: 454, absent: 18 }
];

const chartConfig = {
  present: {
    label: 'Present',
    color: 'hsl(var(--chart-1))'
  },
  absent: {
    label: 'Absent',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig;

export function BarGraph() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('present');

  const total = React.useMemo(
    () => ({
      present: chartData.reduce((acc, curr) => acc + curr.present, 0),
      absent: chartData.reduce((acc, curr) => acc + curr.absent, 0)
    }),
    []
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Attendance Trends</CardTitle>
          <CardDescription>
            Daily attendance records for the current term.
          </CardDescription>
        </div>
        <div className="flex">
          {['present', 'absent'].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[chart].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="attendance"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
