import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

const CleanUsage = () => {
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
          <h1 className="text-4xl font-bold mb-8 gradient-text">Clean App Usage Policy</h1>
          <p className="text-gray-600 mb-6 italic">Last Updated: April 28, 2026</p>
          
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Our Commitment to Safety</h2>
            <p className="text-gray-600 leading-relaxed">
              At LoveMitra, our highest priority is ensuring a completely safe, clean, and respectful environment for every user. We believe that dating should be free from harassment, scams, and toxicity. This dedicated policy outlines exactly what we consider unacceptable behavior.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Grounds for Immediate Suspension</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              To guarantee that all users clearly understand the rules, we strictly enforce a <strong>Zero-Tolerance Moderation Policy</strong>. Any violation of the following points serves as direct grounds for an immediate and permanent account ban:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-4">
              <li><strong>Spamming & Unsolicited Links:</strong> Sending repetitive, unwanted messages, or dropping unsolicited external links to profiles, businesses, or other platforms is strictly prohibited. Users found spamming will be permanently suspended.</li>
              <li><strong>Bot Usage & Automation:</strong> The use of bots, automated scripts, third-party apps, or emulators to swipe, message, or farm profiles is illegal on LoveMitra. Our systems actively detect non-human behavioral patterns.</li>
              <li><strong>Abusive Words & Profanity:</strong> Hate speech, racial slurs, severe profanity, body shaming, and abusive language in chats or bios are actively filtered. Attempting to bypass these filters to insult another user will trigger an automatic account suspension.</li>
              <li><strong>High Report Volume:</strong> If a user accumulates a consistently high number of reports from different, unrelated users for "Creepy behavior," "Harassment," or "Inappropriate messages," our administration will preemptively suspend the account to protect the community.</li>
              <li><strong>Financial Scams & Solicitation:</strong> Asking for money, promoting cryptocurrency scams, soliciting financial assistance, or attempting to sell content is an immediate bannable offense.</li>
              <li><strong>Catfishing & Fake Identities:</strong> Pretending to be someone else, using celebrity photos, or using stolen images as your DP is prohibited. Accounts failing AI selfie verification repeatedly will be permanently locked.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Review and Appeals</h2>
            <p className="text-gray-600 leading-relaxed">
              Our automated AI and manual moderation teams review reports 24/7. Due to the severe nature of these violations, bans issued under the Clean App Usage Policy are generally final and cannot be appealed. We take these steps to ensure the platform remains a safe place to find real connections.
            </p>
          </section>

        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default CleanUsage;
