import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const Privacy = () => {
  const isMinimal = new URLSearchParams(window.location.search).get('minimal') === 'true';

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className={`${isMinimal ? 'pt-10' : 'pt-32'} pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-pink max-w-none"
        >
          <h1 className="text-4xl font-bold mb-8 gradient-text">Privacy Policy</h1>
          <p className="text-gray-600 mb-6 italic">Last Updated: April 28, 2026</p>
          
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              Welcome to LoveMitra. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
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
            <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>To provide and maintain our Service.</li>
              <li>To facilitate matching and communication between users.</li>
              <li>To verify your identity and ensure community safety.</li>
              <li>To improve our AI algorithms and user experience.</li>
              <li>To send you administrative information and marketing communications.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">4. Safety and Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We use AI moderation and manual review to keep LoveMitra safe. Your photos are analyzed for NSFW content and identity verification. We do not sell your personal data to third parties.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
            <p className="text-gray-600 leading-relaxed">
              You have the right to access, update, or delete your information at any time through your profile settings. You can also request a copy of the data we hold about you by contacting our support team.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">6. Cookie Policy</h2>
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
            <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:<br />
              <strong>Email:</strong> privacy@lovemitra.com<br />
              <strong>Address:</strong> LoveMitra HQ, Innovation Hub, Bengaluru, India.
            </p>
          </section>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
