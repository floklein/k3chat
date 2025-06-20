import { v } from "convex/values";
import { internalAction, mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getStorageUrl = query({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const storageIdToUrl = internalAction({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    if (process.env.NODE_ENV === "development") {
      const blob = await ctx.storage.get(args.storageId);
      if (!blob) {
        throw new Error("Storage blob not found");
      }
      const arrayBuffer = await blob.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const base64 = btoa(
        Array.from(bytes, (byte) => String.fromCharCode(byte)).join(""),
      );
      return `data:${blob.type};base64,${base64}`;
    }
    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) {
      throw new Error("Storage URL not found");
    }
    return url;
  },
});
