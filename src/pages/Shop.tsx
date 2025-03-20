// app/shop/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Slider
} from "@/components/ui/slider";
import {
  Search,
  SlidersHorizontal,
  Grid,
  List,
  X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
import { Id } from "../../convex/_generated/dataModel";
import { formatCurrency } from '@/lib/utils';

type SortOption = "featured" | "price-low" | "price-high" | "newest" | "rating";
type ViewOption = "grid" | "list";

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [viewMode, setViewMode] = useState<ViewOption>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  // Fetch all products
  const products = useQuery(api.products.getProducts);
  const categories = useQuery(api.products.getAllCategories);

  // Apply all filters and sorting
  const filteredAndSortedProducts = React.useMemo(() => {
    if (!products) return [];

    // Start with all products
    let result = [...products];

    // Filter by category
    if (selectedCategory) {
      result = result.filter(product => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        product =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    // Filter by price range
    result = result.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Filter by stock
    if (inStockOnly) {
      result = result.filter(product => product.inStock);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          // Assuming newer products have higher IDs
          return b._id.toString().localeCompare(a._id.toString());
        case "featured":
        default:
          // Featured products first, then sort by rating
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
      }
    });

    return result;
  }, [products, selectedCategory, sortBy, searchQuery, priceRange, inStockOnly]);

  // Get price range for slider
  useEffect(() => {
    if (products && products.length > 0) {
      const minPrice = 0;
      const maxPrice = 50000; // Use a fixed higher range for Nigerian Naira
      setPriceRange([minPrice, maxPrice]);
    }
  }, [products]);

  // Add a function to handle adding to cart
  const handleAddToCart = (productId: Id<"products">, price: number) => {
    addToCart(productId, 1, price);
    // Mark this product as added to cart
    setAddedToCart(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow py-12 px-6 mt-16">
        <div className="container mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Shop Our Collection</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked collection of premium gifts, flowers, toys, and more that are perfect for any occasion.
            </p>
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-auto flex-grow md:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex-grow md:flex-grow-0">
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="hidden md:flex border rounded p-1 bg-gray-50">
                <Button
                  variant="ghost"
                  size="icon"
                  className={viewMode === 'grid' ? 'bg-white shadow-sm' : ''}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={viewMode === 'list' ? 'bg-white shadow-sm' : ''}
                  onClick={() => setViewMode('list')}
                >
                  <List size={18} />
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal size={16} className="mr-2" />
                Filters
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters Sidebar - Desktop */}
            <div className="hidden md:block w-64 shrink-0">
              <div className="bg-white p-5 rounded-lg shadow-sm sticky top-24">
                <h3 className="font-medium text-lg mb-4">Filters</h3>

                <div className="space-y-6">
                  {/* Categories */}
                  <div>
                    <h4 className="font-medium mb-2">Categories</h4>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Checkbox
                          id="all-categories"
                          checked={selectedCategory === null}
                          onCheckedChange={() => setSelectedCategory(null)}
                        />
                        <Label htmlFor="all-categories" className="ml-2 cursor-pointer">
                          All Categories
                        </Label>
                      </div>

                      {categories?.map((category) => (
                        <div key={category} className="flex items-center">
                          <Checkbox
                            id={`category-${category}`}
                            checked={selectedCategory === category}
                            onCheckedChange={(checked) => setSelectedCategory(checked ? category : null)}
                          />
                          <Label htmlFor={`category-${category}`} className="ml-2 cursor-pointer">
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">Price Range</h4>
                      <span className="text-sm text-gray-500">
                        {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                      </span>
                    </div>
                    <Slider
                      defaultValue={[0, 100000]}
                      min={0}
                      max={100000}
                      step={1000}
                      value={[priceRange[0], priceRange[1]]}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      className="my-4"
                    />
                  </div>

                  {/* In Stock Only */}
                  <div className="flex items-center">
                    <Checkbox
                      id="in-stock"
                      checked={inStockOnly}
                      onCheckedChange={(checked) => setInStockOnly(!!checked)}
                    />
                    <Label htmlFor="in-stock" className="ml-2 cursor-pointer">
                      In Stock Only
                    </Label>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-6"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchQuery("");
                    setPriceRange([0, 50000]);
                    setInStockOnly(false);
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            </div>

            {/* Mobile Filters */}
            <div className={`md:hidden fixed inset-0 bg-white z-50 p-6 transition-transform duration-300 transform ${showFilters ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl">Filters</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                  <X size={24} />
                </Button>
              </div>

              <div className="space-y-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="categories">
                    <AccordionTrigger>Categories</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center">
                          <Checkbox
                            id="mobile-all-categories"
                            checked={selectedCategory === null}
                            onCheckedChange={() => setSelectedCategory(null)}
                          />
                          <Label htmlFor="mobile-all-categories" className="ml-2 cursor-pointer">
                            All Categories
                          </Label>
                        </div>

                        {categories?.map((category) => (
                          <div key={`mobile-${category}`} className="flex items-center">
                            <Checkbox
                              id={`mobile-category-${category}`}
                              checked={selectedCategory === category}
                              onCheckedChange={(checked) => setSelectedCategory(checked ? category : null)}
                            />
                            <Label htmlFor={`mobile-category-${category}`} className="ml-2 cursor-pointer">
                              {category}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="price">
                    <AccordionTrigger>Price Range</AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-2">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-500">
                            {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                          </span>
                        </div>
                        <Slider
                          defaultValue={[0, 50000]}
                          min={0}
                          max={50000}
                          step={1000}
                          value={[priceRange[0], priceRange[1]]}
                          onValueChange={(value) => setPriceRange(value as [number, number])}
                          className="my-4"
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="flex items-center">
                  <Checkbox
                    id="mobile-in-stock"
                    checked={inStockOnly}
                    onCheckedChange={(checked) => setInStockOnly(!!checked)}
                  />
                  <Label htmlFor="mobile-in-stock" className="ml-2 cursor-pointer">
                    In Stock Only
                  </Label>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t flex gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchQuery("");
                    setPriceRange([0, 50000]);
                    setInStockOnly(false);
                  }}
                >
                  Clear All
                </Button>
                <Button
                  size="lg"
                  className="flex-1 bg-gold-400 hover:bg-gold-500"
                  onClick={() => setShowFilters(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>

            {/* Products grid/list */}
            <div className="flex-1">
              {/* Results count and current filters */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-500">
                  Showing {filteredAndSortedProducts.length} result{filteredAndSortedProducts.length !== 1 ? 's' : ''}
                </div>

                {/* Active Filters */}
                {(selectedCategory || searchQuery || inStockOnly || priceRange[0] > 0 || priceRange[1] < 50000) && (
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory && (
                      <div className="bg-gray-100 text-sm px-2 py-1 rounded-full flex items-center">
                        {selectedCategory}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1"
                          onClick={() => setSelectedCategory(null)}
                        >
                          <X size={12} />
                        </Button>
                      </div>
                    )}

                    {inStockOnly && (
                      <div className="bg-gray-100 text-sm px-2 py-1 rounded-full flex items-center">
                        In Stock
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1"
                          onClick={() => setInStockOnly(false)}
                        >
                          <X size={12} />
                        </Button>
                      </div>
                    )}

                    {(priceRange[0] > 0 || priceRange[1] < 50000) && (
                      <div className="bg-gray-100 text-sm px-2 py-1 rounded-full flex items-center">
                        {formatCurrency(priceRange[0])}-{formatCurrency(priceRange[1])}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1"
                          onClick={() => setPriceRange([0, 50000])}
                        >
                          <X size={12} />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Loading state */}
              {products === undefined ? (
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'grid-cols-1 gap-4'}`}>
                  {Array(6)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className={`flex ${viewMode === 'grid' ? 'flex-col' : 'flex-row'} bg-white p-4 rounded-lg shadow-sm gap-4`}>
                        <Skeleton className={viewMode === 'grid' ? 'h-48 w-full rounded-lg' : 'h-24 w-24 rounded-lg'} />
                        <div className={`flex flex-col ${viewMode === 'grid' ? 'space-y-2' : 'flex-1 space-y-1'}`}>
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          {viewMode === 'list' && <Skeleton className="h-4 w-full mt-2" />}
                        </div>
                      </div>
                    ))}
                </div>
              ) : filteredAndSortedProducts.length > 0 ? (
                viewMode === 'grid' ? (
                  // Grid view
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAndSortedProducts.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                ) : (
                  // List view
                  <div className="space-y-4">
                    {filteredAndSortedProducts.map((product) => (
                      <div key={product._id} className="flex bg-white p-4 rounded-lg shadow-sm">
                        <div className="w-24 h-24 shrink-0">
                          <img
                            src={product.image || 'https://via.placeholder.com/200'}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-gold-500 font-medium mt-1">{formatCurrency(product.price)}</p>
                          <p className="text-gray-600 text-sm mt-2 line-clamp-2">{product.description}</p>
                          <div className="mt-2 flex">
                            <Button
                              size="sm"
                              className="bg-gold-400 hover:bg-gold-500 text-white"
                              onClick={() =>
                                addedToCart[product._id]
                                  ? navigate('/cart')
                                  : handleAddToCart(product._id, product.price)
                              }
                            >
                              {addedToCart[product._id] ? 'View Cart' : 'Add to Cart'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-16 bg-white rounded-lg">
                  <p className="text-gray-500 mb-4">No products found matching your criteria.</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory(null);
                      setSearchQuery("");
                      setPriceRange([0, 50000]);
                      setInStockOnly(false);
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;