import { Icons } from '~/components/icons';

export function Spinner() {
  return (
    <div className='grid place-content-center'>
      <Icons.spinner className='size-8 animate-spin' />
    </div>
  );
}
