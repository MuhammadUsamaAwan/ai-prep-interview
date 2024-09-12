'use client';

import { useAuthActions } from '@convex-dev/auth/react';

import { Button } from '~/components/ui/button';
import { Icons } from '~/components/icons';

export function SignInOptions() {
  const { signIn } = useAuthActions();

  return (
    <>
      <Button variant='outline' className='w-full' onClick={() => signIn('google')}>
        <Icons.google className='mr-2 size-5' />
        Sign In with Google
      </Button>
      <Button variant='outline' className='w-full' onClick={() => signIn('github')}>
        <Icons.github className='mr-2 size-5' />
        Sign In with Github
      </Button>
    </>
  );
}
