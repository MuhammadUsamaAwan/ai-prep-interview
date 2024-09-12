import { type Metadata } from 'next';
import { redirect } from 'next/navigation';
import { isAuthenticatedNextjs } from '@convex-dev/auth/nextjs/server';

import { siteConfig } from '~/config/site';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

import { SignInOptions } from './_components/signin-options';

export const metadata: Metadata = {
  title: `${siteConfig.name} - Sign In`,
  description: siteConfig.description,
};

export default function SignInPage() {
  const isAuthenticated = isAuthenticatedNextjs();

  if (isAuthenticated) {
    redirect('/');
  }

  return (
    <div className='container pb-10 pt-52'>
      <Card className='mx-auto w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-2xl'>Sign In</CardTitle>
          <CardDescription>Sign In to your account using one of the options below.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-2'>
          <SignInOptions />
        </CardContent>
      </Card>
    </div>
  );
}
