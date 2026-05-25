import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, ShieldCheck, MapPin, Search, Users } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -10 }}
    className="bg-white p-8 rounded-3xl card-shadow border border-gray-50 group hover:border-primary-start/20 transition-all"
  >
    <div className="w-14 h-14 bg-pastel-pink rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-gradient transition-colors duration-500">
      <Icon className="text-primary-start group-hover:text-white transition-colors" size={28} />
    </div>
    <h3 className="text-xl font-bold mb-4 text-gray-900">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </motion.div>
);

const Features = () => {
  const features = [
    {
      icon: Target,
      title: "Smart Matching",
      description: "Our AI analyzes personality traits and interests to suggest highly compatible matches."
    },
    {
      icon: Zap,
      title: "Instant Chat",
      description: "Don't wait for a match. Use Spark to send a quick message and get noticed instantly."
    },
    {
      icon: MapPin,
      title: "Local Discovery",
      description: "Find amazing people in your neighborhood or city with our precise location filtering."
    },
    {
      icon: ShieldCheck,
      title: "Verified Profiles",
      description: "Say goodbye to catfishing. Our mandatory photo verification keeps the community real."
    },
    {
      icon: Search,
      title: "Advanced Filters",
      description: "Filter by values, lifestyle, and more to find exactly what you're looking for."
    },
    {
      icon: Users,
      title: "Community Events",
      description: "Join local mixers and group events to meet people in a relaxed, social setting."
    }
  ];

  return (
    <section id="features" className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Why Choose <span className="gradient-text">LoveMitra</span>?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-500 max-w-2xl mx-auto"
          >
            We focus on quality over quantity, providing you with the tools to build meaningful relationships.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
