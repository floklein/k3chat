import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

export const getAuthUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    return userId ? await ctx.db.get(userId) : null;
  },
});
