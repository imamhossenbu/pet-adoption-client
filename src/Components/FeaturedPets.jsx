import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import { useFavorites } from "../context/FavoritesContext";
import HeadingSection from "../shared/HeadingSection";
import { FaHeart, FaRegHeart, FaPaw, FaArrowRight, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import { getPetImage, handleImageError } from "../utils/imageFallback";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
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

const FeaturedPets = () => {
  const axiosPublic = useAxiosPublic();
  const { toggleFavorite, isFavorite } = useFavorites();

  const { data, isLoading } = useQuery({
    queryKey: ["featured-pets-home"],
    queryFn: async () => {
      const res = await axiosPublic.get("/pets", {
        params: { limit: 6, page: 1 },
      });
      return res.data;
    },
  });

  const pets = data?.pets || [];

  return (
    <section className="py-20 bg-gray-50/80 overflow-hidden">
      <div className="container mx-auto px-4 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <HeadingSection
            title="Meet Our Featured Pets"
            subtitle="These adorable companions were recently rescued and are looking for warm, loving homes. Could you be their forever family?"
          />
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col">
                <Skeleton height={240} className="rounded-xl mb-4" />
                <div className="flex justify-between items-center mb-2">
                  <Skeleton width={140} height={24} className="rounded" />
                  <Skeleton width={80} height={20} className="rounded-full" />
                </div>
                <Skeleton width={160} height={14} className="mb-3 rounded" />
                <Skeleton count={2} height={12} className="mb-4 rounded" />
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <Skeleton height={46} className="rounded-xl" />
                  <Skeleton height={46} className="rounded-xl" />
                </div>
                <Skeleton height={40} className="rounded-xl mt-auto" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {pets.map((pet) => (
              <motion.div
                key={pet._id}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col group relative"
              >
                {/* Favorite Heart Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleFavorite(pet);
                  }}
                  className="absolute top-3 right-3 z-20 p-2.5 rounded-full bg-white/90 hover:bg-white text-red-500 shadow-md backdrop-blur-sm transition-transform active:scale-90"
                  title={isFavorite(pet._id) ? "Remove from favorites" : "Save to favorites"}
                  aria-label="Toggle favorite"
                >
                  {isFavorite(pet._id) ? (
                    <FaHeart className="w-5 h-5 text-red-500" />
                  ) : (
                    <FaRegHeart className="w-5 h-5 text-gray-700 hover:text-red-500" />
                  )}
                </button>

                {/* Category Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-[#1D1D1D]/80 backdrop-blur-xs text-[#FBAE02] font-extrabold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider">
                    {pet.petCategory || "Pet"}
                  </span>
                </div>

                {/* Pet Image */}
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  <img
                    src={getPetImage(pet.petImage, pet.petCategory, pet._id)}
                    alt={pet.petName}
                    onError={(e) => handleImageError(e, pet.petCategory)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 sm:flex sm:justify-center sm:items-center transition duration-300 hidden sm:block">
                    <NavLink
                      to={`/pet-details/${pet._id}`}
                      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                    >
                      View Profile
                    </NavLink>
                  </div>
                </div>

                {/* Pet Details Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="text-2xl font-black text-gray-900 group-hover:text-orange-600 transition">
                        {pet.petName}
                      </h3>
                      <span className="text-[11px] bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded-md border border-green-200 flex items-center gap-1">
                        <FaCheckCircle className="text-green-600 w-3 h-3" /> Vaccinated
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                      <FaMapMarkerAlt className="text-orange-500" />
                      <span>{pet.petLocation || "Available at shelter"}</span>
                    </p>

                    <p className="text-xs text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                      {pet.shortDescription || "Friendly, gentle and waiting to be your loyal best friend forever."}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-gray-700 mb-4">
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Age</span>
                        <strong>{pet.petAge} Years Old</strong>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Status</span>
                        <strong className="text-emerald-600 font-bold">Ready for Home</strong>
                      </div>
                    </div>
                  </div>

                  {/* Button for Mobile or Direct click */}
                  <NavLink
                    to={`/pet-details/${pet._id}`}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="w-full text-center bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold py-2.5 px-4 rounded-xl transition duration-200 shadow-sm block text-sm sm:hidden"
                  >
                    Meet & Adopt {pet.petName}
                  </NavLink>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* View All Pets Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <NavLink
            to="/pet-listing"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-3 bg-[#1D1D1D] hover:bg-black text-[#FBAE02] hover:text-white font-extrabold py-3.5 px-8 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 text-base border border-gray-700"
          >
            <FaPaw className="text-xl" />
            Explore All Available Pets ({data?.pets?.length ? "40+ Available" : "Browse All"})
            <FaArrowRight className="text-sm" />
          </NavLink>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedPets;
