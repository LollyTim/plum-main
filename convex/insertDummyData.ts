// convex/insertDummyData.ts
import { mutation } from "./_generated/server";

export const insertDummyData = mutation({
  handler: async (ctx) => {
    const dummyProducts = [
      {
        name: "Gift Box",
        category: "Gift Items",
        price: 19.99,
        description: "A beautifully wrapped gift box.",
        stock: 50,
        image: "https://example.com/gift-box.jpg",
        featured: true,
        discount: 0.1,
        rating: 4.5,
        reviews: 120,
      },
      {
        name: "Teddy Bear",
        category: "Toys",
        price: 29.99,
        description: "A soft and cuddly teddy bear.",
        stock: 100,
        image: "https://example.com/teddy-bear.jpg",
        featured: false,
        discount: 0,
        rating: 4.8,
        reviews: 200,
      },
      {
        name: "Rose Bouquet",
        category: "Flowers",
        price: 39.99,
        description: "A dozen red roses.",
        stock: 30,
        image: "https://example.com/rose-bouquet.jpg",
        featured: true,
        discount: 0.2,
        rating: 4.7,
        reviews: 150,
      },
      {
        name: "Helium Balloons",
        category: "Balloons",
        price: 9.99,
        description: "Colorful helium balloons.",
        stock: 200,
        image: "https://example.com/helium-balloons.jpg",
        featured: false,
        discount: 0,
        rating: 4.6,
        reviews: 90,
      },
      {
        name: "Lavender Body Spray",
        category: "Body Sprays",
        price: 14.99,
        description: "A refreshing lavender-scented body spray.",
        stock: 80,
        image: "https://example.com/lavender-spray.jpg",
        featured: true,
        discount: 0.15,
        rating: 4.9,
        reviews: 300,
      },
    ];

    for (const product of dummyProducts) {
      await ctx.db.insert("products", {
        ...product,
        inStock: product.stock > 0,
      });
    }
  },
});
