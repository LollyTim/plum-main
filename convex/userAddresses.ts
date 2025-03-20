// convex/userAddresses.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query: Fetch addresses for the current user
export const getUserAddresses = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("userAddresses")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

// Mutation: Add or update a user address
export const saveUserAddress = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    address: v.string(),
    city: v.string(),
    state: v.string(),
    zipCode: v.string(),
    isDefault: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existingAddress = await ctx.db
      .query("userAddresses")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existingAddress) {
      // Update existing address
      await ctx.db.patch(existingAddress._id, { ...args });
    } else {
      // Create new address
      await ctx.db.insert("userAddresses", args);
    }
  },
});
