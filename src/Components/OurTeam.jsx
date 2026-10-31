import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import HeadingSection from "../shared/HeadingSection";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

const fallbackTeamMembers = [
    {
        name: "Mika Doe",
        role: "Adoption Manager",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
        social: {
            facebook: "https://www.facebook.com",
            twitter: "https://www.twitter.com",
            linkedin: "https://www.linkedin.com",
        },
    },
    {
        name: "Jillian Smith",
        role: "Vet Assistant",
        image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80",
        social: {
            facebook: "https://www.facebook.com",
            twitter: "https://www.twitter.com",
            linkedin: "https://www.linkedin.com",
        },
    },
    {
        name: "Dr. Laura Smith",
        role: "Veterinarian",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80",
        social: {
            facebook: "https://www.facebook.com",
            twitter: "https://www.twitter.com",
            linkedin: "https://www.linkedin.com",
        },
    },
    {
        name: "John Doe",
        role: "Pet Trainer",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
        social: {
            facebook: "https://www.facebook.com",
            twitter: "https://www.twitter.com",
            linkedin: "https://www.linkedin.com",
        },
    },
    {
        name: "Sarah Johnson",
        role: "Animal Care Specialist",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
        social: {
            facebook: "https://www.facebook.com",
            twitter: "https://www.twitter.com",
            linkedin: "https://www.linkedin.com",
        },
    },
    {
        name: "Michael Adams",
        role: "Pet Behaviorist",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80",
        social: {
            facebook: "https://www.facebook.com",
            twitter: "https://www.twitter.com",
            linkedin: "https://www.linkedin.com",
        },
    },
];

const OurTeam = () => {
    const axiosPublic = useAxiosPublic();
    const { data: teamMembers = [] } = useQuery({
        queryKey: ["public-team"],
        queryFn: async () => {
            try {
                const res = await axiosPublic.get("/team");
                return res.data || [];
            } catch (e) {
                return [];
            }
        }
    });

    const displayMembers = teamMembers.length > 0 ? teamMembers : fallbackTeamMembers;

    return (
        <section className="py-20 bg-gray-100 overflow-hidden">
            <div className="container mx-auto px-4 md:px-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <HeadingSection title="Our Team" subtitle="Meet our dedicated pet care specialists who love and care for your pets like their own." />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="relative overflow-hidden"
                >
                    <div className="swiper-button-prev-custom absolute top-1/2 left-4 transform -translate-y-1/2 z-10 cursor-pointer bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white rounded-full p-2.5 shadow-md transition-colors">
                        <FaArrowLeftLong size={18} />
                    </div>
                    <div className="swiper-button-next-custom absolute top-1/2 right-4 transform -translate-y-1/2 z-10 cursor-pointer bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white rounded-full p-2.5 shadow-md transition-colors">
                        <FaArrowRightLong size={18} />
                    </div>
                    <Swiper
                        modules={[Autoplay, Navigation, Pagination]}
                        spaceBetween={20}
                        slidesPerView={1}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        autoplay={{ delay: 0, disableOnInteraction: false }}
                        speed={5000}
                        loop={displayMembers.length > 3}
                        navigation={{
                            prevEl: ".swiper-button-prev-custom",
                            nextEl: ".swiper-button-next-custom",
                        }}
                        pagination={{ clickable: true }}
                    >
                        {displayMembers.map((member, index) => (
                            <SwiperSlide key={member._id || index}>
                                <motion.div whileHover={{ y: -6 }} className="relative mx-auto w-full max-w-[340px] rounded-2xl shadow-lg bg-white overflow-hidden group border border-gray-100">
                                    <div className="relative group overflow-hidden">
                                        <img 
                                            src={member.image} 
                                            alt={member.name} 
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80";
                                            }}
                                            className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300" 
                                        />

                                        {/* Social icons div, showing on hover */}
                                        <div
                                            className="absolute top-0 right-0 h-full w-14 bg-[#1D1D1D]/90 backdrop-blur-xs rounded-l-2xl flex flex-col justify-center items-center space-y-4 transition-all transform translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                                        >
                                            {member.social?.facebook && (
                                                <a href={member.social.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-white/20 transition">
                                                    <FaFacebookF className="text-[#FBAE02]" size={16} />
                                                </a>
                                            )}
                                            {member.social?.twitter && (
                                                <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-white/20 transition">
                                                    <FaTwitter className="text-[#FBAE02]" size={16} />
                                                </a>
                                            )}
                                            {member.social?.linkedin && (
                                                <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-white/20 transition">
                                                    <FaLinkedinIn className="text-[#FBAE02]" size={16} />
                                                </a>
                                            )}
                                            {member.social?.instagram && (
                                                <a href={member.social.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-white/20 transition">
                                                    <FaInstagram className="text-[#FBAE02]" size={16} />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-6 bg-white text-center">
                                        <h3 className="text-xl font-black text-gray-900">{member.name}</h3>
                                        <p className="text-orange-500 flex justify-center items-center gap-2 my-1">
                                            <span className="w-6 h-[2px] bg-orange-400"></span> 🐾 <span className="w-6 h-[2px] bg-orange-400"></span>
                                        </p>
                                        <p className="text-gray-500 text-sm font-semibold">{member.role}</p>
                                    </div>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </motion.div>
            </div>
        </section>
    );
};

export default OurTeam;
