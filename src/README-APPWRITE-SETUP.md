
# Appwrite Setup Guide for Plum Shop

This guide will help you set up Appwrite to work with the Plum Shop application. Appwrite is a backend-as-a-service (BaaS) platform that will store all of our data and handle our server-side logic.

## Prerequisites

1. [Create an Appwrite account](https://appwrite.io/) if you don't have one.
2. [Create a Clerk account](https://clerk.dev/) if you don't have one.

## Step 1: Create an Appwrite Project

1. Go to the [Appwrite Console](https://cloud.appwrite.io/)
2. Create a new project named "PlumShop"
3. Take note of your **Project ID**

## Step 2: Set Up Environment Variables

Create a `.env` file in the root of your project with the following variables:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_PRODUCTS_COLLECTION_ID=your_products_collection_id
VITE_APPWRITE_ORDERS_COLLECTION_ID=your_orders_collection_id
VITE_APPWRITE_USERS_COLLECTION_ID=your_users_collection_id
VITE_APPWRITE_BUCKET_ID=your_bucket_id
```

## Step 3: Create Appwrite Database and Collections

1. In your Appwrite console, go to Databases and create a new database called "PlumShop"
2. Take note of the **Database ID**

### Create Collections

#### Products Collection

1. Create a new collection called "Products" 
2. Add the following attributes:
   - `name` (string, required)
   - `category` (string, required)
   - `price` (number, required)
   - `description` (string)
   - `stock` (number, required)
   - `image` (string)
   - `featured` (boolean)
   - `discount` (number)

#### Orders Collection

1. Create a new collection called "Orders"
2. Add the following attributes:
   - `userId` (string, required)
   - `status` (string, required) - Possible values: "pending", "processing", "shipped", "delivered", "cancelled"
   - `items` (json, required) - Array of product items with quantity
   - `shipping` (json, required) - Shipping address and contact information
   - `payment` (json) - Payment details
   - `total` (number, required)
   - `subtotal` (number, required)
   - `tax` (number)
   - `shipping_fee` (number)
   - `tracking_number` (string)
   - `delivery_date` (string)
   - `notes` (string)

#### Users Collection

1. Create a new collection called "Users"
2. Add the following attributes:
   - `email` (string, required)
   - `name` (string)
   - `userId` (string) - This will store the Clerk user ID
   - `role` (string, required) - Values: "admin" or "customer"
   - `phone` (string)
   - `address` (json)
   - `createdAt` (string)
   - `lastLogin` (string)

### Create Indexes

For each collection, create the following indexes:

#### Products Collection
- Index on `category` (key: category)
- Index on `featured` (key: featured)

#### Orders Collection
- Index on `userId` (key: userId)
- Index on `status` (key: status)

#### Users Collection
- Index on `email` (key: email, unique)
- Index on `userId` (key: userId)
- Index on `role` (key: role)

## Step 4: Set Up Storage

1. Go to Storage in the Appwrite console
2. Create a new bucket named "PlumShopFiles"
3. Take note of the **Bucket ID**
4. Set permissions to allow file reads for any user but only write for authenticated users

## Step 5: Set Up Permissions

For each collection and the storage bucket, set up appropriate permissions:

1. Allow read access to all (for products, public access is fine)
2. For orders and users, restrict read/write to authenticated users
3. For admin operations, we'll handle this through our app logic

## Step 6: Deploy and Test

After setting up all the necessary components in Appwrite and configuring your environment variables, deploy your application and verify that:

1. Products can be viewed by anyone
2. Users can sign up and log in using Clerk
3. Logged-in users can place orders
4. Admin users can manage products and view/update orders

## Troubleshooting

If you encounter any issues:

1. Check the browser console for error messages
2. Verify that all environment variables are correctly set
3. Ensure that collection permissions are properly configured in Appwrite
4. Validate that your Clerk setup is correct

## Additional Resources

- [Appwrite Documentation](https://appwrite.io/docs)
- [Clerk Documentation](https://clerk.dev/docs)
- [Appwrite + React Guide](https://appwrite.io/docs/quick-starts/react)
