import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';
import AuthContext from "../context/authContext";
import { useFavorites } from "../context/FavoritesContext";
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import UserAvatar from "../Components/UserAvatar";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logOut } = useContext(AuthContext);
  const { favorites, setIsDrawerOpen } = useFavorites();
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
    { name: "Matchmaker", path: "/pet-matchmaker" },
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


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth"});
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <NavLink to="/" onClick={scrollToTop} className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="h-8 w-auto mr-3"
            />
            <span className="text-3xl font-bold text-black">PeddyCare</span>
          </NavLink>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <NavLink onClick={scrollToTop} key={link.name} to={link.path} className={linkClass}>
                {({ isActive }) => (
                  <>
                    {isActive && activeLogo(link.name)}
                    {link.name}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right Action Icons (Favorites + Profile) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Favorites Wishlist Trigger Button */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2.5 rounded-full hover:bg-orange-50 text-gray-700 hover:text-red-500 transition duration-200 border border-gray-200 shadow-2xs group"
              title="View Saved Pets Wishlist"
              aria-label="View Saved Pets Wishlist"
            >
              <FaHeart className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FBAE02] text-black font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* Profile Section (Show only if user is logged in) */}
            {user && (
              <div className="relative">
                <UserAvatar
                  name={user.displayName || user.email}
                  email={user.email}
                  photo={user.photoURL}
                  className="h-10 w-10 rounded-full cursor-pointer text-sm font-black shadow-sm"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                />
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1D1D1D] text-white rounded-xl shadow-xl z-10 border border-gray-700 overflow-hidden">
                    <NavLink
                      to="/dashboard"
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2.5 text-white font-medium transition duration-200 hover:bg-[#FBAE02] hover:text-black"
                    >
                      Dashboard
                    </NavLink>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleLogOut();
                      }}
                      className="w-full text-left px-4 py-2.5 text-white font-medium transition duration-200 hover:bg-red-600 border-t border-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Right Section (Wishlist Button + Menu Toggle) */}
          <div className="flex md:hidden items-center space-x-3">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-2 rounded-full hover:bg-orange-50 text-gray-700"
              title="Saved Pets"
            >
              <FaHeart className="w-5 h-5 text-red-500" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FBAE02] text-black font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            <button
              className="text-gray-600 focus:outline-none p-1"
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
      </div>

        {/* Mobile Navigation Links */}
        {isOpen && (
          <div className="md:hidden py-3 border-t border-gray-100">
            {user && (
              <div className="px-4 py-3 mb-2 bg-gray-50 rounded-2xl flex items-center gap-3">
                <UserAvatar
                  name={user.displayName || user.email}
                  email={user.email}
                  photo={user.photoURL}
                  className="w-10 h-10 rounded-full text-sm font-black"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-black text-xs text-gray-900 truncate">
                    {user.displayName || "Member"}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            )}
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 ${linkClass}`}
              >
                {link.name}
              </NavLink>
            ))}
            {user && (
              <div className="pt-2 mt-2 border-t border-gray-100 space-y-1">
                <NavLink
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-xs font-bold text-gray-700 hover:text-[#FBAE02]"
                >
                  Dashboard
                </NavLink>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogOut();
                  }}
                  className="block w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
