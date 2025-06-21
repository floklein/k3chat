import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { messageContentToChatName } from "./lib";
import { userMessage } from "./schema";

export const getChats = query({
  args: {
    search: v.optional(v.string()),
  },
  handler: async (ctx, { search }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const chats = await ctx.db
      .query("chats")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    return search
      ? chats.filter((chat) =>
          chat.name.toLowerCase().includes(search.toLowerCase()),
        )
      : chats;
  },
});

export const getChat = query({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, { chatId }) => {
    return await ctx.db.get(chatId);
  },
});

export const createChat = mutation({
  args: {
    content: userMessage.fields.content,
    model: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const chatId = await ctx.db.insert("chats", {
      name: messageContentToChatName(args.content),
      userId,
      model: args.model,
    });
    ctx.runMutation(internal.messages.insertUserMessage, {
      chatId,
      userId,
      content: args.content,
      model: args.model,
    });
    return chatId;
  },
});

export const deleteChat = mutation({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, { chatId }) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", chatId))
      .collect();
    await Promise.all(messages.map((message) => ctx.db.delete(message._id)));
    await Promise.all(
      messages.reduce<Promise<void>[]>((acc, message) => {
        if (typeof message.content === "string") {
          return acc;
        }
        acc.push(
          ...message.content.map(async (part) => {
            if (part.type === "image_url") {
              return ctx.storage.delete(part.storageId);
            }
          }),
        );
        return acc;
      }, []),
    );
    await ctx.db.delete(chatId);
  },
});
