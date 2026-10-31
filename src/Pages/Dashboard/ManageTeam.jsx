import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import {
  FaUserFriends,
  FaPlusCircle,
  FaTrashAlt,
  FaEdit,
  FaTimes,
  FaShieldAlt,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaCloudUploadAlt,
  FaSpinner,
  FaCheck,
  FaImage
} from "react-icons/fa";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Skeleton from "react-loading-skeleton";
import { uploadImageToCloud } from "../../utils/cloudinaryUpload";

const defaultPortrait = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80";

const ManageTeam = () => {
  const axiosSecure = useAxiosSecure();
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // Form states
  const [memberForm, setMemberForm] = useState({
    name: "",
    role: "",
    image: "",
    bio: "",
    social: {
      facebook: "",
      twitter: "",
      linkedin: "",
      instagram: "",
    },
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch team members
  const { data: team = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-team"],
    queryFn: async () => {
      const res = await axiosSecure.get("/team");
      return res.data || [];
    },
  });

  // Handle image file selection
  const handleFileSelect = async (file, isEdit = false) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      Swal.fire("Invalid File", "Please select an image file (PNG, JPG, WEBP).", "warning");
      return;
    }

    setSelectedFile(file);
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setIsUploading(true);

    try {
      const uploadedUrl = await uploadImageToCloud(file, "dog");
      if (uploadedUrl) {
        if (isEdit) {
          setEditingMember((prev) => ({ ...prev, image: uploadedUrl }));
        } else {
          setMemberForm((prev) => ({ ...prev, image: uploadedUrl }));
        }
      }
    } catch (err) {
      console.error("Upload error:", err);
      Swal.fire("Upload Notice", "Cloud upload fallback engaged.", "info");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e, isEdit = false) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0], isEdit);
    }
  };

  const resetForm = () => {
    setMemberForm({
      name: "",
      role: "",
      image: "",
      bio: "",
      social: { facebook: "", twitter: "", linkedin: "", instagram: "" },
    });
    setSelectedFile(null);
    setPreviewUrl("");
    setIsUploading(false);
    setShowUrlInput(false);
  };

  // Add Member
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberForm.name?.trim() || !memberForm.role?.trim()) {
      Swal.fire("Required", "Please provide at least Name and Role.", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      let finalImage = memberForm.image;
      if (selectedFile && !finalImage) {
        setIsUploading(true);
        finalImage = await uploadImageToCloud(selectedFile, "dog");
      }

      const res = await axiosSecure.post("/team", {
        ...memberForm,
        image: finalImage || defaultPortrait,
      });

      if (res.data.insertedId || res.data.acknowledged) {
        Swal.fire({
          icon: "success",
          title: "Team Member Added!",
          text: `${memberForm.name} added to the team directory.`,
          timer: 2000,
          showConfirmButton: false,
        });
        setIsAddModalOpen(false);
        resetForm();
        refetch();
      }
    } catch (err) {
      Swal.fire("Error", "Failed to add team member.", "error");
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (member) => {
    setEditingMember({
      ...member,
      social: member.social || { facebook: "", twitter: "", linkedin: "", instagram: "" },
    });
    setPreviewUrl(member.image || "");
    setSelectedFile(null);
    setShowUrlInput(false);
  };

  // Update Member
  const handleUpdateMember = async (e) => {
    e.preventDefault();
    if (!editingMember?.name?.trim() || !editingMember?.role?.trim()) {
      Swal.fire("Required", "Name and Role are required.", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      let finalImage = editingMember.image;
      if (selectedFile) {
        setIsUploading(true);
        finalImage = await uploadImageToCloud(selectedFile, "dog");
      }

      const res = await axiosSecure.patch(`/team/${editingMember._id}`, {
        ...editingMember,
        image: finalImage || defaultPortrait,
      });

      if (res.data.modifiedCount || res.data.acknowledged) {
        Swal.fire({
          icon: "success",
          title: "Member Updated!",
          text: `${editingMember.name}'s profile has been updated.`,
          timer: 2000,
          showConfirmButton: false,
        });
        setEditingMember(null);
        resetForm();
        refetch();
      }
    } catch (err) {
      Swal.fire("Error", "Failed to update team member.", "error");
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  // Delete Member
  const handleDeleteMember = async (id, name) => {
    const confirm = await Swal.fire({
      title: `Remove ${name}?`,
      text: "This team member will be removed from both Admin and the public website.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Remove",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/team/${id}`);
        if (res.data.deletedCount) {
          refetch();
          Swal.fire("Removed!", `${name} has been removed.`, "success");
        }
      } catch (err) {
        Swal.fire("Error", "Could not remove team member.", "error");
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <Helmet>
        <title>Manage Team Members || PeddyCare Admin</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#FBAE02] tracking-wider mb-1">
            <FaShieldAlt /> Personnel & Leadership
          </span>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Our Care Specialists & Team ({team.length})
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage pet care specialists, doctors, trainers, and leadership displayed on the public site.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold text-xs uppercase px-5 py-3 rounded-2xl transition shadow"
        >
          <FaPlusCircle className="text-sm" /> Add Team Member
        </button>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full">
            <Skeleton height={180} count={3} className="rounded-2xl mb-4" />
          </div>
        ) : team.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-gray-100">
            <FaUserFriends className="mx-auto text-4xl text-gray-300 mb-3" />
            <h4 className="text-base font-black text-gray-800">No Team Members Found</h4>
            <p className="text-xs text-gray-400 mt-1">
              Add your first veterinarian or care specialist to display them on the website.
            </p>
          </div>
        ) : (
          team.map((member) => (
            <div
              key={member._id}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="relative">
                    <img
                      src={member.image || defaultPortrait}
                      alt={member.name}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-100 shadow-sm group-hover:scale-105 transition duration-300"
                    />
                    <span className="absolute -bottom-2 -right-2 bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-200">
                      Staff
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(member)}
                      className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition"
                      title="Edit Member"
                    >
                      <FaEdit className="text-xs" />
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member._id, member.name)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                      title="Delete Member"
                    >
                      <FaTrashAlt className="text-xs" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-black text-gray-900 mb-0.5">
                  {member.name}
                </h3>
                <p className="text-xs font-bold text-[#FBAE02] uppercase tracking-wider mb-2">
                  {member.role}
                </p>
                <p className="text-xs text-gray-500 line-clamp-3 mb-4">
                  {member.bio || "Professional animal care specialist committed to welfare and rehabilitation."}
                </p>
              </div>

              {/* Social Links */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {member.social?.facebook && (
                    <a
                      href={member.social.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs hover:bg-blue-600 hover:text-white transition"
                    >
                      <FaFacebookF />
                    </a>
                  )}
                  {member.social?.twitter && (
                    <a
                      href={member.social.twitter}
                      target="_blank"
                      rel="noreferrer"
                      className="w-7 h-7 rounded-lg bg-sky-50 text-sky-500 flex items-center justify-center text-xs hover:bg-sky-500 hover:text-white transition"
                    >
                      <FaTwitter />
                    </a>
                  )}
                  {member.social?.linkedin && (
                    <a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center text-xs hover:bg-blue-700 hover:text-white transition"
                    >
                      <FaLinkedinIn />
                    </a>
                  )}
                  {member.social?.instagram && (
                    <a
                      href={member.social.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="w-7 h-7 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center text-xs hover:bg-pink-600 hover:text-white transition"
                    >
                      <FaInstagram />
                    </a>
                  )}
                </div>

                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Active
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsAddModalOpen(false);
                resetForm();
              }}
              className="absolute right-5 top-5 p-2 rounded-xl text-gray-400 hover:text-black hover:bg-gray-100 transition"
            >
              <FaTimes />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-amber-50 text-[#FBAE02]">
                <FaUserFriends className="text-sm" />
              </span>
              <h3 className="text-lg font-black text-gray-900">
                Add New Team Member
              </h3>
            </div>
            <p className="text-xs text-gray-400 mb-5">
              Profile details will appear on the public Meet Our Team section.
            </p>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Alex Mercer"
                    value={memberForm.name}
                    onChange={(e) =>
                      setMemberForm({ ...memberForm, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                    Role / Designation *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Veterinarian"
                    value={memberForm.role}
                    onChange={(e) =>
                      setMemberForm({ ...memberForm, role: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                  />
                </div>
              </div>

              {/* Direct Image Upload Dropzone */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-black uppercase text-gray-700 flex items-center gap-1.5">
                    <FaImage className="text-[#FBAE02]" /> Member Photo (Direct Upload)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-[11px] font-bold text-[#FBAE02] hover:text-orange-600 transition"
                  >
                    {showUrlInput ? "Hide URL Option" : "Or enter URL"}
                  </button>
                </div>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => handleDrop(e, false)}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-4 text-center transition flex flex-col items-center justify-center min-h-[130px] ${
                    isDragging
                      ? "border-[#FBAE02] bg-amber-50/50 scale-[1.01]"
                      : previewUrl
                      ? "border-emerald-300 bg-emerald-50/20"
                      : "border-gray-200 bg-gray-50/50 hover:bg-gray-100/50 hover:border-[#FBAE02]/60"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileSelect(e.target.files[0], false);
                    }}
                  />

                  {previewUrl ? (
                    <div className="flex items-center gap-4 w-full">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-2xl border border-gray-200 shadow-sm shrink-0"
                      />
                      <div className="text-left flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          {isUploading ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                              <FaSpinner className="animate-spin text-[10px]" /> Uploading...
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              <FaCheck className="text-[9px]" /> Photo Ready
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-gray-800 truncate">
                          {selectedFile?.name || "Uploaded Portrait"}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          Click or drag to replace image
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          setPreviewUrl("");
                          setMemberForm((prev) => ({ ...prev, image: "" }));
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-white transition"
                        title="Remove photo"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5 pointer-events-none py-1">
                      <div className="w-11 h-11 mx-auto rounded-2xl bg-amber-100/80 text-[#FBAE02] flex items-center justify-center text-lg">
                        <FaCloudUploadAlt />
                      </div>
                      <p className="text-xs font-black text-gray-800">
                        Click or drag & drop member portrait
                      </p>
                      <p className="text-[11px] text-gray-400">
                        PNG, JPG, or WEBP (Square portrait recommended)
                      </p>
                    </div>
                  )}
                </div>

                {showUrlInput && (
                  <div className="mt-2.5">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... or image URL"
                      value={memberForm.image}
                      onChange={(e) => {
                        setMemberForm({ ...memberForm, image: e.target.value });
                        if (e.target.value) setPreviewUrl(e.target.value);
                      }}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Biography / Expertise
                </label>
                <textarea
                  rows="2"
                  placeholder="Specialization, experience, and background..."
                  value={memberForm.bio}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, bio: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                ></textarea>
              </div>

              {/* Social Links */}
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Social Media Links (Optional)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="url"
                    placeholder="Facebook Profile URL"
                    value={memberForm.social.facebook}
                    onChange={(e) =>
                      setMemberForm({
                        ...memberForm,
                        social: { ...memberForm.social, facebook: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                  />
                  <input
                    type="url"
                    placeholder="LinkedIn Profile URL"
                    value={memberForm.social.linkedin}
                    onChange={(e) =>
                      setMemberForm({
                        ...memberForm,
                        social: { ...memberForm.social, linkedin: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                  />
                  <input
                    type="url"
                    placeholder="Twitter Profile URL"
                    value={memberForm.social.twitter}
                    onChange={(e) =>
                      setMemberForm({
                        ...memberForm,
                        social: { ...memberForm.social, twitter: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                  />
                  <input
                    type="url"
                    placeholder="Instagram Profile URL"
                    value={memberForm.social.instagram}
                    onChange={(e) =>
                      setMemberForm({
                        ...memberForm,
                        social: { ...memberForm.social, instagram: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    resetForm();
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold text-xs uppercase px-6 py-2.5 rounded-xl transition shadow disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting || isUploading ? (
                    <>
                      <FaSpinner className="animate-spin" /> Saving...
                    </>
                  ) : (
                    "Add Member"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setEditingMember(null);
                resetForm();
              }}
              className="absolute right-5 top-5 p-2 rounded-xl text-gray-400 hover:text-black hover:bg-gray-100 transition"
            >
              <FaTimes />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-amber-50 text-[#FBAE02]">
                <FaEdit className="text-sm" />
              </span>
              <h3 className="text-lg font-black text-gray-900">
                Edit Team Member: {editingMember.name}
              </h3>
            </div>
            <p className="text-xs text-gray-400 mb-5">
              Update designation, image, and social media handles.
            </p>

            <form onSubmit={handleUpdateMember} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMember.name}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                    Role / Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMember.role}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, role: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                  />
                </div>
              </div>

              {/* Edit Image Upload Dropzone */}
              <div>
                <label className="block text-xs font-black uppercase text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <FaImage className="text-[#FBAE02]" /> Replace Photo (Direct Upload)
                </label>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => handleDrop(e, true)}
                  onClick={() => editFileInputRef.current?.click()}
                  className="relative cursor-pointer border-2 border-dashed rounded-2xl p-4 text-center transition flex flex-col items-center justify-center min-h-[110px] border-gray-200 bg-gray-50/50 hover:bg-gray-100/50 hover:border-[#FBAE02]/60"
                >
                  <input
                    ref={editFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileSelect(e.target.files[0], true);
                    }}
                  />

                  <div className="flex items-center gap-4 w-full">
                    <img
                      src={previewUrl || editingMember.image || defaultPortrait}
                      alt="Preview"
                      className="w-14 h-14 object-cover rounded-2xl border border-gray-200 shadow-sm shrink-0"
                    />
                    <div className="text-left flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {isUploading ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                            <FaSpinner className="animate-spin text-[10px]" /> Uploading...
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            <FaCheck className="text-[9px]" /> Current Photo
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-gray-800 truncate">
                        {selectedFile?.name || "Click to upload replacement image"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Biography / Expertise
                </label>
                <textarea
                  rows="2"
                  value={editingMember.bio || ""}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, bio: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                ></textarea>
              </div>

              {/* Social Links */}
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Social Links
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="url"
                    placeholder="Facebook Profile URL"
                    value={editingMember.social?.facebook || ""}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        social: { ...editingMember.social, facebook: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                  />
                  <input
                    type="url"
                    placeholder="LinkedIn Profile URL"
                    value={editingMember.social?.linkedin || ""}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        social: { ...editingMember.social, linkedin: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                  />
                  <input
                    type="url"
                    placeholder="Twitter Profile URL"
                    value={editingMember.social?.twitter || ""}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        social: { ...editingMember.social, twitter: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                  />
                  <input
                    type="url"
                    placeholder="Instagram Profile URL"
                    value={editingMember.social?.instagram || ""}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        social: { ...editingMember.social, instagram: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingMember(null);
                    resetForm();
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold text-xs uppercase px-6 py-2.5 rounded-xl transition shadow disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting || isUploading ? (
                    <>
                      <FaSpinner className="animate-spin" /> Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTeam;
