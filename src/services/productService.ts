import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Product } from "@/types/product";

export const getProducts = () => {
  return useQuery(api.products.getProducts);
};

export const getFeaturedProducts = () => {
  return useQuery(api.products.getFeaturedProducts);
};

export const getProductById = (id: string) => {
  return useQuery(api.products.getProductById, { id });
};

export const createProduct = () => {
  const createProductMutation = useMutation(api.products.createProduct);

  return async (productData: Omit<Product, "id">) => {
    try {
      const id = await createProductMutation(productData);
      return id;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  };
};

export const updateProduct = () => {
  const updateProductMutation = useMutation(api.products.updateProduct);

  return async (id: string, productData: Partial<Omit<Product, "id">>) => {
    try {
      const updated = await updateProductMutation({
        id,
        ...productData,
      });
      return updated;
    } catch (error) {
      console.error(`Error updating product with ID ${id}:`, error);
      throw error;
    }
  };
};

export const deleteProduct = () => {
  const deleteProductMutation = useMutation(api.products.deleteProduct);

  return async (id: string) => {
    try {
      await deleteProductMutation({ id });
      return true;
    } catch (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      throw error;
    }
  };
};

export const getAllCategories = () => {
  return useQuery(api.products.getAllCategories);
};
