import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ProductCard from './ProductCard';
import { Skeleton } from "@/components/ui/skeleton";
import { api } from '../../convex/_generated/api';
import { useConvex } from 'convex/react';

const FeaturedProducts = () => {
  const convex = useConvex();

  // Fetch all products and reduce to latest 4 in the component
  const { data: products, isLoading, error, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: () => convex.query(api.products.getProducts),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2, // Retry failed requests twice
  });

  // Get latest 4 products
  const latestProducts = products
    ? [...products]
      .sort((a, b) => b._creationTime - a._creationTime)
      .slice(0, 4)
    : [];

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12 max-w-2xl mx-auto animate-fade-in">
          <span className="inline-block px-3 py-1 bg-gold-100 text-gold-600 rounded-full text-sm font-medium mb-4">New Arrivals</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Products</h2>
          <p className="text-gray-600">
            Discover our newest collection of premium gifts, flowers, toys, and more, fresh off the shelves.
          </p>
        </div>

        {error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">Failed to load latest products.</p>
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="inline-flex items-center"
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {isLoading ? (
              // Loading skeletons with shimmer effect
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex flex-col space-y-4 animate-pulse">
                  <Skeleton className="h-64 w-full rounded-xl bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
                  <Skeleton className="h-4 w-3/4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
                  <Skeleton className="h-4 w-1/2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
                </div>
              ))
            ) : latestProducts.length > 0 ? (
              latestProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No products available at the moment.</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-12 text-center">
          <Button
            variant="outline"
            size="lg"
            className="border-gold-300 text-gold-600 hover:bg-gold-50 group transition-all"
            asChild
          >
            <Link to="/shop">
              View All Products
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;