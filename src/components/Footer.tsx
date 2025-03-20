
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, Instagram, Twitter, Linkedin, 
  Mail, Phone, MapPin, ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer = () => {
  return (
    <footer className="bg-white pt-16 border-t border-gold-100">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and about */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <h1 className="text-2xl font-bold text-gold-500">Plum</h1>
            </Link>
            <p className="text-gray-600 mb-4 max-w-md">
              Premium gifts, flowers, toys, and decoration services for all your special occasions. Making moments memorable since 2010.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center hover:bg-gold-200 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-gold-500" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center hover:bg-gold-200 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-gold-500" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center hover:bg-gold-200 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 text-gold-500" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center hover:bg-gold-200 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-gold-500" />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-gold-500 transition-colors inline-flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-600 hover:text-gold-500 transition-colors inline-flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-gold-500 transition-colors inline-flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-gold-500 transition-colors inline-flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-gold-500 transition-colors inline-flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-gray-600 hover:text-gold-500 transition-colors inline-flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Gift Items
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-600 hover:text-gold-500 transition-colors inline-flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Flowers
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-600 hover:text-gold-500 transition-colors inline-flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Toys
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-600 hover:text-gold-500 transition-colors inline-flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Balloons
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-600 hover:text-gold-500 transition-colors inline-flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2" />
                  Body Sprays
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-gold-500 flex-shrink-0 mt-1 mr-3" />
                <span className="text-gray-600">123 Elegant Avenue, Luxury District, NY 10001</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-gold-500 flex-shrink-0 mr-3" />
                <a href="tel:+1234567890" className="text-gray-600 hover:text-gold-500 transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-gold-500 flex-shrink-0 mr-3" />
                <a href="mailto:info@plumgifts.com" className="text-gray-600 hover:text-gold-500 transition-colors">
                  info@plumgifts.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Newsletter */}
        <div className="mt-12 py-8 border-t border-gold-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-gray-600">Stay updated with our latest offers and new arrivals</p>
            </div>
            <div className="flex max-w-md">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gold-200 focus:border-gold-400 transition-colors"
              />
              <Button className="bg-gold-400 hover:bg-gold-500 text-white rounded-l-none transition-all">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        {/* Bottom footer */}
        <div className="py-6 text-center border-t border-gold-100 mt-8">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Plum Gift Store. All rights reserved. 
            <span className="mx-2">|</span>
            <a href="#" className="hover:text-gold-500 transition-colors">Privacy Policy</a>
            <span className="mx-2">|</span>
            <a href="#" className="hover:text-gold-500 transition-colors">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
