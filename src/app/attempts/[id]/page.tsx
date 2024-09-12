import { redirect } from 'next/navigation';
import { isAuthenticatedNextjs } from '@convex-dev/auth/nextjs/server';

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

  return <div>AttemptPage {id}</div>;
}
