import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShieldAlt, FaLock, FaUserSecret, FaCookieBite, FaEnvelope, FaCalendarAlt } from "react-icons/fa";

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50/70 min-h-screen pb-24">
      <Helmet>
        <title>Privacy Policy || PeddyCare</title>
      </Helmet>

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#171717] via-[#242424] to-[#171717] text-white py-16 md:py-20 border-b border-gray-800">
        <div className="container mx-auto px-4 md:px-10 text-center max-w-4xl">
          <span className="inline-flex items-center gap-2 bg-[#FBAE02] text-black font-extrabold text-xs uppercase px-4 py-1.5 rounded-full mb-4 shadow-sm">
            <FaShieldAlt /> Legal & Data Protection
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            PeddyCare Privacy Policy
          </h1>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Your trust and personal security are our utmost priority. Learn how we collect, protect, and handle your information with transparency.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-6">
            <FaCalendarAlt className="text-[#FBAE02]" />
            <span>Last Updated: October 2026 • Effective Immediately</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-10 max-w-4xl -mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-6 md:p-12 shadow-md border border-gray-100 space-y-10"
        >
          {/* Section 1 */}
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-4 flex items-center gap-2.5">
              <span className="w-2.5 h-6 bg-[#FBAE02] rounded-full"></span>
              1. Information We Collect
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              When you use PeddyCare to browse pets, submit adoption applications, donate to emergency veterinary campaigns, or access account services, we may collect:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 pl-2">
              <li><strong>Account Credentials:</strong> Name, email address, password hash, and profile image (via Firebase Authentication or Google Sign-In).</li>
              <li><strong>Adoption Application Details:</strong> Contact phone number, address/living environment, pet ownership history, and preferences submitted in adoption forms.</li>
              <li><strong>Donation & Transaction Data:</strong> Payment card details processed securely through Stripe PCI-DSS Level 1 compliant servers (PeddyCare does not store your full card number).</li>
              <li><strong>Technical & Usage Information:</strong> Browser type, operating system, IP address, and pages visited for platform reliability and security monitoring.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-4 flex items-center gap-2.5">
              <span className="w-2.5 h-6 bg-orange-500 rounded-full"></span>
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              We process your personal information strictly for legitimate animal welfare and platform functionality purposes:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100">
                <h4 className="font-bold text-gray-900 text-sm mb-1">Adoption Matchmaking</h4>
                <p className="text-xs text-gray-600">Connecting adopters with shelter volunteers and generating official adoption certificates.</p>
              </div>
              <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100">
                <h4 className="font-bold text-gray-900 text-sm mb-1">Donation Transparency</h4>
                <p className="text-xs text-gray-600">Issuing official tax receipts, tracking medical emergency campaign goals, and fraud prevention.</p>
              </div>
              <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100">
                <h4 className="font-bold text-gray-900 text-sm mb-1">Security & Moderation</h4>
                <p className="text-xs text-gray-600">Enforcing terms against commercial puppy mills, abusive listings, or unauthorized account access.</p>
              </div>
              <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100">
                <h4 className="font-bold text-gray-900 text-sm mb-1">Service Communication</h4>
                <p className="text-xs text-gray-600">Sending booking confirmations, pet welfare updates, and critical system notifications.</p>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-4 flex items-center gap-2.5">
              <span className="w-2.5 h-6 bg-[#1D1D1D] rounded-full"></span>
              3. Data Security & Storage (Encryption Standards)
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              We employ strict industry-standard technical measures to safeguard your personal data:
            </p>
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-700 space-y-2">
              <p className="flex items-center gap-2">
                <FaLock className="text-emerald-600 flex-shrink-0" />
                <span><strong>SSL/TLS 256-bit Encryption:</strong> All data transmitted between your browser and our servers is strictly encrypted.</span>
              </p>
              <p className="flex items-center gap-2">
                <FaShieldAlt className="text-orange-500 flex-shrink-0" />
                <span><strong>Tokenized JWT Authentication:</strong> Session tokens are securely verified on backend API endpoints.</span>
              </p>
              <p className="flex items-center gap-2">
                <FaUserSecret className="text-gray-700 flex-shrink-0" />
                <span><strong>No Third-Party Data Selling:</strong> We do NOT sell, rent, or trade your personal information to advertising brokers under any circumstances.</span>
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-4 flex items-center gap-2.5">
              <span className="w-2.5 h-6 bg-[#FBAE02] rounded-full"></span>
              4. Cookies and Local Storage
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              PeddyCare utilizes localized browser storage (such as <code>localStorage</code>) to store your Favorite/Wishlist pets and theme preferences so your curated list remains accessible across sessions. We do not use intrusive tracking pixels.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-4 flex items-center gap-2.5">
              <span className="w-2.5 h-6 bg-orange-500 rounded-full"></span>
              5. Your Rights and Data Control
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              Under international privacy guidelines (including GDPR and CCPA standards), you have full control over your data:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-600 pl-2">
              <li>The right to request a digital copy of all personal information we hold about you.</li>
              <li>The right to correct inaccurate or outdated information in your profile.</li>
              <li>The right to request permanent deletion of your account and adoption history.</li>
            </ul>
          </div>

          {/* Contact Box */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-orange-50/40 p-6 rounded-2xl border border-orange-100">
            <div>
              <h4 className="font-extrabold text-gray-900 text-base">Questions about your privacy?</h4>
              <p className="text-xs text-gray-600 mt-1">Our Data Protection Officer is ready to assist you.</p>
            </div>
            <Link
              to="/contact"
              className="bg-[#1D1D1D] hover:bg-black text-[#FBAE02] hover:text-white font-extrabold text-xs px-5 py-3 rounded-xl transition duration-200 shadow whitespace-nowrap"
            >
              Contact Privacy Team
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
