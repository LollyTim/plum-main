// app/cart/page.tsx
"use client";

import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag, ChevronRight } from "lucide-react";
import { formatCurrency } from '@/lib/utils';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, clearCart, totalItems, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="flex-grow py-20 px-6 mt-16">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-center">Your Shopping Cart</h1>
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="w-24 h-24 bg-gold-100 rounded-full mx-auto flex items-center justify-center mb-6">
                <ShoppingBag className="h-12 w-12 text-gold-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Browse our products and find something you'll love</p>
              <Button className="bg-gold-400 hover:bg-gold-500 text-white" asChild>
                <Link to="/shop">Continue Shopping</Link>
              </Button>
            </div>
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
          <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Cart Items ({totalItems})</h2>
                    <Button
                      variant="ghost"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={clearCart}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Cart
                    </Button>
                  </div>
                </div>
                <div className="divide-y">
                  {items.map((item) => (
                    <div key={item.productId} className="p-6 flex flex-col sm:flex-row gap-4">
                      <div className="sm:w-24 sm:h-24 rounded-md overflow-hidden flex-shrink-0">
                        <Link to={`/product/${item.productId}`}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </Link>
                      </div>
                      <div className="flex-grow">
                        <Link
                          to={`/product/${item.productId}`}
                          className="font-medium hover:text-gold-500 transition-colors"
                        >
                          {item.name}
                        </Link>
                        <p className="text-gray-500 text-sm">{item.category}</p>
                        <div className="mt-2 flex justify-between items-center">
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-500 hover:text-gold-500 h-8 w-8"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-500 hover:text-gold-500 h-8 w-8"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                              onClick={() => removeFromCart(item.productId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t pt-3 mt-3 flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-xl text-gold-500">{formatCurrency(subtotal)}</span>
                  </div>
                </div>
                <Button className="w-full bg-gold-400 hover:bg-gold-500 text-white mb-4" asChild>
                  <Link to="/checkout">
                    Proceed to Checkout
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full border-gold-300 text-gold-600 hover:bg-gold-50" asChild>
                  <Link to="/shop">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;