import { useQuery } from 'convex/react';

import { api } from '~/convex/_generated/api';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion';
import { Spinner } from '~/components/spinner';

type AttemptDetailsProps = {
  id: string;
};

export function AttemptDetails({ id }: AttemptDetailsProps) {
  const data = useQuery(api.queries.attemptFeedback, { id });

  if (!data) {
    return <Spinner />;
  }

  return (
    <div>
      <h1 className='text-2xl font-bold'>{data.interview?.jobTitle} - Feedback</h1>
      <div className='text-muted-foreground'>
        Average Rating:{' '}
        {(data.answers.reduce((acc, curr) => acc + (curr?.rating ?? 0), 0) / data.answers.length).toFixed(2)}
      </div>
      <Accordion type='multiple' className='mt-6 space-y-4'>
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
  );
}
