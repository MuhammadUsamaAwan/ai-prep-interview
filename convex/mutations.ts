import { getAuthUserId } from '@convex-dev/auth/server';
import { ConvexError, v } from 'convex/values';

import { internal } from './_generated/api';
import { internalMutation, mutation } from './_generated/server';

export const createInterview = mutation({
  args: {
    jobTitle: v.string(),
    jobDescription: v.string(),
    jobExperience: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError('User not authenticated');
    const interviewId = await ctx.db.insert('interviews', {
      jobTitle: args.jobTitle,
      jobDescription: args.jobDescription,
      jobExperience: args.jobExperience,
      userId,
      attemptCount: 0,
    });
    await ctx.scheduler.runAfter(0, internal.actions.generateInterviewQuestions, {
      interviewId,
      ...args,
    });
  },
});

export const saveQuestions = internalMutation({
  args: {
    interviewId: v.id('interviews'),
    result: v.array(v.object({ question: v.string(), answer: v.string() })),
  },
  handler: async (ctx, args) => {
    const questionsPromises = args.result.map(r =>
      ctx.db.insert('questions', {
        interviewId: args.interviewId,
        content: r.question,
        answer: r.answer,
      })
    );
    await Promise.all(questionsPromises);
  },
});

export const createInterviewAttempt = mutation({
  args: {
    interviewId: v.id('interviews'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError('User not authenticated');
    const interviewAttempt = await ctx.db.insert('interviewAttempts', {
      interviewId: args.interviewId,
      userId,
      currentQuestionIndex: 0,
    });
    return interviewAttempt;
  },
});
