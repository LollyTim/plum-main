import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Products table
  products: defineTable({
    name: v.string(),
    category: v.string(),
    price: v.number(),
    description: v.string(),
    stock: v.number(),
    image: v.string(),
    featured: v.boolean(),
    discount: v.number(),
    rating: v.number(),
    reviews: v.number(),
    inStock: v.boolean(),
  }).index("by_featured", ["featured", "rating"]),

  // Carts table
  carts: defineTable({
    userId: v.string(), // Clerk user ID
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
        price: v.number(), // Add price field here
      })
    ),
  }).index("by_userId", ["userId"]),

  // Orders table
  orders: defineTable({
    userId: v.string(), // Clerk user ID
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
    status: v.union(
      v.literal("pending"),
      v.literal("processing"),
      v.literal("shipped"),
      v.literal("delivered")
    ),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("failed"),
      v.literal("refunded")
    ),
    paymentMethod: v.optional(v.string()),
    paymentReference: v.optional(v.string()),
    paymentDate: v.optional(v.string()), // ISO date string
    createdAt: v.string(), // ISO date string
  }),
  // Customers table
  customers: defineTable({
    name: v.string(),
    email: v.string(),
    address: v.string(),
    phone: v.string(),
    createdAt: v.string(), // ISO date string
  }),

  // Users table
  users: defineTable({
    userId: v.string(), // Clerk user ID
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("user"), v.literal("admin")), // User role
    createdAt: v.string(), // ISO date string
  }).index("by_userId", ["userId"]),

  userAddresses: defineTable({
    userId: v.string(), // Clerk user ID
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    address: v.string(),
    city: v.string(),
    state: v.string(),
    zipCode: v.string(),
    isDefault: v.boolean(), // Mark as default address
  }).index("by_userId", ["userId"]),
});
