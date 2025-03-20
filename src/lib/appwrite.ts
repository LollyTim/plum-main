
import { Client, Account, Databases, Storage, ID, Query, Models } from 'appwrite';

// Appwrite configuration
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Set your Appwrite endpoint
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || ''); // Set your project ID

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID, Query }; // Re-export for use in other files

// Database and collection IDs
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || '';
export const PRODUCTS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID || '';
export const ORDERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_ORDERS_COLLECTION_ID || '';
export const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID || '';

// Helper functions for products
export const getProducts = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      [Query.limit(100)]
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getFeaturedProducts = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      [Query.equal('featured', true), Query.limit(8)]
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};

export const getProductById = async (id: string) => {
  try {
    const response = await databases.getDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      id
    );
    return response;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

export const createProduct = async (productData: any) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      ID.unique(),
      productData
    );
    return response;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id: string, productData: any) => {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      id,
      productData
    );
    return response;
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    await databases.deleteDocument(
      DATABASE_ID,
      PRODUCTS_COLLECTION_ID,
      id
    );
    return true;
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    throw error;
  }
};

// Helper functions for orders
export const createOrder = async (orderData: any) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      ID.unique(),
      orderData
    );
    return response;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrdersByUserId = async (userId: string) => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [Query.equal('userId', userId), Query.orderDesc('$createdAt')]
    );
    return response.documents;
  } catch (error) {
    console.error(`Error fetching orders for user ${userId}:`, error);
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      [Query.orderDesc('$createdAt'), Query.limit(100)]
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
};

export const getOrderById = async (id: string) => {
  try {
    const response = await databases.getDocument(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      id
    );
    return response;
  } catch (error) {
    console.error(`Error fetching order with ID ${id}:`, error);
    throw error;
  }
};

export const updateOrderStatus = async (id: string, status: string) => {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      ORDERS_COLLECTION_ID,
      id,
      { status }
    );
    return response;
  } catch (error) {
    console.error(`Error updating order status for ID ${id}:`, error);
    throw error;
  }
};

// Helper functions for categories
export const getAllCategories = async () => {
  try {
    const products = await getProducts();
    const categories = [...new Set(products.map(product => product.category))];
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Helper for file uploads
export const uploadFile = async (file: File) => {
  try {
    const response = await storage.createFile(
      import.meta.env.VITE_APPWRITE_BUCKET_ID || '',
      ID.unique(),
      file
    );
    return response;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const getFilePreview = (fileId: string) => {
  return storage.getFilePreview(
    import.meta.env.VITE_APPWRITE_BUCKET_ID || '',
    fileId
  );
};

// Create a helper to check DB setup
export const checkAppwriteSetup = async (): Promise<boolean> => {
  try {
    // Check if the database exists
    const databaseExists = await databases.get(DATABASE_ID).catch(() => null);
    
    if (!databaseExists) {
      console.error("Database does not exist! Please create a database first.");
      return false;
    }
    
    // Check if collections exist
    const collections = [
      { id: PRODUCTS_COLLECTION_ID, name: 'Products' },
      { id: ORDERS_COLLECTION_ID, name: 'Orders' },
      { id: USERS_COLLECTION_ID, name: 'Users' }
    ];
    
    for (const collection of collections) {
      try {
        await databases.getCollection(DATABASE_ID, collection.id);
      } catch (error) {
        console.error(`${collection.name} collection does not exist!`, error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error checking Appwrite setup:", error);
    return false;
  }
};

// Setup function to create collections if they don't exist
export const setupAppwriteCollections = async () => {
  // This is a placeholder - the actual implementation should be in a separate helper utility
  console.log("Please use the appwriteSetupHelper utility to set up collections");
  return false;
};
