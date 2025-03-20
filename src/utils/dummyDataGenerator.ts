import { api } from "../../convex/_generated/api";
import { useMutation } from "convex/react";

const PRODUCT_CATEGORIES = [
  "Gift Items",
  "Toys",
  "Flowers",
  "Balloons",
  "Body Sprays",
];

const PRODUCT_NAMES = [
  {
    category: "Gift Items",
    names: [
      "Luxury Gift Box",
      "Premium Gift Set",
      "Celebration Package",
      "Anniversary Gift Set",
      "Birthday Gift Box",
    ],
  },
  {
    category: "Toys",
    names: [
      "Premium Plush Toy",
      "Interactive Learning Toy",
      "Wooden Blocks Set",
      "Musical Toy Collection",
      "Educational Puzzle",
    ],
  },
  {
    category: "Flowers",
    names: [
      "Premium Flower Bouquet",
      "Rose Collection",
      "Mixed Flower Arrangement",
      "Exotic Flower Set",
      "Seasonal Flower Mix",
    ],
  },
  {
    category: "Balloons",
    names: [
      "Celebration Balloon Pack",
      "Birthday Balloon Set",
      "Wedding Balloon Collection",
      "Anniversary Balloon Mix",
      "Graduation Balloon Bundle",
    ],
  },
  {
    category: "Body Sprays",
    names: [
      "Exclusive Perfume Collection",
      "Premium Fragrance Set",
      "Luxury Scent Package",
      "Signature Cologne Set",
      "Designer Fragrance Collection",
    ],
  },
];

// Generate product data
const generateProductData = (count: number) => {
  const products = [];

  for (let i = 0; i < count; i++) {
    const categoryIndex = Math.floor(Math.random() * PRODUCT_CATEGORIES.length);
    const category = PRODUCT_CATEGORIES[categoryIndex];

    const productCategory = PRODUCT_NAMES.find(
      (pc) => pc.category === category
    );
    const nameIndex = Math.floor(Math.random() * productCategory.names.length);
    const name = `${productCategory.names[nameIndex]} ${Math.floor(
      Math.random() * 100
    )}`;

    const price = parseFloat((Math.random() * 200 + 20).toFixed(2));
    const stock = Math.floor(Math.random() * 100) + 1;
    const featured = Math.random() > 0.7;
    const rating = parseFloat((Math.random() * 5).toFixed(1));
    const reviews = Math.floor(Math.random() * 100);

    products.push({
      name,
      category,
      price,
      description: `High-quality ${category.toLowerCase()} perfect for any occasion. This ${name.toLowerCase()} will make a great gift or addition to your collection.`,
      stock,
      image: `https://source.unsplash.com/300x300/?${category
        .toLowerCase()
        .replace(" ", "")}`,
      featured,
      discount:
        Math.random() > 0.8 ? parseFloat((Math.random() * 0.4).toFixed(2)) : 0,
      rating,
      reviews,
      inStock: stock > 0,
    });
  }

  return products;
};

// Generate random users
const generateUserData = (count: number) => {
  const users = [];
  const roles = ["customer", "customer", "customer", "customer", "admin"]; // 1 in 5 chance of admin

  for (let i = 0; i < count; i++) {
    const firstName = [
      "John",
      "Jane",
      "Alex",
      "Sarah",
      "Michael",
      "Emma",
      "David",
      "Olivia",
    ][Math.floor(Math.random() * 8)];
    const lastName = [
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Garcia",
      "Miller",
      "Davis",
    ][Math.floor(Math.random() * 8)];

    users.push({
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(
        Math.random() * 1000
      )}@example.com`,
      name: `${firstName} ${lastName}`,
      userId: `user_${Math.random().toString(36).substring(2, 15)}`,
      role: roles[Math.floor(Math.random() * roles.length)],
      phone: `+1${Math.floor(Math.random() * 1000000000)
        .toString()
        .padStart(10, "0")}`,
      address: {
        street: `${Math.floor(Math.random() * 1000) + 1} Main St`,
        city: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"][
          Math.floor(Math.random() * 5)
        ],
        state: ["NY", "CA", "IL", "TX", "AZ"][Math.floor(Math.random() * 5)],
        zipCode: Math.floor(Math.random() * 90000 + 10000).toString(),
        country: "USA",
      },
    });
  }

  return users;
};

export const useDummyDataGenerator = () => {
  const createProduct = useMutation(api.products.createProduct);
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUserProfile);

  // Function to populate products
  const populateProducts = async (count: number = 10) => {
    const productData = generateProductData(count);

    for (const product of productData) {
      try {
        await createProduct(product);
      } catch (error) {
        console.error("Error creating product:", error);
      }
    }

    return productData.length;
  };

  // Function to populate users
  const populateUsers = async (count: number = 5) => {
    const userData = generateUserData(count);

    for (const user of userData) {
      try {
        await createOrUpdateUser(user);
      } catch (error) {
        console.error("Error creating user:", error);
      }
    }

    return userData.length;
  };

  return {
    populateProducts,
    populateUsers,
  };
};
