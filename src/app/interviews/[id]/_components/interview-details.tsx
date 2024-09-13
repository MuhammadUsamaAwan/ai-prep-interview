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
      <h1 className='text-2xl font-bold'>{interview?.jobTitle}</h1>
      <div className='text-muted-foreground'>{interview?.jobExperience} years experience</div>
      <div className='text-muted-foreground'>{interview?.jobDescription}</div>
    </div>
  );
}
