
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const imageRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!imageRef.current) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate mouse position as percentage of viewport
      const xPos = (clientX / innerWidth) - 0.5;
      const yPos = (clientY / innerHeight) - 0.5;
      
      // Apply subtle parallax effect
      imageRef.current.style.transform = `translate(${xPos * 20}px, ${yPos * 20}px)`;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,244,219,0.7),rgba(255,255,255,0)_70%)]"></div>
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white to-transparent"></div>
      
      <div className="container mx-auto px-6 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div>
              <span className="inline-block px-3 py-1 bg-gold-100 text-gold-600 rounded-full text-sm font-medium mb-4">Premium Gift Store</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Discover Perfect <span className="text-gold-gradient">Gifts</span> for Every Occasion
              </h1>
            </div>
            <p className="text-gray-600 text-lg md:text-xl">
              From exquisite flowers to charming toys, find thoughtful gifts that create lasting memories for your loved ones.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gold-400 hover:bg-gold-500 text-white transition-all"
                asChild
              >
                <Link to="/shop">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Shop Now
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-gold-300 text-gold-600 hover:bg-gold-50 group transition-all"
                asChild
              >
                <Link to="/services">
                  Explore Services
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center space-x-6 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gold-100 border-2 border-white flex items-center justify-center text-gold-500 font-medium">
                    {i}
                  </div>
                ))}
              </div>
              <p className="text-gray-600">Join <span className="text-gold-500 font-semibold">2,000+</span> happy customers</p>
            </div>
          </div>
          
          <div className="relative animate-slide-up" ref={imageRef}>
            {/* Main hero image */}
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
              <img 
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80" 
                alt="Gift collection" 
                className="w-full h-auto rounded-2xl object-cover"
              />
            </div>
            
            {/* Floating decorative elements */}
            <div className="absolute top-[-2rem] right-[-2rem] w-24 h-24 rounded-full bg-gold-100 animate-float"></div>
            <div className="absolute bottom-[-1rem] left-[-1rem] w-16 h-16 rounded-full bg-gold-200 animate-float" style={{animationDelay: '1s'}}></div>
            
            {/* Product card previews */}
            <div className="absolute -bottom-6 -left-10 glass p-3 rounded-lg shadow-lg animate-float" style={{animationDelay: '0.5s'}}>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center">
                  <ShoppingBag className="h-4 w-4 text-gold-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Luxury Gifts</p>
                  <p className="text-xs text-gray-600">Premium selection</p>
                </div>
              </div>
            </div>
            
            <div className="absolute top-10 -right-10 glass p-3 rounded-lg shadow-lg animate-float" style={{animationDelay: '1.5s'}}>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center">
                  <span className="text-gold-500 text-xs font-bold">★★★★★</span>
                </div>
                <div>
                  <p className="text-sm font-medium">5.0 Rating</p>
                  <p className="text-xs text-gray-600">Trusted by customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
