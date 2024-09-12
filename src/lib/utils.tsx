import { clsx, type ClassValue } from 'clsx';
import { ConvexError } from 'convex/values';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function showErrorMessage(error: unknown) {
  const errorMessage = error instanceof ConvexError ? error.data : 'Unexpected error occurred! Please try again later.';
  toast.error(errorMessage);
}
