import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  FaTimes,
  FaPaw,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaHeart,
  FaPaperPlane,
  FaShieldAlt,
  FaSpinner
} from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { getPetImage, handleImageError } from "../utils/imageFallback";

const AdoptionRequestModal = ({ isOpen, onClose, pet, user, onSuccess }) => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-populate phone & address from user's saved profile if available
  useEffect(() => {
    if (isOpen && user?.email) {
      axiosSecure
        .get(`/users/email/${user.email}`)
        .then((res) => {
          if (res.data) {
            if (res.data.phone && !phone) setPhone(res.data.phone);
            if (res.data.address && !address) setAddress(res.data.address);
          }
        })
        .catch(() => {
          // ignore if user profile doc is not yet complete
        });
    }
  }, [isOpen, user, axiosSecure]);

  if (!isOpen || !pet) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phone.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Phone Number Required",
        text: "Please provide a valid contact number so the pet owner can reach you.",
        confirmButtonColor: "#FBAE02",
      });
      return;
    }

    if (!address.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Address Required",
        text: "Please provide your residential address for the adoption request.",
        confirmButtonColor: "#FBAE02",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const adoptionData = {
        petId: pet._id || pet.id,
        petName: pet.petName || "Companion Pet",
        petImage: pet.petImage || "",
        petCategory: pet.petCategory || "Pet",
        petAge: pet.petAge || "",
        petLocation: pet.petLocation || "",
        ownerEmail: pet.userEmail || pet.ownerEmail || "",
        userName: user?.displayName || "Applicant",
        userEmail: user?.email || "",
        phone: phone.trim(),
        address: address.trim(),
        notes: notes.trim(),
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      // Call API (supports both /adoptions and /adoption)
      const res = await axiosSecure.post("/adoptions", adoptionData);

      if (res.data?.insertedId || res.data?.acknowledged) {
        Swal.fire({
          icon: "success",
          title: "Adoption Request Sent! 🎉",
          html: `Your request to adopt <b>${pet.petName}</b> has been submitted successfully! The pet owner will review your application.`,
          confirmButtonColor: "#FBAE02",
          confirmButtonText: "Track My Applications",
          showCancelButton: true,
          cancelButtonColor: "#374151",
          cancelButtonText: "Stay on Page",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/dashboard/my-adoption-requests");
          }
        });

        if (onSuccess) onSuccess();
        onClose();
      } else {
        throw new Error(res.data?.message || "Failed to record adoption application.");
      }
    } catch (err) {
      console.error("Adoption submission error:", err);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          err.response?.data?.message ||
          err.message ||
          "Could not send adoption request. Please try again.",
        confirmButtonColor: "#FBAE02",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden transform transition-all my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#141414] px-6 py-5 text-white flex items-center justify-between border-b border-gray-800">
          <div>
            <span className="text-[11px] font-black uppercase text-[#FBAE02] tracking-wider flex items-center gap-1.5">
              <FaPaw /> Official Adoption Request
            </span>
            <h3 className="text-lg font-black text-white mt-0.5">
              Adopt {pet.petName}
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition"
            title="Close modal"
          >
            <FaTimes size={14} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Pet Preview Strip */}
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-orange-50/70 border border-orange-100/80">
            <img
              src={getPetImage(pet.petImage, pet.petCategory, pet._id)}
              alt={pet.petName}
              onError={(e) => handleImageError(e, pet.petCategory)}
              className="w-14 h-14 rounded-xl object-cover border border-orange-200 shadow-xs shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-gray-900 truncate">
                  {pet.petName}
                </h4>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#FBAE02] text-black">
                  {pet.petCategory || "Pet"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500 font-medium mt-0.5">
                <span>Age: <strong>{pet.petAge || "1"} yrs</strong></span>
                <span>•</span>
                <span className="truncate">📍 {pet.petLocation || "Available"}</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Applicant Name & Email Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Name */}
              <div>
                <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">
                  Applicant Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-xs">
                    <FaUser />
                  </span>
                  <input
                    type="text"
                    disabled
                    value={user?.displayName || "Prospective Adopter"}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-600 font-semibold cursor-not-allowed outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-black uppercase text-gray-500 mb-1">
                  Applicant Email
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-xs">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-600 font-semibold cursor-not-allowed outline-none truncate"
                  />
                </div>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-[11px] font-black uppercase text-gray-700 mb-1">
                Contact Phone <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#FBAE02] text-xs">
                  <FaPhone />
                </span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +880 1700-000000"
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 font-medium focus:ring-2 focus:ring-[#FBAE02] focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-[11px] font-black uppercase text-gray-700 mb-1">
                Living / Residential Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none text-[#FBAE02] text-xs">
                  <FaMapMarkerAlt />
                </span>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address, apartment/house number, city..."
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 font-medium focus:ring-2 focus:ring-[#FBAE02] focus:border-transparent outline-none transition resize-none"
                />
              </div>
            </div>

            {/* Personal Note / Experience */}
            <div>
              <label className="block text-[11px] font-black uppercase text-gray-700 mb-1">
                Note for Pet Owner <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <span className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-xs">
                  <FaHeart className="text-rose-400" />
                </span>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell the pet parent a little about your home environment, schedule, or pet care experience..."
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 font-medium focus:ring-2 focus:ring-[#FBAE02] focus:border-transparent outline-none transition resize-none"
                />
              </div>
            </div>

            {/* Reassurance Badge */}
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-2.5 text-[11px] text-gray-500">
              <FaShieldAlt className="text-emerald-500 shrink-0 text-sm" />
              <span>
                Your application will be sent directly to the owner. Pet adoption through PeddyCare is 100% free of charge.
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-black text-xs uppercase px-5 py-2.5 rounded-xl transition shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin text-xs" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="text-xs" />
                    <span>Submit Adoption Request</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

AdoptionRequestModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  pet: PropTypes.object,
  user: PropTypes.object,
  onSuccess: PropTypes.func,
};

export default AdoptionRequestModal;
