import type { Icons } from '~/components/icons';

export type Icon = keyof typeof Icons;

export type Feature = {
  title: string;
  description: string;
  icon: Icon;
};
