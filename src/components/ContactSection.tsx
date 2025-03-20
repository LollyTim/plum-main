
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Phone, Mail, MessageSquare, MapPin, 
  Facebook, Instagram, Twitter, Linkedin 
} from 'lucide-react';

const ContactSection = () => {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12 max-w-2xl mx-auto animate-fade-in">
          <span className="inline-block px-3 py-1 bg-gold-100 text-gold-600 rounded-full text-sm font-medium mb-4">Get In Touch</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h2>
          <p className="text-gray-600">
            Have questions about our products or services? Our team is here to help you find the perfect gifts and solutions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact cards */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gold-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center mb-4">
              <Phone className="h-5 w-5 text-gold-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Call Us</h3>
            <p className="text-gray-600 mb-4">We're available Monday-Friday from 9am to 6pm</p>
            <a 
              href="tel:+1234567890" 
              className="text-gold-500 font-medium hover:text-gold-600 transition-colors"
            >
              +1 (234) 567-890
            </a>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gold-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center mb-4">
              <Mail className="h-5 w-5 text-gold-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Email Us</h3>
            <p className="text-gray-600 mb-4">We'll respond to your inquiry within 24 hours</p>
            <a 
              href="mailto:info@plumgifts.com" 
              className="text-gold-500 font-medium hover:text-gold-600 transition-colors"
            >
              info@plumgifts.com
            </a>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gold-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center mb-4">
              <MessageSquare className="h-5 w-5 text-gold-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">WhatsApp</h3>
            <p className="text-gray-600 mb-4">Chat with us directly for quick assistance</p>
            <a 
              href="https://wa.me/1234567890" 
              className="text-gold-500 font-medium hover:text-gold-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Send Message
            </a>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          <div className="lg:col-span-2 space-y-6 animate-fade-in">
            <h3 className="text-2xl font-bold">Visit Our Store</h3>
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gold-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-medium">Plum Gift Store</h4>
                <p className="text-gray-600">123 Elegant Avenue, Luxury District, NY 10001</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Opening Hours</h4>
              <ul className="space-y-1 text-gray-600">
                <li className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 8:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span>
                  <span>11:00 AM - 5:00 PM</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Follow Us</h4>
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center hover:bg-gold-200 transition-colors"
                >
                  <Facebook className="h-5 w-5 text-gold-500" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center hover:bg-gold-200 transition-colors"
                >
                  <Instagram className="h-5 w-5 text-gold-500" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center hover:bg-gold-200 transition-colors"
                >
                  <Twitter className="h-5 w-5 text-gold-500" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center hover:bg-gold-200 transition-colors"
                >
                  <Linkedin className="h-5 w-5 text-gold-500" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3 animate-slide-up">
            <form className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-6">Send us a message</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-200 focus:border-gold-400 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-200 focus:border-gold-400 transition-colors"
                    placeholder="Your email"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-200 focus:border-gold-400 transition-colors"
                  placeholder="Message subject"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea 
                  id="message" 
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-200 focus:border-gold-400 transition-colors resize-none"
                  placeholder="Your message"
                ></textarea>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gold-400 hover:bg-gold-500 text-white transition-all"
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
