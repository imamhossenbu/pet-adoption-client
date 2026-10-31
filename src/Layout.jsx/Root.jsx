import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";
import Newsletter from "../Components/NewsLetter";
import ScrollToTopButton from "../shared/ScrollToTopButton";
import FavoritesDrawer from "../Components/FavoritesDrawer";
import PeddyAssistantBot from "../Components/PeddyAssistantBot";

const Root = () => {
  const location=useLocation();
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow" style={{ minHeight: `calc(100vh - 50px)` }}>
        {/* Adjust 200px based on Navbar + Footer combined height */}
        <Outlet />
      </div>
      <ScrollToTopButton></ScrollToTopButton>

      {/* Floating AI Pet Care Assistant & Favorites Drawer */}
      <PeddyAssistantBot />
      <FavoritesDrawer />

      {!(location.pathname === "/login" || location.pathname === "/sign-up") && (
        <Newsletter />
      )}
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Root;
