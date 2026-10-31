import { useState } from "react";

// Harmonious vibrant gradients based on initial letter
const colorThemes = [
  "bg-gradient-to-br from-amber-400 via-[#FBAE02] to-orange-500 text-black border-amber-300/80 shadow-amber-500/20",
  "bg-gradient-to-br from-amber-500 to-orange-600 text-white border-orange-400/80 shadow-orange-500/20",
  "bg-gradient-to-br from-emerald-400 to-teal-600 text-white border-emerald-300/80 shadow-emerald-500/20",
  "bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-blue-300/80 shadow-blue-500/20",
  "bg-gradient-to-br from-purple-500 to-pink-600 text-white border-purple-300/80 shadow-purple-500/20",
  "bg-gradient-to-br from-rose-500 to-red-600 text-white border-rose-300/80 shadow-rose-500/20",
  "bg-gradient-to-br from-cyan-500 to-blue-600 text-white border-cyan-300/80 shadow-cyan-500/20",
];

const getThemeForName = (name = "") => {
  const clean = name.trim();
  if (!clean) return colorThemes[0];
  const charCode = clean.toUpperCase().charCodeAt(0) || 65;
  return colorThemes[charCode % colorThemes.length];
};

const getInitial = (name = "", email = "") => {
  if (name && typeof name === "string" && name.trim().length > 0) {
    return name.trim()[0].toUpperCase();
  }
  if (email && typeof email === "string" && email.trim().length > 0) {
    return email.trim()[0].toUpperCase();
  }
  return "U";
};

const UserAvatar = ({
  name = "User",
  email = "",
  photo = "",
  className = "w-10 h-10 rounded-2xl text-sm",
  alt = "User Avatar",
  onClick,
  showBorder = true,
}) => {
  const [imageError, setImageError] = useState(false);

  // Consider dummy placeholders as missing images
  const isDummyPlaceholder =
    !photo ||
    typeof photo !== "string" ||
    photo.trim() === "" ||
    photo.includes("5GzXkwq/user.png") ||
    photo.includes("via.placeholder") ||
    photo.includes("placeholder.com");

  const initial = getInitial(name, email);
  const theme = getThemeForName(name || email);

  if (!isDummyPlaceholder && !imageError) {
    return (
      <img
        src={photo}
        alt={alt || name}
        onError={() => setImageError(true)}
        onClick={onClick}
        className={`object-cover select-none shrink-0 ${
          showBorder ? "border-2 border-[#FBAE02]" : ""
        } ${className}`}
      />
    );
  }

  return (
    <div
      onClick={onClick}
      title={name || email || "User"}
      className={`inline-flex items-center justify-center font-black select-none shrink-0 shadow-sm transition transform hover:scale-105 ${
        showBorder ? "border-2" : ""
      } ${theme} ${className}`}
      style={{
        textShadow: "0 1px 2px rgba(0,0,0,0.2)",
      }}
    >
      <span>{initial}</span>
    </div>
  );
};

export default UserAvatar;
