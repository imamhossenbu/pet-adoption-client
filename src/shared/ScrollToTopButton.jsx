import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when scrolling down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Smooth scrolling to top function
  const scrollToTop = () => {
    const scrollStep = -window.scrollY / 50;  // Slower scroll effect
    const scrollInterval = setInterval(() => {
      if (window.scrollY !== 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15); // Adjust timing for smoother effect
  };

  return (
    <div>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-16 right-8 z-50 bg-red-500 text-white w-8 h-8 rounded-lg flex items-center justify-center shadow-lg transition duration-300 hover:bg-red-600"
        >
          <FaArrowUp size={15} />
        </button>
      )}
    </div>
  );
};

export default ScrollToTopButton;
