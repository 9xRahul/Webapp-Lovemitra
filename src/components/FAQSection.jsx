import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex w-full items-center justify-between text-left focus:outline-none group"
        onClick={onClick}
      >
        <h3 className="text-lg font-medium text-gray-900 group-hover:text-pink-600 transition-colors">
          {question}
        </h3>
        <ChevronDown 
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-pink-600' : ''}`} 
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pt-4 text-gray-600 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
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

  return (
    <section className="py-20 bg-slate-50" id="faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <div className="bg-pink-100 p-3 rounded-full text-pink-600">
              <MessageCircleQuestion size={32} />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4 text-slate-900 font-heading">Frequently Asked Questions</h2>
          <p className="text-gray-600 text-lg">
            Everything you need to know about how LoveMitra works.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8"
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-slate-600">
            Still have questions? <br/> Contact our support team at <a href="mailto:support@lovemitra.com" className="text-pink-600 font-medium hover:underline">support@lovemitra.com</a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
