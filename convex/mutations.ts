import { getAuthUserId } from '@convex-dev/auth/server';
import { ConvexError, v } from 'convex/values';

import { internal } from './_generated/api';
import { type Id } from './_generated/dataModel';
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
    const interview = await ctx.db
      .query('interviews')
      .withIndex('by_id', q => q.eq('_id', args.interviewId))
      .first();
    if (!interview) throw new ConvexError('Interview not found');
    const interviewAttempt = await ctx.db.insert('interviewAttempts', {
      interviewId: args.interviewId,
      userId,
      currentQuestionIndex: -1,
    });
    await ctx.db.patch(args.interviewId, { attemptCount: interview.attemptCount + 1 });
    return interviewAttempt;
  },
});

export const deleteInterview = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError('User not authenticated');
    const interview = await ctx.db
      .query('interviews')
      .withIndex('by_id', q => q.eq('_id', args.id as Id<'interviews'>))
      .first();
    if (!interview) throw new ConvexError('Interview not found');
    const [attempts, questions, answers] = await Promise.all([
      ctx.db
        .query('interviewAttempts')
        .withIndex('by_interview', q => q.eq('interviewId', args.id as Id<'interviews'>))
        .collect(),
      ctx.db
        .query('questions')
        .withIndex('by_interview', q => q.eq('interviewId', args.id as Id<'interviews'>))
        .collect(),
      ctx.db
        .query('answers')
        .withIndex('by_interview', q => q.eq('interviewId', args.id as Id<'interviews'>))
        .collect(),
    ]);
    const attemptIds = attempts.map(a => a._id);
    const questionIds = questions.map(q => q._id);
    const answerIds = answers.map(a => a._id);
    const deletePromises = [interview._id, ...attemptIds, ...questionIds, ...answerIds].map(id => ctx.db.delete(id));
    await Promise.all(deletePromises);
  },
});
