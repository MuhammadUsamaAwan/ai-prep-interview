'use client';

import { useQuery } from 'convex/react';

import { api } from '~/convex/_generated/api';
import { Spinner } from '~/components/spinner';

type InterviewDetailsProps = {
  id: string;
};

export function InterviewDetails({ id }: InterviewDetailsProps) {
  const interview = useQuery(api.queries.interview, { id });

  if (!interview) {
    return <Spinner />;
  }

  return (
    <div>
      <h1 className='mb-6 text-2xl font-bold'>{interview?.jobTitle}</h1>
      <div className='mb-2'>
        <span className='font-bold'>Job experience:</span> {interview?.jobExperience} years
      </div>
      <div>
        <span className='font-bold'>Job Description:</span> {interview?.jobDescription}
      </div>
    </div>
  );
}
