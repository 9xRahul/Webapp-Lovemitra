import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import Safety from '../components/landing/Safety';
import AppPreview from '../components/landing/AppPreview';
import Testimonials from '../components/landing/Testimonials';
import CTA from '../components/landing/CTA';
import Contact from '../components/landing/Contact';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [hash, pathname]);

  return (
    <main className="w-full bg-white text-gray-900 overflow-x-hidden font-inter">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <AppPreview />
      <Safety />
      <Testimonials />
      <CTA />
      <Contact />
      <Footer />
    </main>
  );
};

export default LandingPage;

