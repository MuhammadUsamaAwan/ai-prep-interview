import { redirect } from 'next/navigation';
import { isAuthenticatedNextjs } from '@convex-dev/auth/nextjs/server';

import { Interview } from './_components/interview';

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
      <Interview attemptId={id} />
    </div>
  );
}
