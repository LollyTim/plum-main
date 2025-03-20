// app/types/product.ts
export interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  stock: number;
  image: string;
  featured: boolean;
  discount: number;
  rating: number;
  reviews: number;
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shipping: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  payment?: {
    method: string;
    transactionId?: string;
    status: "pending" | "completed" | "failed";
  };
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  subtotal: number;
  tax?: number;
  shipping_fee?: number;
  tracking_number?: string;
  delivery_date?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod?: string;
  paymentStatus?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  lastUpdated?: string;
}

export interface OrderNotification {
  id: string;
  orderId: string;
  message: string;
  read: boolean;
  createdAt: string;
  type:
    | "order_placed"
    | "order_shipped"
    | "order_delivered"
    | "payment_received";
}
