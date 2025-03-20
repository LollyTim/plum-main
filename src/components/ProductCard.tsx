import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Eye, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';
import { cn, formatCurrency } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

const ProductCard = ({ product }: { product: Product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (addedToCart) {
      navigate('/cart');
    } else {
      addToCart(product._id, 1, product.price);
      setAddedToCart(true);
    }
  };

  return (
    <div
      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden h-64">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>

        <div
          className={cn(
            "absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300 flex items-center justify-center gap-3",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        >
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full bg-white hover:bg-gold-50 text-gold-500"
            onClick={handleAddToCart}
          >
            {addedToCart ? <ShoppingBag className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
          </Button>
          <Button size="icon" variant="secondary" className="rounded-full bg-white hover:bg-gold-50 text-gold-500">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary" className="rounded-full bg-white hover:bg-gold-50 text-gold-500" asChild>
            <Link to={`/product/${product._id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="absolute top-2 left-2 bg-gold-400 text-white px-2 py-1 rounded text-xs font-semibold">
          {product.category}
        </div>
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-gray-800 group-hover:text-gold-500 transition-colors">
              {product.name}
            </h3>
            <span className="text-gold-500 font-semibold">{formatCurrency(product.price)}</span>
          </div>
        </Link>

        <div className="flex items-center space-x-1 text-gold-400 text-sm">
          {Array(5).fill(0).map((_, i) => (
            <span key={i}>★</span>
          ))}
          <span className="text-gray-600 ml-1">{product.rating} ({product.reviews})</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;