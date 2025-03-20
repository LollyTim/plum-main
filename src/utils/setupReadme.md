
# Perfect Luxury Mart - Setup Guide

This document provides comprehensive instructions for setting up the Perfect Luxury Mart e-commerce application using Appwrite and Clerk.

## Prerequisites

- Node.js 14.x or higher
- NPM 7.x or higher
- An Appwrite account
- A Clerk account

## Environment Variables

Create a `.env` file in the root of your project with the following variables:

```bash
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Appwrite
VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
VITE_APPWRITE_DATABASE_ID=your_appwrite_database_id
VITE_APPWRITE_PRODUCTS_COLLECTION_ID=your_products_collection_id
VITE_APPWRITE_ORDERS_COLLECTION_ID=your_orders_collection_id 
VITE_APPWRITE_USERS_COLLECTION_ID=your_users_collection_id
VITE_APPWRITE_BUCKET_ID=your_storage_bucket_id

# Paystack
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
```

## Clerk Setup

1. Create a new Clerk application at [https://dashboard.clerk.dev/](https://dashboard.clerk.dev/)
2. In your Clerk Dashboard, navigate to API Keys
3. Copy the "Publishable Key" and paste it in your `.env` file as `VITE_CLERK_PUBLISHABLE_KEY`
4. Configure your social login connections (Google, GitHub, etc.) if desired

## Appwrite Setup

### 1. Create a New Appwrite Project

1. Log in to Appwrite Console: [https://cloud.appwrite.io/](https://cloud.appwrite.io/)
2. Create a new project
3. Copy the Project ID and update your `.env` file

### 2. Create a Database

1. In the Appwrite Console, go to Databases
2. Create a new database
3. Copy the Database ID and update your `.env` file

### 3. Create Collections and Attributes

#### Products Collection

1. Create a new collection named "Products"
2. Enable "Document Security" if you want to restrict access
3. Add the following attributes:

| Attribute Name | Type    | Required | Default | Array | Min | Max | Notes |
|---------------|---------|----------|---------|-------|-----|-----|-------|
| name          | string  | Yes      | -       | No    | -   | 256 | -     |
| category      | string  | Yes      | -       | No    | -   | 64  | -     |
| price         | number  | Yes      | 0       | No    | 0   | -   | -     |
| image         | string  | Yes      | -       | No    | -   | 512 | URL to image |
| rating        | number  | No       | 0       | No    | 0   | 5   | -     |
| reviews       | number  | No       | 0       | No    | 0   | -   | -     |
| description   | string  | No       | -       | No    | -   | 2000| -     |
| inStock       | boolean | Yes      | true    | No    | -   | -   | -     |
| featured      | boolean | No       | false   | No    | -   | -   | -     |
| stock         | number  | No       | 0       | No    | 0   | -   | -     |

4. Create the following indexes for better performance:
   - Category index on the `category` field (key: `category_idx`, type: `key`, attributes: `category`)
   - Featured index on the `featured` field (key: `featured_idx`, type: `key`, attributes: `featured`)

5. Copy the Collection ID and update your `.env` file as `VITE_APPWRITE_PRODUCTS_COLLECTION_ID`

#### Orders Collection

1. Create a new collection named "Orders"
2. Add the following attributes:

| Attribute Name   | Type    | Required | Default | Array | Min | Max  | Notes |
|-----------------|---------|----------|---------|-------|-----|------|-------|
| userId          | string  | Yes      | -       | No    | -   | 128  | Clerk user ID |
| customerName    | string  | Yes      | -       | No    | -   | 256  | -     |
| customerEmail   | string  | Yes      | -       | No    | -   | 256  | -     |
| customerPhone   | string  | Yes      | -       | No    | -   | 32   | -     |
| address         | object  | Yes      | -       | No    | -   | -    | Shipping address |
| items           | object  | Yes      | -       | Yes   | -   | -    | Array of products |
| total           | number  | Yes      | 0       | No    | 0   | -    | Order total |
| status          | string  | Yes      | 'pending'| No   | -   | 32   | Order status |
| paymentStatus   | string  | Yes      | 'pending'| No   | -   | 32   | Payment status |
| paymentMethod   | string  | Yes      | -       | No    | -   | 64   | -     |
| createdAt       | string  | Yes      | -       | No    | -   | 64   | ISO date string |
| trackingNumber  | string  | No       | -       | No    | -   | 64   | -     |
| estimatedDelivery| string | No       | -       | No    | -   | 64   | ISO date string |
| lastUpdated     | string  | No       | -       | No    | -   | 64   | ISO date string |
| notes           | string  | No       | -       | No    | -   | 1000 | -     |

3. Create these indexes:
   - User ID index on the `userId` field (key: `user_idx`, type: `key`, attributes: `userId`)
   - Status index on the `status` field (key: `status_idx`, type: `key`, attributes: `status`)
   - Date index on the `createdAt` field (key: `date_idx`, type: `key`, attributes: `createdAt`)

4. Copy the Collection ID and update your `.env` file as `VITE_APPWRITE_ORDERS_COLLECTION_ID`

#### Users Collection

1. Create a new collection named "Users"
2. Add the following attributes:

| Attribute Name | Type    | Required | Default | Array | Min | Max | Notes |
|---------------|---------|----------|---------|-------|-----|-----|-------|
| email         | string  | Yes      | -       | No    | -   | 256 | User's email |
| role          | string  | Yes      | 'customer'| No  | -   | 32  | 'admin' or 'customer' |
| name          | string  | No       | -       | No    | -   | 256 | -     |
| phone         | string  | No       | -       | No    | -   | 32  | -     |
| address       | object  | No       | -       | No    | -   | -   | User's address |
| createdAt     | string  | Yes      | -       | No    | -   | 64  | ISO date string |
| lastLogin     | string  | Yes      | -       | No    | -   | 64  | ISO date string |

3. Create an index on the `email` field for lookups (key: `email_idx`, type: `unique`, attributes: `email`)

4. Copy the Collection ID and update your `.env` file as `VITE_APPWRITE_USERS_COLLECTION_ID`

### 4. Create a Storage Bucket

1. Go to Storage in the Appwrite Console
2. Create a new bucket for storing product images
3. Configure permissions based on your needs (public read, authenticated uploads)
4. Copy the Bucket ID and update your `.env` file as `VITE_APPWRITE_BUCKET_ID`

## Paystack Setup

1. Create a Paystack account at [https://dashboard.paystack.com/](https://dashboard.paystack.com/)
2. Go to Settings > API Keys
3. Copy your Paystack Public Key
4. Add it to your `.env` file as `VITE_PAYSTACK_PUBLIC_KEY`

## Running the Application

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Initial Data Setup

For the initial development setup, you can load sample products into your Appwrite database:

1. Log in to the application with an email containing "admin" to get admin privileges
2. Navigate to the admin dashboard
3. Add products using the admin interface

## Admin Access

- Any user with an email containing "admin" will automatically get admin access
- Admins can manage products, view orders, and perform administrative tasks

## Troubleshooting

### Clerk Integration Issues

- Ensure your Clerk publishable key is correct
- Check that you've configured the required social providers
- Verify that the Clerk authentication routes are properly set up

### Appwrite Connection Issues

- Verify your Appwrite project and collection IDs
- Check that your collections have the correct attributes and indexes
- Ensure your security rules permit the required operations

### Order Processing Issues

- Check that the Paystack integration is correctly configured
- Verify that order notifications are properly set up
- Ensure user profiles are being created when users register

## Support

For additional help, please reach out to our support team.
