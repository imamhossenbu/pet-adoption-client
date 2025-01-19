import { useNavigate } from "react-router-dom";
import aboutUsImage from "../assets/image4.jpg"; // Use a real image of pet adoption
import HeadingSection from "../shared/HeadingSection";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-gray-100">
        <HeadingSection 
          title="About Us" 
          subtitle="Learn more about our mission to connect pets with loving homes and provide quality care."
        />
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Left Side - Image */}
          <div className="w-full lg:w-1/2">
            <img
              src={aboutUsImage}
              alt="About Us"
              className="rounded-lg shadow-lg w-full h-auto object-cover"
            />
          </div>

          {/* Right Side - Content */}
          <div className="w-full lg:w-1/2">
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              PeddyCare was created with a simple mission: to connect loving families with 
              pets in need of a forever home. Our platform makes it easy to browse available 
              pets, learn about their unique personalities, and start the adoption process 
              with just a few clicks.
            </p>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              We work closely with shelters and rescue organizations to ensure every pet gets 
              the best care and a second chance at life. Whether you're looking for a furry friend 
              or a feathery companion, PeddyCare is here to help you find the perfect match.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Join us in our journey to create a better world, one paw at a time.
            </p>

            {/* Buttons Section */}
            <div className="mt-8 flex flex-wrap gap-6">
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
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutUs;
