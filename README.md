
# Polymer Gift Store

A full-featured e-commerce application built with React, TypeScript, Tailwind CSS, and Appwrite backend.

![Polymer Gift Store Screenshot](public/og-image.png)

## Features

- 🛍️ Product catalog with categories and filtering
- 🔍 Product search and detailed product pages
- 🛒 Shopping cart functionality
- 💳 Checkout flow with PayStack integration
- 👤 User authentication with Clerk
- 📦 Order tracking and history
- 🔐 Admin dashboard for product and order management
- 📱 Fully responsive design 
- 🎨 Modern UI with Tailwind CSS and shadcn/ui components

## Setup Instructions

### Prerequisites

- Node.js v16+ and npm/yarn/pnpm
- Appwrite account (for backend)
- Clerk account (for authentication)
- PayStack account (for payment processing)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Clerk (Authentication)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key

# Appwrite (Backend)
VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
VITE_APPWRITE_DATABASE_ID=your_appwrite_database_id
VITE_APPWRITE_PRODUCTS_COLLECTION_ID=your_products_collection_id
VITE_APPWRITE_ORDERS_COLLECTION_ID=your_orders_collection_id
VITE_APPWRITE_USERS_COLLECTION_ID=your_users_collection_id
VITE_APPWRITE_BUCKET_ID=your_bucket_id

# PayStack (Payments)
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_key
```

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/polymer-gift-store.git
   cd polymer-gift-store
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Appwrite Setup Guide

### 1. Create an Appwrite Project

1. Sign up or log in to [Appwrite Console](https://cloud.appwrite.io/)
2. Create a new project and name it (e.g., "Polymer Gift Store")
3. Set the platform to "Web App"
4. Add your localhost URL as a platform (e.g., http://localhost:5173)

### 2. Create a Database

1. Go to Databases and create a new database (e.g., "polymer-store")
2. Note down the Database ID for your `.env.local` file

### 3. Create Collections

You need to create the following collections:

#### Products Collection

1. Create a new collection named "products"
2. Set up the following attributes:
   - `name` (string, required)
   - `category` (string, required)
   - `price` (number, required)
   - `image` (string, required)
   - `rating` (number, default: 0)
   - `reviews` (number, default: 0)
   - `description` (string)
   - `inStock` (boolean, default: true)
   - `featured` (boolean, default: false)
   - `stock` (number, default: 0)

3. Set the required permissions (read: everyone, write: admins only)

#### Orders Collection

1. Create a new collection named "orders"
2. Set up the following attributes:
   - `userId` (string, required)
   - `customerName` (string, required)
   - `customerEmail` (string, required)
   - `customerPhone` (string, required)
   - `address` (object, required)
     - `street` (string)
     - `city` (string)
     - `state` (string)
     - `zipCode` (string)
     - `country` (string)
   - `items` (array of objects, required)
     - Each item should have: id, name, price, quantity, image
   - `total` (number, required)
   - `status` (string, enum: 'pending', 'processing', 'shipped', 'delivered', 'cancelled')
   - `paymentStatus` (string, enum: 'pending', 'paid', 'failed')
   - `paymentMethod` (string)
   - `createdAt` (string, ISO date)
   - `trackingNumber` (string)
   - `estimatedDelivery` (string, ISO date)
   - `lastUpdated` (string, ISO date)
   - `notes` (string)

3. Set appropriate permissions (read: user's own documents, write: authenticated users for creation)

#### Users Collection

1. Create a new collection named "users"
2. Set up the following attributes:
   - `email` (string, required, unique)
   - `role` (string, default: 'customer')
   - `name` (string)
   - `phone` (string)
   - `address` (object)
   - `createdAt` (string, ISO date)
   - `lastLogin` (string, ISO date)

3. Set appropriate permissions (read: user's own document, write: user's own document)

### 4. Create a Storage Bucket

1. Go to Storage and create a new bucket for product images
2. Set permissions (read: everyone, write: admins only)
3. Note down the Bucket ID for your `.env.local` file

### 5. Set up Indexes for Performance

For each collection, create appropriate indexes:
- Products: category, featured
- Orders: userId, status
- Users: email

### 6. Clerk Integration

1. Sign up for [Clerk](https://clerk.dev/) and create a new application
2. Configure your Clerk application for email/password and/or social logins
3. Copy your Publishable Key from the Clerk dashboard to your `.env.local` file

### 7. PayStack Integration

1. Sign up for [PayStack](https://paystack.com/)
2. Get your test API keys from the PayStack dashboard
3. Add your Publishable Key to the `.env.local` file

## Admin Access

To designate a user as an admin:

1. Create a user via the Clerk signup flow
2. In the Appwrite console, manually set their `role` to "admin" in the Users collection
   OR
3. For development testing, use an email containing "admin" (e.g., admin@example.com)

## Project Structure

```
polymer-gift-store/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── admin/          # Admin-specific components
│   │   ├── payment/        # Payment-related components
│   │   └── ui/             # UI component library (shadcn/ui)
│   ├── context/            # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities and service connections
│   ├── pages/              # Application pages/routes
│   │   └── auth/           # Authentication pages
│   ├── services/           # API service functions
│   └── types/              # TypeScript type definitions
└── ...                     # Config files
```

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Ensure your Clerk publishable key is correctly set in `.env.local`
   - Check that your application's URL is added to Clerk's allowed origins

2. **Database Connection Issues**
   - Verify all Appwrite credentials in `.env.local`
   - Ensure collections have proper attributes and indexes

3. **Payment Processing Problems**
   - Check that your PayStack API key is correctly set
   - Verify your PayStack account is properly configured for test payments

## Deployment

This application can be deployed to any static site hosting service:

1. Build the application:
   ```
   npm run build
   ```

2. Deploy the contents of the `dist` directory to your preferred hosting provider (Vercel, Netlify, etc.)

3. Update your Appwrite and Clerk settings to include your production domain

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
