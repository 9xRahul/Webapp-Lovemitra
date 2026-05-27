import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const CTA = () => {
  return (
    <section id="download" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-gradient rounded-[3rem] p-12 md:p-24 text-center relative z-10 shadow-2xl">
          {/* Animated Circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6 sm:mb-8">
              Ready to find your <br /> <span className="text-white/80 italic">Perfect Match?</span>
            </h2>
            <p className="text-white/90 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              Join millions of people who have already found meaningful relationships on LoveMitra. Download the app today!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button className="flex items-center gap-4 bg-gray-900 text-white px-10 py-5 rounded-3xl hover:bg-black transition-all hover:scale-105 shadow-xl border border-white/10">
                <Play className="fill-white" size={28} />
                <div className="text-left">
                  <p className="text-xs uppercase opacity-70">Get it on</p>
                  <p className="text-xl font-bold">Google Play</p>
                </div>
              </button>
            </div>

            <div className="mt-16 flex flex-wrap justify-center gap-8 text-white/60 text-sm font-semibold uppercase tracking-widest">
              <span>★ 4.9 Rating</span>
              <span>•</span>
              <span>10M+ Downloads</span>
              <span>•</span>
              <span>Featured on App Store</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
