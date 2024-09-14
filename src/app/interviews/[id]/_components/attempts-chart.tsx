'use client';

import { useQuery } from 'convex/react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import { api } from '~/convex/_generated/api';
import { Card, CardContent } from '~/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '~/components/ui/chart';

const chartColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

const generateChartConfig = (attempts: number): ChartConfig => {
  return Array.from({ length: attempts }, (_, i) => {
    const attemptNumber = i + 1;
    return {
      [`attempt${attemptNumber}`]: {
        label: `Attempt ${attemptNumber}`,
        color: chartColors[i % chartColors.length],
      },
    };
  }).reduce((acc, curr) => ({ ...acc, ...curr }), {});
};

type AttemptsChartProps = {
  interviewId: string;
};

export function AttemptsChart({ interviewId }: AttemptsChartProps) {
  const chartData = useQuery(api.queries.attemptsChart, { interviewId });

  if (!chartData || chartData.length === 0) {
    return null;
  }

  const numAttempts = Object.keys(chartData[0] ?? []).filter(key => key.startsWith('attempt')).length;

  const chartConfig = generateChartConfig(numAttempts);

  return (
    <div>
      <h2 className='mb-4 text-2xl font-bold'>Interview Rating Comparison</h2>
      <Card className='h-[280px] w-[500px]'>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
              height={280}
            >
              <CartesianGrid vertical={false} />
              <XAxis dataKey='questionNumber' axisLine={false} tickMargin={8} tickFormatter={(v, i) => `${i + 1}`} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              {Object.keys(chartConfig).map(key => (
                <Line
                  key={key}
                  dataKey={key}
                  type='monotone'
                  stroke={chartConfig?.[key]?.color}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
