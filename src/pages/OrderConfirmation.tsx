import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useConvex } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clipboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { CheckCircle2 } from 'lucide-react';

type Order = {
  _id: Id<"orders">;
  _creationTime: number;
  userId: string;
  items: {
    productId: Id<"products">;
    quantity: number;
    price: number;
  }[];
  total: number;
  shippingAddress: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  status: "pending" | "processing" | "shipped" | "delivered";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod?: string;
  paymentReference?: string;
  paymentDate?: string;
  createdAt: string;
};

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const convex = useConvex();
  const { toast } = useToast();

  // Fetch order data if order ID is available
  const { data: order, isLoading, error } = useQuery<Order | null>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) return null;
      return await convex.query(api.orders.getOrder, { id: orderId as Id<"orders"> });
    },
    enabled: !!orderId
  });

  const copyOrderId = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId);
      toast({
        title: "Order ID copied!",
        description: "The order ID has been copied to your clipboard.",
      });
    }
  };

  const getDisplayOrderId = () => {
    if (!orderId) return "Unknown";
    if (orderId.length > 8) {
      return `...${orderId.slice(-8)}`;
    }
    return orderId;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
            <Button onClick={() => navigate('/shop')}>Continue Shopping</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been received and is now being processed.
          </p>

          <div className="border-t border-b py-4 my-4">
            <div className="flex items-center justify-center mb-2">
              <h2 className="text-sm font-medium text-gray-500 mr-2">ORDER NUMBER:</h2>
              <div className="flex items-center">
                <span className="font-mono">{getDisplayOrderId()}</span>
                {orderId && (
                  <button
                    onClick={copyOrderId}
                    className="ml-2 text-gray-400 hover:text-gray-600"
                  >
                    <Clipboard className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            {order.createdAt && (
              <p className="text-sm text-gray-500">
                {format(new Date(order.createdAt), 'MMMM d, yyyy')}
              </p>
            )}
          </div>

          <p className="text-gray-600 mb-6">
            We've sent a confirmation email to your email address with the order details.
          </p>

          <div className="space-y-4">
            <Button
              className="w-full bg-gold-400 hover:bg-gold-500"
              onClick={() => navigate(orderId ? `/order-tracking/${orderId}` : '/order-tracking')}
            >
              Track Order
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/shop')}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
