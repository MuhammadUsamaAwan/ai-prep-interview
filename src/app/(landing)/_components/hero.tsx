import Link from 'next/link';
import { isAuthenticatedNextjs } from '@convex-dev/auth/nextjs/server';

import { buttonVariants } from '~/components/ui/button';

export function Hero() {
  const isAuthenticated = isAuthenticatedNextjs();

  return (
    <section className='relative overflow-hidden pb-14 pt-28'>
      <div aria-hidden='true' className='absolute -top-96 start-1/2 flex -translate-x-1/2'>
        <div className='h-[44rem] w-[25rem] -translate-x-40 rotate-[-60deg] bg-gradient-to-r from-background/50 to-background blur-3xl' />
        <div className='h-[50rem] w-[90rem] origin-top-left -translate-x-60 -rotate-12 rounded-full bg-gradient-to-tl from-primary-foreground via-primary-foreground to-background blur-3xl' />
      </div>
      <div className='relative z-10'>
        <div className='container'>
          <div className='mx-auto max-w-2xl text-center'>
            <div className='mt-5 max-w-2xl'>
              <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
                Elevate Your Interview Skills using AI
              </h1>
            </div>
            <div className='mt-5 max-w-3xl'>
              <h2 className='text-xl text-muted-foreground'>
                Unlock your full potential with our cutting-edge AI-powered mock interviews. Get real-time feedback,
                tailored practice, and boost your confidence to land your dream job.
              </h2>
            </div>
            <div className='mt-8 flex justify-center gap-3'>
              {isAuthenticated ? (
                <>
                  <Link href='/dashboard' className={buttonVariants({ size: 'lg' })}>
                    Dashboard
                  </Link>
                </>
              ) : (
                <Link href='/signin' className={buttonVariants({ size: 'lg' })}>
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
