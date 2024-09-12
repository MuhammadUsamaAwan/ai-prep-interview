import { z } from 'zod';

export const createInterviewSchema = z.object({
  jobTitle: z.string().min(1, {
    message: 'Job title is required',
  }),
  jobDescription: z.string().min(1, {
    message: 'Job description is required',
  }),
  jobExperience: z
    .number({
      required_error: 'Job experience is required',
    })
    .min(0),
});
