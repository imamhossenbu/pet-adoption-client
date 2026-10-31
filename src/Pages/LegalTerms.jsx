import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFileContract, FaGavel, FaBan, FaHandHoldingHeart, FaCheckCircle, FaCalendarAlt } from "react-icons/fa";

const TermsOfService = () => {
  return (
    <div className="bg-gray-50/70 min-h-screen pb-24">
      <Helmet>
        <title>Terms of Service || PeddyCare</title>
      </Helmet>

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#171717] via-[#242424] to-[#171717] text-white py-16 md:py-20 border-b border-gray-800">
        <div className="container mx-auto px-4 md:px-10 text-center max-w-4xl">
          <span className="inline-flex items-center gap-2 bg-[#FBAE02] text-black font-extrabold text-xs uppercase px-4 py-1.5 rounded-full mb-4 shadow-sm">
            <FaFileContract /> Platform Terms & Rules
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            PeddyCare Terms of Service
          </h1>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Welcome to PeddyCare. By accessing or using our platform, you agree to comply with our ethical animal welfare guidelines and community commitments.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-6">
            <FaCalendarAlt className="text-[#FBAE02]" />
            <span>Effective: October 2026 • Applies to all registered members & visitors</span>
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
              1. Acceptance of Terms & Mission
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              PeddyCare is an ethical pet adoption, welfare, and rescue donation platform. By creating an account, browsing listings, submitting adoption requests, or donating, you enter into a legally binding agreement to uphold the terms set forth herein.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              If you disagree with any portion of these terms, you must discontinue using our services immediately.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-4 flex items-center gap-2.5">
              <span className="w-2.5 h-6 bg-orange-500 rounded-full"></span>
              2. Strict Ethical Listing Policy (Zero Tolerance for Puppy Mills)
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              PeddyCare exists exclusively to facilitate ethical pet rescue, rehoming, and non-profit animal support. The following activities are strictly prohibited and will result in immediate permanent account termination and potential legal referral:
            </p>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
                <FaBan className="text-red-600 w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-red-900 text-sm">Commercial Breeding & Sale</h4>
                  <p className="text-xs text-red-700 mt-0.5">
                    No commercial breeders, puppy/kitten mills, or sale of pets for profit are permitted. All pet rehoming must prioritize animal welfare.
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
                <FaBan className="text-red-600 w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-red-900 text-sm">Misrepresentation of Pet Health</h4>
                  <p className="text-xs text-red-700 mt-0.5">
                    Caregivers must disclose all known medical conditions, behavioral quirks, and vaccination records honestly. Concealing known issues is a direct violation of these terms.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-4 flex items-center gap-2.5">
              <span className="w-2.5 h-6 bg-[#1D1D1D] rounded-full"></span>
              3. Adopter Commitments & Obligations
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              Individuals submitting adoption requests agree to:
            </p>
            <ul className="space-y-2.5 text-sm text-gray-700">
              <li className="flex items-start gap-2.5">
                <FaCheckCircle className="text-emerald-600 w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Provide accurate information regarding housing type, pet permissions from landlords, and household composition.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <FaCheckCircle className="text-emerald-600 w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Provide adequate nourishment, continuous fresh water, safe shelter, exercise, veterinary care, and loving attention throughout the pet's lifetime.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <FaCheckCircle className="text-emerald-600 w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Commit to non-abandonment. If personal circumstances prevent continued care, the adopter must contact PeddyCare or the original caregiver for safe surrender rather than abandoning or surrendering to a high-kill shelter.</span>
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-4 flex items-center gap-2.5">
              <span className="w-2.5 h-6 bg-orange-600 rounded-full"></span>
              4. Donation Campaigns & Financial Transparency
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              Donation campaigns on PeddyCare are audited and managed through verified Stripe payment processing:
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-600 pl-2">
              <li>Donations are strictly designated for animal medical emergencies, shelter operations, and rescue nutrition.</li>
              <li>Campaign creators must submit veterinary invoices and photographic progress updates.</li>
              <li>All donations are non-refundable once disbursed for the designated medical treatment or surgery.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-4 flex items-center gap-2.5">
              <span className="w-2.5 h-6 bg-[#FBAE02] rounded-full"></span>
              5. Account Suspension and Banning Rights
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              PeddyCare administrators reserve the right to suspend or permanently ban any user account, revoke listing privileges, or reject adoption requests if a user violates these terms, exhibits abusive language, or endangers animal welfare.
            </p>
          </div>

          {/* Bottom Callout */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <div>
              <h4 className="font-extrabold text-gray-900 text-base">Questions regarding our terms?</h4>
              <p className="text-xs text-gray-600 mt-1">Our legal & welfare committee is available for inquiries.</p>
            </div>
            <Link
              to="/contact"
              className="bg-[#1D1D1D] hover:bg-black text-[#FBAE02] hover:text-white font-extrabold text-xs px-5 py-3 rounded-xl transition duration-200 shadow whitespace-nowrap"
            >
              Contact Legal Department
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
