import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import { motion } from "framer-motion";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { FaQuoteLeft } from "react-icons/fa";
import HeadingSection from "../shared/HeadingSection";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

// Fake testimonial data
const testimonials = [
    {
        image: "https://randomuser.me/api/portraits/women/50.jpg",
        name: "Sarah Johnson",
        role: "Pet Owner",
        quote: "Adopting from PeddyCare was the best decision I ever made! The team was incredibly helpful, and I found my perfect furry companion in no time.",
    },
    {
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        name: "Michael Thompson",
        role: "Pet Enthusiast",
        quote: "I highly recommend PeddyCare to anyone looking for a pet. They provide excellent support, and their adoption process is smooth and transparent.",
    },
    {
        image: "https://randomuser.me/api/portraits/women/28.jpg",
        name: "Emily Roberts",
        role: "Animal Lover",
        quote: "I am beyond grateful for PeddyCare! They helped me find my rescue dog, and he has been the best addition to my life. Their service is truly outstanding.",
    },
    {
        image: "https://randomuser.me/api/portraits/men/65.jpg",
        name: "James Peterson",
        role: "Pet Parent",
        quote: "PeddyCare made adopting my cat so easy and enjoyable. Their team was supportive throughout the process, and I couldn't be happier.",
    },
    {
        image: "https://randomuser.me/api/portraits/women/18.jpg",
        name: "Jessica Lee",
        role: "Pet Trainer",
        quote: "As a pet trainer, I appreciate the care and attention PeddyCare gives to their animals. I found my amazing dog through them, and he's been a joy to train!",
    },
];

const Testimonial = () => {
    return (
        <section className="py-20 bg-gray-100">
            <div className="container mx-auto px-6 md:px-10  text-center">
                <HeadingSection
                    title="What Our Adopters Say"
                    subtitle="See what our happy pet owners have to say about their adoption journey with PeddyCare."
                />
                <motion.div className="relative overflow-hidden">
                    <div className="swiper-button-prev-custom absolute top-1/2 left-4 transform -translate-y-1/2 z-10 cursor-pointer bg-[#FBAE02] hover:bg-gray-300 text-gray-800 rounded-full p-2 shadow-md">
                        <FaArrowLeftLong size={20} />
                    </div>
                    <div className="swiper-button-next-custom absolute top-1/2 right-4 transform -translate-y-1/2 z-10 cursor-pointer bg-[#FBAE02] hover:bg-gray-300 text-gray-800 rounded-full p-2 shadow-md">
                        <FaArrowRightLong size={20} />
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
                        speed={8000}
                        loop={true}
                        navigation={{
                            prevEl: ".swiper-button-prev-custom",
                            nextEl: ".swiper-button-next-custom",
                        }}
                        pagination={{ clickable: true }}
                    >
                        {testimonials.map((testimonial, index) => (
                            <SwiperSlide key={index}>
                                <div className="bg-white shadow-lg h-[400px] rounded-lg z-0 p-10 text-center relative">
                                    <FaQuoteLeft className="absolute left-4 top-4 text-6xl -z-10  text-gray-200" />
                                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                        {testimonial.quote}
                                    </p>
                                    <div className="flex flex-col items-center">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="rounded-full border-4 border-white shadow-md w-24 h-24 object-cover"
                                        />
                                        <h3 className="text-2xl font-bold text-gray-800 mt-4">{testimonial.name}</h3>
                                        <p className="text-gray-500 text-lg">{testimonial.role}</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </motion.div>
            </div>
        </section>
    );
};

export default Testimonial;
