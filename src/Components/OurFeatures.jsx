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
        <section className="py-16 bg-gray-100 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <HeadingSection title="Our Features" subtitle="Discover the amazing services we offer for your pets' health and happiness." />
            </motion.div>
            <div className="container mx-auto px-4 md:px-10 text-center">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    
                    {/* Left Side - Features List */}
                    <div className="w-full lg:w-1/3 space-y-8">
                        {features.slice(0, 3).map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                className="flex items-center gap-4 text-left p-3 rounded-2xl hover:bg-white/60 transition-colors"
                            >
                                <div className="bg-[#FBAE02] text-black rounded-2xl p-3.5 shadow-md flex-shrink-0">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{feature.title}</h3>
                                    <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Center - Feature Image with Smooth Floating Motion */}
                    <div className="w-full lg:w-1/3">
                        <motion.img
                            src={featureImage}
                            alt="Feature"
                            className="rounded-3xl shadow-xl w-full h-auto object-cover border-4 border-white"
                            animate={{
                                y: [0, -12, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    </div>

                    {/* Right Side - Features List */}
                    <div className="w-full lg:w-1/3 space-y-8">
                        {features.slice(3).map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                className="flex items-center gap-4 text-left p-3 rounded-2xl hover:bg-white/60 transition-colors"
                            >
                                <div className="bg-[#FBAE02] text-black rounded-2xl p-3.5 shadow-md flex-shrink-0">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{feature.title}</h3>
                                    <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default OurFeatures;
