import React, { useState } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useConvex } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { useUser as useClerkUser } from '@clerk/clerk-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  ChevronLeft,
  Package,
  Truck,
  Check,
  Clock,
  AlertTriangle,
  Info,
  MapPin,
  Receipt,
  User,
  Phone,
  Mail,
  CalendarClock,
  CheckCircle,
  X,
  AlertCircle,
  DollarSign
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { cn, formatCurrency } from '@/lib/utils';

// Fix Order type to match the actual structure
type OrderItem = {
  productId: Id<"products">;
  quantity: number;
  price: number;
  // Add product info that will be populated
  name?: string;
  image?: string;
};

type Order = {
  _id: Id<"orders">;
  _creationTime?: number;
  userId: string;
  items: OrderItem[];
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
  paymentStatus?: "pending" | "paid" | "failed" | "refunded";
  paymentMethod?: string;
  paymentReference?: string;
  paymentDate?: string;
  createdAt: string;
};

const OrderTracking = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user, isLoaded } = useClerkUser();
  const [activeTab, setActiveTab] = useState('details');
  const { toast } = useToast();
  const convex = useConvex();

  // Fetch order data using convex query
  const { data: order, isLoading, error } = useQuery<Order | null>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      if (!orderId) return null;
      return await convex.query(api.orders.getOrder, { id: orderId as Id<"orders"> });
    },
    enabled: !!orderId
  });

  if (!isLoaded) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="flex-grow py-20 px-6 mt-16">
          <div className="container mx-auto max-w-4xl">
            <p className="text-center">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  // If the order is loaded but doesn't belong to the current user, redirect
  if (order && order.userId !== user.id && !window.location.pathname.includes('/admin')) {
    toast({
      title: "Access denied",
      description: "You don't have permission to view this order.",
      variant: "destructive"
    });
    return <Navigate to="/account" replace />;
  }

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 3;
      default:
        return 0;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500 bg-yellow-100';
      case 'processing':
        return 'text-blue-500 bg-blue-100';
      case 'shipped':
        return 'text-purple-500 bg-purple-100';
      case 'delivered':
        return 'text-green-500 bg-green-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'processing':
        return <Package className="h-5 w-5" />;
      case 'shipped':
        return <Truck className="h-5 w-5" />;
      case 'delivered':
        return <Check className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500 bg-yellow-100';
      case 'paid':
        return 'text-green-500 bg-green-100';
      case 'failed':
        return 'text-red-500 bg-red-100';
      case 'refunded':
        return 'text-blue-500 bg-blue-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5" />;
      case 'paid':
        return <CheckCircle className="h-5 w-5" />;
      case 'failed':
        return <X className="h-5 w-5" />;
      case 'refunded':
        return <DollarSign className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getEstimatedDeliveryDate = (order: Order) => {
    if (order.status === 'delivered') {
      return 'Delivered';
    }

    const createdDate = new Date(order.createdAt);

    switch (order.status) {
      case 'pending':
        return format(addDays(createdDate, 7), 'PPP');
      case 'processing':
        return format(addDays(createdDate, 5), 'PPP');
      case 'shipped':
        return format(addDays(createdDate, 2), 'PPP');
      default:
        return format(addDays(createdDate, 7), 'PPP');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-grow py-20 px-6 mt-16">
        <div className="container mx-auto max-w-4xl">
          <Button
            variant="ghost"
            className="mb-6 flex items-center text-gray-600 hover:text-gold-500"
            asChild
          >
            <Link to="/account">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Account
            </Link>
          </Button>

          <h1 className="text-3xl font-bold mb-6">Order Tracking</h1>

          {isLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>
          ) : error || !order ? (
            <Card>
              <CardHeader>
                <CardTitle>Order Not Found</CardTitle>
                <CardDescription>We couldn't find the order you're looking for.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-red-500">The order may have been deleted or you might not have permission to view it.</p>
              </CardContent>
              <CardFooter>
                <Button
                  className="bg-gold-400 hover:bg-gold-500 text-white"
                  asChild
                >
                  <Link to="/account">Back to Account</Link>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <>
              {/* Order Status Banner */}
              <div className="mb-6 px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className={`rounded-full p-2 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <h2 className="text-sm font-medium text-gray-700">Current Status</h2>
                    <p className="text-lg font-semibold capitalize">{order.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-sm font-medium text-gray-700">Est. Delivery</h2>
                  <p className="text-lg font-semibold">{getEstimatedDeliveryDate(order)}</p>
                </div>
              </div>

              {/* Payment Status Banner */}
              <div className="mb-6 px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className={`rounded-full p-2 ${getPaymentStatusColor(order.paymentStatus || 'pending')}`}>
                    {getPaymentStatusIcon(order.paymentStatus || 'pending')}
                  </div>
                  <div>
                    <h2 className="text-sm font-medium text-gray-700">Payment Status</h2>
                    <p className="text-lg font-semibold capitalize">{order.paymentStatus || 'pending'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-sm font-medium text-gray-700">Payment Method</h2>
                  <p className="text-lg font-semibold">{order.paymentMethod || 'Unknown'}</p>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Order #{order._id.slice(-8)}</CardTitle>
                      <CardDescription>
                        Placed on {format(new Date(order.createdAt), 'PPP')}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-2 capitalize">{order.status}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="mb-8">
                    <div className="relative">
                      <div className="overflow-hidden h-2 mb-6 text-xs flex rounded bg-gray-200">
                        <div
                          className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gold-400`}
                          style={{ width: `${(getStatusStep(order.status) / 3) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between">
                        <div className={`flex flex-col items-center ${getStatusStep(order.status) >= 0 ? 'text-gold-500' : 'text-gray-400'}`}>
                          <div className={`rounded-full w-8 h-8 flex items-center justify-center border-2 ${getStatusStep(order.status) >= 0 ? 'border-gold-500 bg-gold-100' : 'border-gray-300'}`}>
                            <Clock className="h-4 w-4" />
                          </div>
                          <span className="text-xs mt-1">Pending</span>
                        </div>
                        <div className={`flex flex-col items-center ${getStatusStep(order.status) >= 1 ? 'text-gold-500' : 'text-gray-400'}`}>
                          <div className={`rounded-full w-8 h-8 flex items-center justify-center border-2 ${getStatusStep(order.status) >= 1 ? 'border-gold-500 bg-gold-100' : 'border-gray-300'}`}>
                            <Package className="h-4 w-4" />
                          </div>
                          <span className="text-xs mt-1">Processing</span>
                        </div>
                        <div className={`flex flex-col items-center ${getStatusStep(order.status) >= 2 ? 'text-gold-500' : 'text-gray-400'}`}>
                          <div className={`rounded-full w-8 h-8 flex items-center justify-center border-2 ${getStatusStep(order.status) >= 2 ? 'border-gold-500 bg-gold-100' : 'border-gray-300'}`}>
                            <Truck className="h-4 w-4" />
                          </div>
                          <span className="text-xs mt-1">Shipped</span>
                        </div>
                        <div className={`flex flex-col items-center ${getStatusStep(order.status) >= 3 ? 'text-gold-500' : 'text-gray-400'}`}>
                          <div className={`rounded-full w-8 h-8 flex items-center justify-center border-2 ${getStatusStep(order.status) >= 3 ? 'border-gold-500 bg-gold-100' : 'border-gray-300'}`}>
                            <Check className="h-4 w-4" />
                          </div>
                          <span className="text-xs mt-1">Delivered</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="details">
                        <Info className="h-4 w-4 mr-2" />
                        Details
                      </TabsTrigger>
                      <TabsTrigger value="address">
                        <MapPin className="h-4 w-4 mr-2" />
                        Shipping
                      </TabsTrigger>
                      <TabsTrigger value="items">
                        <Receipt className="h-4 w-4 mr-2" />
                        Items
                      </TabsTrigger>
                      <TabsTrigger value="timeline">
                        <CalendarClock className="h-4 w-4 mr-2" />
                        Timeline
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4 pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Order Number</h3>
                          <p>{order._id.slice(-8)}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Date Placed</h3>
                          <p>{format(new Date(order.createdAt), 'PPP')}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
                          <p>{formatCurrency(order.total)}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Payment Method</h3>
                          <p>{order.paymentMethod || 'Standard Payment'}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Payment Status</h3>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus || 'pending')}`}>
                              {getPaymentStatusIcon(order.paymentStatus || 'pending')}
                              <span className="ml-1 capitalize">{order.paymentStatus || 'pending'}</span>
                            </span>
                          </div>
                        </div>
                        {order.paymentReference && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Payment Reference</h3>
                            <p className="text-sm font-mono">{order.paymentReference}</p>
                          </div>
                        )}
                        {order.paymentDate && (
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Payment Date</h3>
                            <p>{format(new Date(order.paymentDate), 'PPP')}</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="address" className="space-y-4 pt-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="flex items-center text-sm font-medium text-gray-700 mb-3">
                          <MapPin className="h-4 w-4 mr-2" />
                          Shipping Address
                        </h3>
                        <p className="mt-1 text-gray-800 font-medium">{order.shippingAddress.name}</p>
                        <p className="text-gray-600">{order.shippingAddress.address}</p>
                        <p className="text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="flex items-center text-sm font-medium text-gray-700 mb-3">
                          <User className="h-4 w-4 mr-2" />
                          Contact Information
                        </h3>
                        <p className="flex items-center text-gray-600 mt-1">
                          <Mail className="h-4 w-4 mr-2" />
                          {order.shippingAddress.email}
                        </p>
                        <p className="flex items-center text-gray-600 mt-1">
                          <Phone className="h-4 w-4 mr-2" />
                          {order.shippingAddress.phone}
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="items" className="pt-4">
                      <div className="border rounded-md divide-y">
                        {order.items.map((item, index) => (
                          <div key={index} className="p-4 flex items-center">
                            <div className="w-16 h-16 rounded overflow-hidden mr-4 bg-gray-100">
                              <img src="https://via.placeholder.com/64" alt="Product" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow">
                              <h3 className="font-medium">Product ID: {item.productId.slice(-8)}</h3>
                              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                              <p className="text-sm text-gray-500">{formatCurrency(item.price)} each</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">{formatCurrency(order.total)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Shipping</span>
                          <span className="font-medium">Free</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                          <span>Total</span>
                          <span>{formatCurrency(order.total)}</span>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="timeline" className="pt-4">
                      <div className="space-y-4">
                        <div className="relative pb-8">
                          <div className="absolute left-4 top-0 bottom-0 -ml-px border-l-2 border-gray-200"></div>
                          <div className="flex items-start">
                            <div className="flex-shrink-0 bg-gold-500 rounded-full w-8 h-8 flex items-center justify-center z-10">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                            <div className="ml-4">
                              <h3 className="text-base font-medium">Order Placed</h3>
                              <p className="text-sm text-gray-500">{format(new Date(order.createdAt), 'PPP')}</p>
                              <p className="mt-1 text-sm text-gray-600">Your order has been received and is being prepared.</p>
                            </div>
                          </div>
                        </div>

                        {order.status !== 'pending' && (
                          <div className="relative pb-8">
                            <div className="absolute left-4 top-0 bottom-0 -ml-px border-l-2 border-gray-200"></div>
                            <div className="flex items-start">
                              <div className="flex-shrink-0 bg-gold-500 rounded-full w-8 h-8 flex items-center justify-center z-10">
                                <Package className="h-4 w-4 text-white" />
                              </div>
                              <div className="ml-4">
                                <h3 className="text-base font-medium">Processing</h3>
                                <p className="text-sm text-gray-500">{format(addDays(new Date(order.createdAt), 1), 'PPP')}</p>
                                <p className="mt-1 text-sm text-gray-600">Your order is being processed and packaged.</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {order.status === 'shipped' && (
                          <div className="relative pb-8">
                            <div className="absolute left-4 top-0 bottom-0 -ml-px border-l-2 border-gray-200"></div>
                            <div className="flex items-start">
                              <div className="flex-shrink-0 bg-gold-500 rounded-full w-8 h-8 flex items-center justify-center z-10">
                                <Truck className="h-4 w-4 text-white" />
                              </div>
                              <div className="ml-4">
                                <h3 className="text-base font-medium">Shipped</h3>
                                <p className="text-sm text-gray-500">{format(addDays(new Date(order.createdAt), 2), 'PPP')}</p>
                                <p className="mt-1 text-sm text-gray-600">Your order has been shipped and is on its way to you.</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {order.status === 'delivered' ? (
                          <div className="relative">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 bg-gold-500 rounded-full w-8 h-8 flex items-center justify-center z-10">
                                <Check className="h-4 w-4 text-white" />
                              </div>
                              <div className="ml-4">
                                <h3 className="text-base font-medium">Delivered</h3>
                                <p className="text-sm text-gray-500">{format(addDays(new Date(order.createdAt), 5), 'PPP')}</p>
                                <p className="mt-1 text-sm text-gray-600">Your order has been delivered. Enjoy!</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="relative">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center z-10">
                                <Check className="h-4 w-4 text-gray-400" />
                              </div>
                              <div className="ml-4">
                                <h3 className="text-base font-medium text-gray-400">Delivered</h3>
                                <p className="text-sm text-gray-400">Estimated: {getEstimatedDeliveryDate(order)}</p>
                                <p className="mt-1 text-sm text-gray-400">Your order will be delivered soon.</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>

                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    className="border-gold-300 text-gold-600 hover:bg-gold-50"
                    asChild
                  >
                    <Link to="/account">Back to Orders</Link>
                  </Button>

                  {order.status === 'delivered' && (
                    <Button className="bg-gold-400 hover:bg-gold-500 text-white">
                      Buy Again
                    </Button>
                  )}

                  {(order.status === 'pending' || order.status === 'processing') && (
                    <Button
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => {
                        toast({
                          title: "Feature coming soon",
                          description: "Cancel order functionality is under development.",
                        });
                      }}
                    >
                      Cancel Order
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderTracking;
