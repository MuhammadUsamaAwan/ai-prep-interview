'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';

import { api } from '~/convex/_generated/api';
import { showErrorMessage } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Spinner } from '~/components/spinner';

export function Interviews() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const interviews = useQuery(api.queries.interviews);
  const createInterviewAttempt = useMutation(api.mutations.createInterviewAttempt);

  if (!interviews) {
    return <Spinner />;
  }

  if (interviews.length === 0) {
    return (
      <p className='text-center text-muted-foreground'>No interviews found. Create a new interview to get started.</p>
    );
  }

  return (
    <div className='grid md:grid-cols-2 lg:grid-cols-3'>
      {interviews.map(i => (
        <Card key={i._id}>
          <CardHeader>
            <CardTitle>{i.jobTitle}</CardTitle>
            <CardDescription className='flex items-center justify-between'>
              <div>{i.jobExperience} years of experience</div>
              <div>{i.attemptCount} attempts made</div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='line-clamp-3'>{i.jobDescription}</div>
          </CardContent>
          <CardFooter className='gap-2'>
            <Button variant='outline'>View Attempts ({i.attemptCount})</Button>
            <Button
              variant='outline'
              isLoading={isPending}
              onClick={async () => {
                startTransition(async () => {
                  try {
                    const attemptId = await createInterviewAttempt({ interviewId: i._id });
                    router.push(`/attempts/${attemptId}`);
                  } catch (error) {
                    showErrorMessage(error);
                  }
                });
              }}
            >
              Attempt Interview
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
