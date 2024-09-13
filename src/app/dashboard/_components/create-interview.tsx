'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'convex/react';
import { PlusIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { type z } from 'zod';

import { api } from '~/convex/_generated/api';
import { showErrorMessage } from '~/lib/utils';
import { createInterviewSchema } from '~/lib/validations';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Textarea } from '~/components/ui/textarea';

type Inputs = z.infer<typeof createInterviewSchema>;

export function CreateInterview() {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const form = useForm<Inputs>({
    resolver: zodResolver(createInterviewSchema),
  });
  const createInterview = useMutation(api.mutations.createInterview);

  async function onSubmit(values: Inputs) {
    startTransition(async () => {
      try {
        await createInterview(values);
        form.reset();
        setOpen(false);
      } catch (error) {
        showErrorMessage(error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className='mr-2 size-5' />
          Add New
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Mock Interview</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} autoComplete='off' className='space-y-4'>
            <FormField
              control={form.control}
              name='jobTitle'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Job Title' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='jobExperience'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Experience</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Job Experience'
                      type='number'
                      min={0}
                      value={field.value}
                      onChange={val => field.onChange(Number(val.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='jobDescription'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Description</FormLabel>
                  <FormControl>
                    <Textarea rows={6} placeholder='Job Description' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button className='w-full' isLoading={isPending}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
