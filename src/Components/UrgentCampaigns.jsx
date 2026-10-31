import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import HeadingSection from "../shared/HeadingSection";
import DonationProgress from "../shared/DonationProgress";
import { FaHeart, FaArrowRight, FaHandHoldingHeart } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import { getPetImage, handleImageError } from "../utils/imageFallback";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const UrgentCampaigns = () => {
  const axiosPublic = useAxiosPublic();

  const { data, isLoading } = useQuery({
    queryKey: ["urgent-campaigns-home"],
    queryFn: async () => {
      const res = await axiosPublic.get("/donations", {
        params: { limit: 3, page: 1 },
      });
      return res.data;
    },
  });

  const campaigns = data?.donations || [];

  if (!isLoading && campaigns.length === 0) return null;

  return (
    <section className="py-20 bg-amber-50/40 border-t border-orange-100 overflow-hidden">
      <div className="container mx-auto px-4 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <HeadingSection
            title="Urgent Rescue Campaigns"
            subtitle="Every penny makes a difference. Help us fund critical surgeries, nourishing food, and recovery care for pets in critical situations."
          />
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-5 shadow border border-gray-100 flex flex-col">
                <Skeleton height={224} className="rounded-xl mb-4" />
                <Skeleton width={160} height={24} className="rounded mb-2" />
                <Skeleton count={2} height={12} className="rounded mb-4" />
                <div className="flex justify-between items-center p-3.5 bg-orange-50/50 rounded-xl mb-4 border border-orange-100">
                  <div className="w-1/2">
                    <Skeleton width={60} height={10} className="mb-1" />
                    <Skeleton width={90} height={22} className="mb-1" />
                    <Skeleton width={70} height={10} />
                  </div>
                  <Skeleton circle width={56} height={56} />
                </div>
                <Skeleton height={44} className="rounded-xl mt-auto" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {campaigns.slice(0, 3).map((campaign) => {
              const donated = parseFloat(campaign.donatedAmount) || 0;
              const maxGoal = parseFloat(campaign.maxDonationAmount) || 100;

              return (
                <motion.div
                  key={campaign._id}
                  variants={cardVariants}
                  whileHover={{ y: -8, transition: { duration: 0.25 } }}
                  className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-gray-200/80 flex flex-col group relative"
                >
                  {/* Urgent Ribbon */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-red-600 text-white font-extrabold text-[10px] uppercase px-3 py-1 rounded-full shadow flex items-center gap-1">
                      <FaHeart className="w-2.5 h-2.5 animate-pulse" /> Urgent Emergency
                    </span>
                  </div>

                  {/* Campaign Image */}
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img
                      src={getPetImage(campaign.petImage, "dog", campaign._id)}
                      alt={campaign.petName}
                      onError={(e) => handleImageError(e, "dog")}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition mb-2">
                        {campaign.petName}
                      </h3>

                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                        {campaign.shortDescription || "Help us fund life-saving medical rehabilitation for this rescued soul."}
                      </p>

                      {/* Progress Metrics */}
                      <div className="flex items-center justify-between gap-4 bg-orange-50/60 p-3.5 rounded-xl border border-orange-100 mb-4">
                        <div>
                          <p className="text-[11px] text-gray-500 uppercase font-bold">Raised</p>
                          <p className="text-lg font-black text-orange-600">${donated}</p>
                          <p className="text-[11px] text-gray-500">Goal: ${maxGoal}</p>
                        </div>
                        <div className="w-16 h-16 flex-shrink-0">
                          <DonationProgress donatedAmount={donated} maxDonationAmount={maxGoal} />
                        </div>
                      </div>
                    </div>

                    <NavLink
                      to={`/donation-details/${campaign._id}`}
                      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                      className="w-full text-center bg-gradient-to-r from-[#FBAE02] to-orange-500 hover:from-orange-500 hover:to-orange-600 text-black hover:text-white font-extrabold py-3 px-4 rounded-xl transition duration-200 shadow-md block text-sm flex items-center justify-center gap-2"
                    >
                      <FaHandHoldingHeart className="text-base" />
                      Donate Now For {campaign.petName}
                    </NavLink>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* View All Campaigns Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <NavLink
            to="/donation-campaigns"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 bg-white hover:bg-orange-500 text-gray-800 hover:text-white font-bold py-3 px-7 rounded-xl border border-orange-300 shadow transition-all duration-200 text-sm hover:scale-105 active:scale-95"
          >
            View All Active Campaigns
            <FaArrowRight className="text-xs" />
          </NavLink>
        </motion.div>
      </div>
    </section>
  );
};

export default UrgentCampaigns;
