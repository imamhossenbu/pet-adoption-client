import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { FaPaw, FaMagic, FaHome, FaHeart, FaArrowRight } from "react-icons/fa";
import HeadingSection from "../shared/HeadingSection";

const MatchmakerBanner = () => {
  return (
    <div className="py-16 bg-white overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <HeadingSection
          title="Find Your Soulmate With AI"
          subtitle="Unsure whether a playful pup or an independent cat fits your lifestyle best? Let our intelligent algorithm guide you!"
        />
      </motion.div>

      <div className="container mx-auto px-4 md:px-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-gradient-to-br from-[#1D1D1D] via-[#2A2A2A] to-[#1D1D1D] rounded-3xl p-8 md:p-14 text-white overflow-hidden shadow-2xl border border-gray-800"
        >
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 opacity-10 text-[#FBAE02] pointer-events-none">
            <FaPaw size={260} />
          </div>
          <div className="absolute -bottom-10 left-1/3 opacity-5 text-orange-400 pointer-events-none">
            <FaHeart size={180} />
          </div>

          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-[#FBAE02] text-black font-extrabold text-xs uppercase px-3.5 py-1.5 rounded-full mb-4 shadow-md">
              <FaMagic className="text-black" />
              Smart Pet Matchmaker
            </span>

            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
              Meet The Pet Destined <br className="hidden sm:inline" />
              For Your <span className="text-[#FBAE02]">Unique Lifestyle</span>
            </h2>

            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 max-w-2xl">
              Answer 5 quick questions regarding your space, schedule, and family. We calculate compatibility percentages and connect you directly with pets waiting for a loving home like yours.
            </p>

            {/* 3 Quick Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { icon: <FaHome className="text-[#FBAE02] w-5 h-5 mb-2" />, title: "Space Analysis", desc: "Matched to apartments, yards, or farms." },
                { icon: <FaPaw className="text-[#FBAE02] w-5 h-5 mb-2" />, title: "Energy Alignment", desc: "Calm lap companions or high-energy buddies." },
                { icon: <FaHeart className="text-[#FBAE02] w-5 h-5 mb-2" />, title: "Match Percentage", desc: "See direct compatibility scores instantly." }
              ].map((f, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white/10 backdrop-blur-xs rounded-xl p-4 border border-white/10 transition-colors"
                >
                  {f.icon}
                  <h4 className="font-bold text-sm text-white">{f.title}</h4>
                  <p className="text-xs text-gray-400 mt-1">{f.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="flex flex-wrap items-center gap-4">
              <NavLink
                to="/pet-matchmaker"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FBAE02] to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black hover:text-white font-extrabold py-3.5 px-8 rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 text-base"
              >
                Start Free Matchmaker Quiz
                <FaArrowRight className="w-4 h-4" />
              </NavLink>

              <span className="text-xs text-gray-400">
                ⏱ Takes only 1 minute • No signup required
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MatchmakerBanner;
