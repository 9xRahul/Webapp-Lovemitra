import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-20 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
          >
            Get in <span className="gradient-text">Touch</span>
          </motion.h2>
          <p className="text-xl text-gray-500">Have questions? We're here to help you find your perfect match.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center flex-shrink-0">
                <Mail className="text-primary-start" size={24} />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-1">Email Us</h4>
                <p className="text-gray-600">support@lovemitra.com</p>
              </div>
            </div>
            
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center flex-shrink-0">
                <MessageSquare className="text-primary-start" size={24} />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-1">Live Chat</h4>
                <p className="text-gray-600">Available 24/7 in the app</p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-md flex items-center justify-center flex-shrink-0">
                <MapPin className="text-primary-start" size={24} />
              </div>
              <div>
                <h4 className="text-xl font-bold mb-1">Office</h4>
                <p className="text-gray-600">Mumbai, Maharashtra, India</p>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl space-y-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-start/20 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                <input type="email" placeholder="john@example.com" className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-start/20 outline-none transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Message</label>
              <textarea placeholder="How can we help you?" rows="4" className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-start/20 outline-none transition-all resize-none"></textarea>
            </div>
            <button type="submit" className="w-full gradient-button py-4 text-lg">
              Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
