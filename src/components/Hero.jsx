import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import matchesImg from '../assets/screenshots/matches2.jpeg';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-32 sm:pt-40 overflow-hidden bg-pastel-pink/30">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-start/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-primary-end/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm mb-6 border border-primary-start/10">
              <Sparkles className="text-primary-start" size={16} />
              <span className="text-xs sm:text-sm font-semibold text-gray-700">The #1 Choice for Real Connections</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6">
              Find Real <br className="hidden sm:block" /> <span className="gradient-text">Connections</span>, <br className="hidden sm:block" /> Not Just Matches
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              LoveMitra uses smart compatibility algorithms to help you find someone who truly understands you. Join millions finding love today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/login" className="gradient-button w-full sm:w-auto py-5 px-10 text-lg flex items-center justify-center gap-2 group shadow-xl">
                <Heart className="group-hover:fill-white transition-all" size={20} />
                Get Started Now
              </Link>
              <button className="outline-button w-full sm:w-auto py-5 px-10 text-lg flex items-center justify-center gap-2 border-2">
                <Smartphone size={20} />
                Download App
              </button>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/150?u=love${i}`} alt="user" />
                  </div>
                ))}
              </div>
              <div>
                <p className="font-bold text-gray-900">10k+ Members</p>
                <p className="text-sm text-gray-500 underline decoration-primary-start cursor-pointer">Find yours today →</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            {/* Phone Mockup Placeholder */}
            <div className="relative mx-auto w-[280px] h-[580px] bg-gray-900 rounded-xl p-2 shadow-2xl border-[3px] border-gray-700 overflow-hidden">
              {/* Phone Frame inner black border */}
              <div className="absolute inset-0 border-[5px] border-black rounded-xl pointer-events-none z-20"></div>

              {/* S23 Punch-hole Camera */}
              <div className="absolute top-4 inset-x-0 mx-auto w-3.5 h-3.5 bg-black rounded-full z-30 flex items-center justify-center shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]">
                <div className="w-1 h-1 bg-blue-900/40 rounded-full"></div>
              </div>
              
              <div className="relative w-full h-full bg-black rounded-lg overflow-hidden z-10">
                <img src={matchesImg} alt="LoveMitra App" className="w-full h-full object-cover" />
              </div>
            </div>
            
            {/* Floating Cards */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="absolute top-20 -right-10 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <Heart className="text-white fill-white" size={16} />
                </div>
                <div>
                  <p className="font-bold text-sm">New Match!</p>
                  <p className="text-xs text-gray-500">Alex liked you back</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ repeat: Infinity, duration: 5 }}
              className="absolute bottom-20 -left-10 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-start flex items-center justify-center">
                  <Sparkles className="text-white" size={16} />
                </div>
                <div>
                  <p className="font-bold text-sm">Perfect Match</p>
                  <p className="text-xs text-gray-500">98% Compatibility</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
