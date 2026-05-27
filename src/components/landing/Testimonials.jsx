import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TestimonialCard = ({ name, role, content, image, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="bg-white p-8 rounded-3xl card-shadow border border-gray-50 relative group"
  >
    <div className="absolute top-6 right-8 text-primary-start/10 group-hover:text-primary-start/20 transition-colors">
      <Quote size={60} fill="currentColor" />
    </div>
    
    <div className="flex gap-1 mb-4">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={16} className="text-yellow-400 fill-yellow-400" />
      ))}
    </div>
    
    <p className="text-gray-600 italic mb-8 relative z-10 leading-relaxed">
      "{content}"
    </p>
    
    <div className="flex items-center gap-4">
      <img src={image} alt={name} className="w-14 h-14 rounded-full object-cover border-2 border-pastel-pink" />
      <div>
        <h4 className="font-bold text-gray-900">{name}</h4>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  </motion.div>
);

const Testimonials = () => {
  const testimonials = [
    {
      name: "Ananya & Rohan",
      role: "Matched in 3 months",
      content: "Finding someone who shares your values in a city like Mumbai is tough. LoveMitra made it possible. We're so grateful for the compatibility matches!",
      image: "https://images.unsplash.com/photo-1605367104085-f55926ec0031?auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Vikram Singh",
      role: "Verified Member",
      content: "The photo verification is what sold me. It's refreshing to use an app where you know the person on the other side is real. Found some amazing friends and more.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Priyanshi Mehta",
      role: "Creative Designer",
      content: "I love the UI and the safety features. It's designed so thoughtfully for women. I've had meaningful conversations that didn't feel rushed or shallow.",
      image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=150&q=80"
    }
  ];

  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Success <span className="gradient-text">Stories</span></h2>
          <p className="text-xl text-gray-500">Join the thousands who found their perfect partner on LoveMitra.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} {...t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
