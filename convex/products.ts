// convex/products.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query: Get featured products (now returns latest products)
export const getFeaturedProducts = query({
  handler: async (ctx) => {
    try {
      // Get all products
      const products = await ctx.db.query("products").collect();

      // Sort by creation time (descending) and take the latest 4
      const latestProducts = [...products]
        .sort((a, b) => {
          // Try to sort by _creationTime (newest first)
          if (b._creationTime && a._creationTime) {
            return b._creationTime - a._creationTime;
          }

          // Fallback sorting by ID (assuming newer products have higher IDs)
          return b._id.toString().localeCompare(a._id.toString());
        })
        .slice(0, 4);

      // Return the products with transformed IDs
      return latestProducts.map((product) => ({
        ...product,
        id: product._id,
      }));
    } catch (error) {
      console.error("Error fetching latest products:", error);
      return [];
    }
  },
});

// Query: Get all products
export const getProducts = query({
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();

    return products.map((product) => ({
      ...product,
      id: product._id,
    }));
  },
});

// Query: Get product by ID
export const getProductById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    try {
      // Get the product from the database
      const product = await ctx.db.get(args.id);

      // If no product found, return null
      if (!product) {
        console.warn(`Product with ID ${args.id} not found`);
        return null;
      }

      // Add proper ID field and return the complete product data
      return {
        ...product,
        id: product._id,
      };
    } catch (error) {
      console.error(`Error fetching product with ID ${args.id}:`, error);
      return null;
    }
  },
});

// Mutation: Add a new product
export const createProduct = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("products", {
      ...args,
      inStock: args.stock > 0,
    });
  },
});

// Mutation: Update an existing product
export const updateProduct = mutation({
  args: {
    id: v.id("products"),
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
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, {
      ...data,
      inStock: data.stock > 0,
    });
  },
});

// Mutation: Delete a product
export const deleteProduct = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Query: Get all product categories
export const getAllCategories = query({
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    const categories = new Set(products.map((product) => product.category));
    return Array.from(categories).sort();
  },
});

// Query: Get new arrivals (most recently added products)
export const getNewArrivals = query({
  handler: async (ctx) => {
    try {
      // Get all products
      const products = await ctx.db.query("products").collect();

      // Sort by creation time (descending) and take the newest 8
      const newArrivals = [...products]
        .sort((a, b) => {
          // Try to sort by _creationTime (newest first)
          if (b._creationTime && a._creationTime) {
            return b._creationTime - a._creationTime;
          }

          // Fallback sorting by ID (assuming newer products have higher IDs)
          return b._id.toString().localeCompare(a._id.toString());
        })
        .slice(0, 8);

      // Return the products with transformed IDs
      return newArrivals.map((product) => ({
        ...product,
        id: product._id,
      }));
    } catch (error) {
      console.error("Error fetching new arrivals:", error);
      return [];
    }
  },
});

export const getLatestProducts = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { limit = 4 } = args;

    // Get all products
    const products = await ctx.db.query("products").collect();

    // Sort by creation time (descending) and take the specified limit
    const latestProducts = [...products]
      .sort((a, b) => {
        // Try to sort by _creationTime (newest first)
        if (b._creationTime && a._creationTime) {
          return b._creationTime - a._creationTime;
        }

        // Fallback sorting by ID (assuming newer products have higher IDs)
        return b._id.toString().localeCompare(a._id.toString());
      })
      .slice(0, limit);

    // Return the products with transformed IDs
    return latestProducts.map((product) => ({
      ...product,
      id: product._id,
    }));
  },
});
