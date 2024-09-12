'use client';

import { AppProgressBar } from 'next-nprogress-bar';

export function ProgressBarProvider({ children }: React.PropsWithChildren) {
  return (
    <>
      {children}
      <AppProgressBar height='2px' color='#22c55e' options={{ showSpinner: false }} shallowRouting />
    </>
  );
}
