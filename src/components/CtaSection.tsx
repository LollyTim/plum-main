
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, ArrowRight } from 'lucide-react';

const CtaSection = () => {
  return (
    <section className="py-20 px-6 relative overflow-hidden bg-gradient-to-r from-gold-50 to-white">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-gold-100 rounded-full opacity-60 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-60 h-60 bg-gold-100 rounded-full opacity-60 transform translate-x-1/3 translate-y-1/3"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gold-100 animate-fade-in">
          <span className="inline-block px-3 py-1 bg-gold-100 text-gold-600 rounded-full text-sm font-medium mb-4">Special Offer</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Community</h2>
          <p className="text-lg text-gray-600 mb-8">
            Sign up today to receive exclusive offers, early access to new collections, and <span className="text-gold-500 font-medium">15% off</span> your first order.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-gold-400 hover:bg-gold-500 text-white transition-all"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Create an Account
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-gold-300 text-gold-600 hover:bg-gold-50 group transition-all"
            >
              Sign In
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          
          <div className="mt-8 text-gray-500 text-sm">
            Already a member? <a href="#" className="text-gold-500 hover:underline">Sign in</a> to your account
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
