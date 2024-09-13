'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { Trash2Icon } from 'lucide-react';

import { api } from '~/convex/_generated/api';
import { showErrorMessage } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Spinner } from '~/components/spinner';

import { DeleteInterviewConfirm } from './delete-interview-confirm';

export function Interviews() {
  const [isPending, startTransition] = useTransition();
  const [deleteId, setDeleteId] = useState<string | null>(null);
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
        <Card key={i._id} className='group'>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <h2 className='line-clamp-1'>{i.jobTitle}</h2>
              <button className='shrink-0 opacity-0 group-hover:opacity-100' onClick={() => setDeleteId(i._id)}>
                <Trash2Icon className='size-4 text-red-500' />
              </button>
            </CardTitle>
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
      <DeleteInterviewConfirm id={deleteId} onClose={() => setDeleteId(null)} />
    </div>
  );
}
