import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ShoppingCart, Menu, X, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';
import {
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
  useClerk
} from '@clerk/clerk-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 ease-in-out",
        isScrolled ? "bg-white shadow-md py-3" : "bg-transparent"
      )}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center"
            onClick={() => setIsMenuOpen(false)}
          >
            <h1
              className={cn(
                "text-2xl font-bold transition-all duration-300",
                isScrolled ? "text-gold-500" : "text-gold-400"
              )}
            >
              Plum
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink href="/" label="Home" />
            <NavLink href="/shop" label="Shop" />
            <NavLink href="/services" label="Services" />
            <NavLink href="/about" label="About" />
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <SignedOut>
              <Button
                variant="outline"
                className="border-gold-300 text-gold-500 hover:bg-gold-50 hover:text-gold-600 transition-all"
                asChild
              >
                <Link to="/sign-in">Sign In</Link>
              </Button>

              <Button
                className="bg-gold-400 hover:bg-gold-500 text-white transition-all"
                asChild
              >
                <Link to="/sign-up">Sign Up</Link>
              </Button>
            </SignedOut>

            <SignedIn>
              <Link to="/account" className="mr-2">
                <Button
                  variant="ghost"
                  className="flex items-center text-gray-700"
                >
                  <span className="mr-2">Account</span>
                </Button>
              </Link>

              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: 'w-9 h-9'
                  }
                }}
              />
            </SignedIn>

            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-gold-500 hover:bg-gold-50 hover:text-gold-600 transition-all"
                asChild
              >
                <Link to="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-gold-500">
                      {totalItems}
                    </Badge>
                  )}
                </Link>
              </Button>
            </div>
          </div>

          {/* Mobile Cart and Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Mobile Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-gold-500 hover:bg-gold-50 hover:text-gold-600 transition-all relative"
              asChild
            >
              <Link to="/cart">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-gold-500">
                    {totalItems}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Mobile Menu Button */}
            <button
              className="text-gold-500 hover:text-gold-600 transition-all"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-white pt-20 px-6 transform transition-transform duration-300 ease-in-out md:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="flex flex-col space-y-6 items-center">
          <MobileNavLink href="/" label="Home" onClick={() => setIsMenuOpen(false)} />
          <MobileNavLink href="/shop" label="Shop" onClick={() => setIsMenuOpen(false)} />
          <MobileNavLink href="/services" label="Services" onClick={() => setIsMenuOpen(false)} />
          <MobileNavLink href="/about" label="About" onClick={() => setIsMenuOpen(false)} />

          <div className="flex flex-col space-y-4 w-full pt-6">
            <SignedOut>
              <Button
                variant="outline"
                className="w-full border-gold-300 text-gold-500 hover:bg-gold-50 hover:text-gold-600"
                asChild
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to="/sign-in">
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>

              <Button
                className="w-full bg-gold-400 hover:bg-gold-500 text-white"
                asChild
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to="/sign-up">Sign Up</Link>
              </Button>
            </SignedOut>

            <SignedIn>
              <Button
                variant="outline"
                className="w-full border-gold-300 text-gold-500 hover:bg-gold-50 hover:text-gold-600"
                asChild
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to="/account">
                  <User className="h-4 w-4 mr-2" />
                  My Account
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </SignedIn>
          </div>
        </nav>
      </div>
    </header>
  );
};

const NavLink = ({ href, label }: { href: string, label: string }) => {
  return (
    <Link
      to={href}
      className="text-gray-700 hover:text-gold-500 font-medium transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gold-400 after:origin-bottom-right after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-in-out"
    >
      {label}
    </Link>
  );
};

const MobileNavLink = ({ href, label, onClick }: { href: string, label: string, onClick: () => void }) => {
  return (
    <Link
      to={href}
      className="text-gray-800 hover:text-gold-500 text-lg font-medium w-full text-center py-2 transition-colors"
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

export default Navbar;
