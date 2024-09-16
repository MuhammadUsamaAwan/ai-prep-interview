import { z } from 'zod';

export const generateInterviewQuestionsSchema = z.object({
  result: z.array(
    z.object({
      question: z.string().describe('The question'),
      answer: z.string().describe('The answer to the question'),
    })
  ),
});

export type InterviewQuestionsResult = z.infer<typeof generateInterviewQuestionsSchema>;

export const generateFeedbackSchema = z.object({
  result: z.object({
    feedback: z.string().describe('The feedback should be text not markdown'),
    rating: z.number().describe('The rating'),
  }),
});

export type GenerateFeedbackResult = z.infer<typeof generateFeedbackSchema>;
