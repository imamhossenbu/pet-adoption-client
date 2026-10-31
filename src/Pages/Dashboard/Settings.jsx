import { useState, useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCamera,
  FaCheckCircle,
  FaShieldAlt,
  FaSave,
  FaBriefcase,
  FaInfoCircle,
  FaKey,
  FaCalendarAlt,
  FaCloudUploadAlt,
  FaTrashAlt,
  FaExclamationTriangle,
  FaGoogle,
  FaPaperPlane
} from "react-icons/fa";
import AuthContext from "../../context/authContext";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAdmin from "../../Hooks/useAdmin";
import UserAvatar from "../../Components/UserAvatar";
import { uploadImageToCloud } from "../../utils/cloudinaryUpload";

const Settings = () => {
  const { user, updateUserProfile, updateUserPassword, sendResetEmail } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [isAdmin] = useAdmin();

  // Check if account has an active password or authenticated via Google/Social
  const hasPassword = user?.providerData?.some((p) => p.providerId === "password");
  const isGoogleUser = user?.providerData?.some((p) => p.providerId === "google.com");

  // Profile data states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [occupation, setOccupation] = useState("");
  const [bio, setBio] = useState("");
  const [isProfileSaving, setIsProfileSaving] = useState(false);

  // Photo management states
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

  // Populate initial values from Firebase user and server profile
  useEffect(() => {
    if (user) {
      setName(user.displayName || "");
      setPhotoUrl(user.photoURL || "");
      setPhotoPreview(user.photoURL || "");

      // Fetch extended user document from MongoDB
      if (user.email) {
        axiosSecure
          .get(`/users/email/${user.email}`)
          .then((res) => {
            if (res.data) {
              const data = res.data;
              if (data.name) setName(data.name);
              if (data.phone) setPhone(data.phone);
              if (data.address || data.city) setAddress(data.address || data.city);
              if (data.occupation) setOccupation(data.occupation);
              if (data.bio) setBio(data.bio);
              if (data.photoURL || data.image) {
                setPhotoUrl(data.photoURL || data.image);
                setPhotoPreview(data.photoURL || data.image);
              }
            }
          })
          .catch((err) => {
            console.warn("Could not fetch remote user details:", err);
          });
      }
    }
  }, [user, axiosSecure]);

  // Handle local file selection for avatar
  const handlePhotoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: "warning",
          title: "File Too Large",
          text: "Please select an image smaller than 5MB.",
          confirmButtonColor: "#FBAE02",
        });
        return;
      }
      setSelectedFile(file);
      const preview = URL.createObjectURL(file);
      setPhotoPreview(preview);
    }
  };

  // Upload and save avatar
  const handleSavePhoto = async () => {
    if (!selectedFile && !photoUrl) {
      Swal.fire({
        icon: "info",
        title: "No Image Selected",
        text: "Please select an image file or enter an image URL.",
        confirmButtonColor: "#FBAE02",
      });
      return;
    }

    setIsUploadingPhoto(true);
    try {
      let finalUrl = photoUrl;

      // If user chose a file, upload to Cloudinary/ImgBB
      if (selectedFile) {
        const uploaded = await uploadImageToCloud(selectedFile, "avatar");
        if (uploaded) {
          finalUrl = uploaded;
        }
      }

      // Update Firebase Auth Profile
      await updateUserProfile(name || user?.displayName || "User", finalUrl);

      // Sync to MongoDB server
      if (user?.email) {
        await axiosSecure.patch(`/users/profile/${encodeURIComponent(user.email)}`, {
          email: user.email,
          name: name || user?.displayName,
          photoURL: finalUrl,
        });
      }

      setPhotoUrl(finalUrl);
      setPhotoPreview(finalUrl);
      setSelectedFile(null);

      Swal.fire({
        icon: "success",
        title: "Profile Photo Updated!",
        text: "Your new avatar has been applied across the platform.",
        confirmButtonColor: "#FBAE02",
        timer: 2000,
      });
    } catch (err) {
      console.error("Avatar update error:", err);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err.message || "Could not update avatar. Please try again.",
        confirmButtonColor: "#FBAE02",
      });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Reset photo to initial letter avatar
  const handleResetToInitials = async () => {
    const confirm = await Swal.fire({
      title: "Remove Profile Picture?",
      text: "Your avatar will default to your stylish initial letter.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#FBAE02",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Remove",
    });

    if (!confirm.isConfirmed) return;

    setIsUploadingPhoto(true);
    try {
      await updateUserProfile(name || user?.displayName || "User", "");
      if (user?.email) {
        await axiosSecure.patch(`/users/profile/${encodeURIComponent(user.email)}`, {
          email: user.email,
          photoURL: "",
        });
      }
      setPhotoUrl("");
      setPhotoPreview("");
      setSelectedFile(null);

      Swal.fire({
        icon: "success",
        title: "Avatar Reset",
        text: "Profile picture removed successfully.",
        confirmButtonColor: "#FBAE02",
        timer: 1800,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to reset avatar.",
        confirmButtonColor: "#FBAE02",
      });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Save personal information
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Name is Required",
        text: "Please provide your full name.",
        confirmButtonColor: "#FBAE02",
      });
      return;
    }

    setIsProfileSaving(true);
    try {
      // 1. Update Firebase display name
      await updateUserProfile(name.trim(), photoUrl || user?.photoURL || "");

      // 2. Sync full profile to MongoDB
      if (user?.email) {
        await axiosSecure.patch(`/users/profile/${encodeURIComponent(user.email)}`, {
          email: user.email,
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: address.trim(),
          occupation: occupation.trim(),
          bio: bio.trim(),
          photoURL: photoUrl || user?.photoURL || "",
        });
      }

      Swal.fire({
        icon: "success",
        title: "Profile Saved!",
        text: "Your account details have been successfully updated.",
        confirmButtonColor: "#FBAE02",
        timer: 2000,
      });
    } catch (err) {
      console.error("Profile update error:", err);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err.message || "Could not update profile information.",
        confirmButtonColor: "#FBAE02",
      });
    } finally {
      setIsProfileSaving(false);
    }
  };

  // Handle password update / creation
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (hasPassword && !currentPassword) {
      Swal.fire({
        icon: "warning",
        title: "Current Password Required",
        text: "Please enter your current password to authenticate this change.",
        confirmButtonColor: "#FBAE02",
      });
      return;
    }

    if (!newPassword) {
      Swal.fire({
        icon: "warning",
        title: "New Password Required",
        text: "Please enter your desired new password.",
        confirmButtonColor: "#FBAE02",
      });
      return;
    }

    if (newPassword.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Password Too Short",
        text: "Password must be at least 6 characters long.",
        confirmButtonColor: "#FBAE02",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Passwords Do Not Match",
        text: "Please make sure your new password and confirmation match exactly.",
        confirmButtonColor: "#FBAE02",
      });
      return;
    }

    setIsPasswordSaving(true);
    try {
      await updateUserPassword(currentPassword, newPassword);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      Swal.fire({
        icon: "success",
        title: hasPassword ? "Password Updated!" : "Password Created! 🎉",
        text: hasPassword
          ? "Your password has been changed successfully."
          : "You have successfully linked a password to your account! You can now log in using either Google or your email and password.",
        confirmButtonColor: "#FBAE02",
        timer: 3000,
      });
    } catch (err) {
      console.error("Password update error:", err);
      let errorMsg = "Could not update password. Please check your credentials.";
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        errorMsg = "Incorrect current password. Please try again.";
      } else if (err.code === "auth/requires-recent-login") {
        errorMsg = "For security reasons, please log out and log back in before setting your password, or use the email reset link.";
      } else if (err.message) {
        errorMsg = err.message;
      }

      Swal.fire({
        icon: "error",
        title: "Password Update Failed",
        text: errorMsg,
        confirmButtonColor: "#FBAE02",
      });
    } finally {
      setIsPasswordSaving(false);
    }
  };

  // One-click password setup link to user email
  const handleSendResetEmail = async () => {
    if (!user?.email) {
      Swal.fire({
        icon: "warning",
        title: "No Email Found",
        text: "No email address found for this account.",
        confirmButtonColor: "#FBAE02",
      });
      return;
    }

    setIsSendingReset(true);
    try {
      await sendResetEmail(user.email);
      Swal.fire({
        icon: "success",
        title: "Setup Link Sent! ✉️",
        html: `A secure password link has been sent to <b>${user.email}</b>. Follow the link in your email to set or change your password.`,
        confirmButtonColor: "#FBAE02",
      });
    } catch (err) {
      console.error("Reset email error:", err);
      Swal.fire({
        icon: "error",
        title: "Failed to Send Email",
        text: err.message || "Could not dispatch password reset link.",
        confirmButtonColor: "#FBAE02",
      });
    } finally {
      setIsSendingReset(false);
    }
  };

  // Password requirements calculation
  const hasMinLength = newPassword.length >= 6;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);

  return (
    <div className="space-y-8 pb-12">
      <Helmet>
        <title>Account Settings | PeddyCare</title>
      </Helmet>

      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1F1F1F] via-[#141414] to-[#0A0A0A] p-6 md:p-8 text-white border border-gray-800 shadow-xl">
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-[#FBAE02]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
            <div className="relative">
              <UserAvatar
                name={name || user?.displayName || user?.email}
                email={user?.email}
                photo={photoPreview || photoUrl}
                className="w-20 h-20 md:w-24 md:h-24 rounded-3xl text-2xl font-black border-2 border-[#FBAE02]/60 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 w-5 h-5 rounded-full border-2 border-[#141414] flex items-center justify-center">
                <FaCheckCircle className="text-[10px] text-white" />
              </span>
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-white">
                  {name || user?.displayName || "Community Member"}
                </h1>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                    isAdmin
                      ? "bg-[#FBAE02] text-black"
                      : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  }`}
                >
                  {isAdmin ? <FaShieldAlt /> : <FaCheckCircle />}
                  {isAdmin ? "Enterprise Admin" : "Active Member"}
                </span>
              </div>
              <p className="text-gray-400 text-xs md:text-sm mt-1 flex items-center justify-center md:justify-start gap-2">
                <FaEnvelope className="text-[#FBAE02]" />
                {user?.email || "No email bound"}
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-[11px] text-gray-400 font-medium">
                <span className="flex items-center gap-1.5">
                  <FaCalendarAlt className="text-gray-500" />
                  Account created: {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "Active"}
                </span>
                {phone && (
                  <span className="flex items-center gap-1.5">
                    <FaPhone className="text-gray-500" />
                    {phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-center md:text-right shrink-0">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 block">
              Security Level
            </span>
            <span className="text-base font-black text-[#FBAE02] flex items-center justify-center md:justify-end gap-1.5 mt-0.5">
              <FaShieldAlt /> Verified & Secured
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Profile Management & Settings Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Profile Picture & Quick Details (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Profile Picture Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                <FaCamera className="text-[#FBAE02]" /> Profile Picture
              </h2>
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                Photo & Avatar
              </span>
            </div>

            {/* Avatar Preview Section */}
            <div className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-2xl border border-gray-100/80">
              <div className="relative group">
                <UserAvatar
                  name={name || user?.displayName || user?.email}
                  email={user?.email}
                  photo={photoPreview}
                  className="w-28 h-28 rounded-3xl text-3xl font-black shadow-md border-2 border-[#FBAE02]/60 transition transform group-hover:scale-105 duration-300"
                />
                <label
                  htmlFor="avatar-file-input"
                  className="absolute -bottom-2 -right-2 bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white p-2.5 rounded-2xl shadow-md cursor-pointer transition transform active:scale-95"
                  title="Upload from device"
                >
                  <FaCamera className="text-sm" />
                </label>
              </div>

              <p className="text-xs font-bold text-gray-700 mt-4">
                {selectedFile ? selectedFile.name : photoPreview ? "Active Profile Photo" : "Initial Letter Avatar"}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                PNG, JPG or WebP up to 5MB
              </p>
            </div>

            {/* Hidden file input */}
            <input
              id="avatar-file-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoFileChange}
            />

            {/* Action Buttons for Picture */}
            <div className="space-y-3">
              <label
                htmlFor="avatar-file-input"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-gray-300 hover:border-[#FBAE02] hover:bg-orange-50/50 text-xs font-black text-gray-700 hover:text-orange-600 cursor-pointer transition"
              >
                <FaCloudUploadAlt className="text-base text-[#FBAE02]" />
                <span>{selectedFile ? "Change Selected Image" : "Choose New Photo From Device"}</span>
              </label>

              {/* Direct Image URL input */}
              <div>
                <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">
                  Or Paste Direct Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  value={photoUrl}
                  onChange={(e) => {
                    setPhotoUrl(e.target.value);
                    setPhotoPreview(e.target.value);
                    setSelectedFile(null);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:border-transparent outline-none transition"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  disabled={isUploadingPhoto || (!selectedFile && photoUrl === (user?.photoURL || ""))}
                  onClick={handleSavePhoto}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold text-xs py-3 rounded-xl transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaSave />
                  <span>{isUploadingPhoto ? "Saving Photo..." : "Save Photo"}</span>
                </button>

                {(photoPreview || user?.photoURL) && (
                  <button
                    type="button"
                    disabled={isUploadingPhoto}
                    onClick={handleResetToInitials}
                    className="p-3 rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-500 hover:text-red-600 text-xs font-bold transition"
                    title="Reset to Initial Avatar"
                  >
                    <FaTrashAlt />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Account Security Overview Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-900 flex items-center gap-2">
              <FaShieldAlt className="text-[#FBAE02]" /> Authentication Provider
            </h3>
            <div className="bg-gray-50 p-3.5 rounded-2xl flex items-center justify-between text-xs">
              <span className="font-bold text-gray-600">Primary Provider</span>
              <span className="font-black text-gray-900 capitalize">
                {user?.providerData?.[0]?.providerId === "password"
                  ? "Email & Password"
                  : user?.providerData?.[0]?.providerId || "Firebase Auth"}
              </span>
            </div>
            <div className="bg-gray-50 p-3.5 rounded-2xl flex items-center justify-between text-xs">
              <span className="font-bold text-gray-600">Email Verification</span>
              <span className="font-extrabold text-emerald-600 flex items-center gap-1">
                <FaCheckCircle /> Verified
              </span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              To update your registered email address, please submit a request to support or contact our system administrators.
            </p>
          </div>
        </div>

        {/* Right Column: Personal Information & Password Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Personal Information Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <FaUser className="text-[#FBAE02]" /> Personal Information
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Update your personal profile details and contact information.
                </p>
              </div>
              <span className="text-[11px] text-[#FBAE02] font-black uppercase tracking-wider bg-orange-50 px-2.5 py-1 rounded-full">
                Profile Data
              </span>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-black uppercase text-gray-600 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-xs">
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 font-medium focus:ring-2 focus:ring-[#FBAE02] focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                {/* Email Address (Read-only) */}
                <div>
                  <label className="block text-xs font-black uppercase text-gray-600 mb-1.5">
                    Email Address <span className="text-gray-400 font-normal">(Primary)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-xs">
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ""}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-500 font-medium cursor-not-allowed outline-none"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-black uppercase text-gray-600 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-xs">
                      <FaPhone />
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 font-medium focus:ring-2 focus:ring-[#FBAE02] focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>

                {/* Address / Location */}
                <div>
                  <label className="block text-xs font-black uppercase text-gray-600 mb-1.5">
                    City / Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-xs">
                      <FaMapMarkerAlt />
                    </span>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Dhaka, Bangladesh"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 font-medium focus:ring-2 focus:ring-[#FBAE02] focus:border-transparent outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Occupation / Community Role */}
              <div>
                <label className="block text-xs font-black uppercase text-gray-600 mb-1.5">
                  Occupation / Community Title
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-xs">
                    <FaBriefcase />
                  </span>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="e.g. Veterinarian, Animal Volunteer, Foster Parent"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 font-medium focus:ring-2 focus:ring-[#FBAE02] focus:border-transparent outline-none transition"
                  />
                </div>
              </div>

              {/* Bio / About */}
              <div>
                <label className="block text-xs font-black uppercase text-gray-600 mb-1.5">
                  About You / Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a short introduction about your love for animals, experience with pet adoption, or home environment..."
                  className="w-full p-3.5 rounded-xl border border-gray-200 text-xs text-gray-800 font-medium focus:ring-2 focus:ring-[#FBAE02] focus:border-transparent outline-none transition resize-none"
                />
              </div>

              {/* Save Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isProfileSaving}
                  className="inline-flex items-center gap-2 bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold text-xs px-6 py-3 rounded-xl transition shadow-xs disabled:opacity-50"
                >
                  <FaSave />
                  <span>{isProfileSaving ? "Saving Changes..." : "Save Profile Information"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Password & Security Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                  <FaKey className="text-[#FBAE02]" />
                  {hasPassword ? "Security & Password Change" : "Create Password for Email Login"}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {hasPassword
                    ? "Update your login credentials to keep your account safe."
                    : "You signed in with Google. You can create a password to enable direct email login."}
                </p>
              </div>
              <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                hasPassword ? "bg-gray-100 text-gray-600" : "bg-orange-50 text-[#FBAE02]"
              }`}>
                {hasPassword ? "Security" : "Password Setup"}
              </span>
            </div>

            {/* Social / Google User Helpful Notice */}
            {!hasPassword && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3.5 text-xs text-amber-950">
                <div className="w-9 h-9 rounded-xl bg-white border border-amber-200 flex items-center justify-center shrink-0 shadow-xs">
                  <FaGoogle className="text-base text-[#FBAE02]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-gray-900">
                    Signed in with {isGoogleUser ? "Google Authentication" : "Social Login"}
                  </h4>
                  <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">
                    You do not have a password yet because you authenticated using Google. You can create a password below so you can sign in using either Google or your email directly.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Current Password (Only shown if user has an existing password) */}
              {hasPassword && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-black uppercase text-gray-600">
                      Current Password <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      disabled={isSendingReset}
                      onClick={handleSendResetEmail}
                      className="text-[11px] font-bold text-orange-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <FaPaperPlane className="text-[10px]" />
                      <span>{isSendingReset ? "Sending..." : "Forgot password? Send reset link"}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-xs">
                      <FaLock />
                    </span>
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 font-medium focus:ring-2 focus:ring-[#FBAE02] focus:border-transparent outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 text-xs"
                    >
                      {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              )}

              {/* New Password & Confirm Password Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* New Password */}
                <div>
                  <label className="block text-xs font-black uppercase text-gray-600 mb-1.5">
                    {hasPassword ? "New Password" : "Create Password"} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-xs">
                      <FaLock />
                    </span>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 font-medium focus:ring-2 focus:ring-[#FBAE02] focus:border-transparent outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 text-xs"
                    >
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-black uppercase text-gray-600 mb-1.5">
                    Confirm {hasPassword ? "New Password" : "Password"} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 text-xs">
                      <FaLock />
                    </span>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 font-medium focus:ring-2 focus:ring-[#FBAE02] focus:border-transparent outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 text-xs"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Strength Checklist */}
              {newPassword && (
                <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 text-[11px] space-y-1.5">
                  <p className="font-black text-gray-700 flex items-center gap-1.5 mb-1">
                    <FaInfoCircle className="text-[#FBAE02]" /> Password Strength:
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <span className={`flex items-center gap-1 font-bold ${hasMinLength ? "text-emerald-600" : "text-gray-400"}`}>
                      {hasMinLength ? <FaCheckCircle /> : <FaExclamationTriangle />} At least 6 characters
                    </span>
                    <span className={`flex items-center gap-1 font-bold ${hasUpperCase ? "text-emerald-600" : "text-gray-400"}`}>
                      {hasUpperCase ? <FaCheckCircle /> : <FaExclamationTriangle />} Uppercase letter
                    </span>
                    <span className={`flex items-center gap-1 font-bold ${hasLowerCase ? "text-emerald-600" : "text-gray-400"}`}>
                      {hasLowerCase ? <FaCheckCircle /> : <FaExclamationTriangle />} Lowercase letter
                    </span>
                    <span className={`flex items-center gap-1 font-bold ${hasNumber ? "text-emerald-600" : "text-gray-400"}`}>
                      {hasNumber ? <FaCheckCircle /> : <FaExclamationTriangle />} Number digit
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                {!hasPassword ? (
                  <button
                    type="button"
                    disabled={isSendingReset}
                    onClick={handleSendResetEmail}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50/50 text-gray-700 hover:text-orange-600 text-xs font-bold transition disabled:opacity-50"
                  >
                    <FaPaperPlane className="text-xs text-[#FBAE02]" />
                    <span>{isSendingReset ? "Sending Link..." : "Send Setup Link to Email"}</span>
                  </button>
                ) : <div />}

                <button
                  type="submit"
                  disabled={isPasswordSaving || !newPassword}
                  className="inline-flex items-center gap-2 bg-[#141414] hover:bg-black text-[#FBAE02] font-extrabold text-xs px-6 py-3 rounded-xl transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaKey />
                  <span>
                    {isPasswordSaving
                      ? "Saving..."
                      : hasPassword
                      ? "Update Password"
                      : "Set Account Password"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
