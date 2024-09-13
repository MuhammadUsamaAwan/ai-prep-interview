import { useTransition } from 'react';
import { useMutation } from 'convex/react';

import { api } from '~/convex/_generated/api';
import { showErrorMessage } from '~/lib/utils';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog';
import { Button } from '~/components/ui/button';

type DeleteInterviewConfirmProps = {
  id: string | null;
  onClose: () => void;
};

export function DeleteInterviewConfirm({ id, onClose }: DeleteInterviewConfirmProps) {
  const [isPending, startTransition] = useTransition();
  const deleteInterview = useMutation(api.mutations.deleteInterview);

  return (
    <AlertDialog open={Boolean(id)} onOpenChange={() => onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your interview.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant='destructive'
            isLoading={isPending}
            onClick={async () => {
              if (!id) return;
              startTransition(async () => {
                try {
                  await deleteInterview({ id: id });
                  onClose();
                } catch (error) {
                  showErrorMessage(error);
                }
              });
            }}
          >
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
