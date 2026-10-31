import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem("peddy_favorite_pets");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("peddy_favorite_pets", JSON.stringify(favorites));
    } catch (e) {
      console.error("Failed to save favorites to localStorage", e);
    }
  }, [favorites]);

  const isFavorite = (petId) => {
    return favorites.some((pet) => pet._id === petId);
  };

  const toggleFavorite = (pet) => {
    if (!pet || !pet._id) return;

    if (isFavorite(pet._id)) {
      setFavorites((prev) => prev.filter((item) => item._id !== pet._id));
      toast.success(`${pet.petName || "Pet"} removed from favorites`, {
        icon: "💔",
        style: {
          borderRadius: "10px",
          background: "#1D1D1D",
          color: "#fff",
        },
      });
    } else {
      setFavorites((prev) => [pet, ...prev]);
      toast.success(`${pet.petName || "Pet"} added to your favorites!`, {
        icon: "❤️",
        style: {
          borderRadius: "10px",
          background: "#FBAE02",
          color: "#000",
          fontWeight: "600",
        },
      });
    }
  };

  const removeFavorite = (petId, petName) => {
    setFavorites((prev) => prev.filter((item) => item._id !== petId));
    toast.success(`${petName || "Pet"} removed from favorites`, {
      icon: "🗑️",
      style: {
        borderRadius: "10px",
        background: "#1D1D1D",
        color: "#fff",
      },
    });
  };

  const clearFavorites = () => {
    setFavorites([]);
    toast.success("Favorites list cleared", {
      icon: "🧹",
    });
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        removeFavorite,
        clearFavorites,
        isDrawerOpen,
        setIsDrawerOpen,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

export default FavoritesContext;
