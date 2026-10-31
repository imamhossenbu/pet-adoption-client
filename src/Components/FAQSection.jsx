import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dogImage from "../assets/faq.jpg"; 
import { FaChevronDown, FaQuestionCircle, FaPaw } from "react-icons/fa";

const faqs = [
  {
    question: "Is adopting a pet through PeddyCare completely free?",
    answer: "Yes! PeddyCare is a 100% non-profit animal rescue platform. There are no hidden fees to submit an adoption request. All adopters receive full transparent medical and vaccination history of their chosen pet.",
  },
  {
    question: "How does the Smart Matchmaker Quiz calculate compatibility?",
    answer: "Our intelligent algorithm analyzes your living environment (apartment vs house), daily available time, activity preferences, and family situation to score compatibility (e.g. 98% Match) with available pets.",
  },
  {
    question: "Are all pets vaccinated and health-checked before adoption?",
    answer: "Every single rescued pet is examined by certified veterinarians, given core vaccinations (Rabies, DHPP/FVRCP), dewormed, and provided with veterinary clearance before joining their new home.",
  },
  {
    question: "Can I adopt if I live in a rented apartment or compact flat?",
    answer: "Absolutely! Many pets (especially calm cats, rabbits, gentle small-to-medium dogs, and birds) thrive in apartment settings. Check the pet's energy level or use our Matchmaker to find apartment-friendly pets.",
  },
  {
    question: "How are urgent donation funds tracked and verified?",
    answer: "Every donation drive is vetted by our administrators. Funds raised through Stripe directly cover veterinary surgery bills, hospital stay costs, and nutrition. Donors can also review their past donations and receipts in their dashboard.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white border-t border-gray-100 overflow-hidden">
      <div className="container mx-auto px-6 md:px-10 flex flex-col lg:flex-row items-center gap-12">
        {/* Left Side: Image with Badge */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full lg:w-1/2 relative group"
        >
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <img
              src={dogImage}
              alt="FAQ Happy Dogs"
              className="w-full h-[450px] object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute -bottom-5 -right-5 bg-gradient-to-r from-[#1D1D1D] to-[#2D2D2D] text-white p-5 rounded-2xl shadow-xl border border-gray-700 hidden sm:flex items-center gap-3"
          >
            <span className="p-3 bg-[#FBAE02] text-black rounded-xl">
              <FaPaw className="w-6 h-6" />
            </span>
            <div>
              <p className="font-bold text-sm text-white">Have Questions?</p>
              <p className="text-xs text-[#FBAE02]">Our care team is always here to help!</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side: Accordion */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full lg:w-1/2"
        >
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#FBAE02] bg-orange-50 px-3 py-1 rounded-full border border-orange-200 inline-block mb-3">
            Common Inquiries
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight">
            Frequently Asked <span className="text-orange-600">Questions</span>
          </h2>

          <div className="space-y-3.5">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "border-[#FBAE02] bg-orange-50/50 shadow-xs"
                      : "border-gray-200 hover:border-orange-200 bg-white"
                  }`}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="flex justify-between items-center w-full p-4 md:p-5 text-left font-bold text-gray-800 focus:outline-none gap-3 transition-colors"
                  >
                    <span className="flex items-center gap-2.5 text-sm md:text-base">
                      <FaQuestionCircle className={`w-4 h-4 flex-shrink-0 ${isOpen ? "text-orange-500" : "text-gray-400"}`} />
                      {faq.question}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isOpen ? "bg-[#FBAE02] text-black" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <FaChevronDown className="w-3 h-3" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-gray-600 leading-relaxed border-t border-orange-100/60 ml-6">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
