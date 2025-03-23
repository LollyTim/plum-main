// app/admin/page.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import ProductForm from "@/components/admin/ProductForm";
import { Edit, Trash2, Package, Search, Eye } from "lucide-react";
import { Id } from "../../convex/_generated/dataModel";
import { Product, Order } from "@/types/product";
import { Link, Navigate } from "react-router-dom";
import { formatCurrency } from '@/lib/utils';
import { useUser } from "@clerk/clerk-react";
import { isAuthorizedAdmin } from "@/config/admin";

export const ADMIN_EMAILS = [
  "ololadetimileyin3@gmail.com",
  "plumsurprises@gmail.com",
  "okorochukwujoy2020@gmail.com"
];

const Admin = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Id<"products"> | null>(null);

  // Check if user is authorized admin
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  if (!userEmail || !isAuthorizedAdmin(userEmail)) {
    toast({
      title: "Access Denied",
      description: "You don't have permission to access the admin page.",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }

  // Order management states
  const [orderIdToSearch, setOrderIdToSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [newOrderStatus, setNewOrderStatus] = useState<"pending" | "processing" | "shipped" | "delivered">("pending");

  // Fetch data from Convex
  const products = useQuery(api.products.getProducts) || [];
  const orders = useQuery(api.orders.getAllOrders) || [];
  const customers = useQuery(api.customers.getAllCustomers) || [];
  const users = useQuery(api.users.getAllUsers) || [];

  // Mutations
  const deleteProduct = useMutation(api.products.deleteProduct);
  const updateProduct = useMutation(api.products.updateProduct);
  const createProduct = useMutation(api.products.createProduct);
  const updateOrderStatus = useMutation(api.orders.updateOrderStatus);

  // Handle form submission
  const handleFormSubmit = async (data: any) => {
    try {
      if (currentProduct) {
        // Update product
        await updateProduct({ id: currentProduct._id, ...data });
        toast({
          title: "Product updated",
          description: "The product has been successfully updated.",
        });
      } else {
        // Add new product
        await createProduct(data);
        toast({
          title: "Product added",
          description: "The new product has been successfully added.",
        });
      }
      setIsFormOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the product. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle delete product
  const confirmDeleteProduct = async () => {
    if (productToDelete) {
      try {
        await deleteProduct({ id: productToDelete });
        toast({
          title: "Product deleted",
          description: "The product has been successfully deleted.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete the product. Please try again.",
          variant: "destructive",
        });
      }
      setProductToDelete(null);
    }
  };

  // Handle order search
  const handleOrderSearch = () => {
    if (!orderIdToSearch.trim()) {
      toast({
        title: "Error",
        description: "Please enter an order ID",
        variant: "destructive",
      });
      return;
    }

    const foundOrder = orders.find(order =>
      order._id === orderIdToSearch || order._id.toString().slice(-6) === orderIdToSearch
    );

    if (foundOrder) {
      // Transform database order to frontend Order type
      const transformedOrder: Order = {
        id: foundOrder._id.toString(),
        userId: foundOrder.userId,
        items: foundOrder.items.map(item => ({
          id: item.productId.toString(),
          name: products.find(p => p._id === item.productId)?.name || 'Unknown Product',
          price: item.price,
          quantity: item.quantity,
          image: products.find(p => p._id === item.productId)?.image
        })),
        shipping: {
          name: foundOrder.shippingAddress.name,
          address: foundOrder.shippingAddress.address,
          city: foundOrder.shippingAddress.city,
          state: foundOrder.shippingAddress.state,
          zipCode: foundOrder.shippingAddress.zipCode,
          country: 'US', // Default value since it's not in the schema
          phone: foundOrder.shippingAddress.phone,
        },
        status: foundOrder.status,
        total: foundOrder.total,
        subtotal: foundOrder.total, // We don't have subtotal in schema
        createdAt: foundOrder.createdAt,
        customerEmail: foundOrder.shippingAddress.email,
        customerName: foundOrder.shippingAddress.name,
        customerPhone: foundOrder.shippingAddress.phone,
      };

      setSelectedOrder(transformedOrder);
      setIsOrderDetailOpen(true);
      setNewOrderStatus(foundOrder.status);
    } else {
      toast({
        title: "Not found",
        description: "No order found with the provided ID.",
        variant: "destructive",
      });
    }
  };

  // Handle order status update
  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newOrderStatus) return;

    try {
      await updateOrderStatus({
        id: selectedOrder.id as Id<"orders">,
        status: newOrderStatus,
      });
      toast({
        title: "Status updated",
        description: `Order status updated to ${newOrderStatus}.`,
      });
      setIsOrderDetailOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    }
  };

  // View order details
  const viewOrderDetails = (order) => {
    if (!products || !order) return;

    try {
      // Transform database order to frontend Order type
      const transformedOrder = {
        id: order._id,
        userId: order.userId,
        items: order.items.map(item => ({
          id: item.productId,
          name: products.find(p => p._id === item.productId)?.name || 'Unknown Product',
          price: item.price,
          quantity: item.quantity,
          image: products.find(p => p._id === item.productId)?.image || ''
        })),
        shipping: {
          name: order.shippingAddress.name,
          address: order.shippingAddress.address,
          city: order.shippingAddress.city,
          state: order.shippingAddress.state,
          zipCode: order.shippingAddress.zipCode,
          country: 'US', // Default value since it's not in the schema
          phone: order.shippingAddress.phone,
        },
        status: order.status,
        total: order.total,
        subtotal: order.total, // We don't have subtotal in schema
        createdAt: order.createdAt,
        customerEmail: order.shippingAddress.email,
        customerName: order.shippingAddress.name,
        customerPhone: order.shippingAddress.phone,
      };

      setSelectedOrder(transformedOrder);
      setNewOrderStatus(order.status);
      setIsOrderDetailOpen(true);
    } catch (error) {
      console.error("Error transforming order data:", error);
      toast({
        title: "Error",
        description: "Failed to load order details. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <Tabs defaultValue="products" className="w-full">
          <div className="border-b">
            <TabsList className="flex w-full h-14 bg-gray-50">
              <TabsTrigger
                value="products"
                className="flex-1 h-full data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-gold-400 data-[state=active]:shadow-none rounded-none font-medium text-gray-600"
              >
                Products
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="flex-1 h-full data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-gold-400 data-[state=active]:shadow-none rounded-none font-medium text-gray-600"
              >
                Orders
              </TabsTrigger>
              <TabsTrigger
                value="customers"
                className="flex-1 h-full data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-gold-400 data-[state=active]:shadow-none rounded-none font-medium text-gray-600"
              >
                Customers
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="flex-1 h-full data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-gold-400 data-[state=active]:shadow-none rounded-none font-medium text-gray-600"
              >
                Users
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Products Tab */}
          <TabsContent value="products" className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Manage Products</h2>
              <Button onClick={() => setIsFormOpen(true)} className="bg-gold-400 hover:bg-gold-500 text-white">
                Add Product
              </Button>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold">Image</TableHead>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="font-semibold">Price</TableHead>
                    <TableHead className="font-semibold">Stock</TableHead>
                    <TableHead className="font-semibold">Featured</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product._id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="w-10 h-10 rounded overflow-hidden bg-gray-100">
                          <img
                            src={product.image || 'https://via.placeholder.com/40'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        {product.featured ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gold-100 text-gold-800">
                            Featured
                          </span>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setCurrentProduct(product);
                              setIsFormOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setProductToDelete(product._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Manage Orders</h2>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter Order ID"
                  value={orderIdToSearch}
                  onChange={(e) => setOrderIdToSearch(e.target.value)}
                  className="w-64"
                />
                <Button onClick={handleOrderSearch}>
                  <Search className="h-4 w-4 mr-2" /> Search
                </Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold">Order ID</TableHead>
                    <TableHead className="font-semibold">Customer</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Total</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">{order._id.slice(-6)}</TableCell>
                      <TableCell>{order.shippingAddress?.name || order.userId}</TableCell>
                      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${order.status === "delivered" ? "bg-green-100 text-green-800" :
                          order.status === "shipped" ? "bg-blue-100 text-blue-800" :
                            order.status === "processing" ? "bg-yellow-100 text-yellow-800" :
                              "bg-gray-100 text-gray-800"
                          }`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewOrderDetails(order)}
                          >
                            <Package className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                          >
                            <Link to={`/admin/order/${order._id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Manage Customers</h2>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Phone</TableHead>
                    <TableHead className="font-semibold">Address</TableHead>
                    <TableHead className="font-semibold">Orders</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell className="truncate max-w-xs">{customer.address}</TableCell>
                      <TableCell>
                        {orders.filter(o => o.userId === customer._id).length || 0}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Manage Users</h2>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Role</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Last Login</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${user.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                            }`}
                        >
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date().toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentProduct ? "Edit Product" : "Add Product"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={currentProduct}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Order Detail Dialog */}
      <Dialog open={isOrderDetailOpen} onOpenChange={setIsOrderDetailOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Order Details</DialogTitle>
            <DialogDescription>
              View and manage order information
            </DialogDescription>
            <div className="mt-4">
              <Button variant="outline" asChild>
                <Link to={`/admin/order/${selectedOrder?.id}`}>
                  View Full Page
                </Link>
              </Button>
            </div>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-8">
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3">Order Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-medium">{selectedOrder.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span>{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-medium">${selectedOrder.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${selectedOrder.status === "delivered" ? "bg-green-100 text-green-800" :
                          selectedOrder.status === "shipped" ? "bg-blue-100 text-blue-800" :
                            selectedOrder.status === "processing" ? "bg-yellow-100 text-yellow-800" :
                              "bg-gray-100 text-gray-800"
                          }`}>
                          {selectedOrder.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${selectedOrder.paymentStatus === "paid" ? "bg-green-100 text-green-800" :
                          selectedOrder.paymentStatus === "pending" ? "bg-yellow-100 text-yellow-800" :
                            selectedOrder.paymentStatus === "failed" ? "bg-red-100 text-red-800" :
                              selectedOrder.paymentStatus === "refunded" ? "bg-blue-100 text-blue-800" :
                                "bg-gray-100 text-gray-800"
                          }`}>
                          {selectedOrder.paymentStatus || "pending"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3">Customer Information</h3>
                    <div className="space-y-2">
                      <p><span className="text-gray-600">Name:</span> {selectedOrder.shipping.name}</p>
                      <p><span className="text-gray-600">Email:</span> {selectedOrder.customerEmail}</p>
                      <p><span className="text-gray-600">Phone:</span> {selectedOrder.shipping.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3">Shipping Address</h3>
                    <div className="space-y-2">
                      <p>{selectedOrder.shipping.address}</p>
                      <p>{selectedOrder.shipping.city}, {selectedOrder.shipping.state} {selectedOrder.shipping.zipCode}</p>
                      <p>{selectedOrder.shipping.country}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3">Update Status</h3>
                    <div className="space-y-4">
                      <Select
                        value={newOrderStatus}
                        onValueChange={(value: "pending" | "processing" | "shipped" | "delivered") => setNewOrderStatus(value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        className="w-full bg-gold-400 hover:bg-gold-500 text-white"
                        onClick={handleStatusUpdate}
                      >
                        Update Status
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Order Items</h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <div className="divide-y">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="p-4 flex items-center gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-white">
                          <img
                            src={item.image || 'https://via.placeholder.com/80'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-500">SKU: {item.id}</p>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                          <p className="text-sm text-gray-500">{formatCurrency(item.price)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span>${selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsOrderDetailOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={productToDelete !== null}
        onOpenChange={() => setProductToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={confirmDeleteProduct}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;