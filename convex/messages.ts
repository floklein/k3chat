import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import OpenAI from "openai";
import { internal } from "./_generated/api";
import { internalMutation, mutation, query } from "./_generated/server";
import { userMessage } from "./schema";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const getMessages = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }
    return await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .collect();
  },
});

export const createMessage = mutation({
  args: {
    chatId: v.id("chats"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.runMutation(internal.messages.sendMessage, {
      chatId: args.chatId,
      content: args.content,
    });
  },
});

export const sendMessage = internalMutation({
  args: {
    chatId: v.id("chats"),
    content: userMessage.fields.content,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    await ctx.db.insert("messages", {
      chatId: args.chatId,
      content: args.content,
      role: "user",
    });
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .collect();
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash-preview-05-20",
      messages,
      stream: true,
    });
    const messageId = await ctx.db.insert("messages", {
      chatId: args.chatId,
      content: "",
      role: "assistant",
    });
    for await (const chunk of completion) {
      await ctx.db.patch(messageId, {
        content: chunk.choices[0].delta.content ?? "",
      });
    }
  },
});
