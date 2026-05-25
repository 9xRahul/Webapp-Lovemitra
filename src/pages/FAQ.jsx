import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FAQSection from '../components/FAQSection';

const FAQ = () => {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow pt-20">
        <FAQSection />
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;
