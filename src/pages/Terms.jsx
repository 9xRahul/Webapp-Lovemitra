import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const Terms = () => {
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
          <h1 className="text-4xl font-bold mb-8 gradient-text">Terms of Usage</h1>
          <p className="text-gray-600 mb-6 italic">Last Updated: April 28, 2026</p>
          
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing or using the LoveMitra mobile application or website, you agree to be bound by these Terms of Usage. If you do not agree with any part of these terms, you must not use our services.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">2. Zero Tolerance Moderation Policy</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              LoveMitra is dedicated to providing a completely safe and clean dating experience. We enforce a <strong>strict, zero-tolerance moderation policy</strong> on all user interactions:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Strict Chat Moderation:</strong> All chats are actively monitored for abusive, harassing, or inappropriate language. The words users use are filtered to maintain a respectful environment.</li>
              <li><strong>No Nude or Inappropriate Images:</strong> We strictly prohibit the uploading, sharing, or displaying of nude pictures, sexually explicit content, or inappropriate Display Pictures (DPs). Our AI and manual moderators actively scan and remove such content immediately.</li>
              <li><strong>Unprofessional Behavior:</strong> Any behavior deemed unprofessional, predatory, or disrespectful will result in immediate action. We aim to keep the platform clean and comfortable for everyone.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">3. Clean Usage Policy & Grounds for Suspension</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              To guarantee that suspended users clearly understand why their accounts were terminated, and to ensure a high-quality environment for all, we strictly enforce this <strong>Clean Usage Policy</strong>. Any violation of the following points serves as direct grounds for an immediate and permanent ban without refund or appeal:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-4">
              <li><strong>Spamming & Unsolicited Links:</strong> Sending repetitive, unwanted messages, or dropping unsolicited external links to profiles, businesses, or other platforms is strictly prohibited. Users found spamming will be permanently suspended.</li>
              <li><strong>Bot Usage & Automation:</strong> The use of bots, automated scripts, third-party apps, or emulators to swipe, message, or farm profiles is illegal on LoveMitra. Our systems actively detect non-human behavioral patterns.</li>
              <li><strong>Abusive Words & Profanity:</strong> Hate speech, racial slurs, severe profanity, body shaming, and abusive language in chats or bios are filtered. Attempting to bypass these filters to insult another user will trigger an automatic account suspension.</li>
              <li><strong>High Report Volume:</strong> If a user accumulates a consistently high number of reports from different, unrelated users for "Creepy behavior," "Harassment," or "Inappropriate messages," our administration will preemptively suspend the account to protect the community.</li>
              <li><strong>Financial Scams & Solicitation:</strong> Asking for money, promoting cryptocurrency scams, or soliciting financial assistance is an immediate bannable offense.</li>
              <li><strong>Catfishing & Fake Identities:</strong> Pretending to be someone else, using celebrity photos, or using stolen images as your DP is prohibited. Accounts failing AI selfie verification repeatedly will be locked.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">4. Reporting and Blocking</h2>
            <p className="text-gray-600 leading-relaxed">
              User safety is our highest priority. If you encounter any user violating our guidelines, you have the ability to <strong>Report</strong> and <strong>Block</strong> them instantly from their profile or within the chat. All reports are treated with urgency and are reviewed by our moderation team within 24 hours.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">5. Admin Suspension and Banning</h2>
            <p className="text-gray-600 leading-relaxed">
              LoveMitra administrators possess the full authority to suspend or permanently ban any user account without prior warning. If an admin determines that a user's behavior is unprofessional or violates our strict community guidelines, their account will be suspended immediately to preserve our clean dating experience.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">6. User Conduct and Eligibility</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              You must be at least 18 years old to use LoveMitra. You agree not to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Use the service for commercial solicitation, scams, or spam.</li>
              <li>Impersonate any person or create fake profiles (catfishing).</li>
              <li>Harass, bully, or intimidate other users.</li>
              <li>Share illegal content or promote illegal activities.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">7. Account Deactivation and Deletion</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              You maintain full control over your profile and visibility on LoveMitra:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Deactivation:</strong> You may temporarily deactivate your account at any time. While deactivated, your profile will be completely hidden, and nobody will be able to see you on the app.</li>
              <li><strong>Deletion & 72-Hour Grace Period:</strong> You can permanently delete your account if you choose to leave. To ensure you don't lose your data by mistake, we provide a <strong>72-hour grace period</strong>. During this time, your profile remains completely hidden from all users, giving you the opportunity to rethink your deletion decision. After 72 hours, your data is permanently erased.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              LoveMitra provides the service "as is" and shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use our services.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">9. Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update these Terms from time to time to reflect new safety guidelines or features. Your continued use of the service constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">10. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              For any questions regarding these Terms, please reach out to us at:<br />
              <strong>Email:</strong> legal@lovemitra.com
            </p>
          </section>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
