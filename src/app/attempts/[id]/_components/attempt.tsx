'use client';

import { useQuery } from 'convex/react';

import { api } from '~/convex/_generated/api';
import { Spinner } from '~/components/spinner';

import { AttemptDetails } from './attempt-details';
import { Interview } from './interview';
import { StartInterview } from './start-attempt';

type AttemptProps = {
  id: string;
};

export function Attempt({ id }: AttemptProps) {
  const attempt = useQuery(api.queries.interviewAttempt, { id });

  if (!attempt) {
    return <Spinner />;
  }

  if (!attempt.startedAt) {
    return <StartInterview id={id} />;
  }

  if (attempt.endedAt) {
    return <AttemptDetails id={id} />;
  }

  return <Interview id={id} />;
}
