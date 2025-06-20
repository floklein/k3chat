import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import OpenAI from "openai";
import { ChatCompletionContentPart } from "openai/resources";
import { Model, models } from "../lib/models";
import { internal } from "./_generated/api";
import {
  internalAction,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { assistantMessage, userMessage } from "./schema";

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
      throw new Error("Unauthorized");
    }
    const chat = await ctx.db.get(args.chatId);
    if (!chat) {
      throw new Error("Chat not found");
    }
    if (chat.userId !== userId) {
      throw new Error("Unauthorized");
    }
    return await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .collect();
  },
});

export const createUserMessage = mutation({
  args: {
    chatId: v.id("chats"),
    content: userMessage.fields.content,
    model: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    await ctx.runMutation(internal.messages.insertUserMessage, {
      chatId: args.chatId,
      userId,
      content: args.content,
      model: args.model,
    });
    await ctx.db.patch(args.chatId, {
      model: args.model,
    });
  },
});

export const insertUserMessage = internalMutation({
  args: {
    chatId: v.id("chats"),
    userId: v.id("users"),
    content: userMessage.fields.content,
    model: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      chatId: args.chatId,
      userId: args.userId,
      content: args.content,
      role: "user",
    });
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .collect();
    await ctx.scheduler.runAfter(0, internal.messages.createCompletion, {
      userId: args.userId,
      messages,
      model: args.model,
    });
  },
});

export const getOpenaiMessages = internalAction({
  args: {
    messages: v.array(v.union(userMessage, assistantMessage)),
  },
  handler: async (ctx, args) => {
    return await Promise.all(
      args.messages.map(async (message) => {
        if (message.role === "user") {
          if (typeof message.content === "string") {
            return {
              ...message,
              content: message.content,
            };
          }
          return {
            ...message,
            content: await Promise.all(
              message.content.map(
                async (part): Promise<ChatCompletionContentPart> => {
                  if (part.type === "image_url") {
                    return {
                      ...part,
                      image_url: {
                        url: await ctx.runAction(internal.utils.getOpenaiUrl, {
                          storageId: part.storageId,
                        }),
                      },
                    };
                  }
                  return part;
                },
              ),
            ),
          };
        }
        return message;
      }),
    );
  },
});

export const createCompletion = internalAction({
  args: {
    messages: v.array(v.union(userMessage, assistantMessage)),
    model: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const model = models[args.model as Model];
    if (!model) {
      throw new Error("Invalid model");
    }
    const completion = await openai.chat.completions.create({
      model: model.modelId,
      messages: await ctx.runAction(internal.messages.getOpenaiMessages, {
        messages: args.messages,
      }),
      stream: true,
    });
    const messageId = await ctx.runMutation(
      internal.messages.insertCompletion,
      {
        chatId: args.messages[0].chatId,
        userId: args.userId,
        content: "",
        model: args.model,
      },
    );
    let content = "";
    for await (const chunk of completion) {
      content += chunk.choices[0].delta.content ?? "";
      await ctx.runMutation(internal.messages.patchCompletion, {
        messageId,
        content,
      });
    }
  },
});

export const insertCompletion = internalMutation({
  args: {
    chatId: v.id("chats"),
    userId: v.id("users"),
    content: v.string(),
    model: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      chatId: args.chatId,
      userId: args.userId,
      content: args.content,
      role: "assistant",
      model: args.model,
    });
  },
});

export const patchCompletion = internalMutation({
  args: {
    messageId: v.id("messages"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, {
      content: args.content,
    });
  },
});
