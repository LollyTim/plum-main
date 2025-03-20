import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Gift, Flower, House, Home, MessageCircle } from 'lucide-react';

const Services = () => {
  const handleWhatsAppClick = () => {
    // Replace with your actual WhatsApp number
    window.open('https://wa.me/1234567890', '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-gold-50 to-white">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Premium Services</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Discover the perfect gift for any occasion with our personalized services and elegant offerings.
            </p>
            <Button
              className="bg-gold-400 hover:bg-gold-500 text-white"
              onClick={handleWhatsAppClick}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Contact Us on WhatsApp
            </Button>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ServiceCard
                icon={<Gift className="h-12 w-12 text-gold-500" />}
                title="Custom Gift Baskets"
                description="Let us create a personalized gift basket tailored to your recipient's tastes and preferences. Choose from our premium selection of items or bring your own to be beautifully arranged."
              />

              <ServiceCard
                icon={<Flower className="h-12 w-12 text-gold-500" />}
                title="Flower Arrangements"
                description="Our expert florists create stunning floral arrangements for any occasion. From romantic bouquets to elegant centerpieces, we use only the freshest, high-quality blooms."
              />

              <ServiceCard
                icon={<House className="h-12 w-12 text-gold-500" />}
                title="Event Decoration"
                description="Transform your special event with our professional decoration services. We handle everything from balloon arrangements to complete venue styling for birthdays, weddings, and corporate events."
              />

              <ServiceCard
                icon={<Home className="h-12 w-12 text-gold-500" />}
                title="Interior Accents"
                description="Elevate your home or office space with our curated selection of interior decoration items. Our design consultants can help you select pieces that complement your existing décor."
              />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-12 text-center">What Our Clients Say</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Testimonial
                quote="The flower arrangement Plum created for my daughter's wedding was absolutely breathtaking. Everyone was asking who did our flowers!"
                author="Sarah Johnson"
                role="Wedding Client"
              />

              <Testimonial
                quote="I ordered a custom gift basket for my business partner, and the attention to detail was impressive. The presentation was elegant and memorable."
                author="Michael Chen"
                role="Corporate Client"
              />

              <Testimonial
                quote="Plum transformed our office party with their balloon decorations. The space looked magical and our team was blown away."
                author="Lisa Rodriguez"
                role="Event Client"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Create Something Special?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Contact us today to discuss your needs and let us help you create a memorable experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-gold-400 hover:bg-gold-500 text-white"
                onClick={handleWhatsAppClick}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Contact Us on WhatsApp
              </Button>

              <Button variant="outline" className="border-gold-300 text-gold-600 hover:bg-gold-100">
                View Portfolio
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

const ServiceCard = ({ icon, title, description }: {
  icon: React.ReactNode,
  title: string,
  description: string
}) => (
  <div className="bg-white rounded-xl shadow-md p-8 transition-transform hover:scale-105">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Testimonial = ({ quote, author, role }: {
  quote: string,
  author: string,
  role: string
}) => (
  <div className="bg-white rounded-xl shadow-md p-8">
    <div className="text-4xl text-gold-300 mb-4">"</div>
    <p className="text-gray-600 italic mb-6">{quote}</p>
    <Separator className="mb-4" />
    <div>
      <p className="font-semibold">{author}</p>
      <p className="text-gray-500 text-sm">{role}</p>
    </div>
  </div>
);

export default Services;
