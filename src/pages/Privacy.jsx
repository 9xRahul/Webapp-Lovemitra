import React from 'react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { motion } from 'framer-motion';

const Privacy = () => {
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
              Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">Policy</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-gray-600 font-medium italic"
            >
              Last Updated: April 28, 2026
            </motion.p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24 flex-grow bg-white relative z-10 -mt-10 rounded-t-3xl shadow-sm border-t border-gray-100">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 prose prose-pink max-w-none"
          >
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">1. Introduction</h2>
              <p className="text-gray-600 leading-relaxed">
                Welcome to LoveMitra. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">2. Information We Collect</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We collect information that you provide directly to us when you create an account, update your profile, or communicate with us. This includes:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Account Information:</strong> Name, email address, phone number, and password.</li>
                <li><strong>Profile Information:</strong> Gender, date of birth, location, photos, interests, and bio.</li>
                <li><strong>Verification Data:</strong> Photos taken for AI selfie verification.</li>
                <li><strong>Usage Data:</strong> Information about your interactions with other users and our services.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>To provide and maintain our Service.</li>
                <li>To facilitate matching and communication between users.</li>
                <li>To verify your identity and ensure community safety.</li>
                <li>To improve our AI algorithms and user experience.</li>
                <li>To send you administrative information and marketing communications.</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">4. Safety and Security</h2>
              <p className="text-gray-600 leading-relaxed">
                We use AI moderation and manual review to keep LoveMitra safe. Your photos are analyzed for NSFW content and identity verification. We do not sell your personal data to third parties.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">5. Your Rights</h2>
              <p className="text-gray-600 leading-relaxed">
                You have the right to access, update, or delete your information at any time through your profile settings. You can also request a copy of the data we hold about you by contacting our support team.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">6. Cookie Policy</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our use of cookies is strictly limited to essential functionality necessary to provide you with a seamless and secure experience. This section outlines exactly how we approach local storage and cookies on your device.
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                <li><strong>Strictly Essential Use:</strong> We only use cookies and local storage mechanisms to maintain your active session, remember your login state, and ensure the app functions correctly during your visit.</li>
                <li><strong>Zero Marketing or Tracking:</strong> <strong className="text-gray-900">We do not store cookies or any data for marketing, advertising, or retargeting purposes.</strong> We do not use third-party tracking pixels or persistent marketing trackers. Your activity on LoveMitra is not packaged or shared with ad networks.</li>
                <li><strong>No Cross-Site Tracking:</strong> The minimal functional data we temporarily store cannot track your behavior across other websites or applications.</li>
              </ul>
              <p className="text-gray-600 leading-relaxed">
                By designing our system this way, we ensure your privacy remains completely intact and free from intrusive data-harvesting practices common in other apps.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">7. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at:<br />
                <strong>Email:</strong> privacy@lovemitra.com<br />
                <strong>Address:</strong> LoveMitra HQ, Innovation Hub, Bengaluru, India.
              </p>
            </section>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Privacy;
