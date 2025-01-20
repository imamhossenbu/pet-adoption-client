import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import catImage from "../assets/cat.jpg";
import dogImage from "../assets/dog.jpg";
import rabbitImage from "../assets/rabbit.png";
import birdImage from "../assets/bird.jpg";

const petCategories = [
  { name: "Cats", image: catImage, link: "/category/cats" },
  { name: "Dogs", image: dogImage, link: "/category/dogs" },
  { name: "Rabbits", image: rabbitImage, link: "/category/rabbits" },
  { name: "Birds", image: birdImage, link: "/category/birds" },
];

const PetsCategory = () => {
  const navigate = useNavigate();

  return (
    <section className="pt-20 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        {/* Title and Subtitle */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Explore Our Pet Categories
          </h2>
          <p className="text-lg text-gray-600 mt-4">
            Find the perfect companion by exploring our curated categories of pets.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {petCategories.map((category, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 cursor-pointer"
              onClick={() => navigate(category.link)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Category Image */}
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-40 object-cover"
                loading="lazy"
              />
              {/* Category Name */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 text-center">
                  {category.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PetsCategory;
