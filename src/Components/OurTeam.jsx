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
        image: "https://i.ibb.co/g7yXcnT/team1.jpg",
        social: {
            facebook: "https://www.facebook.com/mika.doe",
            twitter: "https://www.twitter.com/mika_doe",
            linkedin: "https://www.linkedin.com/in/mikadoe",
        },
    },
    {
        name: "Jillian Smith",
        role: "Vet Assistant",
        image: "https://i.ibb.co/hyP6rrf/team2.jpg",
        social: {
            facebook: "https://www.facebook.com/jillian.smith",
            twitter: "https://www.twitter.com/jillian_smith",
            linkedin: "https://www.linkedin.com/in/jilliansmith",
        },
    },
    {
        name: "Laura Smith",
        role: "Veterinarian",
        image: "https://i.ibb.co/5cfZDGw/team3.jpg",
        social: {
            facebook: "https://www.facebook.com/laura.smith",
            twitter: "https://www.twitter.com/laura_smith",
            linkedin: "https://www.linkedin.com/in/laurasmith",
        },
    },
    {
        name: "John Doe",
        role: "Pet Trainer",
        image: "https://i.ibb.co/h7R5Ldx/team4.jpg",
        social: {
            facebook: "https://www.facebook.com/john.doe",
            twitter: "https://www.twitter.com/john_doe",
            linkedin: "https://www.linkedin.com/in/johndoe",
        },
    },
    {
        name: "Sarah Johnson",
        role: "Animal Care Specialist",
        image: "https://i.ibb.co/QdYgsz1/team5.jpg",
        social: {
            facebook: "https://www.facebook.com/sarah.johnson",
            twitter: "https://www.twitter.com/sarah_johnson",
            linkedin: "https://www.linkedin.com/in/sarahjohnson",
        },
    },
    {
        name: "Michael Adams",
        role: "Pet Behaviorist",
        image: "https://i.ibb.co/BqKtPQ8/team6.jpg",
        social: {
            facebook: "https://www.facebook.com/michael.adams",
            twitter: "https://www.twitter.com/michael_adams",
            linkedin: "https://www.linkedin.com/in/michaeladams",
        },
    },
];

const OurTeam = () => {
    return (
        <section className="py-20 bg-gray-100">
            <div className="container mx-auto px-4 md:px-10 text-center">
                <HeadingSection title="Our Team" subtitle="Meet our dedicated pet care specialists who love and care for your pets like their own." />

                <motion.div className="relative overflow-hidden">
                    <div className="swiper-button-prev-custom absolute top-1/2 left-4 transform -translate-y-1/2 z-10 cursor-pointer bg-[#FBAE02] hover:bg-gray-300 text-gray-800 rounded-full p-2 shadow-md">
                        <FaArrowLeftLong  size={20} />
                    </div>
                    <div className="swiper-button-next-custom absolute top-1/2 right-4 transform -translate-y-1/2 z-10 cursor-pointer bg-[#FBAE02] hover:bg-gray-300 text-gray-800 rounded-full p-2 shadow-md">
                        <FaArrowRightLong  size={20} />
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
                                <motion.div whileHover={{ scale: 1.05 }} className="relative w-[350px] h-[420px] rounded-lg shadow-lg bg-white overflow-hidden group">
                                    <div className="relative group">
                                        <img src={member.image} alt={member.name} className="w-full h-72 object-cover rounded-lg" />

                                        {/* Social icons div, showing on hover */}
                                        <div
                                            className="absolute top-0 right-0 h-full w-16 bg-blue-500 rounded-l-lg flex flex-col justify-center items-center space-y-4 transition-all transform translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                                        >
                                            <a href={member.social.facebook} target="_blank" rel="noopener noreferrer">
                                                <FaFacebookF className="text-white hover:text-blue-300 transition" size={20} />
                                            </a>
                                            <a href={member.social.twitter} target="_blank" rel="noopener noreferrer">
                                                <FaTwitter className="text-white hover:text-blue-300 transition" size={20} />
                                            </a>
                                            <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                                                <FaLinkedinIn className="text-white hover:text-blue-300 transition" size={20} />
                                            </a>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-gray-50 text-center">
                                        <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                                        <p className="text-pink-500 flex justify-center items-center gap-2">
                                            <span className="w-6 h-[2px] bg-pink-500"></span> 🐾 <span className="w-6 h-[2px] bg-pink-500"></span>
                                        </p>
                                        <p className="text-gray-600 mt-3">{member.role}</p>
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
