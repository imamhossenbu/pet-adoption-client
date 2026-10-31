import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import { FaPaw, FaHeart, FaHandHoldingHeart, FaAward } from "react-icons/fa";

const statsContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const statItemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const ImpactStats = () => {
  const axiosPublic = useAxiosPublic();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["platform-stats"],
    queryFn: async () => {
      const res = await axiosPublic.get("/platform-stats");
      return res.data;
    },
  });

  const totalPets = stats?.totalPets || 47;
  const totalAdoptions = stats?.totalAdoptions || 22;
  const availablePets = stats?.availablePets || 35;
  const totalRaised = stats?.totalRaised || 7733;

  const statItems = [
    {
      label: "Pets Rescued & Listed",
      value: `${totalPets}+`,
      desc: "Compassionately cared for",
      icon: <FaPaw className="w-7 h-7 text-[#FBAE02]" />,
    },
    {
      label: "Happy Adoptions",
      value: `${totalAdoptions}+`,
      desc: "Found loving forever families",
      icon: <FaHeart className="w-7 h-7 text-red-500" />,
    },
    {
      label: "Waiting for Love",
      value: `${availablePets}`,
      desc: "Vaccinated & ready to meet you",
      icon: <FaAward className="w-7 h-7 text-emerald-400" />,
    },
    {
      label: "Emergency Aid Raised",
      value: `$${totalRaised.toLocaleString()}`,
      desc: "For surgeries & medical care",
      icon: <FaHandHoldingHeart className="w-7 h-7 text-[#FBAE02]" />,
    },
  ];

  return (
    <section className="py-14 bg-gradient-to-r from-[#171717] via-[#212121] to-[#171717] text-white border-y border-gray-800 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-10">
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 text-center flex flex-col items-center justify-center"
              >
                <Skeleton circle width={52} height={52} baseColor="#262626" highlightColor="#333333" className="mb-3" />
                <Skeleton width={100} height={32} baseColor="#262626" highlightColor="#333333" className="mb-2" />
                <Skeleton width={130} height={16} baseColor="#262626" highlightColor="#333333" className="mb-1" />
                <Skeleton width={110} height={12} baseColor="#262626" highlightColor="#333333" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={statsContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-30px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {statItems.map((item, idx) => (
              <motion.div
                key={idx}
                variants={statItemVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 text-center hover:border-[#FBAE02]/60 hover:bg-white/[0.08] transition-colors duration-300 group shadow-sm flex flex-col items-center justify-center cursor-default"
              >
                <div className="p-3 bg-white/[0.06] rounded-2xl mb-3 group-hover:scale-110 group-hover:bg-[#FBAE02]/20 transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-[#FBAE02] tracking-tight mb-1 group-hover:scale-105 transition-transform duration-300">
                  {item.value}
                </h3>
                <p className="text-sm font-bold text-gray-200 mb-1">{item.label}</p>
                <span className="text-xs text-gray-400">{item.desc}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ImpactStats;
