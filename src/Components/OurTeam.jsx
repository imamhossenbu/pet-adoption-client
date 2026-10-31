import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import HeadingSection from "../shared/HeadingSection";
import { FaFacebookF, FaTwitter, FaLinkedinIn} from "react-icons/fa";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

const teamMembers = [
    {
        name: "Mika Doe",
        role: "Adoption Manager",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
        social: {
            facebook: "https://www.facebook.com/mika.doe",
            twitter: "https://www.twitter.com/mika_doe",
            linkedin: "https://www.linkedin.com/in/mikadoe",
        },
    },
    {
        name: "Jillian Smith",
        role: "Vet Assistant",
        image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80",
        social: {
            facebook: "https://www.facebook.com/jillian.smith",
            twitter: "https://www.twitter.com/jillian_smith",
            linkedin: "https://www.linkedin.com/in/jilliansmith",
        },
    },
    {
        name: "Laura Smith",
        role: "Veterinarian",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80",
        social: {
            facebook: "https://www.facebook.com/laura.smith",
            twitter: "https://www.twitter.com/laura_smith",
            linkedin: "https://www.linkedin.com/in/laurasmith",
        },
    },
    {
        name: "John Doe",
        role: "Pet Trainer",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
        social: {
            facebook: "https://www.facebook.com/john.doe",
            twitter: "https://www.twitter.com/john_doe",
            linkedin: "https://www.linkedin.com/in/johndoe",
        },
    },
    {
        name: "Sarah Johnson",
        role: "Animal Care Specialist",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
        social: {
            facebook: "https://www.facebook.com/sarah.johnson",
            twitter: "https://www.twitter.com/sarah_johnson",
            linkedin: "https://www.linkedin.com/in/sarahjohnson",
        },
    },
    {
        name: "Michael Adams",
        role: "Pet Behaviorist",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80",
        social: {
            facebook: "https://www.facebook.com/michael.adams",
            twitter: "https://www.twitter.com/michael_adams",
            linkedin: "https://www.linkedin.com/in/michaeladams",
        },
    },
];

const OurTeam = () => {
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
                        loop={true}
                        navigation={{
                            prevEl: ".swiper-button-prev-custom",
                            nextEl: ".swiper-button-next-custom",
                        }}
                        pagination={{ clickable: true }}
                    >
                        {teamMembers.map((member, index) => (
                            <SwiperSlide key={index}>
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
                                            <a href={member.social.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-white/20 transition">
                                                <FaFacebookF className="text-[#FBAE02]" size={16} />
                                            </a>
                                            <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-white/20 transition">
                                                <FaTwitter className="text-[#FBAE02]" size={16} />
                                            </a>
                                            <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-white/20 transition">
                                                <FaLinkedinIn className="text-[#FBAE02]" size={16} />
                                            </a>
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
