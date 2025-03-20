// convex/orders.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Mutation: Create an order
export const createOrder = mutation({
  args: {
    userId: v.string(),
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
        price: v.number(),
      })
    ),
    total: v.number(),
    shippingAddress: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.string(),
      address: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
    }),
    paymentMethod: v.optional(v.string()),
    paymentReference: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { paymentReference, ...otherArgs } = args;

    // Determine order and payment status based on payment reference
    const status: "pending" | "processing" | "shipped" | "delivered" =
      paymentReference ? "processing" : "pending";
    const paymentStatus: "pending" | "paid" | "failed" | "refunded" =
      paymentReference ? "paid" : "pending";
    const now = new Date().toISOString();

    const orderData = {
      ...otherArgs,
      status,
      paymentStatus,
      createdAt: now,
    };

    // Add payment-related fields if payment reference is provided
    if (paymentReference) {
      Object.assign(orderData, {
        paymentReference,
        paymentDate: now,
      });
    }

    const order = await ctx.db.insert("orders", orderData);
    return order;
  },
});

// Query: Fetch all orders (for admin)
export const getAllOrders = query({
  handler: async (ctx) => {
    return await ctx.db.query("orders").collect();
  },
});

// Query: Get order by ID
export const getOrderById = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Mutation: Update order status
export const updateOrderStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

// Mutation: Update payment status
export const updatePaymentStatus = mutation({
  args: {
    id: v.id("orders"),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("failed"),
      v.literal("refunded")
    ),
    paymentReference: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, paymentStatus, paymentReference } = args;

    const updates: any = {
      paymentStatus,
    };

    if (paymentReference) {
      updates.paymentReference = paymentReference;
    }

    if (paymentStatus === "paid") {
      updates.paymentDate = new Date().toISOString();

      // If payment is successful, also set order status to processing
      if (paymentStatus === "paid") {
        updates.status = "processing";
      }
    }

    await ctx.db.patch(id, updates);
  },
});

// Query: Get shipping information for an order
export const getShippingInfo = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order) {
      throw new Error("Order not found");
    }
    return order.shippingAddress;
  },
});

// Query: Get customer orders
export const getCustomerOrders = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
  },
});

// Query: Get a single order by ID
export const getOrder = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order) return null;
    return order;
  },
});

export const getLatestProducts = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { limit = 4 } = args;

    // Fetch products sorted by createdAt in descending order
    const products = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("featured"), true))
      .order("desc")
      .take(limit);

    return products;
  },
});
