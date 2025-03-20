import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Package, Truck, Check, Clock, ArrowLeft, DollarSign } from "lucide-react";
import { Id } from "../../convex/_generated/dataModel";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Clipboard, CheckCircle, ShoppingBag, AlertCircle } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useUser } from "@clerk/clerk-react";
import { isAuthorizedAdmin } from "@/config/admin";
import { Navigate } from "react-router-dom";

const OrderDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useUser();
    const [newStatus, setNewStatus] = useState<string>("");

    // Check if user is authorized admin
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    if (!userEmail || !isAuthorizedAdmin(userEmail)) {
        toast({
            title: "Access Denied",
            description: "You don't have permission to access this page.",
            variant: "destructive",
        });
        return <Navigate to="/" replace />;
    }

    // Fetch order data with proper error handling
    const order = useQuery(api.orders.getOrder, {
        id: id as Id<"orders">
    });

    const products = useQuery(api.products.getProducts);
    const updateOrderStatus = useMutation(api.orders.updateOrderStatus);

    // Set the initial status once order data is loaded
    useEffect(() => {
        if (order && order.status) {
            setNewStatus(order.status);
        }
    }, [order]);

    if (!order || !products) {
        return (
            <>
                <Navbar />
                <div className="container mx-auto p-6 mt-24">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                        <div className="space-y-4">
                            <div className="h-40 bg-gray-200 rounded"></div>
                            <div className="h-40 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    const handleStatusUpdate = async () => {
        try {
            await updateOrderStatus({
                id: id as Id<"orders">,
                status: newStatus as "pending" | "processing" | "shipped" | "delivered",
            });
            toast({
                title: "Status updated",
                description: `Order status updated to ${newStatus}`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update order status",
                variant: "destructive",
            });
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-5 w-5 text-yellow-500" />;
            case 'processing':
                return <Package className="h-5 w-5 text-blue-500" />;
            case 'shipped':
                return <Truck className="h-5 w-5 text-purple-500" />;
            case 'delivered':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            default:
                return <AlertCircle className="h-5 w-5 text-red-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
                return 'bg-purple-100 text-purple-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            case 'refunded':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-6 mt-24">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Order Details</h1>
                        <Button variant="outline" onClick={() => navigate(-1)}>
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Button>
                    </div>

                    {/* Order Status Banner */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className={`rounded-full p-3 ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Current Status</p>
                                    <p className="text-xl font-semibold capitalize">{order.status}</p>
                                </div>
                            </div>

                            {/* Admin Status Update */}
                            <div className="flex items-center space-x-4">
                                <Select
                                    value={newStatus}
                                    onValueChange={(value) => setNewStatus(value)}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Update status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="processing">Processing</SelectItem>
                                        <SelectItem value="shipped">Shipped</SelectItem>
                                        <SelectItem value="delivered">Delivered</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleStatusUpdate}>
                                    Update Status
                                </Button>
                            </div>
                        </div>

                        {/* Payment Status Display */}
                        <div className="mt-6 flex items-center">
                            <div className="flex items-center space-x-4">
                                <div className={`rounded-full p-3 ${getPaymentStatusColor(order.paymentStatus || 'pending')}`}>
                                    <DollarSign className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Payment Status</p>
                                    <p className="text-xl font-semibold capitalize">{order.paymentStatus || 'pending'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Progress Steps */}
                        <div className="mt-6">
                            <div className="relative">
                                <div className="overflow-hidden h-2 mb-6 text-xs flex rounded bg-gray-200">
                                    <div
                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gold-400"
                                        style={{
                                            width: `${order.status === 'delivered' ? '100%' :
                                                order.status === 'shipped' ? '75%' :
                                                    order.status === 'processing' ? '50%' :
                                                        '25%'
                                                }`
                                        }}
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <div className={`flex flex-col items-center ${order.status !== 'pending' ? 'text-gold-500' : 'text-gray-400'}`}>
                                        <div className={`rounded-full w-8 h-8 flex items-center justify-center border-2 ${order.status !== 'pending' ? 'border-gold-500 bg-gold-100' : 'border-gray-300'}`}>
                                            <Clock className="h-4 w-4" />
                                        </div>
                                        <span className="text-xs mt-1">Pending</span>
                                    </div>
                                    <div className={`flex flex-col items-center ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'text-gold-500' : 'text-gray-400'}`}>
                                        <div className={`rounded-full w-8 h-8 flex items-center justify-center border-2 ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'border-gold-500 bg-gold-100' : 'border-gray-300'}`}>
                                            <Package className="h-4 w-4" />
                                        </div>
                                        <span className="text-xs mt-1">Processing</span>
                                    </div>
                                    <div className={`flex flex-col items-center ${['shipped', 'delivered'].includes(order.status) ? 'text-gold-500' : 'text-gray-400'}`}>
                                        <div className={`rounded-full w-8 h-8 flex items-center justify-center border-2 ${['shipped', 'delivered'].includes(order.status) ? 'border-gold-500 bg-gold-100' : 'border-gray-300'}`}>
                                            <Truck className="h-4 w-4" />
                                        </div>
                                        <span className="text-xs mt-1">Shipped</span>
                                    </div>
                                    <div className={`flex flex-col items-center ${order.status === 'delivered' ? 'text-gold-500' : 'text-gray-400'}`}>
                                        <div className={`rounded-full w-8 h-8 flex items-center justify-center border-2 ${order.status === 'delivered' ? 'border-gold-500 bg-gold-100' : 'border-gray-300'}`}>
                                            <Check className="h-4 w-4" />
                                        </div>
                                        <span className="text-xs mt-1">Delivered</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Customer Information */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
                            <div className="space-y-3">
                                <p><span className="text-gray-500">Name:</span> {order.shippingAddress.name}</p>
                                <p><span className="text-gray-500">Email:</span> {order.shippingAddress.email}</p>
                                <p><span className="text-gray-500">Phone:</span> {order.shippingAddress.phone}</p>
                            </div>
                        </div>

                        {/* Shipping Information */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                            <div className="space-y-3">
                                <p>{order.shippingAddress.address}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <h2 className="text-xl font-semibold p-6 border-b">Order Items</h2>
                        <div className="divide-y">
                            {order.items.map((item) => {
                                const product = products.find(p => p._id === item.productId);
                                return (
                                    <div key={item.productId} className="p-6 flex items-center gap-4">
                                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50">
                                            <img
                                                src={product?.image || 'https://via.placeholder.com/80'}
                                                alt={product?.name || 'Product'}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-medium">{product?.name || 'Product'}</h3>
                                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                                            <p className="text-sm text-gray-500">{formatCurrency(item.price)} each</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="p-6 border-t">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-500">Order Total</p>
                                    <p className="text-2xl font-bold">{formatCurrency(order.total)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Order ID</p>
                                    <div className="flex items-center gap-2">
                                        <code className="text-sm font-mono">{order._id}</code>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(order._id);
                                                            toast({
                                                                title: "Copied",
                                                                description: "Order ID copied to clipboard",
                                                            });
                                                        }}
                                                    >
                                                        <Clipboard className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Copy Order ID</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderDetail; 