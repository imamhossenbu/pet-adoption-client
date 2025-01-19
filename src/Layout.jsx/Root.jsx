import { Outlet } from "react-router-dom";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";

const Root = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow" style={{ minHeight: `calc(100vh - 50px)` }}>
        {/* Adjust 200px based on Navbar + Footer combined height */}
        <Outlet />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Root;
