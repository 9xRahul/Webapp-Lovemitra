import React, { useState, useEffect } from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/#features' },
    { name: 'Safety', href: '/#safety' },
    { name: 'How it Works', href: '/#how-it-works' },
    { name: 'Contact', href: '/#contact' },
  ];

  if (new URLSearchParams(window.location.search).get('minimal') === 'true') {
    return null;
  }

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-3 shadow-sm' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <img 
                src="logo-full.png" 
                alt="LoveMitra Logo" 
                className={`${scrolled ? 'h-10 sm:h-12' : 'h-12 sm:h-16'} w-auto object-contain transition-all duration-300 group-hover:scale-105`} 
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-700 hover:text-primary-start font-medium transition-colors duration-300"
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center space-x-4">
              <Link to="/login" className="px-5 py-2.5 text-sm font-semibold text-primary-start border-2 border-primary-start/20 rounded-full hover:bg-primary-start/5 transition-all duration-300">
                Login
              </Link>
              <button className="gradient-button !py-2.5 !px-6 text-sm">
                Download App
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-start transition-colors"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="md:hidden fixed inset-0 z-[9999] bg-white flex flex-col h-screen w-screen overflow-hidden"
            style={{ backgroundColor: '#ffffff' }}
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-10">
              <Link to="/" onClick={() => setIsOpen(false)}>
                <img src="logo-full.png" alt="LoveMitra Logo" className="h-10 w-auto object-contain" />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-900"
              >
                <X size={32} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto px-8 py-10 bg-white">
              <div className="flex flex-col space-y-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-4xl font-bold text-gray-900 border-b border-gray-50 pb-4"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              
              <div className="mt-12 flex flex-col gap-4">
                <Link to="/login" onClick={() => setIsOpen(false)} className="w-full flex justify-center py-4 text-gray-700 font-bold rounded-2xl border border-gray-200 text-xl">
                  Log in
                </Link>
                <button className="w-full gradient-button py-5 text-white font-bold rounded-2xl text-xl shadow-xl">
                  Download App
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
