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
  }).index('by_interview', ['interviewId']),
  interviewAttempts: defineTable({
    interviewId: v.id('interviews'),
    userId: v.id('users'),
    startedAt: v.optional(v.number()),
    endedAt: v.optional(v.number()),
    currentQuestionIndex: v.number(),
  }).index('by_interview', ['interviewId']),
  answers: defineTable({
    interviewId: v.id('interviews'),
    questionId: v.id('questions'),
    interviewAttemptId: v.id('interviewAttempts'),
    userId: v.id('users'),
    content: v.string(),
    feedback: v.optional(v.string()),
    rating: v.optional(v.number()),
  }).index('by_interview', ['interviewId']),
});

export default schema;
