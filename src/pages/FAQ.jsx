import React, { useState } from 'react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { motion, AnimatePresence } from 'framer-motion';

const faqData = [
  {
    question: "What is LoveMitra?",
    answer: "LoveMitra is a modern matchmaking and dating platform designed to help you find meaningful, genuine connections. We prioritize user safety, authentic profiles, and deep compatibility."
  },
  {
    question: "Is LoveMitra free to use?",
    answer: "Currently, LoveMitra is completely free of cost! You can enjoy our core matchmaking and chat features without any hidden charges. In the future, we may introduce a reasonable, affordable fee for advanced matchmaking features to help maintain the quality and security of the platform."
  },
  {
    question: "How do I match with someone?",
    answer: "It's simple! Browse through profiles and tap the Heart icon (or swipe right) if you're interested. If that person also likes your profile, it becomes a 'Mutual Match,' and a private chat room instantly opens up for both of you."
  },
  {
    question: "How does the compatibility score work?",
    answer: "Our intelligent algorithm analyzes your profile details—such as your interests, location, age, and relationship goals—and compares them with others to generate a unique compatibility score. The higher the score, the better the potential match!"
  },
  {
    question: "Why should I verify my profile picture?",
    answer: "Verifying your profile picture gives you a 'Verified' badge, which significantly increases your reliability and attractiveness to potential matches. It proves you are a genuine person, helping to build trust within the community and giving you priority in the matchmaking pool."
  },
  {
    question: "Can I upload any kind of profile picture?",
    answer: "No. We strictly prohibit explicit, sexually suggestive, or nude profile pictures to maintain a clean and respectful environment. Our advanced AI moderation system automatically detects and prevents the upload of any inappropriate images. Attempting to bypass this will lead to account suspension."
  },
  {
    question: "Is my personal data and chat history private?",
    answer: "Absolutely. We enforce strict data isolation. Your private conversations are end-to-end secured and only visible to you and the person you are matched with. No other users can access your chats or personal match history."
  },
  {
    question: "Do you store my photos after I delete them?",
    answer: "Absolutely not. When you delete a photo or remove your account from the app, the images are permanently and securely erased from our servers. We deeply respect your data privacy and do not hold onto deleted content."
  },
  {
    question: "Do you store my verification selfie?",
    answer: "No, we do not store your verification selfies. The photo verification process happens in real-time to match your live selfie with your uploaded profile pictures. Once the verification succeeds or fails, the temporary selfie data is instantly discarded."
  },
  {
    question: "Do I need to verify my mobile number?",
    answer: "While strict mobile OTP verification might not be fully enforced for everyone right now, we highly encourage you to use your own authentic mobile number. In the near future, mandatory mobile verification will be rolled out for all users to ensure safety, and unverified or fake numbers may lead to immediate account suspension."
  },
  {
    question: "What are Profile Visitors?",
    answer: "Whenever someone views your profile, we notify you! You can check your 'Visitors' tab to see exactly who has been looking at your profile, giving you a chance to make the first move."
  },
  {
    question: "What should I do if someone is behaving inappropriately?",
    answer: "We have a zero-tolerance policy for harassment or toxic behavior (our Clean App Usage Policy). You can instantly Block and Report any user directly from their profile or chat screen. Our moderation team investigates all reports promptly and bans offending accounts."
  }
];

const FAQItem = ({ faq, isOpen, toggleOpen }) => {
  return (
    <div className="mb-4 border border-gray-200 rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md">
      <button
        onClick={toggleOpen}
        className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
      >
        <span className="text-lg font-semibold text-gray-800">{faq.question}</span>
        <div className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-300 ${isOpen ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
          <svg className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6 text-gray-600 leading-relaxed">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <main className="min-h-screen bg-gray-50 font-inter flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-gradient-to-br from-pink-50 via-white to-orange-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-orange-400 blur-[100px] rounded-full mix-blend-multiply filter"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6"
            >
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">Questions</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-gray-600"
            >
              Everything you need to know about LoveMitra and how it works. Can't find the answer you're looking for? Feel free to contact our support team.
            </motion.p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 md:py-24 flex-grow bg-white relative z-10 -mt-10 rounded-t-3xl shadow-sm border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {faqData.map((faq, index) => (
              <FAQItem 
                key={index} 
                faq={faq} 
                isOpen={index === openIndex} 
                toggleOpen={() => setOpenIndex(index === openIndex ? -1 : index)} 
              />
            ))}
          </div>
          
          {/* Still have questions? CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto mt-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Still have questions?</h3>
            <p className="text-pink-100 mb-8 max-w-xl mx-auto">
              Our dedicated support team is always ready to help you with any issues or queries you might have.
            </p>
            <button className="bg-white text-pink-600 font-semibold py-3 px-8 rounded-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              Contact Support
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default FAQ;
