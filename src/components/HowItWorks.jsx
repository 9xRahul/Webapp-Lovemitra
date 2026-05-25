import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Search, MessageCircle, Heart } from 'lucide-react';

const Step = ({ number, icon: Icon, title, description, index }) => (
  <motion.div
    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    className="flex flex-col items-center text-center p-6"
  >
    <div className="relative mb-8">
      <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center relative z-10">
        <Icon className="text-primary-start" size={40} />
      </div>
      <div className="absolute -top-4 -right-4 w-10 h-10 bg-brand-gradient rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-20">
        {number}
      </div>
      {/* Connector for desktop */}
      {index < 3 && (
        <div className="hidden lg:block absolute top-1/2 left-[120%] w-[100%] h-[2px] bg-gradient-to-r from-primary-start/20 to-transparent z-0" />
      )}
    </div>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-gray-600 max-w-xs">{description}</p>
  </motion.div>
);

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Create Profile",
      description: "Sign up and build your unique profile with our easy guided process."
    },
    {
      icon: Search,
      title: "Find Matches",
      description: "Set your preferences and let our algorithm find your ideal compatible partners."
    },
    {
      icon: MessageCircle,
      title: "Start Chatting",
      description: "Break the ice with our fun prompts or send a simple 'Hello' to get things going."
    },
    {
      icon: Heart,
      title: "Find Love",
      description: "Go on real dates and build lasting connections with people you truly vibe with."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-24 bg-pastel-orange/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">How <span className="gradient-text">LoveMitra</span> Works</h2>
          <p className="text-xl text-gray-500">Your journey to finding love is just 4 steps away.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 relative">
          {steps.map((step, index) => (
            <Step key={index} {...step} number={index + 1} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
