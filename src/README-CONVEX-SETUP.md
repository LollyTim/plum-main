
# Convex Setup Guide

This guide will help you set up Convex for your e-commerce application.

## Prerequisites

1. Node.js and npm/yarn installed
2. A Convex account (https://convex.dev)

## Setup Steps

### 1. Create a Convex Project

1. Sign up for a Convex account at https://dashboard.convex.dev
2. Create a new project from the dashboard
3. Note your project ID and deployment URL

### 2. Configure Environment Variables

Create a `.env` file in the root of your project with the following:

```
VITE_CONVEX_URL=https://your-deployment-url.convex.cloud
```

Replace `your-deployment-url` with the deployment URL from your Convex project dashboard.

### 3. Update convex.json

Edit the `convex.json` file in the root of your project:

```json
{
  "project": {
    "orgId": "your_org_id",
    "projectId": "your_project_id"
  },
  "functions": {
    "runtime": "v8",
    "memory": "256mb",
    "entrypoint": "dist/functions.js",
    "prelude": "dist/prelude.js"
  },
  "deployment": {
    "url": "https://your-deployment-url.convex.cloud"
  }
}
```

Replace:
- `your_org_id` with your Convex organization ID
- `your_project_id` with your Convex project ID
- `your-deployment-url` with your deployment URL

### 4. Install Convex CLI

```bash
npm install -g convex
```

### 5. Log in to Convex

```bash
npx convex login
```

### 6. Push the Convex Schema

```bash
npx convex dev
```

This will start the Convex development server and push your schema to the cloud.

## Data Structure

The application uses the following Convex tables:

1. **products** - Store product information
   - name: string
   - category: string
   - price: number
   - description: string
   - stock: number
   - image: string
   - featured: boolean (optional)
   - discount: number (optional)
   - rating: number (optional)
   - reviews: number (optional)
   - inStock: boolean (optional)
   - createdAt: string
   - updatedAt: string (optional)

2. **orders** - Store customer orders
   - userId: string
   - items: array of items
   - shipping: shipping information
   - payment: payment information (optional)
   - status: string
   - total: number
   - subtotal: number
   - tax: number (optional)
   - shipping_fee: number (optional)
   - tracking_number: string (optional)
   - delivery_date: string (optional)
   - notes: string (optional)
   - createdAt: string
   - updatedAt: string (optional)
   - customerName: string (optional)
   - customerEmail: string (optional)
   - customerPhone: string (optional)
   - address: address information (optional)
   - paymentMethod: string (optional)
   - paymentStatus: string (optional)
   - trackingNumber: string (optional)
   - estimatedDelivery: string (optional)
   - lastUpdated: string (optional)

3. **users** - Store user profiles
   - email: string
   - name: string (optional)
   - userId: string (Clerk user ID)
   - role: string
   - phone: string (optional)
   - address: address information (optional)
   - createdAt: string
   - lastLogin: string

4. **notifications** - Store order notifications
   - orderId: string
   - message: string
   - read: boolean
   - createdAt: string
   - type: string

## Admin Setup

To set up an admin account:

1. Create a regular user account using Clerk authentication
2. Go to your Convex dashboard and navigate to the "Data" tab
3. Find the user in the "users" table and edit the record
4. Change the "role" field from "customer" to "admin"
5. Save the changes

Alternatively, you can use the Admin page's "Test Data" tab to generate dummy users, and approximately 1 in 5 will be assigned as admins automatically.

## Generating Test Data

The application includes a utility for generating test data:

1. Log in as an admin
2. Go to the Admin dashboard
3. Navigate to the "Test Data" tab
4. Use the forms to generate products and users as needed

## Troubleshooting

1. **Schema Changes**: If you modify the schema in `convex/schema.ts`, you need to run `npx convex dev` again to update your database.

2. **Authentication Issues**: Ensure your Clerk integration is properly set up and that user IDs are being correctly passed to Convex.

3. **Data Access Issues**: Check the Convex dashboard logs for any permission or data access errors.

4. **Missing Dependencies**: Ensure all required packages are installed by running `npm install` or `yarn install`.

For more help, refer to the Convex documentation at https://docs.convex.dev/
