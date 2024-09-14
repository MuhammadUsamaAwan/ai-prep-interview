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
          content: `Generate a list of interview questions and their ideal answers for a ${args.jobTitle} position with ${args.jobExperience} years of experience. The job description is: "${args.jobDescription}".
          For each question:
          1. Ensure it's relevant to the job description and experience level.
          2. Include a mix of technical and behavioral questions.
          3. Provide a detailed ideal answer that demonstrates the expected knowledge or skills.`,
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
          content: `Evaluate the interviewee's response to the following question:
          Question: "${args.question}"
          Response: "${args.content}"
          Provide a detailed assessment including:
          1. A numerical rating from 0 to 10, where 0 is completely incorrect or irrelevant, and 10 is an excellent, comprehensive answer.
          2. A brief explanation (2-3 sentences) justifying the rating.
          3. Specific strengths in the response.
          4. Areas for improvement or additional points the interviewee could have mentioned.
          5. A concise suggestion for how the interviewee could improve their answer.`,
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
