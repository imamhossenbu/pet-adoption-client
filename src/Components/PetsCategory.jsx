import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import catImage from "../assets/cat.jpg";
import dogImage from "../assets/dog.jpg";
import rabbitImage from "../assets/rabbit.png";
import birdImage from "../assets/bird.jpg";
import HeadingSection from "../shared/HeadingSection";

const defaultCategoryImages = {
  cat: catImage,
  dog: dogImage,
  rabbit: rabbitImage,
  bird: birdImage,
};

const PetsCategory = () => {
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  const { data: dbCategories = [] } = useQuery({
    queryKey: ["public-categories"],
    queryFn: async () => {
      try {
        const res = await axiosPublic.get("/categories");
        return res.data || [];
      } catch (e) {
        return [];
      }
    },
  });

  const categoriesToDisplay =
    dbCategories.length > 0
      ? dbCategories.map((c) => ({
          name: c.label || `${c.category}s`,
          category: (c.category || "").toLowerCase(),
          image:
            c.image ||
            defaultCategoryImages[(c.category || "").toLowerCase()] ||
            dogImage,
          icon: c.icon || "🐾",
        }))
      : [
          { name: "Cats", image: catImage, category: "cat" },
          { name: "Dogs", image: dogImage, category: "dog" },
          { name: "Rabbits", image: rabbitImage, category: "rabbit" },
          { name: "Birds", image: birdImage, category: "bird" },
        ];

  return (
    <section className="pt-20 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <HeadingSection
          title={"Explore Our Pet Categories"}
          subtitle={"Find the perfect companion by exploring our curated categories of pets."}
        />

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {categoriesToDisplay.map((category, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl overflow-hidden border border-gray-100 transition duration-300 cursor-pointer group"
              onClick={() => {
                navigate(`/pet-listing?category=${category.category}`);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Category Image */}
              <div className="relative h-44 w-full overflow-hidden bg-gray-100">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src =
                      defaultCategoryImages[category.category] || dogImage;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                {category.icon && (
                  <span className="absolute top-3 right-3 text-lg bg-white/90 backdrop-blur-xs w-9 h-9 rounded-xl flex items-center justify-center shadow-xs">
                    {category.icon}
                  </span>
                )}
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-lg font-black text-white drop-shadow-sm">
                    {category.name}
                  </h3>
                  <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                    Explore Pets &rarr;
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PetsCategory;
