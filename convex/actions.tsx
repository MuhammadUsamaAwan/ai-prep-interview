import { v } from 'convex/values';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

import { internal } from './_generated/api';
import { internalAction } from './_generated/server';
import { openai } from './lib';

const responseSchema = z.object({
  result: z.array(
    z.object({
      question: z.string().describe('The question'),
      answer: z.string().describe('The answer to the question'),
    })
  ),
});

export type AIResponse = z.infer<typeof responseSchema>;

export const generateInterviewQuestions = internalAction({
  args: {
    interviewId: v.id('interviews'),
    jobTitle: v.string(),
    jobDescription: v.string(),
    jobExperience: v.number(),
  },
  handler: async (ctx, args) => {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06',
      messages: [
        {
          role: 'user',
          content: `Based on the job title "${args.jobTitle}", experience of ${args.jobExperience} years and the job description "${args.jobDescription}", generate a list of questions and answers that could be asked to an interviewee`,
        },
      ],
      response_format: zodResponseFormat(responseSchema, 'responseSchema'),
    });
    const content = JSON.parse(response.choices[0]?.message.content ?? '') as AIResponse;
    await ctx.runMutation(internal.mutations.saveQuestions, { interviewId: args.interviewId, result: content.result });
  },
});
