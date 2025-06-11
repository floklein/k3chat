import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const contentPartText = v.object({
  type: v.literal("text"),
  text: v.string(),
});

const contentPartImage = v.object({
  type: v.literal("image_url"),
  image_url: v.object({
    url: v.string(),
  }),
});

const contentPartRefusal = v.object({
  type: v.literal("refusal"),
  refusal: v.string(),
});

const contentPart = v.union(contentPartText, contentPartImage);

export const userMessage = v.object({
  _id: v.id("messages"),
  _creationTime: v.number(),
  chatId: v.id("chats"),
  userId: v.id("users"),
  role: v.literal("user"),
  content: v.union(v.string(), v.array(contentPart)),
});

export const assistantMessage = v.object({
  _id: v.id("messages"),
  _creationTime: v.number(),
  chatId: v.id("chats"),
  userId: v.id("users"),
  role: v.literal("assistant"),
  content: v.union(
    v.string(),
    v.array(v.union(contentPartText, contentPartRefusal)),
  ),
  model: v.string(),
});

export default defineSchema({
  ...authTables,
  chats: defineTable({
    _id: v.id("chats"),
    _creationTime: v.number(),
    name: v.string(),
    userId: v.id("users"),
    model: v.string(),
  }).index("by_user", ["userId"]),
  messages: defineTable(v.union(userMessage, assistantMessage)).index(
    "by_chat",
    ["chatId"],
  ),
});
