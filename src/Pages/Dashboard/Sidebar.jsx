/* eslint-disable react/prop-types */

// import { useContext } from "react";
import { NavLink } from "react-router-dom";
import logo from '../../../public/logo.png'
// import AuthContext from "../../context/authContext";

const Sidebar = ({user}) => {
    // const {user}=useContext(AuthContext)
  const sharedLinks = [
    { name: "Home", path: "/" },
    { name: "Pet Listing", path: "/pet-listing" },
    { name: "Donation Campaign", path: "/donation-campaigns" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
  ];

  const userLinks = [
    { name: "Add a Pet", path: "/dashboard/add-pet" },
    { name: "My Added Pets", path: "/dashboard/my-added-pets" },
    { name: "Adoption Request", path: "/dashboard/adoption-request" },
    { name: "Create Donation Campaign", path: "/dashboard/create-donation-campaign" },
    { name: "My Donation Campaigns", path: "/dashboard/my-donation-campaigns" },
    { name: "My Donations", path: "/dashboard/my-donations" },
  ];

  const adminLinks = [
    { name: "Users", path: "/dashboard/users" },
    { name: "All Pets", path: "/dashboard/all-pets" },
    { name: "All Donations", path: "/dashboard/all-donations" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Logo */}
      <div className="py-4 px-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className=" w-16 h-16 flex justify-center items-center rounded-full text-black font-semibold">
            <img src={logo} alt="" />
          </span>
          PeddyCare Dashboard
        </h1>
      </div>

      {/* User/Admin Links */}
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 px-4">
          <li className="text-gray-400 uppercase font-semibold text-sm">
            {user.role === "admin" ? "Admin Links" : "User Links"}
          </li>
          {(user.role === "admin" ? adminLinks : userLinks).map((link, index) => (
            <li key={index}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md ${
                    isActive
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
            <hr />
          {sharedLinks.map((link, index) => (
            <li key={index}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md ${
                    isActive
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
      </nav>
    </div>
  );
};

export default Sidebar;
