'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { format } from 'date-fns';

import { api } from '~/convex/_generated/api';
import { showErrorMessage } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';

type AttemptsTableProps = {
  interviewId: string;
};

export function AttemptsTable({ interviewId }: AttemptsTableProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const attempts = useQuery(api.queries.interviewAttemptsByInterview, { interviewId });
  const createInterviewAttempt = useMutation(api.mutations.createInterviewAttempt);

  if (!attempts) {
    return null;
  }

  if (attempts.length === 0) {
    return (
      <div className='space-y-4 pt-20'>
        <div className='text-center text-muted-foreground'>No attempts found</div>
        <div className='flex justify-center'>
          <Button
            isLoading={isPending}
            onClick={async () => {
              startTransition(async () => {
                try {
                  // @ts-expect-error interviewId is the Id
                  const attemptId = await createInterviewAttempt({ interviewId });
                  router.push(`/attempts/${attemptId}`);
                } catch (error) {
                  showErrorMessage(error);
                }
              });
            }}
          >
            Attempt Interview
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='overflow-x-auto rounded-xl border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='text-center'>Attempt #</TableHead>
            <TableHead className='text-center'>Started At</TableHead>
            <TableHead className='text-center'>Ended At</TableHead>
            <TableHead className='text-center'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attempts.map((a, i) => (
            <TableRow key={a._id}>
              <TableCell className='text-center'>{i + 1}</TableCell>
              <TableCell className='text-center'>
                {a.startedAt ? format(new Date(a.startedAt), 'MMM dd yyyy, HH:mm aa') : '-'}
              </TableCell>
              <TableCell className='text-center'>
                {a.endedAt ? format(new Date(a.endedAt), 'MMM dd yyyy, HH:mm aa') : '-'}
              </TableCell>
              <TableCell className='text-center'>
                <Link className='underline underline-offset-2' href={`/attempts/${a._id}`}>
                  {a.endedAt ? 'View Details' : a.startedAt ? 'Continue' : 'Start Now'}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
