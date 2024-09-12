import { authTables } from '@convex-dev/auth/server';
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const schema = defineSchema({
  ...authTables,
  interviews: defineTable({
    jobTitle: v.string(),
    jobDescription: v.string(),
    companyName: v.optional(v.string()),
    jobExperience: v.number(),
    createdBy: v.id('users'),
    startedAt: v.number(),
    currentQuestionIndex: v.number(),
    retryCount: v.number(),
  }),
  questions: defineTable({
    interviewId: v.id('interviews'),
    content: v.string(),
    answer: v.string(),
  }),
  answers: defineTable({
    questionId: v.id('questions'),
    userId: v.id('users'),
    content: v.string(),
    feedback: v.optional(v.string()),
    rating: v.optional(v.number()),
    attempt: v.number(),
  }),
});

export default schema;
