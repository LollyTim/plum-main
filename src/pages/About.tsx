
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Clock, Gift, Heart, Star, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-to-b from-gold-50 to-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1553545985-1e0d8781d5db')] bg-cover bg-center opacity-10"></div>
          <div className="container mx-auto px-6 text-center relative z-10">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">About Plum</h1>
              <p className="text-lg text-gray-700 mb-8 animate-fade-in delay-100">
                Creating moments of joy through thoughtfully curated gifts and premium services since 2010.
              </p>
              <div className="flex flex-wrap justify-center gap-4 animate-fade-in delay-200">
                <Button className="bg-gold-400 hover:bg-gold-500 text-white">
                  Our Services
                </Button>
                <Button variant="outline" className="border-gold-300 text-gold-600 hover:bg-gold-50">
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-slide-up delay-300">
                <h2 className="text-3xl font-bold">Our Story</h2>
                <p className="text-gray-600">
                  Plum was founded with a simple yet powerful mission: to help people express their feelings through meaningful gifts. What began as a small boutique in Lagos, Nigeria, has grown into a beloved brand known for quality and creativity.
                </p>
                <p className="text-gray-600">
                  Our journey started when our founder, Sarah Okafor, recognized the need for a gift shop that offered more than just products – one that provided an experience and helped customers tell their unique stories through thoughtfully selected items.
                </p>
                <p className="text-gray-600">
                  Today, Plum continues to embrace that original vision, combining traditional gift-giving customs with modern aesthetics and convenience. Our team of passionate gift curators and floral designers work tirelessly to create offerings that bring joy to both givers and receivers.
                </p>
              </div>
              
              <div className="relative animate-fade-in delay-500">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-gold-100 rounded-full -z-10"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gold-50 rounded-full -z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1581088677873-2cc89d618a40" 
                  alt="Plum store interior" 
                  className="rounded-xl shadow-xl w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Values Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                At the core of everything we do are the principles that guide our business and relationships.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <ValueCard 
                icon={<Heart className="h-10 w-10 text-gold-500" />}
                title="Thoughtfulness"
                description="We believe in the power of thoughtful gestures to strengthen relationships and create meaningful connections."
              />
              
              <ValueCard 
                icon={<Star className="h-10 w-10 text-gold-500" />}
                title="Quality"
                description="Every product we offer meets our high standards for craftsmanship, durability, and design excellence."
              />
              
              <ValueCard 
                icon={<Users className="h-10 w-10 text-gold-500" />}
                title="Community"
                description="We're committed to supporting local artisans and giving back to the communities we serve."
              />
              
              <ValueCard 
                icon={<Gift className="h-10 w-10 text-gold-500" />}
                title="Joy"
                description="We measure our success by the happiness our products bring to both gift-givers and recipients."
              />
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                The passionate people behind Plum who work tirelessly to create memorable experiences for our customers.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TeamMember 
                name="Sarah Okafor"
                role="Founder & Creative Director"
                image="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"
              />
              
              <TeamMember 
                name="David Chen"
                role="Head of Operations"
                image="https://images.unsplash.com/photo-1560250097-0b93528c311a"
              />
              
              <TeamMember 
                name="Amara Johnson"
                role="Lead Floral Designer"
                image="https://images.unsplash.com/photo-1580489944761-15a19d654956"
              />
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-16 bg-gold-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Don't just take our word for it – hear from the people who've experienced the Plum difference.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Testimonial 
                quote="Plum helped me find the perfect anniversary gift when I was completely out of ideas. Their personalized service made all the difference."
                author="Michael K."
                location="Lagos"
              />
              
              <Testimonial 
                quote="The birthday arrangement they created for my mother was absolutely stunning. It arrived exactly on time and made her day special."
                author="Chioma A."
                location="Abuja"
              />
              
              <Testimonial 
                quote="As a corporate client, I appreciate their attention to detail and ability to handle large orders for our events with consistent quality."
                author="Robert T."
                location="Port Harcourt"
              />
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

const ValueCard = ({ icon, title, description }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string 
}) => (
  <div className="bg-white rounded-xl shadow-md p-6 transition-transform hover:scale-105">
    <div className="flex justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 text-center">{title}</h3>
    <p className="text-gray-600 text-center">{description}</p>
  </div>
);

const TeamMember = ({ name, role, image }: { 
  name: string, 
  role: string, 
  image: string 
}) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105">
    <div className="h-64 overflow-hidden">
      <img 
        src={image} 
        alt={name} 
        className="w-full h-full object-cover"
      />
    </div>
    <div className="p-6 text-center">
      <h3 className="text-xl font-bold mb-1">{name}</h3>
      <p className="text-gray-600">{role}</p>
    </div>
  </div>
);

const Testimonial = ({ quote, author, location }: { 
  quote: string, 
  author: string, 
  location: string 
}) => (
  <div className="bg-white rounded-xl shadow-md p-6">
    <div className="mb-4 text-4xl text-gold-300">"</div>
    <p className="text-gray-600 italic mb-6">{quote}</p>
    <div>
      <p className="font-semibold">{author}</p>
      <p className="text-gray-500 text-sm">{location}</p>
    </div>
  </div>
);

export default About;
