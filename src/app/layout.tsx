import type { Metadata } from 'next';
import { ConvexAuthNextjsServerProvider } from '@convex-dev/auth/nextjs/server';
import { GeistSans } from 'geist/font/sans';

import { siteConfig } from '~/config/site';
import { cn } from '~/lib/utils';
import { Toaster } from '~/components/ui/toaster';
import { SiteFooter } from '~/components/layouts/site-footer';
import { SiteHeader } from '~/components/layouts/site-header';
import { ConvexClientProvider } from '~/components/providers/convex-client-provider';
import { ProgressBarProvider } from '~/components/providers/progress-bar-provider';
import { ThemeProvider } from '~/components/providers/theme-provider';

import '~/styles/globals.css';

export const metadata: Metadata = {
  title: `${siteConfig.name} - AI Mock Interviews`,
  description: siteConfig.description,
  icons: ['/favicon.svg'],
};

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang='en' suppressHydrationWarning>
        <body className={cn('flex min-h-dvh flex-col font-sans antialiased', GeistSans.variable)}>
          <ThemeProvider attribute='class' defaultTheme='dark' disableTransitionOnChange>
            <ProgressBarProvider>
              <ConvexClientProvider>
                <SiteHeader />
                <main className='flex-1'>{children}</main>
                <SiteFooter />
                <Toaster />
              </ConvexClientProvider>
            </ProgressBarProvider>
          </ThemeProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
