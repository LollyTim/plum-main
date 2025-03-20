// convex/carts.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query: Fetch cart for the current user with populated product details
export const getCart = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const cart = await ctx.db
      .query("carts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!cart) return null;

    // Populate product details for each cart item
    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        if (!product) {
          // Product not found, could have been deleted
          return {
            ...item,
            name: "Product not available",
            image: "",
            category: "",
          };
        }
        // Return cart item with product details
        return {
          ...item,
          name: product.name,
          image: product.image,
          category: product.category,
          description: product.description,
        };
      })
    );

    return {
      ...cart,
      items: populatedItems,
    };
  },
});

// Mutation: Add item to cart
export const addToCart = mutation({
  args: {
    userId: v.string(),
    productId: v.id("products"),
    quantity: v.number(),
    price: v.number(), // Add price field
  },
  handler: async (ctx, args) => {
    const cart = await ctx.db
      .query("carts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (cart) {
      // Update existing cart
      const existingItem = cart.items.find(
        (item) => item.productId === args.productId
      );
      if (existingItem) {
        existingItem.quantity += args.quantity;
      } else {
        cart.items.push({
          productId: args.productId,
          quantity: args.quantity,
          price: args.price,
        });
      }
      await ctx.db.patch(cart._id, { items: cart.items });
    } else {
      // Create new cart
      await ctx.db.insert("carts", {
        userId: args.userId,
        items: [
          {
            productId: args.productId,
            quantity: args.quantity,
            price: args.price,
          },
        ],
      });
    }
  },
});
// Mutation: Remove item from cart
export const removeFromCart = mutation({
  args: {
    userId: v.string(),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const cart = await ctx.db
      .query("carts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (cart) {
      const updatedItems = cart.items.filter(
        (item) => item.productId !== args.productId
      );
      await ctx.db.patch(cart._id, { items: updatedItems });
    }
  },
});

// Mutation: Update item quantity in cart
export const updateCartItemQuantity = mutation({
  args: {
    userId: v.string(),
    productId: v.id("products"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const cart = await ctx.db
      .query("carts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (cart) {
      const updatedItems = cart.items.map((item) =>
        item.productId === args.productId
          ? { ...item, quantity: args.quantity }
          : item
      );
      await ctx.db.patch(cart._id, { items: updatedItems });
    }
  },
});

// Mutation: Clear cart
export const clearCart = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const cart = await ctx.db
      .query("carts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (cart) {
      await ctx.db.patch(cart._id, { items: [] });
    }
  },
});
