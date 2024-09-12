'use client';

import { useQuery } from 'convex/react';

import { api } from '~/convex/_generated/api';
import { Spinner } from '~/components/spinner';

export function Interviews() {
  const interviews = useQuery(api.queries.interviews);

  if (!interviews) {
    return <Spinner />;
  }

  return <pre>{JSON.stringify(interviews)}</pre>;
}
