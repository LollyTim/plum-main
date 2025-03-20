// app/checkout/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import PaystackWrapper from "@/components/payment/PaystackWrapper";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { formatCurrency } from '@/lib/utils';

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoaded } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  useEffect(() => {
    if (!SignedIn) {
      navigate("/sign-in");
    }
  }, [SignedIn, navigate]);

  const shipping = 5;
  const tax = parseFloat((subtotal * 0.07).toFixed(2));
  const total = subtotal + shipping + tax;

  // Fetch user addresses
  const userAddresses = useQuery(api.userAddresses.getUserAddresses, {
    userId: user?.id || "",
  });

  // Save address mutation
  const saveAddress = useMutation(api.userAddresses.saveUserAddress);

  // Create order mutation
  const createOrder = useMutation(api.orders.createOrder);

  // Pre-fill form with user data
  useEffect(() => {
    if (isLoaded && user) {
      setFormData((prev) => ({
        ...prev,
        name: user.fullName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
      }));
    }
  }, [isLoaded, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.zipCode
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Save address
    await saveAddress({
      userId: user?.id || "",
      ...formData,
      isDefault: true,
    });

    // Proceed to payment
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = async (paymentReference: string) => {
    try {
      // Create order
      const orderId = await createOrder({
        userId: user?.id || "",
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        total: total,
        shippingAddress: formData,
        paymentMethod: "Paystack",
        paymentReference: paymentReference,
      });

      // Clear cart
      clearCart();

      // Redirect to confirmation page with order ID
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      console.error("Order creation failed:", error);
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="flex-grow py-20 px-6 mt-16">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            <p className="mb-8">Your cart is empty. Please add items to your cart before checking out.</p>
            <Button
              className="bg-gold-400 hover:bg-gold-500 text-white"
              onClick={() => navigate("/shop")}
            >
              Continue Shopping
            </Button>
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
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6">
                {!showPaymentForm ? (
                  <>
                    <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 (555) 123-4567"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Delivery Address *</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="123 Main St, Apt 4B"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="New York"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State/Province *</Label>
                          <Input
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            placeholder="NY"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                          <Input
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            placeholder="10001"
                            required
                          />
                        </div>
                      </div>
                      <div className="pt-4">
                        <Button
                          type="submit"
                          className="w-full bg-gold-400 hover:bg-gold-500 text-white"
                        >
                          Continue to Payment
                        </Button>
                      </div>
                    </form>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                    <p className="text-gray-500 mb-4">
                      Secure payment processing powered by Paystack. Your payment information is encrypted and secure.
                    </p>
                    <div className="border rounded-md p-6">
                      <PaystackWrapper
                        onSuccess={handlePaymentSuccess}
                        amount={total}
                        email={formData.email}
                        name={formData.name}
                        phone={formData.phone}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      className="mt-4"
                      onClick={() => setShowPaymentForm(false)}
                    >
                      Back to Shipping Info
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4 mb-4">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-md overflow-hidden mr-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{formatCurrency(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 mt-3 flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-xl text-gold-500">{formatCurrency(subtotal)}</span>
                  </div>
                </div>
                <SignedOut>
                  <div className="p-4 bg-gray-50 rounded-md mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Create an account or sign in to track your orders and save your shipping information.
                    </p>
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <a href="/sign-up">Create Account</a>
                    </Button>
                  </div>
                </SignedOut>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;