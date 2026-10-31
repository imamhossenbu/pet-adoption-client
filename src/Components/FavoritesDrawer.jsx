import { useFavorites } from "../context/FavoritesContext";
import { NavLink } from "react-router-dom";
import { FaTrash, FaTimes, FaHeart, FaMapMarkerAlt, FaPaw } from "react-icons/fa";
import { getPetImage, handleImageError } from "../utils/imageFallback";

const FavoritesDrawer = () => {
  const { favorites, isDrawerOpen, setIsDrawerOpen, removeFavorite, clearFavorites } = useFavorites();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-[#1D1D1D] to-[#2b2b2b] text-white flex items-center justify-between border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <span className="p-2 bg-[#FBAE02] text-black rounded-lg">
                <FaHeart className="w-5 h-5 text-red-600" />
              </span>
              <div>
                <h2 className="text-xl font-bold">Saved Pets</h2>
                <p className="text-xs text-gray-300">
                  {favorites.length} {favorites.length === 1 ? "pet" : "pets"} in your wishlist
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition"
              aria-label="Close drawer"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {favorites.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-20 h-20 mx-auto mb-4 bg-orange-50 rounded-full flex items-center justify-center text-orange-400">
                  <FaPaw className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">No Saved Pets Yet</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
                  Browse our adorable pets and click the heart icon to save your favorites here for easy comparison!
                </p>
                <NavLink
                  to="/pet-listing"
                  onClick={() => setIsDrawerOpen(false)}
                  className="inline-block bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-bold py-2.5 px-6 rounded-lg transition duration-200 shadow-md"
                >
                  Browse Pets Now
                </NavLink>
              </div>
            ) : (
              favorites.map((pet) => (
                <div
                  key={pet._id}
                  className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-3 hover:shadow-md transition duration-200 gap-3 group"
                >
                  <img
                    src={getPetImage(pet.petImage, pet.petCategory, pet._id)}
                    alt={pet.petName}
                    onError={(e) => handleImageError(e, pet.petCategory)}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border border-gray-300"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 truncate text-base group-hover:text-orange-600 transition">
                      {pet.petName}
                    </h4>
                    <p className="text-xs text-gray-500 flex items-center mt-0.5">
                      <FaMapMarkerAlt className="mr-1 text-orange-500 flex-shrink-0" />
                      <span className="truncate">{pet.petLocation || "Available"}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-orange-100 text-orange-800 font-semibold px-2 py-0.5 rounded-full capitalize">
                        {pet.petCategory || "Pet"}
                      </span>
                      <span className="text-xs text-gray-500">
                        Age: {pet.petAge} yrs
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between h-20 py-1">
                    <button
                      onClick={() => removeFavorite(pet._id, pet.petName)}
                      className="text-gray-400 hover:text-red-500 p-1.5 rounded transition"
                      title="Remove from favorites"
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                    <NavLink
                      to={`/pet-details/${pet._id}`}
                      onClick={() => setIsDrawerOpen(false)}
                      className="bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white text-xs font-bold py-1.5 px-3 rounded-md transition shadow-sm"
                    >
                      View
                    </NavLink>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          {favorites.length > 0 && (
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-3">
              <button
                onClick={clearFavorites}
                className="text-xs text-gray-600 hover:text-red-600 font-semibold transition underline"
              >
                Clear all favorites
              </button>
              <NavLink
                to="/pet-listing"
                onClick={() => setIsDrawerOpen(false)}
                className="bg-[#1D1D1D] hover:bg-black text-white text-xs font-semibold py-2 px-4 rounded-lg transition"
              >
                Explore More Pets
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesDrawer;
