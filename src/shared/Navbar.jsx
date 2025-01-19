import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from '../../public/logo.png';
import AuthContext from "../context/authContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogOut = () => {
    logOut()
      .then(() => {
        toast.success('Log Out Successful');
        navigate('/');
      })
      .catch((err) => {
        toast.error('Log Out Failed');
        console.error(err.message);
      });
  };

  // Navigation Links with Active Class
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Pet Listing", path: "/pet-listing" },
    { name: "Donation Campaigns", path: "/donation-campaigns" },
    { name: "Services", path: "/services" },
    { name: "Contact Us", path: "/contact" },
  ];

  const activeLogo = () => {
    return (
      <img
        src={logo} // Replace with your logo path
        alt="Active Logo"
        className="h-5 w-5 mr-1 inline-block"
      />
    );
  };

  // Show Login link only when user is not logged in
  if (!user) {
    navLinks.push({ name: "Login", path: "/login" });
  }

  // Active and Default Class
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-[#FBAE02] font-bold text-lg"
      : "text-black font-semibold hover:text-[#FBAE02] text-lg transition duration-300";

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="h-8 w-auto mr-3"
            />
            <span className="text-2xl font-bold text-gray-800">PeddyCare</span>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <NavLink key={link.name} to={link.path} className={linkClass}>
                {({ isActive }) => (
                  <>
                    {isActive && activeLogo(link.name)}
                    {link.name}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Profile Section (Show only if user is logged in) */}
          {user ? (
            <div className="relative">
              <img
                src={user.photoURL}
                alt="User"
                className="h-10 w-10 rounded-full cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg z-10">
                  <NavLink
                    to="/dashboard"
                    className="block px-4 py-2 text-white font-medium transition duration-300 hover:bg-white hover:text-blue-500 rounded-t-lg"
                  >
                    Dashboard
                  </NavLink>
                  <button
                    onClick={handleLogOut}
                    className="w-full text-left px-4 py-2 text-white font-medium transition duration-300 hover:bg-white hover:text-red-500 rounded-b-lg"
                  >
                    Logout
                  </button>
                </div>

              )}
            </div>
          ) : (
            <></>
          )}

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
