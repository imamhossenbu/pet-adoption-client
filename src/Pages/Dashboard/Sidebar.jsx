import { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from '../../../public/logo.png';
import useAdmin from "../../Hooks/useAdmin";

const Sidebar = () => {
  const [isAdmin] = useAdmin();
  const [showUserRoutes, setShowUserRoutes] = useState(false);

  const sharedLinks = [
    { name: "Home", path: "/" },
    { name: "Pet Listing", path: "/pet-listing" },
    { name: "Donation Campaign", path: "/donation-campaigns" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
  ];

  // User links (Only available when viewing user dashboard)
  const userLinks = [
    { name: "Add a Pet", path: "/dashboard/add-pet" },
    { name: "My Added Pets", path: "/dashboard/my-added-pets" },
    { name: "Adoption Request", path: "/dashboard/adoption-request" },
    { name: "Create Donation Campaign", path: "/dashboard/create-donation-campaign" },
    { name: "My Donation Campaigns", path: "/dashboard/my-donation-campaigns" },
    { name: "My Donations", path: "/dashboard/my-donations" },
  ];

  // Admin links
  const adminLinks = [
    { name: "Users", path: "/dashboard/all-users" },
    { name: "All Pets", path: "/dashboard/all-pets" },
    { name: "All Donations", path: "/dashboard/all-donations" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-800 text-white">
      {/* Logo */}
      <div className="py-4 px-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="w-16 h-16 flex justify-center items-center rounded-full text-black font-semibold">
            <img src={logo} alt="Logo" />
          </span>
          PeddyCare Dashboard
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 px-4">
          <li className="text-gray-400 uppercase font-semibold text-sm">
            {showUserRoutes ? "User Links" : "Admin Links"}
          </li>

          {/* Conditionally show user or admin links based on the toggle state */}
          {(isAdmin && showUserRoutes ? userLinks : isAdmin ? adminLinks : userLinks).map((link, index) => (
            <li key={index}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md ${isActive
                    ? "bg-orange-500 text-white font-semibold"
                    : "text-gray-300 hover:bg-gray-700"
                  }`
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Shared Links */}
        <ul className="space-y-1 px-4 mt-6 mb-6">
          <hr className="border-gray-600" />
          {sharedLinks.map((link, index) => (
            <li key={index}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md ${isActive
                    ? "bg-orange-500 text-white font-semibold"
                    : "text-gray-300 hover:bg-gray-700"
                  }`
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Toggle button for switching between user and admin views */}
        {isAdmin && (
          <div className="px-4">
            <button
              onClick={() => setShowUserRoutes(!showUserRoutes)}
              className="btn bg-orange-500 font-semibold w-full px-4 py-2 rounded-md hover:bg-orange-600"
            >
              {showUserRoutes ? "Go to Admin Dashboard" : "Go to User Dashboard"}
            </button>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
