
# Plum Shop - Appwrite and Clerk Integration Guide

This document provides a comprehensive guide to setting up the Plum Shop application with Appwrite as the database and Clerk for authentication.

## 1. Setting Up Clerk Authentication

### 1.1. Create a Clerk Account and Project
1. Go to [clerk.dev](https://clerk.dev) and sign up for an account
2. Create a new application called "Plum Shop"
3. In the Clerk dashboard, go to API Keys and copy your **Publishable Key**

### 1.2. Configure Environment Variables
Create a `.env` file in the root of your project:
```
VITE_CLERK_PUBLISHABLE_KEY=your_publishable_key_from_clerk
```

## 2. Setting Up Appwrite

### 2.1. Create an Appwrite Account and Project
1. Go to [appwrite.io](https://appwrite.io) and sign up for an account
2. Create a new project called "PlumShop"
3. Copy your **Project ID** from the project settings

### 2.2. Create a Database
1. In the Appwrite console, go to Databases
2. Click "Create Database"
3. Name it "PlumShop"
4. Choose your preferred location
5. Copy the **Database ID** that's generated

### 2.3. Create Collections

#### 2.3.1. Products Collection
1. In your database, click "Create Collection"
2. Name: "Products"
3. Create the following attributes:
   - `name` (string, required)
   - `category` (string, required)
   - `price` (number, required)
   - `description` (string)
   - `stock` (number, required)
   - `image` (string)
   - `featured` (boolean)
   - `discount` (number)
4. Create the following indexes:
   - Index on `category` (key: category)
   - Index on `featured` (key: featured)
5. Set permissions to allow read access to everyone, but only write access to users with admin role

#### 2.3.2. Orders Collection
1. Create new collection named "Orders"
2. Create the following attributes:
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
3. Create the following indexes:
   - Index on `userId` (key: userId)
   - Index on `status` (key: status)
4. Set permissions to allow read/write access only to authenticated users for their own orders

#### 2.3.3. Users Collection
1. Create new collection named "Users"
2. Create the following attributes:
   - `email` (string, required)
   - `name` (string)
   - `userId` (string) - This will store the Clerk user ID
   - `role` (string, required) - Values: "admin" or "customer"
   - `phone` (string)
   - `address` (json)
   - `createdAt` (string)
   - `lastLogin` (string)
3. Create the following indexes:
   - Index on `email` (key: email, unique)
   - Index on `userId` (key: userId)
   - Index on `role` (key: role)
4. Set permissions to allow users to read/write only their own profiles

### 2.4. Create Storage Bucket
1. Go to Storage in Appwrite console
2. Click "Create Bucket"
3. Name it "PlumShopFiles"
4. Copy the **Bucket ID**
5. Set permissions to allow file reads for any user but only writes for authenticated users

### 2.5. Update Environment Variables
Add the following variables to your `.env` file:

```
VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_PRODUCTS_COLLECTION_ID=your_products_collection_id
VITE_APPWRITE_ORDERS_COLLECTION_ID=your_orders_collection_id
VITE_APPWRITE_USERS_COLLECTION_ID=your_users_collection_id
VITE_APPWRITE_BUCKET_ID=your_bucket_id
```

## 3. Understanding the Integration

### 3.1. How Clerk and Appwrite Work Together
1. Clerk handles user authentication, providing sign-up, sign-in, and user management
2. When a user signs up or logs in with Clerk, the app syncs their basic profile to Appwrite
3. The `UserSync` component in `App.tsx` handles this synchronization automatically
4. The user's Clerk ID is stored in Appwrite for reference

### 3.2. Key Integration Points
- `App.tsx`: Contains the `UserSync` component that syncs Clerk users to Appwrite
- `userService.ts`: Functions for creating/updating user profiles in Appwrite
- `useAdmin.ts`: Hook that checks if a user has admin rights based on their Appwrite profile
- `Account.tsx`: Displays user profile information from both Clerk and Appwrite

## 4. User Workflows

### 4.1. Customer Workflow
1. User signs up/logs in via Clerk
2. A profile is created in Appwrite with 'customer' role
3. User can:
   - Browse products
   - Add items to cart
   - Place orders
   - Track their orders
   - Update their profile

### 4.2. Admin Workflow
1. Admin logs in via Clerk
2. A profile is created in Appwrite with 'admin' role
   - For demo purposes, any user with "admin" in their email is given admin role
3. Admin can:
   - Manage products (add, edit, delete)
   - View all orders
   - Update order status
   - View customer information

## 5. Testing the Integration

### 5.1. Sample Admin Account
Create a test account with "admin" in the email (e.g., admin@example.com) when signing up with Clerk.

### 5.2. Sample Products
Add sample products through the admin interface or directly in Appwrite:
- Name: "Premium Flower Bouquet"
- Category: "Flowers"
- Price: 89.99
- Stock: 24
- Description: "A beautiful arrangement of seasonal flowers"

### 5.3. Testing the Order Flow
1. Log in as a customer
2. Add products to cart
3. Complete checkout
4. View order in account page
5. Log in as admin to see the order and update its status

## 6. Deployment Considerations

### 6.1. Environment Variables
Ensure all environment variables are set correctly in your production environment.

### 6.2. CORS Settings
In your Appwrite project settings, add your production domain to the allowed domains.

### 6.3. Clerk Settings
In your Clerk dashboard, add your production domain to the allowed domains.

## 7. Troubleshooting

### 7.1. Authentication Issues
- Check if your Clerk Publishable Key is correctly set
- Verify the `UserSync` component is working by checking console logs

### 7.2. Database Access Issues
- Verify you have the correct Appwrite Project ID and Database ID
- Check collection permissions in Appwrite
- Check for errors in the browser console

### 7.3. Missing Data
- Ensure the collections are created with the correct attributes and indexes
- Verify the data is being properly saved to Appwrite collections

## 8. Next Steps

### 8.1. Additional Features
- Implement forgot password flow
- Add social login options
- Enhance admin dashboard with analytics
- Implement real-time notifications for order status changes

### 8.2. Security Enhancements
- Implement rate limiting
- Add more granular permission controls
- Set up webhook verification
