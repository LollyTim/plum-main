
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Gift, Flower, PartyPopper, Home, 
  Calendar, Clock, Check, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: Gift,
    title: 'Gift Wrapping',
    description: 'Elevate your gifts with our premium wrapping service, adding that special touch of elegance.'
  },
  {
    icon: Flower,
    title: 'Floral Arrangements',
    description: 'Custom flower arrangements designed by professionals for any occasion or celebration.'
  },
  {
    icon: PartyPopper,
    title: 'Party Decoration',
    description: 'Transform your venue into an elegant celebration space with our decoration services.'
  },
  {
    icon: Home,
    title: 'Interior Decoration',
    description: 'Enhance your living spaces with our tasteful and sophisticated interior decoration.'
  }
];

const ServiceCard = ({ service }: { service: typeof services[0] }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 group">
      <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center mb-4 group-hover:bg-gold-200 transition-colors">
        <service.icon className="h-6 w-6 text-gold-500" />
      </div>
      <h3 className="text-xl font-semibold mb-2 group-hover:text-gold-500 transition-colors">{service.title}</h3>
      <p className="text-gray-600 mb-4">{service.description}</p>
      <Button 
        variant="ghost" 
        className="p-0 h-auto text-gold-500 hover:text-gold-600 hover:bg-transparent group-hover:underline transition-all"
      >
        Learn more
        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
};

const ServicesSection = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-gold-50">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <span className="inline-block px-3 py-1 bg-gold-100 text-gold-600 rounded-full text-sm font-medium">Our Services</span>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Premium Decoration <br />Services for Every <br />
              <span className="text-gold-gradient">Special Moment</span>
            </h2>
            <p className="text-gray-600 text-lg">
              From elegant interior designs to festive party decorations, our professional team brings your vision to life with attention to every detail.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-gold-100 flex-shrink-0 flex items-center justify-center mt-1">
                  <Check className="h-4 w-4 text-gold-500" />
                </div>
                <p className="text-gray-700">Professional decoration experts with years of experience</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-gold-100 flex-shrink-0 flex items-center justify-center mt-1">
                  <Check className="h-4 w-4 text-gold-500" />
                </div>
                <p className="text-gray-700">Premium materials and unique design concepts</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-gold-100 flex-shrink-0 flex items-center justify-center mt-1">
                  <Check className="h-4 w-4 text-gold-500" />
                </div>
                <p className="text-gray-700">Tailored to your preferences and occasion requirements</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-2">
              <Button 
                size="lg" 
                className="bg-gold-400 hover:bg-gold-500 text-white transition-all"
                asChild
              >
                <Link to="/services">
                  <Calendar className="h-5 w-5 mr-2" />
                  Book Service
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-gold-300 text-gold-600 hover:bg-gold-50 group transition-all"
                asChild
              >
                <Link to="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-slide-up">
            {services.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
