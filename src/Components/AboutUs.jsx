import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import aboutUsImage from "../assets/image4.jpg"; // Use a real image of pet adoption
import HeadingSection from "../shared/HeadingSection";

const AboutUs = () => {
  const navigate = useNavigate();

  // Motion variants for animation
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.3, // Stagger animation for child elements
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeInOut" } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut" } },
  };

  return (
    <motion.section
      className="py-20 bg-gray-100"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }} // Trigger animation when 20% of element is in view
    >
      <HeadingSection
        title="About Us"
        subtitle="Learn more about our mission to connect pets with loving homes and provide quality care."
      />

      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">

          {/* Left Side - Image with motion */}
          <motion.div
            className="w-full lg:w-1/2"
            variants={imageVariants}
          >
            <img
              src={aboutUsImage}
              alt="About Us"
              className="rounded-lg shadow-lg w-full h-auto object-cover"
            />
          </motion.div>

          {/* Right Side - Content with staggered animation */}
          <motion.div
            className="w-full lg:w-1/2"
            variants={containerVariants}
          >
            <motion.p className="text-lg text-gray-600 mb-6 leading-relaxed" variants={fadeInUp}>
              PeddyCare was created with a simple mission: to connect loving families with 
              pets in need of a forever home. Our platform makes it easy to browse available 
              pets, learn about their unique personalities, and start the adoption process 
              with just a few clicks.
            </motion.p>
            <motion.p className="text-lg text-gray-600 mb-6 leading-relaxed" variants={fadeInUp}>
              We work closely with shelters and rescue organizations to ensure every pet gets 
              the best care and a second chance at life. Whether you're looking for a furry friend 
              or a feathery companion, PeddyCare is here to help you find the perfect match.
            </motion.p>
            <motion.p className="text-lg text-gray-600 leading-relaxed" variants={fadeInUp}>
              Join us in our journey to create a better world, one paw at a time.
            </motion.p>

            {/* Buttons Section */}
            <motion.div
              className="mt-8 flex flex-wrap gap-6"
              variants={fadeInUp}
            >
              <button
                onClick={() => navigate("/contact")}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300"
              >
                Contact Us
              </button>
              <button
                onClick={() => navigate("/services")}
                className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300"
              >
                Our Services
              </button>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </motion.section>
  );
};

export default AboutUs;
