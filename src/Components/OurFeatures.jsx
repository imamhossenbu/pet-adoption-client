import featureImage from "../assets/features.jpg"; // Replace with your real image
import { FaPaw, FaHome, FaHeartbeat, FaGraduationCap, FaClinicMedical } from "react-icons/fa";
import HeadingSection from "../shared/HeadingSection";
import { motion } from "framer-motion";

const features = [
    {
        icon: <FaClinicMedical size={40} className="text-white" />,
        title: "Natural Products",
        description: "We provide organic and eco-friendly pet products to ensure your furry friend stays healthy and happy, with no harmful chemicals or additives.",
    },
    {
        icon: <FaPaw size={40} className="text-white" />,
        title: "Vet Care",
        description: "Our professional veterinary team offers regular check-ups, vaccinations, and emergency services to keep your pets in the best health possible.",
    },
    {
        icon: <FaGraduationCap size={40} className="text-white" />,
        title: "Training",
        description: "From basic obedience to advanced skills, our expert trainers provide personalized training programs to help your pet become well-behaved and confident.",
    },
    {
        icon: <FaHome size={40} className="text-white" />,
        title: "Housing",
        description: "We ensure a safe and comfortable environment for your pets, offering spacious and hygienic housing options tailored to their needs.",
    },
    {
        icon: <FaHeartbeat size={40} className="text-white" />,
        title: "Adoption",
        description: "Find your perfect companion by browsing our adoption center and giving a loving home to a pet in need of care and companionship.",
    },
    {
        icon: <FaPaw size={40} className="text-white" />,
        title: "Quality Care",
        description: "Our dedicated staff ensures round-the-clock care, providing nutritious meals, regular exercise, and lots of love to all pets under our supervision.",
    },
];

const OurFeatures = () => {
    return (
        <section className="py-6 bg-gray-100">
            <HeadingSection title="Our Features" subtitle="Discover the amazing services we offer for your pets' health and happiness."></HeadingSection>
            <div className="container mx-auto px-4 md:px-10 text-center">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    
                    {/* Left Side - Features List */}
                    <div className="w-full lg:w-1/3 space-y-8">
                        {features.slice(0, 3).map((feature, index) => (
                            <div key={index} className="flex items-center gap-4 text-left">
                                <div className="bg-pink-500 rounded-full p-4">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Center - Feature Image with Infinite Motion */}
                    <div className="w-full lg:w-1/3">
                        <motion.img
                            src={featureImage}
                            alt="Feature"
                            className="rounded-lg shadow-lg w-full h-auto object-cover"
                            animate={{
                                y: [0, -50, 0], // Move up and down
                            }}
                            transition={{
                                duration: 3,  // Speed of the animation
                                repeat: Infinity,  // Infinite looping
                                ease: "easeInOut", // Smooth transition
                            }}
                        />
                    </div>

                    {/* Right Side - Features List */}
                    <div className="w-full lg:w-1/3 space-y-8">
                        {features.slice(3).map((feature, index) => (
                            <div key={index} className="flex items-center gap-4 text-left">
                                <div className="bg-pink-500 rounded-full p-4">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default OurFeatures;
