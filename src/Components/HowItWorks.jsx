import { motion } from "framer-motion";
import { FaSearch, FaFileAlt, FaHandshake, FaHome, FaArrowRight } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import HeadingSection from "../shared/HeadingSection";

const steps = [
  {
    step: "01",
    title: "Browse & Match",
    desc: "Explore verified pets in our listing or take the 1-minute Smart Matchmaker Quiz to find your lifestyle match.",
    icon: <FaSearch className="w-6 h-6 text-black" />,
  },
  {
    step: "02",
    title: "Submit Application",
    desc: "Click 'Adopt Now' on any pet and submit your contact information with 100% free, transparent application process.",
    icon: <FaFileAlt className="w-6 h-6 text-black" />,
  },
  {
    step: "03",
    title: "Meet & Greet",
    desc: "Coordinate with the caregiver or shelter to spend time with the pet and make sure your hearts align.",
    icon: <FaHandshake className="w-6 h-6 text-black" />,
  },
  {
    step: "04",
    title: "Welcome Home",
    desc: "Finalize the adoption, download your Official Pet Adoption Certificate, and welcome your soulmate into your family!",
    icon: <FaHome className="w-6 h-6 text-black" />,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
    },
  },
};

const stepCardVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const HowItWorks = () => {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <HeadingSection
            title="How Adoption Works"
            subtitle="Bringing a new furry family member into your home is simple, safe, and completely transparent with PeddyCare."
          />
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative mt-12"
        >
          {steps.map((item, index) => (
            <motion.div
              key={index}
              variants={stepCardVariants}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="bg-gray-50/80 hover:bg-orange-50/60 border border-gray-200 hover:border-[#FBAE02] rounded-3xl p-7 transition-colors duration-300 shadow-xs hover:shadow-xl relative group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#FBAE02] flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <span className="text-3xl font-black text-gray-300 group-hover:text-orange-500 transition-colors font-mono">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2.5 group-hover:text-orange-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200/60 text-xs font-bold text-[#FBAE02] group-hover:text-orange-600 flex items-center gap-1 transition-colors">
                Step {index + 1} of 4 →
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Banner Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-14 text-center"
        >
          <p className="text-sm text-gray-500 mb-4">
            Ready to give a rescued friend the loving life they've been praying for?
          </p>
          <NavLink
            to="/pet-listing"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-extrabold py-3.5 px-8 rounded-xl shadow-lg transition duration-200 text-sm hover:scale-105 active:scale-95"
          >
            Start Your Adoption Journey Today
            <FaArrowRight className="w-3.5 h-3.5" />
          </NavLink>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
