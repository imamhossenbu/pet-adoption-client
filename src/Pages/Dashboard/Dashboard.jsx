import { useContext, useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaBell,
  FaPlus,
  FaHome,
  FaShieldAlt,
  FaPaw,
  FaUserCircle
} from "react-icons/fa";
import Sidebar from "./Sidebar";
import AuthContext from "../../context/authContext";
import useAdmin from "../../Hooks/useAdmin";
import Skeleton from "react-loading-skeleton";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [isAdmin, isPending] = useAdmin();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  // Derive human friendly breadcrumb title
  const getPageTitle = (pathname) => {
    if (pathname === "/dashboard") return "Dashboard Overview";
    if (pathname.includes("all-users")) return "Users Management";
    if (pathname.includes("all-pets")) return "Pets Management";
    if (pathname.includes("all-donations")) return "Campaigns Management";
    if (pathname.includes("adoption-requests")) return "Adoption Applications";
    if (pathname.includes("manage-services")) return "Services Management";
    if (pathname.includes("manage-faqs")) return "FAQs Management";
    if (pathname.includes("manage-categories")) return "Categories Management";
    if (pathname.includes("manage-team")) return "Team & Specialists";
    if (pathname.includes("manage-newsletter")) return "Newsletter & Subscribers";
    if (pathname.includes("my-added-pets")) return "My Added Pets";
    if (pathname.includes("add-pet")) return "Add a New Pet";
    if (pathname.includes("update-pet")) return "Update Pet Details";
    if (pathname.includes("create-donation-campaign")) return "Start Donation Campaign";
    if (pathname.includes("my-donation-campaigns")) return "My Donation Campaigns";
    if (pathname.includes("edit-donation")) return "Edit Donation Campaign";
    if (pathname.includes("my-donations")) return "My Donations History";
    if (pathname.includes("my-adoption-requests")) return "My Adoption Applications";
    return "Dashboard";
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="hidden lg:flex lg:w-72 bg-[#141414] p-6 flex-col gap-4">
          <Skeleton height={50} className="rounded-xl mb-4" baseColor="#1f2937" highlightColor="#374151" />
          <Skeleton count={8} height={40} className="rounded-lg mb-2" baseColor="#1f2937" highlightColor="#374151" />
        </div>
        <div className="flex-1 p-8 space-y-6">
          <Skeleton height={64} className="rounded-2xl mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Skeleton height={120} className="rounded-2xl" />
            <Skeleton height={120} className="rounded-2xl" />
            <Skeleton height={120} className="rounded-2xl" />
            <Skeleton height={120} className="rounded-2xl" />
          </div>
          <Skeleton height={320} className="rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50/80 font-sans">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:flex lg:w-72 flex-shrink-0 fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={toggleDrawer}
          />
          <div className="relative w-72 max-w-[80vw] h-full z-10">
            <Sidebar onClose={() => setIsDrawerOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-72 min-w-0">
        {/* Sticky Modern Top Header */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-200/80 px-4 md:px-8 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDrawer}
              aria-label="Toggle Navigation"
              className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition"
            >
              {isDrawerOpen ? <FaTimes size={19} /> : <FaBars size={19} />}
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold">
                <span>Dashboard</span>
                <span>/</span>
                <span className="text-[#FBAE02] font-extrabold capitalize">
                  {getPageTitle(location.pathname)}
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-black text-gray-900 tracking-tight leading-tight">
                {getPageTitle(location.pathname)}
              </h2>
            </div>
          </div>

          {/* Right Header Badges & Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard/add-pet"
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold text-xs uppercase px-4 py-2 rounded-xl transition shadow-xs"
            >
              <FaPlus className="text-xs" />
              <span>Add Pet</span>
            </Link>

            <Link
              to="/"
              className="hidden md:inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold text-xs px-3.5 py-2 rounded-xl transition"
            >
              <FaHome className="text-xs" />
              <span>Visit Site</span>
            </Link>

            {/* User Profile Pill */}
            <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
              <img
                src={user?.photoURL || "https://i.ibb.co/5GzXkwq/user.png"}
                alt={user?.displayName}
                className="w-9 h-9 rounded-xl object-cover border border-[#FBAE02]"
              />
              <div className="hidden xl:block text-left">
                <p className="text-xs font-black text-gray-900 leading-none">
                  {user?.displayName || "Member"}
                </p>
                <span
                  className={`text-[10px] font-extrabold ${
                    isAdmin ? "text-amber-600" : "text-emerald-600"
                  }`}
                >
                  {isAdmin ? "Admin Access" : "Pet Adopter"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Outlet Body */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
