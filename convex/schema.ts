import { authTables } from '@convex-dev/auth/server';
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const schema = defineSchema({
  ...authTables,
  interviews: defineTable({
    jobTitle: v.string(),
    jobDescription: v.string(),
    jobExperience: v.number(),
    userId: v.id('users'),
    attemptCount: v.number(),
  }).index('by_user', ['userId']),
  questions: defineTable({
    interviewId: v.id('interviews'),
    content: v.string(),
    answer: v.string(),
  }),
  interviewAttempts: defineTable({
    interviewId: v.id('interviews'),
    userId: v.id('users'),
    startedAt: v.number(),
    endedAt: v.optional(v.number()),
    currentQuestionIndex: v.number(),
  }),
  answers: defineTable({
    questionId: v.id('questions'),
    interviewAttemptId: v.id('interviewAttempts'),
    userId: v.id('users'),
    content: v.string(),
    feedback: v.optional(v.string()),
    rating: v.optional(v.number()),
  }),
});

export default schema;
