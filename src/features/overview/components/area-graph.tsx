'use client';

import { IconTrendingUp } from '@tabler/icons-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

const chartData = [
  { month: 'January', internal: 75, external: 70 },
  { month: 'February', internal: 82, external: 75 },
  { month: 'March', internal: 78, external: 72 },
  { month: 'April', internal: 85, external: 80 },
  { month: 'May', internal: 88, external: 82 },
  { month: 'June', internal: 92, external: 85 }
];

const chartConfig = {
  scores: {
    label: 'Scores'
  },
  internal: {
    label: 'Internal Assessment',
    color: 'var(--primary)'
  },
  external: {
    label: 'External Exams',
    color: 'var(--primary-light)'
  }
} satisfies ChartConfig;

export function AreaGraph() {
  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Academic Performance</CardTitle>
        <CardDescription>
          Average scores for internal and external assessments
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='aspect-auto h-[250px] w-full'
        >
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <defs>
              <linearGradient id='fillInternal' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-internal)'
                  stopOpacity={1.0}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-internal)'
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id='fillExternal' x1='0' y1='0' x2='0' y2='1'>
                <stop
                  offset='5%'
                  stopColor='var(--color-external)'
                  stopOpacity={0.8}
                />
                <stop
                  offset='95%'
                  stopColor='var(--color-external)'
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='dot' />}
            />
            <Area
              dataKey='external'
              type='natural'
              fill='url(#fillExternal)'
              fillOpacity={0.4}
              stroke='var(--color-external)'
              stackId='a'
            />
            <Area
              dataKey='internal'
              type='natural'
              fill='url(#fillInternal)'
              fillOpacity={0.4}
              stroke='var(--color-internal)'
              stackId='a'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-start gap-2 text-sm'>
          <div className='grid gap-2'>
            <div className='flex items-center gap-2 font-medium leading-none'>
              Performance up by 8.4% this term <IconTrendingUp className='h-4 w-4' />
            </div>
            <div className='flex items-center gap-2 leading-none text-muted-foreground'>
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
