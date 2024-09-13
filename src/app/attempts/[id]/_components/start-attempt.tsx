import { useState, useTransition } from 'react';
import { useMutation, useQuery } from 'convex/react';
import Webcam from 'react-webcam';

import { api } from '~/convex/_generated/api';
import { showErrorMessage } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { Spinner } from '~/components/spinner';

type StartInterviewProps = {
  id: string;
};

export function StartInterview({ id }: StartInterviewProps) {
  const [isPending, startTransition] = useTransition();
  const [mediaLoaded, setMediaLoaded] = useState(true);

  const attempt = useQuery(api.queries.interviewAttempt, { id });
  const interview = useQuery(api.queries.interview, { id: attempt?.interviewId });
  const questions = useQuery(api.queries.questionsByInterview, {
    interviewId: attempt?.interviewId,
  });
  const startInterview = useMutation(api.mutations.startInterview);

  if (!attempt || !questions) {
    return <Spinner />;
  }

  return (
    <div>
      <h1 className='mb-4 text-2xl font-bold'>Get Ready for Your Interview</h1>
      <div className='flex flex-col items-start gap-6 sm:flex-row'>
        <div className='relative h-56 w-full flex-1 sm:h-96'>
          <Webcam className='size-full rounded-xl border' onUserMediaError={() => setMediaLoaded(false)} audio />
          {!mediaLoaded && (
            <span className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-lg font-semibold'>
              Camera Failed
            </span>
          )}
          <div className='mt-4 flex justify-center'>
            <Button
              isLoading={isPending}
              onClick={async () => {
                startTransition(async () => {
                  try {
                    await startInterview({ attemptId: attempt._id });
                  } catch (error) {
                    showErrorMessage(error);
                  }
                });
              }}
            >
              Start Interview
            </Button>
          </div>
        </div>
        <div className='flex-1 space-y-3 rounded-xl border p-4 shadow'>
          <div>
            <span className='font-semibold'>Job Title:</span> {interview?.jobTitle}
          </div>
          <div>
            <span className='font-semibold'>Job Experience:</span> {interview?.jobExperience} years
          </div>
          <div>
            <span className='font-semibold'>Job Description:</span> {interview?.jobDescription}
          </div>
        </div>
      </div>
    </div>
  );
}
