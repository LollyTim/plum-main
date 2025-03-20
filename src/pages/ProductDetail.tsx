import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useConvex } from 'convex/react';
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Heart, Truck, ShieldCheck, Clock, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();
  const convex = useConvex();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Use TanStack Query for product data with retry capability
  const { data: product, isLoading, error, refetch } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) {
        throw new Error("Product ID is required");
      }
      try {
        // Use convex client directly for better error handling
        const result = await convex.query(api.products.getProductById, {
          id: productId as Id<"products">
        });

        if (!result) {
          throw new Error("Product not found");
        }

        return result;
      } catch (err) {
        console.error("Error fetching product:", err);
        throw new Error("Failed to load product data");
      }
    },
    enabled: !!productId,
    retry: 1,
  });

  const handleAddToCart = () => {
    if (product) {
      addToCart(product._id, quantity, product.price);
      setAddedToCart(true);
      toast({
        title: "Added to cart",
        description: `${quantity} × ${product.name} added to your cart`,
      });
    }
  };

  const goToCart = () => {
    navigate('/cart');
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="flex-grow py-20 px-6 mt-16">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-8">
              <Button variant="ghost" asChild>
                <Link to="/shop" className="text-gray-600">
                  <ArrowLeft className="h-4 w-4 mr-2" /> Back to Shop
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <Skeleton className="w-full aspect-square rounded-xl" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-24 w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="flex-grow py-20 px-6 mt-16">
          <div className="container mx-auto max-w-6xl text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="mb-8 text-red-500">
              {error ? (error as Error).message : "The product you are looking for does not exist or has been removed."}
            </p>
            <div className="flex justify-center space-x-4">
              <Button className="bg-gold-400 hover:bg-gold-500 text-white" asChild>
                <Link to="/shop">Continue Shopping</Link>
              </Button>
              <Button variant="outline" onClick={() => refetch()}>
                <RefreshCcw className="h-4 w-4 mr-2" />
                Try Again
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
          <div className="mb-8">
            <Button variant="ghost" asChild>
              <Link to="/shop" className="text-gray-600">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Shop
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full rounded-xl shadow-md object-cover aspect-square"
                />
              ) : (
                <div className="w-full rounded-xl bg-gray-100 flex items-center justify-center aspect-square">
                  <p className="text-gray-400">No image available</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <h1 className="text-3xl font-bold">{product.name}</h1>

              <div className="flex items-center">
                <p className="text-2xl font-bold text-gold-500">{formatCurrency(product.price)}</p>
                {product.discount && (
                  <p className="ml-3 text-gray-500 line-through">
                    {formatCurrency(product.price * (1 + product.discount / 100))}
                  </p>
                )}
              </div>

              <p className="text-gray-600">{product.description}</p>

              <div className="border-t border-b py-4 flex justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gold-400" />
                  <span>Delivery within 1-3 days</span>
                </div>
                <div className="flex items-center">
                  <ShieldCheck className="h-4 w-4 mr-2 text-gold-400" />
                  <span>1 Year Warranty</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="border rounded-md flex items-center">
                  <button
                    className="px-4 py-2 hover:bg-gray-50"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-l border-r">{quantity}</span>
                  <button
                    className="px-4 py-2 hover:bg-gray-50"
                    onClick={incrementQuantity}
                    disabled={product.stock <= quantity}
                  >
                    +
                  </button>
                </div>

                <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0
                    ? `${product.stock} in stock`
                    : 'Out of stock'}
                </span>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full bg-gold-400 hover:bg-gold-500 text-white py-6 rounded-md"
                  onClick={addedToCart ? goToCart : handleAddToCart}
                  disabled={product.stock <= 0}
                >
                  {addedToCart ? 'View Cart' : 'Add to Cart'}
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-gold-200 text-gold-600 hover:bg-gold-50 py-6 rounded-md"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Add to Wishlist
                </Button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex items-start">
                  <Truck className="h-5 w-5 mr-2 text-gold-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Free Shipping</p>
                    <p className="text-sm text-gray-500">On orders over $50</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <ShieldCheck className="h-5 w-5 mr-2 text-gold-500 mt-0.5" />
                  <div>
                    <p className="font-medium">30-Day Returns</p>
                    <p className="text-sm text-gray-500">Hassle-free returns policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
