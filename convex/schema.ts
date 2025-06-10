import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  chats: defineTable({
    _id: v.id("chats"),
    _creationTime: v.number(),
    name: v.string(),
    userId: v.id("users"),
  }).index("by_user", ["userId"]),
  messages: defineTable({
    _id: v.id("messages"),
    _creationTime: v.number(),
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    chatId: v.id("chats"),
  }).index("by_chat", ["chatId"]),
});
