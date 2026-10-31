import { useState } from "react";
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
  FaCheckCircle
} from "react-icons/fa";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Skeleton from "react-loading-skeleton";

const ManageCategories = () => {
  const axiosSecure = useAxiosSecure();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCat, setNewCat] = useState({
    category: "",
    label: "",
    icon: "🐾",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categories = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const res = await axiosSecure.get("/categories");
      return res.data || [];
    },
  });

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCat.category) {
      Swal.fire("Required", "Please provide a category name.", "warning");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await axiosSecure.post("/categories", {
        ...newCat,
        label: newCat.label || `${newCat.category}s`,
      });
      if (res.data.insertedId || res.data.acknowledged) {
        Swal.fire("Success!", "Pet category added.", "success");
        setIsAddModalOpen(false);
        setNewCat({ category: "", label: "", icon: "🐾", description: "" });
        refetch();
      }
    } catch (err) {
      Swal.fire("Error", "Failed to add category.", "error");
    } finally {
      setIsSubmitting(false);
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
                  <span className="text-3xl p-3 bg-amber-50 rounded-2xl border border-amber-100/50">
                    {cat.icon || "🐾"}
                  </span>
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
          <div className="bg-white w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-xl text-gray-400 hover:text-black hover:bg-gray-100 transition"
            >
              <FaTimes />
            </button>

            <h3 className="text-lg font-black text-gray-900 mb-1">
              Add New Pet Category
            </h3>
            <p className="text-xs text-gray-400 mb-5">
              Create a new category for classification and filtering.
            </p>

            <form onSubmit={handleAddCategory} className="space-y-4">
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
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold text-xs uppercase px-6 py-2.5 rounded-xl transition shadow disabled:opacity-50"
                >
                  {isSubmitting ? "Adding..." : "Add Category"}
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
