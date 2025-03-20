"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel"; // Import the Id type
import { useUser } from "@clerk/clerk-react";

const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const userId = user?.id || "";

  const cart = useQuery(api.carts.getCart, { userId });
  const addToCartMutation = useMutation(api.carts.addToCart);
  const removeFromCartMutation = useMutation(api.carts.removeFromCart);
  const updateCartItemQuantityMutation = useMutation(api.carts.updateCartItemQuantity);
  const clearCartMutation = useMutation(api.carts.clearCart);

  const addToCart = (productId: Id<"products">, quantity: number, price: number) => {
    addToCartMutation({ userId, productId, quantity, price }); // Pass price here
  };

  const removeFromCart = (productId: Id<"products">) => {
    removeFromCartMutation({ userId, productId });
  };

  const updateQuantity = (productId: Id<"products">, quantity: number) => {
    updateCartItemQuantityMutation({ userId, productId, quantity });
  };

  const clearCart = () => {
    clearCartMutation({ userId });
  };

  return (
    <CartContext.Provider
      value={{
        items: cart?.items || [],
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems: cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0,
        subtotal: cart?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);