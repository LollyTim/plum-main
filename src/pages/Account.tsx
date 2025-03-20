import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SignedIn, SignedOut, useUser, useClerk } from '@clerk/clerk-react';
import { useQuery as useConvexQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
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
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

const Account = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [activeTab, setActiveTab] = useState('profile');

  // Get user profile from Clerk
  const clerkUserId = user?.id;

  // Fetch orders directly from Convex
  const orders = useConvexQuery(api.orders.getCustomerOrders, { userId: clerkUserId || "" });
  const isLoadingOrders = orders === undefined;

  const handleSignOut = async () => {
    await signOut();
  };

  if (!isLoaded) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="flex-grow py-20 px-6 mt-16">
          <div className="container mx-auto max-w-5xl">
            <p className="text-center">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-grow py-20 px-6 mt-16">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold mb-8">My Account</h1>

          <SignedOut>
            <Navigate to="/sign-in" replace />
          </SignedOut>

          <SignedIn>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-1">
                <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24">
                  <div className="p-6 bg-gold-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gold-200">
                        {user?.imageUrl ? (
                          <img src={user.imageUrl} alt={user.fullName || 'User'} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gold-200 flex items-center justify-center">
                            <User className="h-6 w-6 text-gold-600" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{user?.fullName || 'User'}</h3>
                        <p className="text-sm text-gray-500 truncate max-w-[150px]">{user?.primaryEmailAddress?.emailAddress}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <nav className="space-y-2">
                      <button
                        className={`flex items-center space-x-2 p-2 rounded-md w-full text-left ${activeTab === 'profile' ? 'bg-gold-50 text-gold-600' : 'hover:bg-gray-50'}`}
                        onClick={() => setActiveTab('profile')}
                      >
                        <User className="h-5 w-5" />
                        <span>Profile</span>
                      </button>

                      <button
                        className={`flex items-center space-x-2 p-2 rounded-md w-full text-left ${activeTab === 'orders' ? 'bg-gold-50 text-gold-600' : 'hover:bg-gray-50'}`}
                        onClick={() => setActiveTab('orders')}
                      >
                        <Package className="h-5 w-5" />
                        <span>Orders</span>
                      </button>





                      <hr className="my-2" />

                      <button
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-red-50 text-red-500 w-full text-left"
                        onClick={handleSignOut}
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Sign Out</span>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>

              <div className="md:col-span-3">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsContent value="profile" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>View and manage your account details</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                            <p>{user?.fullName || 'Not provided'}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Email</h3>
                            <p>{user?.primaryEmailAddress?.emailAddress}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Username</h3>
                            <p>{user?.username || 'Not set'}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                            <p>{user?.createdAt ? format(new Date(user.createdAt), 'PP') : 'Not available'}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="bg-gold-400 hover:bg-gold-500 text-white"
                          onClick={() => window.open('https://accounts.clerk.dev/user')}
                        >
                          Manage Profile
                        </Button>
                      </CardFooter>
                    </Card>
                  </TabsContent>

                  <TabsContent value="orders" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Your Orders</CardTitle>
                        <CardDescription>Track and manage your recent orders</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {isLoadingOrders ? (
                          <div className="space-y-4">
                            {Array(3).fill(0).map((_, i) => (
                              <div key={i} className="flex flex-col space-y-2">
                                <Skeleton className="h-12 w-full rounded-md" />
                              </div>
                            ))}
                          </div>
                        ) : orders && orders.length > 0 ? (
                          <div className="border rounded-md divide-y">
                            {orders.map((order) => (
                              <div key={order._id} className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium">Order #{order._id.slice(-8)}</p>
                                    <p className="text-sm text-gray-500">{format(new Date(order.createdAt), 'PP')}</p>
                                    <div className="mt-1">
                                      <span className="inline-block px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                      </span>
                                      <span className={`ml-2 inline-block px-2 py-1 text-xs rounded-full capitalize
                                        ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                          order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                                            order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                              // order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                              'bg-yellow-100 text-yellow-700'
                                        }`}
                                      >
                                        {order.status}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">${order.total.toFixed(2)}</p>
                                    <Link
                                      to={`/order/${order._id}`}
                                      className="text-gold-500 hover:text-gold-600 text-sm flex items-center justify-end mt-2"
                                    >
                                      View Details <ChevronRight className="h-4 w-4 ml-1" />
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <p className="text-gray-500">You haven't placed any orders yet.</p>
                            <Button
                              className="mt-4 bg-gold-400 hover:bg-gold-500 text-white"
                              asChild
                            >
                              <Link to="/shop">Start Shopping</Link>
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="wishlist" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Your Wishlist</CardTitle>
                        <CardDescription>Items you've saved for later</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-6">
                          <p className="text-gray-500">Your wishlist is empty.</p>
                          <Button
                            className="mt-4 bg-gold-400 hover:bg-gold-500 text-white"
                            asChild
                          >
                            <Link to="/shop">Explore Products</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="settings" className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>Account Settings</CardTitle>
                        <CardDescription>Manage your account preferences</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-center py-6">
                          <p className="text-gray-500">Settings page is under construction.</p>
                          <Button
                            className="mt-4 bg-gold-400 hover:bg-gold-500 text-white"
                            onClick={() => window.open('https://accounts.clerk.dev/user')}
                          >
                            Manage Account Settings
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </SignedIn>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Account;