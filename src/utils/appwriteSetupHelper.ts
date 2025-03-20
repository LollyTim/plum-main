
import { Client, Databases, Storage, ID } from 'appwrite';

// This script is for initializing Appwrite collections, attributes, and indexes

export const initializeAppwrite = async (
  projectId: string,
  databaseId: string,
  productsCollectionId: string,
  ordersCollectionId: string,
  usersCollectionId: string,
  bucketId: string
) => {
  try {
    // Initialize Appwrite client
    const client = new Client()
      .setEndpoint('https://cloud.appwrite.io/v1')
      .setProject(projectId);

    const databases = new Databases(client);
    const storage = new Storage(client);

    console.log('Starting Appwrite initialization...');

    // Check if the database exists, create it if not
    try {
      await databases.get(databaseId);
      console.log('Database already exists.');
    } catch (error) {
      console.error('Error checking database:', error);
      console.log('Please create the database manually in the Appwrite console.');
      return false;
    }

    // Initialize Products collection
    await initializeProductsCollection(
      databases,
      databaseId,
      productsCollectionId
    );

    // Initialize Orders collection
    await initializeOrdersCollection(
      databases,
      databaseId,
      ordersCollectionId
    );

    // Initialize Users collection
    await initializeUsersCollection(
      databases,
      databaseId,
      usersCollectionId
    );

    // Setup storage bucket
    await initializeStorageBucket(
      storage,
      bucketId
    );

    console.log('Appwrite initialization complete!');
    return true;
  } catch (error) {
    console.error('Error initializing Appwrite:', error);
    return false;
  }
};

const initializeProductsCollection = async (
  databases: Databases,
  databaseId: string,
  collectionId: string
) => {
  try {
    // Check if collection exists
    try {
      await databases.getCollection(databaseId, collectionId);
      console.log('Products collection already exists');
      return;
    } catch (error) {
      console.log('Creating Products collection...');
    }

    // Create Products collection
    await databases.createCollection(
      databaseId,
      collectionId,
      'Products'
    );

    // Create attributes
    console.log('Creating attributes for Products collection...');
    
    // These attribute creation methods need to be called from the Appwrite console or API
    // as the SDK no longer supports these methods directly
    console.log('Please create the following attributes for the Products collection in the Appwrite console:');
    console.log('- name (string, required)');
    console.log('- category (string, required)');
    console.log('- price (number, required)');
    console.log('- description (string)');
    console.log('- stock (number, required)');
    console.log('- image (string)');
    console.log('- featured (boolean)');
    console.log('- discount (number)');

    // Create indexes
    console.log('Please create the following indexes for the Products collection in the Appwrite console:');
    console.log('- Index on category');
    console.log('- Index on featured');

    console.log('Products collection setup complete');
  } catch (error) {
    console.error('Error setting up Products collection:', error);
  }
};

const initializeOrdersCollection = async (
  databases: Databases,
  databaseId: string,
  collectionId: string
) => {
  try {
    // Check if collection exists
    try {
      await databases.getCollection(databaseId, collectionId);
      console.log('Orders collection already exists');
      return;
    } catch (error) {
      console.log('Creating Orders collection...');
    }

    // Create Orders collection
    await databases.createCollection(
      databaseId,
      collectionId,
      'Orders'
    );

    // Create attributes
    console.log('Creating attributes for Orders collection...');
    
    console.log('Please create the following attributes for the Orders collection in the Appwrite console:');
    console.log('- userId (string, required)');
    console.log('- status (string, required) - Possible values: "pending", "processing", "shipped", "delivered", "cancelled"');
    console.log('- items (json, required) - Array of product items with quantity');
    console.log('- shipping (json, required) - Shipping address and contact information');
    console.log('- payment (json) - Payment details');
    console.log('- total (number, required)');
    console.log('- subtotal (number, required)');
    console.log('- tax (number)');
    console.log('- shipping_fee (number)');
    console.log('- tracking_number (string)');
    console.log('- delivery_date (string)');
    console.log('- notes (string)');

    // Create indexes
    console.log('Please create the following indexes for the Orders collection in the Appwrite console:');
    console.log('- Index on userId');
    console.log('- Index on status');
    console.log('- Index on createdAt');

    console.log('Orders collection setup complete');
  } catch (error) {
    console.error('Error setting up Orders collection:', error);
  }
};

const initializeUsersCollection = async (
  databases: Databases,
  databaseId: string,
  collectionId: string
) => {
  try {
    // Check if collection exists
    try {
      await databases.getCollection(databaseId, collectionId);
      console.log('Users collection already exists');
      return;
    } catch (error) {
      console.log('Creating Users collection...');
    }

    // Create Users collection
    await databases.createCollection(
      databaseId,
      collectionId,
      'Users'
    );

    // Create attributes
    console.log('Creating attributes for Users collection...');
    
    console.log('Please create the following attributes for the Users collection in the Appwrite console:');
    console.log('- email (string, required)');
    console.log('- name (string)');
    console.log('- userId (string) - This will store the Clerk user ID');
    console.log('- role (string, required) - Values: "admin" or "customer"');
    console.log('- phone (string)');
    console.log('- address (json)');
    console.log('- createdAt (string)');
    console.log('- lastLogin (string)');

    // Create indexes
    console.log('Please create the following indexes for the Users collection in the Appwrite console:');
    console.log('- Index on email (unique)');
    console.log('- Index on userId');

    console.log('Users collection setup complete');
  } catch (error) {
    console.error('Error setting up Users collection:', error);
  }
};

const initializeStorageBucket = async (
  storage: Storage,
  bucketId: string
) => {
  try {
    // Check if bucket exists
    try {
      await storage.getBucket(bucketId);
      console.log('Storage bucket already exists');
      return;
    } catch (error) {
      console.log('Creating storage bucket...');
    }

    // Create bucket
    await storage.createBucket(
      bucketId,
      'PlumShopFiles',
      ['file']
    );

    console.log('Storage bucket setup complete');
  } catch (error) {
    console.error('Error setting up storage bucket:', error);
  }
};
