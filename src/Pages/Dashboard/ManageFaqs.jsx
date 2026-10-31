import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import {
  FaQuestionCircle,
  FaPlusCircle,
  FaSearch,
  FaEdit,
  FaTrashAlt,
  FaCheckCircle,
  FaTimes,
  FaShieldAlt,
  FaFilter
} from "react-icons/fa";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Skeleton from "react-loading-skeleton";

const ManageFaqs = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentFaq, setCurrentFaq] = useState(null);
  const [newFaq, setNewFaq] = useState({
    question: "",
    answer: "",
    category: "Adoption",
    active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: faqs = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-faqs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/faqs");
      return res.data || [];
    },
  });

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchSearch =
        faq.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory =
        categoryFilter === "all" ||
        faq.category?.toLowerCase() === categoryFilter.toLowerCase();
      return matchSearch && matchCategory;
    });
  }, [faqs, searchTerm, categoryFilter]);

  const handleAddFaq = async (e) => {
    e.preventDefault();
    if (!newFaq.question || !newFaq.answer) {
      Swal.fire("Required", "Please provide both question and answer.", "warning");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await axiosSecure.post("/faqs", {
        ...newFaq,
        createdAt: new Date().toISOString(),
      });
      if (res.data.insertedId || res.data.acknowledged) {
        Swal.fire("Success!", "FAQ added to platform.", "success");
        setIsAddModalOpen(false);
        setNewFaq({ question: "", answer: "", category: "Adoption", active: true });
        refetch();
      }
    } catch (err) {
      Swal.fire("Error", "Failed to add FAQ.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditFaq = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axiosSecure.patch(`/faqs/${currentFaq._id}`, {
        question: currentFaq.question,
        answer: currentFaq.answer,
        category: currentFaq.category,
        active: currentFaq.active,
      });
      if (res.data.modifiedCount || res.data.acknowledged) {
        Swal.fire("Updated!", "FAQ updated successfully.", "success");
        setIsEditModalOpen(false);
        setCurrentFaq(null);
        refetch();
      }
    } catch (err) {
      Swal.fire("Error", "Failed to update FAQ.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFaq = async (id, question) => {
    const confirm = await Swal.fire({
      title: "Delete FAQ?",
      text: `Are you sure you want to remove: "${question?.slice(0, 40)}..."?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Delete",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/faqs/${id}`);
        if (res.data.deletedCount) {
          refetch();
          Swal.fire("Deleted!", "FAQ has been removed.", "success");
        }
      } catch (err) {
        Swal.fire("Error", "Failed to delete FAQ.", "error");
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <Helmet>
        <title>Manage FAQs || PeddyCare Admin</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#FBAE02] tracking-wider mb-1">
            <FaShieldAlt /> Knowledge Base
          </span>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Manage Dynamic FAQs ({faqs.length})
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Add, edit, or remove frequently asked questions shown on the public pages.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold text-xs uppercase px-5 py-3 rounded-2xl transition shadow"
        >
          <FaPlusCircle className="text-sm" /> Add New FAQ
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 md:p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="relative w-full sm:w-96">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search FAQs by question or answer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FaFilter className="text-gray-400 text-xs" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="adoption">Adoption</option>
            <option value="health & safety">Health & Safety</option>
            <option value="donations">Donations</option>
            <option value="support">Support</option>
          </select>
        </div>
      </div>

      {/* FAQs List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-6 space-y-4 bg-white rounded-3xl">
            <Skeleton height={80} count={4} className="rounded-2xl" />
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-gray-100">
            <FaQuestionCircle className="mx-auto text-4xl text-gray-300 mb-3" />
            <h4 className="text-base font-black text-gray-800">No FAQs found</h4>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              Add a new question and answer to help community adopters understand PeddyCare.
            </p>
          </div>
        ) : (
          filteredFaqs.map((faq, index) => (
            <div
              key={faq._id || index}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="bg-amber-50 text-[#FBAE02] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-amber-200/50">
                    {faq.category || "General"}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1">
                    <FaCheckCircle className="text-[9px]" /> Live on Site
                  </span>
                </div>
                <h3 className="text-base font-black text-gray-900 mb-1">
                  {faq.question}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed max-w-3xl">
                  {faq.answer}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
                <button
                  onClick={() => {
                    setCurrentFaq({ ...faq });
                    setIsEditModalOpen(true);
                  }}
                  className="p-2.5 rounded-xl bg-amber-50 text-[#FBAE02] hover:bg-amber-100 text-xs font-bold transition"
                  title="Edit FAQ"
                >
                  <FaEdit className="text-sm" />
                </button>
                <button
                  onClick={() => handleDeleteFaq(faq._id, faq.question)}
                  className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition"
                  title="Delete FAQ"
                >
                  <FaTrashAlt className="text-sm" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add FAQ Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-xl text-gray-400 hover:text-black hover:bg-gray-100 transition"
            >
              <FaTimes />
            </button>

            <h3 className="text-lg font-black text-gray-900 mb-1">
              Add New Frequently Asked Question
            </h3>
            <p className="text-xs text-gray-400 mb-5">
              This will be dynamically displayed in the FAQ section.
            </p>

            <form onSubmit={handleAddFaq} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Question *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Are all pets vaccinated and health-checked?"
                  value={newFaq.question}
                  onChange={(e) =>
                    setNewFaq({ ...newFaq, question: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Category
                </label>
                <select
                  value={newFaq.category}
                  onChange={(e) =>
                    setNewFaq({ ...newFaq, category: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                >
                  <option value="Adoption">Adoption</option>
                  <option value="Health & Safety">Health & Safety</option>
                  <option value="Donations">Donations</option>
                  <option value="Support">Support</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Answer *
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="Provide a comprehensive and friendly answer for adopters..."
                  value={newFaq.answer}
                  onChange={(e) =>
                    setNewFaq({ ...newFaq, answer: e.target.value })
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
                  {isSubmitting ? "Adding..." : "Add FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit FAQ Modal */}
      {isEditModalOpen && currentFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-xl text-gray-400 hover:text-black hover:bg-gray-100 transition"
            >
              <FaTimes />
            </button>

            <h3 className="text-lg font-black text-gray-900 mb-1">
              Edit Question & Answer
            </h3>
            <p className="text-xs text-gray-400 mb-5">
              Update the question wording or answer content.
            </p>

            <form onSubmit={handleEditFaq} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Question *
                </label>
                <input
                  type="text"
                  required
                  value={currentFaq.question}
                  onChange={(e) =>
                    setCurrentFaq({ ...currentFaq, question: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Category
                </label>
                <select
                  value={currentFaq.category}
                  onChange={(e) =>
                    setCurrentFaq({ ...currentFaq, category: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                >
                  <option value="Adoption">Adoption</option>
                  <option value="Health & Safety">Health & Safety</option>
                  <option value="Donations">Donations</option>
                  <option value="Support">Support</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Answer *
                </label>
                <textarea
                  rows="4"
                  required
                  value={currentFaq.answer}
                  onChange={(e) =>
                    setCurrentFaq({ ...currentFaq, answer: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold text-xs uppercase px-6 py-2.5 rounded-xl transition shadow disabled:opacity-50"
                >
                  {isSubmitting ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFaqs;
