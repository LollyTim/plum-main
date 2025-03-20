import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Order } from "@/types/product";

export const createOrder = () => {
  const createOrderMutation = useMutation(api.orders.createOrder);

  return async (orderData: {
    userId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    items: {
      id: string;
      name: string;
      price: number;
      quantity: number;
      image?: string;
    }[];
    total: number;
    subtotal: number;
    paymentMethod: string;
  }) => {
    try {
      const id = await createOrderMutation(orderData);
      return id;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };
};

export const getOrdersByUserId = (userId: string) => {
  return useQuery(api.orders.getOrdersByUserId, { userId });
};

export const getAllOrders = () => {
  return useQuery(api.orders.getAllOrders);
};

export const getOrderById = (id: string) => {
  return useQuery(api.orders.getOrderById, { id });
};

export const updateOrderStatus = () => {
  const updateStatusMutation = useMutation(api.orders.updateOrderStatus);

  return async (id: string, status: string) => {
    try {
      const updated = await updateStatusMutation({ id, status });
      return updated;
    } catch (error) {
      console.error(`Error updating order status for ID ${id}:`, error);
      throw error;
    }
  };
};
