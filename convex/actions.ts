import { v } from 'convex/values';
import { zodResponseFormat } from 'openai/helpers/zod';

import { internal } from './_generated/api';
import { internalAction } from './_generated/server';
import { openai } from './lib';
import {
  generateFeedbackSchema,
  generateInterviewQuestionsSchema,
  type GenerateFeedbackResult,
  type InterviewQuestionsResult,
} from './validations';

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
      response_format: zodResponseFormat(generateInterviewQuestionsSchema, 'generateInterviewQuestionsSchema'),
    });
    const content = JSON.parse(response.choices[0]?.message.content ?? '') as InterviewQuestionsResult;
    await ctx.runMutation(internal.mutations.saveQuestions, { interviewId: args.interviewId, result: content.result });
  },
});

export const generateFeedback = internalAction({
  args: {
    interviewId: v.id('interviews'),
    questionId: v.id('questions'),
    interviewAttemptId: v.id('interviewAttempts'),
    content: v.string(),
    userId: v.id('users'),
    question: v.string(),
    isLastQuestion: v.boolean(),
  },
  handler: async (ctx, args) => {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06',
      messages: [
        {
          role: 'user',
          content: `Give rating (0 to 10) and feeback for the question "${args.question}" based on the interviewer's response "${args.content}"`,
        },
      ],
      response_format: zodResponseFormat(generateFeedbackSchema, 'generateFeedbackSchema'),
    });
    const content = JSON.parse(response.choices[0]?.message.content ?? '') as GenerateFeedbackResult;
    await ctx.runMutation(internal.mutations.saveAnswer, {
      interviewId: args.interviewId,
      questionId: args.questionId,
      interviewAttemptId: args.interviewAttemptId,
      content: args.content,
      userId: args.userId,
      isLastQuestion: args.isLastQuestion,
      feedback: content.result.feedback,
      rating: content.result.rating,
    });
  },
});
