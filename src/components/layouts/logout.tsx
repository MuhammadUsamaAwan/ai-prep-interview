'use client';

import { useRouter } from 'next/navigation';
import { useAuthActions } from '@convex-dev/auth/react';
import { LogOutIcon } from 'lucide-react';

export function Logout() {
  const { signOut } = useAuthActions();
  const router = useRouter();

  return (
    <button
      onClick={() => {
        signOut();
        router.push('/');
      }}
      className='flex w-full items-center px-2 py-1.5'
    >
      <LogOutIcon className='mr-2 size-4' />
      Log Out
    </button>
  );
}
