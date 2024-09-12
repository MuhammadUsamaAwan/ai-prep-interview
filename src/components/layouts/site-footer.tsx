import { siteConfig } from '~/config/site';
import { ThemeToggle } from '~/components/layouts/theme-toggle';

export function SiteFooter() {
  return (
    <footer className='container flex items-center justify-between py-4'>
      <div className='text-sm text-muted-foreground'>
        Copyright © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
      <ThemeToggle />
    </footer>
  );
}
