import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Eye, Lock, UserCheck, AlertTriangle } from 'lucide-react';

const SafetyItem = ({ icon: Icon, title, description }) => (
  <div className="flex gap-6 items-start">
    <div className="flex-shrink-0 w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center">
      <Icon className="text-primary-start" size={24} />
    </div>
    <div>
      <h4 className="text-xl font-bold mb-2 text-gray-900">{title}</h4>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  </div>
);

const Safety = () => {
  return (
    <section id="safety" className="py-20 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="bg-brand-gradient rounded-[3rem] overflow-hidden shadow-2xl relative">
          {/* Background Patterns */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-20" />
          
          <div className="grid lg:grid-cols-2 gap-12 p-8 md:p-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex items-center justify-center"
            >
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30">
                  <ShieldCheck className="text-white w-32 h-32 md:w-40 md:h-40" />
                </div>
                {/* Floating elements */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }} 
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute -top-4 -right-4 bg-white p-4 rounded-2xl shadow-xl"
                >
                  <Lock className="text-primary-start" size={24} />
                </motion.div>
                <motion.div 
                   animate={{ y: [0, 10, 0] }} 
                   transition={{ repeat: Infinity, duration: 4 }}
                  className="absolute bottom-10 -left-10 bg-white p-4 rounded-2xl shadow-xl"
                >
                  <UserCheck className="text-primary-end" size={24} />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8">Your Safety is Our <span className="underline decoration-white/30">Priority</span></h2>
              <p className="text-white/80 text-lg sm:text-xl mb-8 sm:mb-12">We use advanced technology and manual review to ensure your dating experience is safe and secure.</p>
              
              <div className="grid gap-8">
                <SafetyItem 
                  icon={Eye} 
                  title="AI Moderation" 
                  description="Our AI systems scan for inappropriate content and suspicious behavior 24/7." 
                />
                <SafetyItem 
                  icon={UserCheck} 
                  title="Photo Verification" 
                  description="Required verification for all members to prevent catfishing and fake accounts." 
                />
                <SafetyItem 
                  icon={Lock} 
                  title="Privacy Controls" 
                  description="You have full control over who sees your profile and what information is shared." 
                />
                <SafetyItem 
                  icon={AlertTriangle} 
                  title="Report & Block" 
                  description="Easy-to-use reporting tools with a dedicated team responding within minutes." 
                />
              </div>

              <button className="mt-12 bg-white text-primary-start font-bold py-4 px-10 rounded-full hover:shadow-xl transition-all active:scale-95">
                Learn More About Safety
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Safety;
