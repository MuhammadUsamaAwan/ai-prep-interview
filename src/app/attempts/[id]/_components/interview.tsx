'use client';

import { useQuery } from 'convex/react';
import Webcam from 'react-webcam';

import { api } from '~/convex/_generated/api';
import { Spinner } from '~/components/spinner';

type InterviewProps = {
  attemptId: string;
};

export function Interview({ attemptId }: InterviewProps) {
  const data = useQuery(api.queries.interviewAttempt, { id: attemptId });
  const questions = useQuery(api.queries.questionsByInterview, {
    interviewId: data?.attempt?.interviewId,
  });
  const currentQuestion =
    !data || data.attempt?.currentQuestionIndex === -1 ? null : questions?.[data.attempt.currentQuestionIndex];

  if (!data || !questions) {
    return <Spinner />;
  }

  if (currentQuestion === null) {
    return (
      <div>
        <h1 className='mb-4 text-2xl font-bold'>Get ready for your interview</h1>
        <div className='grid grid-cols-2 gap-6'>
          <div className='space-y-3 rounded-xl border p-4 shadow'>
            <div>
              <span className='font-semibold'>Job Title:</span> {data.interview?.jobTitle}
            </div>
            <div>
              <span className='font-semibold'>Job Experience:</span> {data.interview?.jobExperience}
            </div>
            <div>
              <span className='font-semibold'>Job Description:</span> {data.interview?.jobDescription}
            </div>
          </div>
          <Webcam className='size-20 border' />
        </div>
      </div>
    );
  }

  return <div>Interview</div>;
}
