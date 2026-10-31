import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { getServiceBySlug, servicesData } from "../data/servicesData";
import {
  FaCheck,
  FaStar,
  FaShieldAlt,
  FaPhoneAlt,
  FaCalendarCheck,
  FaQuestionCircle,
  FaChevronDown,
  FaArrowLeft,
  FaArrowRight,
  FaPaw,
  FaTimes,
  FaAward,
} from "react-icons/fa";

const ServiceDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const service = getServiceBySlug(slug);

  const [openFaq, setOpenFaq] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({
    petName: "",
    petType: "dog",
    ownerName: "",
    ownerPhone: "",
    preferredDate: "",
    notes: "",
  });

  if (!service) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center text-4xl mb-4">
          🐾
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Service Not Found</h2>
        <p className="text-gray-600 max-w-md mb-6">
          The service details you are looking for might have been moved or updated.
        </p>
        <Link
          to="/services"
          className="bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold px-6 py-3 rounded-xl transition duration-200"
        >
          View All Available Services
        </Link>
      </div>
    );
  }

  const handlePlanClick = (plan) => {
    setSelectedPlan(plan);
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingFormData.ownerName || !bookingFormData.ownerPhone) {
      toast.error("Please provide your name and contact phone number.");
      return;
    }
    toast.success(
      `Inquiry confirmed for ${service.title}! Our care specialist will call you shortly.`
    );
    setIsBookingModalOpen(false);
    setBookingFormData({
      petName: "",
      petType: "dog",
      ownerName: "",
      ownerPhone: "",
      preferredDate: "",
      notes: "",
    });
  };

  const otherServices = servicesData.filter((s) => s.slug !== service.slug);

  return (
    <div className="bg-gray-50/60 pb-24">
      <Helmet>
        <title>{service.title} || PeddyCare Services</title>
      </Helmet>

      {/* Hero Header Banner */}
      <section className="relative bg-gradient-to-r from-[#171717] via-[#242424] to-[#171717] text-white py-16 md:py-24 overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 opacity-15 mix-blend-overlay">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover filter blur-xs"
          />
        </div>

        <div className="container mx-auto px-4 md:px-10 relative z-10">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400 mb-4">
            <Link to="/" className="hover:text-[#FBAE02] transition">
              Home
            </Link>
            <span>/</span>
            <Link to="/services" className="hover:text-[#FBAE02] transition">
              Services
            </Link>
            <span>/</span>
            <span className="text-[#FBAE02] font-semibold">{service.title}</span>
          </div>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 bg-[#FBAE02] text-black font-extrabold text-xs uppercase px-3.5 py-1 rounded-full mb-4 shadow-sm">
              <FaAward /> {service.badge}
            </span>

            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              {service.title}
            </h1>

            <p className="text-base md:text-lg text-gray-300 leading-relaxed mb-6">
              {service.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="font-bold text-white">{service.rating}</span>
                <span className="text-gray-400">({service.totalReviews} verified reviews)</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-gray-400">Starting from:</span>
                <span className="text-2xl font-black text-[#FBAE02]">
                  {service.startingPrice}
                </span>
                <span className="text-xs text-gray-400">/{service.priceUnit}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Sidebar Layout */}
      <div className="container mx-auto px-4 md:px-10 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column (2 Cols): Detailed Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Feature Image Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl p-4 md:p-6 shadow-md border border-gray-100 overflow-hidden"
            >
              <div className="rounded-2xl overflow-hidden h-72 md:h-96 w-full relative">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-[#1D1D1D]/80 backdrop-blur-xs text-[#FBAE02] font-bold text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <FaShieldAlt className="text-emerald-400" /> 100% Certified Care
                </div>
              </div>

              {/* 4 Quick Highlight Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {service.keyHighlights.map((hl, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 flex items-start gap-3"
                  >
                    <span className="p-2.5 bg-[#FBAE02] text-black rounded-xl flex-shrink-0 mt-0.5">
                      <FaPaw className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="font-extrabold text-gray-900 text-sm mb-1">{hl.title}</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">{hl.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Comprehensive Service Overview */}
            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2.5 h-7 bg-[#FBAE02] rounded-full"></span>
                Comprehensive Service Overview
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed text-sm md:text-base">
                {service.overview.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* What's Included */}
            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 flex items-center gap-2">
                <span className="w-2.5 h-7 bg-orange-500 rounded-full"></span>
                What Is Included in Every Session
              </h2>
              <p className="text-xs md:text-sm text-gray-500 mb-6">
                We take pride in transparent, thorough service with zero hidden fees or compromises on pet comfort.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {service.whatsIncluded.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#FBAE02] transition-colors"
                  >
                    <div className="flex items-center gap-2 font-bold text-gray-900 text-base mb-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs flex-shrink-0">
                        <FaCheck />
                      </span>
                      {item.title}
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed pl-7">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Pricing Packages */}
            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
              <div className="text-center max-w-xl mx-auto mb-10">
                <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200 inline-block mb-2">
                  Flexible Rates
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                  Transparent Pricing & Plans
                </h2>
                <p className="text-xs md:text-sm text-gray-500 mt-2">
                  Choose the frequency that fits your routine. All packages come with our 100% happiness guarantee.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {service.pricingPlans.map((plan, idx) => (
                  <div
                    key={idx}
                    className={`rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 relative border ${
                      plan.isPopular
                        ? "bg-gradient-to-b from-orange-50/80 to-amber-50/50 border-[#FBAE02] shadow-lg scale-102"
                        : "bg-white border-gray-200 hover:border-gray-300 shadow-xs"
                    }`}
                  >
                    {plan.isPopular && (
                      <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-600 text-white font-extrabold text-[10px] uppercase tracking-wider py-1 px-3 rounded-full shadow">
                        Recommended Choice
                      </span>
                    )}

                    <div>
                      <h3 className="text-lg font-black text-gray-900 mb-1">{plan.name}</h3>
                      <p className="text-xs text-gray-500 mb-4 min-h-[32px]">{plan.desc}</p>

                      <div className="mb-6 pb-6 border-b border-gray-100">
                        <span className="text-3xl md:text-4xl font-black text-gray-900">
                          {plan.price}
                        </span>
                        <span className="text-xs text-gray-500 block mt-0.5 font-medium">
                          {plan.frequency}
                        </span>
                      </div>

                      <ul className="space-y-3 mb-6 text-xs text-gray-700">
                        {plan.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2">
                            <FaCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePlanClick(plan)}
                      className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs md:text-sm transition-all duration-200 shadow-xs ${
                        plan.isPopular
                          ? "bg-gradient-to-r from-[#FBAE02] to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black hover:text-white"
                          : "bg-gray-900 hover:bg-black text-white"
                      }`}
                    >
                      Book This Plan
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Service FAQs Accordion */}
            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-2.5 h-7 bg-[#FBAE02] rounded-full"></span>
                Frequently Asked Questions
              </h2>

              <div className="space-y-3.5">
                {service.faqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div
                      key={index}
                      className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                        isOpen
                          ? "border-[#FBAE02] bg-orange-50/40"
                          : "border-gray-200 hover:border-orange-200 bg-white"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        className="flex justify-between items-center w-full p-4 md:p-5 text-left font-bold text-gray-800 focus:outline-none gap-3"
                      >
                        <span className="flex items-center gap-2.5 text-sm md:text-base">
                          <FaQuestionCircle
                            className={`w-4 h-4 flex-shrink-0 ${
                              isOpen ? "text-orange-500" : "text-gray-400"
                            }`}
                          />
                          {faq.q}
                        </span>
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
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
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-gray-600 leading-relaxed border-t border-orange-100/60 ml-6">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (1 Col): Sticky Booking & Trust Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <div>
                  <span className="text-xs text-gray-400 uppercase font-bold">Standard Rate</span>
                  <p className="text-3xl font-black text-gray-900">{service.startingPrice}</p>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                  ✓ Available Today
                </span>
              </div>

              {/* Fast Direct Booking Form */}
              <h3 className="font-extrabold text-gray-900 text-base mb-3 flex items-center gap-2">
                <FaCalendarCheck className="text-orange-500" /> Book / Inquire Now
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleBookingSubmit(e);
                }}
                className="space-y-3.5"
              >
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Miller"
                    value={bookingFormData.ownerName}
                    onChange={(e) =>
                      setBookingFormData({ ...bookingFormData, ownerName: e.target.value })
                    }
                    className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +1 555-0192"
                    value={bookingFormData.ownerPhone}
                    onChange={(e) =>
                      setBookingFormData({ ...bookingFormData, ownerPhone: e.target.value })
                    }
                    className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Pet's Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Buddy"
                      value={bookingFormData.petName}
                      onChange={(e) =>
                        setBookingFormData({ ...bookingFormData, petName: e.target.value })
                      }
                      className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Preferred Date</label>
                    <input
                      type="date"
                      value={bookingFormData.preferredDate}
                      onChange={(e) =>
                        setBookingFormData({ ...bookingFormData, preferredDate: e.target.value })
                      }
                      className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Special Notes / Needs</label>
                  <textarea
                    rows={2}
                    placeholder="Any medications, specific allergies or behavior instructions?"
                    value={bookingFormData.notes}
                    onChange={(e) =>
                      setBookingFormData({ ...bookingFormData, notes: e.target.value })
                    }
                    className="w-full p-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold py-3 px-4 rounded-xl shadow-md transition-all duration-200 text-sm"
                >
                  Confirm Free Service Inquiry
                </button>
              </form>

              {/* Safety Badges */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <FaShieldAlt className="text-emerald-500 w-4 h-4 flex-shrink-0" />
                  <span>Bonded, Insured & Background Checked Caregivers</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <FaAward className="text-[#FBAE02] w-4 h-4 flex-shrink-0" />
                  <span>100% Satisfaction or Full Refund Guarantee</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <FaPhoneAlt className="text-orange-500 w-4 h-4 flex-shrink-0" />
                  <span>24/7 Dedicated Emergency Care Hotline</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Explore Other Services Section */}
        <div className="mt-20 pt-12 border-t border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-black text-gray-900">Explore Other Pet Care Services</h3>
              <p className="text-xs text-gray-500">
                Discover our full spectrum of professional, compassionate animal welfare programs.
              </p>
            </div>
            <Link
              to="/services"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700"
            >
              All Services <FaArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherServices.slice(0, 3).map((other) => (
              <div
                key={other.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col"
              >
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={other.image}
                    alt={other.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-[#1D1D1D]/80 backdrop-blur-xs text-[#FBAE02] font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase">
                    From {other.startingPrice}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-lg text-gray-900 group-hover:text-orange-600 transition mb-1">
                      {other.title}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
                      {other.tagline}
                    </p>
                  </div>
                  <Link
                    to={`/services/${other.slug}`}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="text-center bg-gray-100 hover:bg-[#FBAE02] text-gray-900 hover:text-black font-extrabold py-2 px-4 rounded-xl transition duration-200 text-xs block"
                  >
                    View Details & Packages →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Plan Modal */}
      <AnimatePresence>
        {isBookingModalOpen && selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setIsBookingModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
                aria-label="Close modal"
              >
                <FaTimes />
              </button>

              <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
                {service.title}
              </span>
              <h3 className="text-2xl font-black text-gray-900 mt-2 mb-1">
                Book "{selectedPlan.name}"
              </h3>
              <p className="text-xs text-gray-500 mb-6">
                Rate: <strong className="text-gray-900">{selectedPlan.price}</strong> ({selectedPlan.frequency})
              </p>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Henderson"
                    value={bookingFormData.ownerName}
                    onChange={(e) =>
                      setBookingFormData({ ...bookingFormData, ownerName: e.target.value })
                    }
                    className="w-full p-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +1 555-0123"
                    value={bookingFormData.ownerPhone}
                    onChange={(e) =>
                      setBookingFormData({ ...bookingFormData, ownerPhone: e.target.value })
                    }
                    className="w-full p-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Pet Name & Breed</label>
                    <input
                      type="text"
                      placeholder="e.g. Milo (Golden)"
                      value={bookingFormData.petName}
                      onChange={(e) =>
                        setBookingFormData({ ...bookingFormData, petName: e.target.value })
                      }
                      className="w-full p-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Target Start Date</label>
                    <input
                      type="date"
                      value={bookingFormData.preferredDate}
                      onChange={(e) =>
                        setBookingFormData({ ...bookingFormData, preferredDate: e.target.value })
                      }
                      className="w-full p-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Special Notes / Routine</label>
                  <textarea
                    rows={2}
                    placeholder="Any feeding timings, allergies or medical instructions?"
                    value={bookingFormData.notes}
                    onChange={(e) =>
                      setBookingFormData({ ...bookingFormData, notes: e.target.value })
                    }
                    className="w-full p-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#FBAE02] to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black hover:text-white font-black py-3.5 px-4 rounded-xl shadow-lg transition duration-200 text-sm"
                  >
                    Submit Booking Request
                  </button>
                  <p className="text-[11px] text-gray-400 text-center mt-2">
                    🔒 No upfront payment required today. Confirmation is subject to schedule alignment.
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceDetails;
