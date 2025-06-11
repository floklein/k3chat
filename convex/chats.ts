import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
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
      name: args.content.toString(),
      userId,
    });
    await ctx.runMutation(internal.messages.insertUserMessage, {
      chatId,
      content: args.content,
      model: args.model,
    });
    return chatId;
  },
});
