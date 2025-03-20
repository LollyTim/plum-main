// convex/users.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mutation: Create or update a user profile
export const createOrUpdateUserProfile = mutation({
  args: {
    userId: v.string(), // Clerk user ID
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if the user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (existingUser) {
      // Update the existing user
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        name: args.name,
      });
      return existingUser._id;
    } else {
      // Create a new user
      const userId = await ctx.db.insert("users", {
        userId: args.userId,
        email: args.email,
        name: args.name,
        role: "user", // Default role
        createdAt: new Date().toISOString(),
      });
      return userId;
    }
  },
});

// Query: Fetch user by Clerk user ID
export const getUserByClerkId = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
  },
});

// Query: Fetch all users (for admin)
export const getAllUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});
