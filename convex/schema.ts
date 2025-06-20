import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const contentPartText = v.object({
  type: v.literal("text"),
  text: v.string(),
});
export type ContentPartText = typeof contentPartText.type;

const contentPartImage = v.object({
  type: v.literal("image_url"),
  storageId: v.id("_storage"),
});
export type ContentPartImage = typeof contentPartImage.type;

const contentPartRefusal = v.object({
  type: v.literal("refusal"),
  refusal: v.string(),
});
export type ContentPartRefusal = typeof contentPartRefusal.type;

export const userContentPart = v.union(contentPartText, contentPartImage);
export const userContentParts = v.array(userContentPart);
export type UserContentPart = typeof userContentPart.type;
export type UserContentParts = typeof userContentParts.type;

export const userMessage = v.object({
  _id: v.id("messages"),
  _creationTime: v.number(),
  chatId: v.id("chats"),
  userId: v.id("users"),
  role: v.literal("user"),
  content: v.union(v.string(), userContentParts),
});

export const assistantContentPart = v.union(
  contentPartText,
  contentPartRefusal,
);
export const assistantContentParts = v.array(assistantContentPart);
export type AssistantContentPart = typeof assistantContentPart.type;
export type AssistantContentParts = typeof assistantContentParts.type;

export const assistantMessage = v.object({
  _id: v.id("messages"),
  _creationTime: v.number(),
  chatId: v.id("chats"),
  userId: v.id("users"),
  role: v.literal("assistant"),
  content: v.union(v.string(), assistantContentParts),
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
