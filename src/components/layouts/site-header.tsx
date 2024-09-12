import Link from 'next/link';
import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server';
import { fetchQuery } from 'convex/nextjs';
import { LayoutDashboardIcon } from 'lucide-react';

import { siteConfig } from '~/config/site';
import { api } from '~/convex/_generated/api';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { buttonVariants } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { Icons } from '~/components/icons';
import { Logout } from '~/components/layouts/logout';

export async function SiteHeader() {
  const currentUser = await fetchQuery(
    api.queries.currentUser,
    {},
    {
      token: convexAuthNextjsToken(),
    }
  );

  return (
    <header className='absolute top-0 z-50 w-full'>
      <div className='container flex h-14 items-center justify-between'>
        <Link href='/' className='flex items-center space-x-2'>
          <Icons.logo className='size-6 text-primary' />
          <span className='font-semibold'>{siteConfig.name}</span>
        </Link>
        {currentUser ? (
          <DropdownMenu>
            <DropdownMenuTrigger className='outline-none'>
              <Avatar className='size-7'>
                <AvatarImage src={currentUser.image} alt='User Avatar' />
                <AvatarFallback>{currentUser.name?.charAt(1).toUpperCase()}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='min-w-36'>
              <DropdownMenuLabel className='line-clamp-1'>{currentUser.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='p-0'>
                <Link href='/dashboard' className='flex w-full items-center px-2 py-1.5'>
                  <LayoutDashboardIcon className='mr-2 size-4' />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className='p-0'>
                <Logout />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href='/signin' className={buttonVariants()}>
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
