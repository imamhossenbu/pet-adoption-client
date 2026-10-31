import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPaw, FaHeart, FaHome, FaShieldAlt, FaAward, FaCheckCircle, FaCalendarCheck } from "react-icons/fa";

const AdoptionPolicy = () => {
  return (
    <div className="bg-gray-50/70 min-h-screen pb-24">
      <Helmet>
        <title>Adoption Policy & Guidelines || PeddyCare</title>
      </Helmet>

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[#171717] via-[#242424] to-[#171717] text-white py-16 md:py-20 border-b border-gray-800">
        <div className="container mx-auto px-4 md:px-10 text-center max-w-4xl">
          <span className="inline-flex items-center gap-2 bg-[#FBAE02] text-black font-extrabold text-xs uppercase px-4 py-1.5 rounded-full mb-4 shadow-sm">
            <FaPaw /> Ethical Adoption Standards
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            PeddyCare Adoption Policy & Welfare Guidelines
          </h1>
          <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Our ethical charter designed to ensure every rescued animal finds a safe, affectionate, and permanent forever home.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-6">
            <FaCalendarCheck className="text-[#FBAE02]" />
            <span>Updated: October 2026 • Certified Animal Welfare Standards</span>
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
          {/* Section 1: Core Philosophy */}
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-4 flex items-center gap-2.5">
              <span className="w-2.5 h-6 bg-[#FBAE02] rounded-full"></span>
              1. Our Core Adoption Philosophy
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              At PeddyCare, we believe adoption is not a transaction—it is the creation of a family bond. Our primary duty of care is to the rescued animal, ensuring they are placed in an environment where their physical, mental, and emotional needs are fully met for the entirety of their natural life.
            </p>
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
              <FaHeart className="text-orange-600 w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>
                <strong>100% Free Adoption Application:</strong> We never charge application filing fees. All screening is performed freely by our compassionate welfare volunteers and foster parents.
              </span>
            </div>
          </div>

          {/* Section 2: Adopter Eligibility */}
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-4 flex items-center gap-2.5">
              <span className="w-2.5 h-6 bg-orange-500 rounded-full"></span>
              2. Minimum Adopter Eligibility Criteria
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              To submit a verified adoption request through PeddyCare, applicants must satisfy the following minimum criteria:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm mb-1">Age & Responsibility</h4>
                <p className="text-xs text-gray-600">The primary applicant must be at least 18 years of age and legally capable of entering a care agreement.</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm mb-1">Housing & Permission</h4>
                <p className="text-xs text-gray-600">Homeowners or renters with explicit landlord authorization confirming pet permissions.</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm mb-1">Household Consensus</h4>
                <p className="text-xs text-gray-600">All adults residing in the home must be in agreement regarding the pet adoption.</p>
              </div>
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <h4 className="font-bold text-gray-900 text-sm mb-1">Financial Capability</h4>
                <p className="text-xs text-gray-600">Commitment to provide ongoing nutrition, preventative medical care, and emergency care.</p>
              </div>
            </div>
          </div>

          {/* Section 3: Veterinary Medical Standards */}
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-4 flex items-center gap-2.5">
              <span className="w-2.5 h-6 bg-[#1D1D1D] rounded-full"></span>
              3. Guaranteed Medical & Health Standards
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              Before any pet is cleared for adoption on PeddyCare, our affiliated veterinary clinics ensure:
            </p>
            <ul className="space-y-2.5 text-sm text-gray-700">
              <li className="flex items-start gap-2.5">
                <FaCheckCircle className="text-emerald-600 w-4 h-4 flex-shrink-0 mt-0.5" />
                <span><strong>Mandatory Core Vaccinations:</strong> Rabies, DHPP (dogs) or FVRCP (cats) administered with veterinary records provided.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <FaCheckCircle className="text-emerald-600 w-4 h-4 flex-shrink-0 mt-0.5" />
                <span><strong>Spay / Neuter Requirement:</strong> All pets of appropriate age are sterilized to curb pet homelessness and prevent reproductive health issues.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <FaCheckCircle className="text-emerald-600 w-4 h-4 flex-shrink-0 mt-0.5" />
                <span><strong>Microchipping & Parasite Defense:</strong> ISO international microchip implanted and internal/external parasites treated.</span>
              </li>
            </ul>
          </div>

          {/* Section 4: 30-Day Transition & Return Policy */}
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-4 flex items-center gap-2.5">
              <span className="w-2.5 h-6 bg-orange-600 rounded-full"></span>
              4. 30-Day Transition Support & Safe Return Guarantee
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              We understand that acclimating to a new home takes patience. We encourage adopters to follow the <strong>"Rule of 3"</strong>:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-center">
              <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
                <span className="font-black text-orange-600 text-lg block">3 Days</span>
                <span className="text-xs text-gray-600">To decompress from the shelter</span>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
                <span className="font-black text-orange-600 text-lg block">3 Weeks</span>
                <span className="text-xs text-gray-600">To learn your daily family routine</span>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
                <span className="font-black text-orange-600 text-lg block">3 Months</span>
                <span className="text-xs text-gray-600">To feel completely secure at home</span>
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              If despite behavioral counseling the pet cannot safely integrate into your household, our <strong>No-Fault Return Policy</strong> guarantees that the animal will be received back into our foster network safely. Under no circumstances should an adopted pet be abandoned, re-sold, or surrendered to an euthanasia shelter.
            </p>
          </div>

          {/* Section 5: Official Pet Adoption Certificate */}
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-4 flex items-center gap-2.5">
              <span className="w-2.5 h-6 bg-[#FBAE02] rounded-full"></span>
              5. Official Pet Adoption Certificate
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              Upon final approval of your adoption, PeddyCare generates an official, verifiable <strong>Pet Adoption Certificate</strong> complete with your pet's registration ID, vaccination seal, and adoption timestamp for legal registry and pet licensing.
            </p>
          </div>

          {/* Bottom Action Cards */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <div>
              <h4 className="font-extrabold text-gray-900 text-base">Ready to meet your new best friend?</h4>
              <p className="text-xs text-gray-600 mt-1">Take our 1-minute quiz or explore available pets.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/pet-matchmaker"
                className="bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold text-xs px-4 py-3 rounded-xl transition duration-200 shadow"
              >
                Smart Matchmaker Quiz
              </Link>
              <Link
                to="/pet-listing"
                className="bg-gray-900 hover:bg-black text-white font-extrabold text-xs px-4 py-3 rounded-xl transition duration-200 shadow"
              >
                Browse Pets
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdoptionPolicy;
