import { redirect } from 'next/navigation';
import { isAuthenticatedNextjs } from '@convex-dev/auth/nextjs/server';

import { Attempt } from './_components/attempt';

type AttemptPageProps = {
  params: {
    id: string;
  };
};

export default function AttemptPage({ params: { id } }: AttemptPageProps) {
  const isAuthenticated = isAuthenticatedNextjs();

  if (!isAuthenticated) {
    redirect('/signin');
  }

  return (
    <div className='container pb-10 pt-20'>
      <Attempt id={id} />
    </div>
  );
}
