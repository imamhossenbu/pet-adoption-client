import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import HeadingSection from "../shared/HeadingSection";
import { servicesData } from "../data/servicesData";
import { FaArrowRight, FaStar, FaPaw, FaCheckCircle } from "react-icons/fa";

const ServicesCategory = () => {
  return (
    <section className="py-20 bg-gray-50/80">
      <div className="container mx-auto px-4 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <HeadingSection
            title="Our Professional Services"
            subtitle="Explore our certified veterinary, grooming, training, and foster care programs designed to keep your pets thriving."
          />
        </motion.div>

        {/* 6 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {servicesData.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col justify-between group"
            >
              <div>
                {/* Image Section */}
                <div className="relative h-60 overflow-hidden bg-gray-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#1D1D1D]/85 backdrop-blur-xs text-[#FBAE02] font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider">
                      {service.badge}
                    </span>
                  </div>

                  {/* Starting Price Tag */}
                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs rounded-xl px-3 py-1 text-xs shadow-md border border-gray-100">
                    <span className="text-gray-400 font-bold block text-[9px] uppercase">From</span>
                    <strong className="text-gray-900 font-black text-sm text-orange-600">
                      {service.startingPrice}
                    </strong>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-1 text-amber-500 text-xs mb-2">
                    <FaStar className="fill-current" />
                    <span className="font-bold text-gray-800">{service.rating}</span>
                    <span className="text-gray-400">({service.totalReviews} reviews)</span>
                  </div>

                  <h3 className="text-xl font-black text-gray-900 group-hover:text-orange-600 transition-colors mb-2.5">
                    {service.title}
                  </h3>

                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                    {service.tagline}
                  </p>

                  {/* Perks preview */}
                  <div className="space-y-1.5 pt-3 border-t border-gray-100">
                    {service.keyHighlights.slice(0, 2).map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                        <FaCheckCircle className="text-emerald-500 w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{h.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="p-6 pt-0">
                <Link
                  to={`/services/${service.slug}`}
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#1D1D1D] to-[#2D2D2D] hover:from-orange-500 hover:to-orange-600 text-white font-extrabold py-3 px-4 rounded-xl shadow-md transition-all duration-300 text-xs md:text-sm group-hover:shadow-lg"
                >
                  <span>Explore Details & Plans</span>
                  <FaArrowRight className="w-3 h-3 text-[#FBAE02] group-hover:text-white transition-colors" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesCategory;
