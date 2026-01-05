'use client';

import * as React from 'react';
import { IconTrendingUp } from '@tabler/icons-react';
import { Label, Pie, PieChart } from 'recharts';

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
  { grade: 'grade9', students: 275, fill: 'var(--primary)' },
  { grade: 'grade10', students: 200, fill: 'var(--primary-light)' },
  { grade: 'grade11', students: 287, fill: 'var(--primary-lighter)' },
  { grade: 'grade12', students: 173, fill: 'var(--primary-dark)' },
  { grade: 'other', students: 190, fill: 'var(--primary-darker)' }
];

const chartConfig = {
  students: {
    label: 'Students'
  },
  grade9: {
    label: 'Grade 9',
    color: 'var(--primary)'
  },
  grade10: {
    label: 'Grade 10',
    color: 'var(--primary)'
  },
  grade11: {
    label: 'Grade 11',
    color: 'var(--primary)'
  },
  grade12: {
    label: 'Grade 12',
    color: 'var(--primary)'
  },
  other: {
    label: 'Other',
    color: 'var(--primary)'
  }
} satisfies ChartConfig;

export function PieGraph() {
  const totalStudents = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.students, 0);
  }, []);

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Student Distribution</CardTitle>
        <CardDescription>
          <span className='hidden @[540px]/card:block'>
            Total students by grade level for the current year
          </span>
          <span className='@[540px]/card:hidden'>Grade distribution</span>
        </CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square h-[250px]'
        >
          <PieChart>
            <defs>
              {['grade9', 'grade10', 'grade11', 'grade12', 'other'].map(
                (grade, index) => (
                  <linearGradient
                    key={grade}
                    id={`fill${grade}`}
                    x1='0'
                    y1='0'
                    x2='0'
                    y2='1'
                  >
                    <stop
                      offset='0%'
                      stopColor='var(--primary)'
                      stopOpacity={1 - index * 0.15}
                    />
                    <stop
                      offset='100%'
                      stopColor='var(--primary)'
                      stopOpacity={0.8 - index * 0.15}
                    />
                  </linearGradient>
                )
              )}
            </defs>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey='students'
              nameKey='grade'
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-3xl font-bold'
                        >
                          {totalStudents.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground'
                        >
                          Students
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 font-medium leading-none'>
          Enrollment up by 5.2% this term <IconTrendingUp className='h-4 w-4' />
        </div>
        <div className='leading-none text-muted-foreground'>
          Showing total students for the 2024-2025 academic year
        </div>
      </CardFooter>
    </Card>
  );
}
