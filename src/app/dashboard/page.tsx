import { redirect } from 'next/navigation';
import { isAuthenticatedNextjs } from '@convex-dev/auth/nextjs/server';

import { CreateInterview } from './_components/create-interview';
import { Interviews } from './_components/interviews';

export default function DashboardPage() {
  const isAuthenticated = isAuthenticatedNextjs();

  if (!isAuthenticated) {
    redirect('/signin');
  }

  return (
    <div className='container pb-10 pt-20'>
      <div className='mb-8 flex items-center justify-between'>
        <h1 className='text-xl font-bold'>Your Mock Interviews</h1>
        <CreateInterview />
      </div>
      <Interviews />
    </div>
  );
}
