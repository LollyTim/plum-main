// convex/customers.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query: Fetch all customers
export const getAllCustomers = query({
  handler: async (ctx) => {
    return await ctx.db.query("customers").collect();
  },
});

// Mutation: Create a new customer
export const createCustomer = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    address: v.string(),
    phone: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("customers", {
      ...args,
      createdAt: new Date().toISOString(),
    });
  },
});

// Mutation: Update customer details
export const updateCustomer = mutation({
  args: {
    id: v.id("customers"),
    name: v.string(),
    email: v.string(),
    address: v.string(),
    phone: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { ...args });
  },
});

// Mutation: Delete a customer
export const deleteCustomer = mutation({
  args: {
    id: v.id("customers"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
