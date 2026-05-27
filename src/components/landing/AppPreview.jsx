import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Smartphone } from 'lucide-react';

import matchesImg from '../../assets/screenshots/matches.jpeg';
import compatibilityImg from '../../assets/screenshots/compatibility.jpeg';
import itsamatchImg from '../../assets/screenshots/itsamatch.jpeg';
import messagesImg from '../../assets/screenshots/messages.jpg';

const screenshots = [
  { id: 1, src: matchesImg, alt: 'Matches View', title: 'Find Your Match' },
  { id: 2, src: compatibilityImg, alt: 'Compatibility Score', title: 'Check Compatibility' },
  { id: 3, src: itsamatchImg, alt: 'It\'s a Match', title: 'It\'s a Match!' },
  { id: 4, src: messagesImg, alt: 'Message Interface', title: 'Chat Seamlessly' },
];

const AppPreview = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === screenshots.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? screenshots.length - 1 : prevIndex - 1));
  };

  // Auto-slide every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <section className="py-24 bg-pastel-pink/10 overflow-hidden" id="preview">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Experience LoveMitra in <span className="gradient-text">Action</span>
            </h2>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Take a sneak peek at our beautifully designed app interface. From smooth swiping to seamless messaging, everything is crafted for the perfect dating experience.
            </p>

            <div className="space-y-6">
              {screenshots.map((screen, index) => (
                <div 
                  key={screen.id} 
                  className={`flex gap-4 p-4 rounded-2xl transition-all cursor-pointer ${currentIndex === index ? 'bg-white shadow-md border border-pink-100' : 'hover:bg-white/50'}`}
                  onClick={() => setCurrentIndex(index)}
                >
                  <div className={`p-3 rounded-xl h-fit transition-colors ${currentIndex === index ? 'bg-brand-gradient text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <Smartphone size={20} />
                  </div>
                  <div className="flex items-center">
                    <h4 className={`font-bold text-lg transition-colors ${currentIndex === index ? 'text-gray-900' : 'text-gray-500'}`}>
                      {screen.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Phone Mockup Slider */}
          <div className="relative h-[650px] flex items-center justify-center mt-8 lg:mt-0">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-brand-gradient/5 rounded-full blur-3xl scale-150" />
            
            <div className="relative w-[300px] h-[600px] bg-gray-900 rounded-xl p-2 shadow-2xl border-[3px] border-gray-700 overflow-hidden z-10">
              {/* Phone Frame inner black border */}
              <div className="absolute inset-0 border-[6px] border-black rounded-xl pointer-events-none z-20"></div>
              
              {/* S23 Punch-hole Camera */}
              <div className="absolute top-5 inset-x-0 mx-auto w-4 h-4 bg-black rounded-full z-30 flex items-center justify-center shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]">
                <div className="w-1 h-1 bg-blue-900/40 rounded-full"></div>
              </div>
              
              {/* Image Container */}
              <div className="relative w-full h-full rounded-lg overflow-hidden bg-black z-10">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentIndex}
                    src={screenshots[currentIndex].src}
                    alt={screenshots[currentIndex].alt}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
              </div>

              {/* Navigation Arrows */}
              <button 
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-pink-500 hover:scale-110 transition z-30"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-pink-500 hover:scale-110 transition z-30"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AppPreview;
