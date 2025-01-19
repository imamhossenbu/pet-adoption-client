import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import Modal from "react-modal";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import HeadingSection from "../shared/HeadingSection";
import { useState } from "react";

// Set the root element for accessibility
Modal.setAppElement("#root");

const services = [
    {
        title: "Dog Walker",
        description: "Professional dog walking services for your furry friends.",
        moreDescription: "Our dog walking service ensures your pet gets the exercise and socialization they need. We offer daily, weekly, and customized walking plans.",
        image: "https://i.ibb.co.com/vHrwSCb/woman-7377662-1280.jpg",
    },
    {
        title: "Agility Training",
        description: "Boost your pet's agility with expert-guided programs.",
        moreDescription: "Our agility training helps pets build confidence and stay active through structured obstacle courses and professional guidance.",
        image: "https://i.ibb.co.com/SyzG5s0/dog-4048819-1280.jpg",
    },
    {
        title: "Veterinarian",
        description: "Expert veterinary care for your pet’s health and wellness.",
        moreDescription: "Get top-notch health care services for your pets, including vaccinations, dental care, and emergency services.",
        image: "https://images.pexels.com/photos/7469217/pexels-photo-7469217.jpeg",
    },
    {
        title: "Pet Grooming",
        description: "Pamper your pet with our top-notch grooming services.",
        moreDescription: "Our grooming includes bathing, haircuts, nail trimming, and spa treatments tailored to your pet's needs.",
        image: "https://i.ibb.co.com/P5fCpvW/nail-clipping-6926862-1280.jpg",
    },
    {
        title: "Pet Boarding",
        description: "Safe and comfortable boarding facilities while you're away.",
        moreDescription: "Our pet boarding provides a safe and friendly environment with 24/7 supervision and personalized care plans.",
        image: "https://i.ibb.co.com/QpkJdrn/dog-5003034-1280.jpg",
    },
    {
        title: "Pet Adoption",
        description: "Find a loving companion through our adoption program.",
        moreDescription: "Browse through our adoption center to find a loving home for a pet in need. Every pet deserves a second chance.",
        image: "https://i.ibb.co.com/LJbGKvF/dog-7770442-1280.jpg",
    },
];

const ServicesCategory = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    const openModal = (service) => {
        setSelectedService(service);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedService(null);
    };

    return (
        <section className="py-20 bg-gray-100">
            <div className="container mx-auto px-4 md:px-10  text-center">
                <HeadingSection title="Services" subtitle="Discover the amazing services we offer for your pets' health and happiness." />

                <motion.div whileHover={{ animationPlayState: "paused" }} className="overflow-hidden">
                    <Swiper
                        modules={[Autoplay, Navigation, Pagination]}
                        spaceBetween={0}
                        slidesPerView={3}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        autoplay={{ delay: 0, disableOnInteraction: false }}
                        speed={4000}
                        loop={true}
                        navigation
                        pagination={{ clickable: true }}
                    >
                        {services.map((service, index) => (
                            <SwiperSlide key={index}>
                                <motion.div whileHover={{ scale: 1.05 }} className="w-[350px] h-[450px] rounded-lg shadow-lg bg-white overflow-hidden">
                                    <div className="relative">
                                        <img src={service.image} alt={service.title} className="w-full h-60 object-cover" />
                                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg border-4 border-white w-24 h-24 flex items-center justify-center">
                                            <img src={service.image} alt={service.title} className="rounded-full w-20 h-20 object-cover" />
                                        </div>
                                    </div>
                                    <div className="p-6 bg-gray-50 text-center">
                                        <h3 className="text-xl font-bold text-gray-800">{service.title}</h3>
                                        <p className="text-gray-600 mt-3">{service.description}</p>
                                    </div>
                                    <div className="bg-blue-900 p-4 text-center">
                                        <button
                                            onClick={() => openModal(service)}
                                            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded-full"
                                        >
                                            Read More
                                        </button>
                                    </div>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </motion.div>
            </div>

            {/* Modal for Service Details */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className="bg-white max-w-lg mx-auto mt-20 p-6 rounded-lg shadow-lg relative z-50"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            >
                {selectedService && (
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-800">{selectedService.title}</h2>
                        <img src={selectedService.image} alt={selectedService.title} className="w-full h-60 object-cover rounded-lg mt-4" />
                        <p className="mt-4 text-lg text-gray-600">{selectedService.moreDescription}</p>
                        <button
                            onClick={closeModal}
                            className="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full"
                        >
                            Close
                        </button>
                    </div>
                )}
            </Modal>
        </section>
    );
};

export default ServicesCategory;
