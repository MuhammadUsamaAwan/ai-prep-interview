import { getAuthUserId } from '@convex-dev/auth/server';
import { ConvexError, v } from 'convex/values';

import { type Id } from './_generated/dataModel';
import { query } from './_generated/server';

export const currentUser = query({
  handler: async ctx => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db.get(userId);
  },
});

export const interviews = query({
  handler: async ctx => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError('User not authenticated');
    const interviews = await ctx.db
      .query('interviews')
      .withIndex('by_user', q => q.eq('userId', userId))
      .collect();
    return interviews;
  },
});

export const interview = query({
  args: { id: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.id) return null;
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError('User not authenticated');
    const interview = await ctx.db
      .query('interviews')
      .withIndex('by_id', q => q.eq('_id', args.id as Id<'interviews'>))
      .filter(q => q.eq(q.field('userId'), userId))
      .first();
    return interview;
  },
});

export const interviewAttempt = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError('User not authenticated');
    const attempt = await ctx.db
      .query('interviewAttempts')
      .withIndex('by_id', q => q.eq('_id', args.id as Id<'interviewAttempts'>))
      .filter(q => q.eq(q.field('userId'), userId))
      .first();
    return attempt;
  },
});

export const questionsByInterview = query({
  args: { interviewId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (!args.interviewId) return [];
    const questions = await ctx.db
      .query('questions')
      .withIndex('by_interview', q => q.eq('interviewId', args.interviewId as Id<'interviews'>))
      .collect();
    return questions;
  },
});

export const interviewAttemptsByInterview = query({
  args: { interviewId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError('User not authenticated');
    const attempts = await ctx.db
      .query('interviewAttempts')
      .withIndex('by_interview', q => q.eq('interviewId', args.interviewId as Id<'interviews'>))
      .filter(q => q.eq(q.field('userId'), userId))
      .collect();
    return attempts;
  },
});
