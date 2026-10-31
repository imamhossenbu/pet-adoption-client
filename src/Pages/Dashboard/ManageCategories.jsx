import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaTags,
  FaPlusCircle,
  FaPaw,
  FaTrashAlt,
  FaExternalLinkAlt,
  FaTimes,
  FaShieldAlt,
  FaCheckCircle,
  FaCloudUploadAlt,
  FaSpinner,
  FaImage,
  FaCheck
} from "react-icons/fa";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Skeleton from "react-loading-skeleton";
import { uploadImageToCloud } from "../../utils/cloudinaryUpload";

const ManageCategories = () => {
  const axiosSecure = useAxiosSecure();
  const fileInputRef = useRef(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCat, setNewCat] = useState({
    category: "",
    label: "",
    icon: "🐾",
    image: "",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categories = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const res = await axiosSecure.get("/categories");
      return res.data || [];
    },
  });

  const handleFileSelect = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      Swal.fire("Invalid File", "Please select an image file (PNG, JPG, WEBP, etc.)", "warning");
      return;
    }

    setSelectedFile(file);
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setIsUploading(true);

    try {
      const uploadedUrl = await uploadImageToCloud(file, newCat.category || "dog");
      if (uploadedUrl) {
        setNewCat((prev) => ({ ...prev, image: uploadedUrl }));
      }
    } catch (err) {
      console.error("Upload error:", err);
      Swal.fire("Upload Notice", "Cloudinary upload preset not configured yet. Fallback image will be used.", "info");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setSelectedFile(null);
    setPreviewUrl("");
    setShowUrlInput(false);
    setIsUploading(false);
    setNewCat({ category: "", label: "", icon: "🐾", image: "", description: "" });
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCat.category?.trim()) {
      Swal.fire("Required", "Please provide a category name.", "warning");
      return;
    }
    setIsSubmitting(true);
    try {
      let finalImageUrl = newCat.image;

      // If user selected file and upload is still pending or not done yet
      if (selectedFile && !finalImageUrl) {
        setIsUploading(true);
        finalImageUrl = await uploadImageToCloud(selectedFile, newCat.category || "dog");
      }

      const res = await axiosSecure.post("/categories", {
        ...newCat,
        category: newCat.category.trim(),
        label: newCat.label?.trim() || `${newCat.category.trim()}s`,
        image: finalImageUrl || "",
      });

      if (res.data.insertedId || res.data.acknowledged) {
        Swal.fire({
          icon: "success",
          title: "Category Added!",
          text: `"${newCat.category}" category created with image successfully.`,
          timer: 2000,
          showConfirmButton: false,
        });
        handleCloseModal();
        refetch();
      }
    } catch (err) {
      Swal.fire("Error", "Failed to add category.", "error");
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    const confirm = await Swal.fire({
      title: "Delete Category?",
      text: `Are you sure you want to delete "${name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Delete",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/categories/${id}`);
        if (res.data.deletedCount) {
          refetch();
          Swal.fire("Deleted!", "Category removed.", "success");
        }
      } catch (err) {
        Swal.fire("Error", "Could not delete category.", "error");
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <Helmet>
        <title>Manage Pet Categories || PeddyCare Admin</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#FBAE02] tracking-wider mb-1">
            <FaShieldAlt /> Taxonomy & Classification
          </span>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Pet Categories ({categories.length})
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage classification categories used across the platform to organize pet listings.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold text-xs uppercase px-5 py-3 rounded-2xl transition shadow"
        >
          <FaPlusCircle className="text-sm" /> Add New Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full">
            <Skeleton height={140} count={2} className="rounded-2xl" />
          </div>
        ) : (
          categories.map((cat, idx) => (
            <div
              key={cat._id || idx}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.label || cat.category}
                      className="w-14 h-14 object-cover rounded-2xl border border-gray-200 shadow-xs"
                    />
                  ) : (
                    <span className="text-3xl p-3 bg-amber-50 rounded-2xl border border-amber-100/50">
                      {cat.icon || "🐾"}
                    </span>
                  )}
                  {cat._id && (
                    <button
                      onClick={() =>
                        handleDeleteCategory(cat._id, cat.category || cat.label)
                      }
                      title="Delete Category"
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                    >
                      <FaTrashAlt className="text-xs" />
                    </button>
                  )}
                </div>

                <h3 className="text-lg font-black text-gray-900 mb-1">
                  {cat.label || cat.category}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-4">
                  {cat.description || "Adorable companions ready for adoption."}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase text-emerald-600 flex items-center gap-1">
                  <FaCheckCircle className="text-[9px]" /> Active Filter
                </span>
                <Link
                  to={`/pet-listing?category=${cat.category?.toLowerCase()}`}
                  target="_blank"
                  className="text-xs font-black text-[#FBAE02] hover:underline flex items-center gap-1"
                >
                  View Pets <FaExternalLinkAlt className="text-[10px]" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleCloseModal}
              className="absolute right-5 top-5 p-2 rounded-xl text-gray-400 hover:text-black hover:bg-gray-100 transition"
            >
              <FaTimes />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-amber-50 text-[#FBAE02]">
                <FaPaw className="text-sm" />
              </span>
              <h3 className="text-lg font-black text-gray-900">
                Add New Pet Category
              </h3>
            </div>
            <p className="text-xs text-gray-400 mb-5">
              Create a new category with direct image upload and icon.
            </p>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                    Category Name (Singular) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hamster, Turtle, Fish"
                    value={newCat.category}
                    onChange={(e) =>
                      setNewCat({ ...newCat, category: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                    Emoji / Icon
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 🐹, 🐢, 🐠"
                    value={newCat.icon}
                    onChange={(e) =>
                      setNewCat({ ...newCat, icon: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                  />
                </div>
              </div>

              {/* Direct Image Upload (File Drag & Drop / Picker) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-black uppercase text-gray-700 flex items-center gap-1.5">
                    <FaImage className="text-[#FBAE02]" /> Category Image (Direct Upload)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-[11px] font-bold text-[#FBAE02] hover:text-orange-600 transition"
                  >
                    {showUrlInput ? "Hide URL Input" : "Or paste URL"}
                  </button>
                </div>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-4 text-center transition flex flex-col items-center justify-center min-h-[140px] ${
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
                      if (e.target.files?.[0]) handleFileSelect(e.target.files[0]);
                    }}
                  />

                  {previewUrl ? (
                    <div className="flex items-center gap-4 w-full">
                      <img
                        src={previewUrl}
                        alt="Category Preview"
                        className="w-20 h-20 object-cover rounded-2xl border border-gray-200 shadow-sm shrink-0"
                      />
                      <div className="text-left flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          {isUploading ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                              <FaSpinner className="animate-spin text-[10px]" /> Uploading...
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              <FaCheck className="text-[9px]" /> Ready to Save
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-gray-800 truncate">
                          {selectedFile?.name || "Selected Category Image"}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          Click or drop another file to change image
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          setPreviewUrl("");
                          setNewCat((prev) => ({ ...prev, image: "" }));
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-white transition"
                        title="Remove image"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5 pointer-events-none py-2">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100/80 text-[#FBAE02] flex items-center justify-center text-xl shadow-xs">
                        <FaCloudUploadAlt />
                      </div>
                      <p className="text-xs font-black text-gray-800">
                        Click to browse or drag & drop image
                      </p>
                      <p className="text-[11px] text-gray-400">
                        PNG, JPG, WEBP, or GIF (Auto-uploaded to cloud)
                      </p>
                    </div>
                  )}
                </div>

                {showUrlInput && (
                  <div className="mt-2.5">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... or direct image link"
                      value={newCat.image}
                      onChange={(e) => {
                        setNewCat({ ...newCat, image: e.target.value });
                        if (e.target.value) setPreviewUrl(e.target.value);
                      }}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Description
                </label>
                <textarea
                  rows="2"
                  placeholder="Short description for adopters..."
                  value={newCat.description}
                  onChange={(e) =>
                    setNewCat({ ...newCat, description: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
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
                    "Add Category"
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

export default ManageCategories;
