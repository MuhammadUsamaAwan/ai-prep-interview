'use client';

import { useAuthActions } from '@convex-dev/auth/react';
import { LogOutIcon } from 'lucide-react';

export function Logout() {
  const { signOut } = useAuthActions();

  return (
    <button onClick={() => signOut()} className='flex w-full items-center px-2 py-1.5'>
      <LogOutIcon className='mr-2 size-4' />
      Log Out
    </button>
  );
}
