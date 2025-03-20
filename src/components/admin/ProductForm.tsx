// app/components/ProductForm.tsx
"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Upload, Image as ImageIcon, Loader } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface ProductFormProps {
  product?: any; // Existing product data for editing
  onSubmit: (data: any) => void; // Callback for form submission
  onCancel: () => void; // Callback for canceling the form
}

const ProductForm = ({ product, onSubmit, onCancel }: ProductFormProps) => {
  const { toast } = useToast();
  const addOrUpdateProduct = useMutation(
    product ? api.products.updateProduct : api.products.createProduct
  );

  // Initialize form data with existing product data or defaults
  const [formData, setFormData] = useState({
    id: product?._id || "",
    name: product?.name || "",
    category: product?.category || "",
    price: product?.price || 0,
    description: product?.description || "",
    stock: product?.stock || 0,
    image: product?.image || "",
    featured: product?.featured || false,
    discount: product?.discount || 0,
    rating: product?.rating || 0,
    reviews: product?.reviews || 0,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" ||
          name === "stock" ||
          name === "discount" ||
          name === "rating" ||
          name === "reviews"
          ? Number(value)
          : value,
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      featured: checked,
    }));
  };

  // Handle select changes
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Create a temporary preview
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);

      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(file);

      // Update form data with the Cloudinary URL
      setFormData(prev => ({
        ...prev,
        image: imageUrl
      }));

      toast({
        title: "Image uploaded",
        description: "Your image has been successfully uploaded."
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
      // Reset preview if upload failed
      setImagePreview(product?.image || null);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.category || formData.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields with valid values",
        variant: "destructive",
      });
      return;
    }

    try {
      if (product) {
        // Update existing product
        await addOrUpdateProduct({
          id: product._id, // Include ID for updates
          ...formData,
        });
        toast({
          title: "Product updated",
          description: "The product has been successfully updated.",
        });
      } else {
        // Add new product (exclude the `id` field)
        const { id, ...newProductData } = formData;
        await addOrUpdateProduct(newProductData);
        toast({
          title: "Product added",
          description: "The new product has been successfully added.",
        });
      }

      onCancel(); // Close the form after submission
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 h-[500px] overflow-scroll">
      {/* Product Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select value={formData.category} onValueChange={handleSelectChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Gift Items">Gift Items</SelectItem>
            <SelectItem value="Toys">Toys</SelectItem>
            <SelectItem value="Flowers">Flowers</SelectItem>
            <SelectItem value="Balloons">Balloons</SelectItem>
            <SelectItem value="Body Sprays">Body Sprays</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price and Stock */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (USD) *</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0.01"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity *</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Discount and Rating */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="discount">Discount (0-1)</Label>
          <Input
            id="discount"
            name="discount"
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={formData.discount}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500">e.g., 0.2 = 20% discount</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rating">Rating (0-5)</Label>
          <Input
            id="rating"
            name="rating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={formData.rating}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-2">
        <Label htmlFor="reviews">Number of Reviews</Label>
        <Input
          id="reviews"
          name="reviews"
          type="number"
          min="0"
          value={formData.reviews}
          onChange={handleChange}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="min-h-[100px]"
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label>Product Image</Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          {imagePreview ? (
            <div className="space-y-4">
              <div className="w-full h-48 mx-auto relative">
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="w-full h-full object-contain"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="relative"
              >
                {isUploading ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" /> Uploading...
                  </>
                ) : (
                  "Change Image"
                )}
              </Button>
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center h-48 cursor-pointer border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                {isUploading ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin inline" /> Uploading...
                  </>
                ) : (
                  "Click to upload product image"
                )}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, or WebP up to 5MB
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploading}
          />

          <input
            type="hidden"
            name="image"
            value={formData.image}
          />
        </div>
      </div>

      {/* Featured Checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="featured"
          checked={formData.featured}
          onCheckedChange={handleCheckboxChange}
        />
        <Label htmlFor="featured" className="cursor-pointer">
          Feature this product on homepage
        </Label>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-gold-400 hover:bg-gold-500 text-white">
          {product ? "Update Product" : "Add Product"}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;