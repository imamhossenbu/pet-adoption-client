import { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from '../../public/logo.png'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Navigation Links with Active Class
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Pet Listing", path: "/pet-listing" },
    { name: "Donation Campaigns", path: "/donation-campaigns" },
    { name: "Login/Register", path: "/login" },
  ];

  // Active and Default Class
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-gray-900 font-semibold border-b-2 border-blue-500"
      : "text-gray-600 hover:text-gray-900 transition duration-300";

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src={logo} // Replace with your logo path
              alt="Logo"
              className="h-8 w-auto mr-3"
            />
            <span className="text-2xl font-bold text-gray-800">PeddyCare</span>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={linkClass}
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Profile Section */}
          <div className="relative">
            <img
              src="https://via.placeholder.com/40" // Replace with user's profile picture URL
              alt="User"
              className="h-10 w-10 rounded-full cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            />
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
                <NavLink
                  to="/dashboard"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Dashboard
                </NavLink>
                <button
                  onClick={() => alert("Logout functionality")}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Links */}
        {isOpen && (
          <div className="md:hidden">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={`block px-4 py-2 ${linkClass}`}
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
