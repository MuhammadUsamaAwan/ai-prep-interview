import { useQuery } from 'convex/react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { api } from '~/convex/_generated/api';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader } from '~/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '~/components/ui/chart';
import { Spinner } from '~/components/spinner';

const chartConfig = {
  rating: {
    label: 'Rating',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

type AttemptDetailsProps = {
  id: string;
};

export function AttemptDetails({ id }: AttemptDetailsProps) {
  const data = useQuery(api.queries.attemptFeedback, { id });

  const chartData = data?.questions.map((q, i) => ({
    question: `Question ${i + 1}`,
    rating: data.answers.find(a => a?.questionId === q._id)?.rating,
  }));

  if (!data) {
    return <Spinner />;
  }

  return (
    <div>
      <div className='mb-6'>
        <h1 className='mb-6 text-2xl font-bold'>{data.interview?.jobTitle}</h1>
        <div className='mb-2'>
          <span className='font-bold'>Job experience:</span> {data.interview?.jobExperience} years
        </div>
        <div>
          <span className='font-bold'>Job Description:</span> {data.interview?.jobDescription}
        </div>
      </div>

      <div className='mb-6'>
        <h2 className='mb-4 text-2xl font-bold'>Interview Rating</h2>
        <Card className='h-[320px] w-[500px]'>
          <CardHeader>
            <CardDescription>
              Overall Rating:{' '}
              {(data.answers.reduce((acc, curr) => acc + (curr?.rating ?? 0), 0) / data.answers.length).toFixed(2)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={chartData} height={320}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='question'
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(v, i) => `${i + 1}`}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey='rating' fill='var(--color-rating)' radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className='mb-4 text-2xl font-bold'>Detailed Feeback</h2>
        <Accordion type='multiple' className='space-y-4'>
          {data.questions.map(q => {
            const answer = data.answers.find(a => a?.questionId === q._id);
            return (
              <AccordionItem key={q._id} value={q._id}>
                <AccordionTrigger>{q.content}</AccordionTrigger>
                <AccordionContent className='space-y-2 border-t pt-2'>
                  <div>
                    <span className='font-semibold'>Your Answer:</span> {answer?.content}
                  </div>
                  <div>
                    <span className='font-semibold'>Sample Answer:</span> {q.answer}
                  </div>
                  <div>
                    <span className='font-semibold'>Feedback:</span> {answer?.feedback}
                  </div>
                  <div>
                    <span className='font-semibold'>Rating:</span> {answer?.rating} / 10
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
