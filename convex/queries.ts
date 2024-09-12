import { getAuthUserId } from '@convex-dev/auth/server';
import { ConvexError } from 'convex/values';

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
      .filter(q => q.eq(q.field('userId'), userId))
      .collect();
    return interviews;
  },
});
