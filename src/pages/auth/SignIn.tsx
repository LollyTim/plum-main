
import React from 'react';
import { SignIn as ClerkSignIn } from "@clerk/clerk-react";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const SignIn = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md mb-8">
        <Link to="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to home
          </Button>
        </Link>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2 text-gold-500">Welcome Back to Plum</h1>
          <p className="text-gray-600">Sign in to your account to continue shopping</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md">
          <ClerkSignIn 
            routing="path" 
            path="/sign-in" 
            signUpUrl="/sign-up" 
            afterSignInUrl="/"
            appearance={{
              elements: {
                formButtonPrimary: 'bg-gold-400 hover:bg-gold-500 text-white',
                card: 'shadow-none',
                formFieldInput: 'border-gray-300 focus:border-gold-300 focus:ring-gold-200',
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
