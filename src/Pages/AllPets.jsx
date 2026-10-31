import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import {
  FaPaw,
  FaPlusCircle,
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrashAlt,
  FaCheckCircle,
  FaTimes,
  FaHeart,
  FaMapMarkerAlt,
  FaExternalLinkAlt
} from "react-icons/fa";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import Skeleton from "react-loading-skeleton";

const AllPets = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Pet state for quick modal
  const [newPet, setNewPet] = useState({
    petName: "",
    petAge: "",
    petCategory: "Dog",
    petLocation: "",
    petImage: "",
    shortDescription: "",
    longDescription: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPets = () => {
    setIsLoading(true);
    axiosSecure
      .get("/allPets")
      .then((res) => {
        setPets(res.data || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fetch pets error:", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchPets();
  }, [axiosSecure]);

  // Filtered Pets
  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const matchSearch =
        pet.petName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.petLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory =
        selectedCategory === "all" ||
        pet.petCategory?.toLowerCase() === selectedCategory.toLowerCase();
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "adopted" && pet.adopted) ||
        (statusFilter === "available" && !pet.adopted);
      return matchSearch && matchCategory && matchStatus;
    });
  }, [pets, searchTerm, selectedCategory, statusFilter]);

  // Adoption Status Toggle
  const handleAdoptedToggle = async (pet) => {
    const newAdoptedState = !pet.adopted;
    try {
      const res = await axiosSecure.patch(`/pets/${pet._id}`, {
        adopted: newAdoptedState,
      });
      if (res.data) {
        setPets((prev) =>
          prev.map((p) =>
            p._id === pet._id ? { ...p, adopted: newAdoptedState } : p
          )
        );
        Swal.fire({
          title: "Status Updated!",
          text: `${pet.petName} is now marked as ${
            newAdoptedState ? "Adopted" : "Available"
          }.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (err) {
      Swal.fire("Error!", "Failed to update adoption status.", "error");
    }
  };

  // Delete Pet
  const handleDelete = (id, name) => {
    Swal.fire({
      title: `Delete ${name || "pet"}?`,
      text: "This pet listing will be permanently removed from PeddyCare.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Delete It",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/pet/${id}`)
          .then((res) => {
            if (res.data.deletedCount) {
              setPets((prev) => prev.filter((p) => p._id !== id));
              Swal.fire("Deleted!", "Pet has been removed.", "success");
            }
          })
          .catch((error) => {
            Swal.fire("Error!", "Could not delete pet listing.", "error");
          });
      }
    });
  };

  // Quick Add Pet Submit
  const handleQuickAddPet = async (e) => {
    e.preventDefault();
    if (!newPet.petName || !newPet.petAge || !newPet.petImage) {
      Swal.fire("Required", "Please fill in Pet Name, Age, and Image URL.", "warning");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await axiosSecure.post("/pet", {
        ...newPet,
        adopted: false,
        dateAdded: new Date().toISOString(),
        userEmail: "admin@peddycare.com",
      });

      if (res.data.insertedId) {
        Swal.fire("Success!", "New pet added to platform listings.", "success");
        setIsAddModalOpen(false);
        setNewPet({
          petName: "",
          petAge: "",
          petCategory: "Dog",
          petLocation: "",
          petImage: "",
          shortDescription: "",
          longDescription: "",
        });
        fetchPets();
      }
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to add pet", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <Helmet>
        <title>Manage Pets || PeddyCare Admin</title>
      </Helmet>

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#FBAE02] tracking-wider mb-1">
            <FaPaw /> Platform Pets Overview
          </span>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Manage Pets Directory ({pets.length})
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Filter by category or adoption status, update details, or list a new companion.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold text-xs uppercase px-5 py-3 rounded-2xl transition shadow"
          >
            <FaPlusCircle className="text-sm" /> Quick Add Pet
          </button>
          <Link
            to="/dashboard/add-pet"
            className="hidden sm:inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold text-xs px-4 py-3 rounded-2xl transition"
          >
            Full Page Form
          </Link>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 md:p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search by pet name, location, or owner email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FBAE02] transition"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs">
            <FaFilter className="text-gray-400 text-[11px]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent font-bold text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="all">🐾 All Categories</option>
              <option value="dog">🐕 Dogs</option>
              <option value="cat">🐈 Cats</option>
              <option value="rabbit">🐇 Rabbits</option>
              <option value="bird">🦜 Birds</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-bold text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="available">Available Only</option>
              <option value="adopted">Adopted Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pets Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton height={60} count={6} className="rounded-xl" />
          </div>
        ) : filteredPets.length === 0 ? (
          <div className="text-center py-16 px-4">
            <FaPaw className="mx-auto text-4xl text-gray-300 mb-3" />
            <h4 className="text-base font-black text-gray-800">No pets found</h4>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              No matching pet records found for your current search criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200/80 text-gray-400 uppercase font-black tracking-wider">
                  <th className="py-4 px-6">Pet Info</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Owner Email</th>
                  <th className="py-4 px-6">Adoption Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPets.map((pet) => (
                  <tr key={pet._id} className="hover:bg-gray-50/70 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={pet.petImage}
                          alt={pet.petName}
                          className="w-12 h-12 rounded-2xl object-cover border border-gray-200 shadow-xs"
                        />
                        <div>
                          <p className="font-black text-gray-900 text-sm">
                            {pet.petName}
                          </p>
                          <span className="text-[10px] text-gray-400">
                            Age: {pet.petAge}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-bold text-gray-700">
                      <span className="bg-gray-100 px-3 py-1 rounded-full text-[11px]">
                        {pet.petCategory}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaMapMarkerAlt className="text-gray-400 text-[10px]" />
                        {pet.petLocation || "Not specified"}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-gray-500 text-xs">
                      {pet.userEmail || "System Admin"}
                    </td>

                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleAdoptedToggle(pet)}
                        className={`inline-flex items-center gap-1.5 text-[11px] font-black px-3.5 py-1.5 rounded-full transition shadow-xs ${
                          pet.adopted
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                        }`}
                        title="Click to toggle adoption status"
                      >
                        {pet.adopted ? (
                          <>
                            <FaCheckCircle className="text-emerald-600" /> Adopted
                          </>
                        ) : (
                          <>
                            <FaHeart className="text-amber-500" /> Available
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        {/* View Details Public Link */}
                        <Link
                          to={`/pet-details/${pet._id}`}
                          title="View Public Page"
                          className="p-2 rounded-xl text-xs font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                        >
                          <FaExternalLinkAlt className="text-xs" />
                        </Link>

                        {/* Edit Button */}
                        <button
                          onClick={() => navigate(`/dashboard/update-pet/${pet._id}`)}
                          title="Edit Pet Details"
                          className="p-2 rounded-xl text-xs font-bold bg-amber-100 text-amber-900 hover:bg-amber-200 transition"
                        >
                          <FaEdit className="text-sm" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(pet._id, pet.petName)}
                          title="Delete Pet"
                          className="p-2 rounded-xl text-xs font-bold bg-red-100 text-red-700 hover:bg-red-200 transition"
                        >
                          <FaTrashAlt className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Add Pet Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-xl text-gray-400 hover:text-black hover:bg-gray-100 transition"
            >
              <FaTimes />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#FBAE02] flex items-center justify-center text-xl">
                <FaPaw />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900">
                  Quick Add a Pet
                </h3>
                <p className="text-xs text-gray-400">
                  Add a new companion directly to the listings
                </p>
              </div>
            </div>

            <form onSubmit={handleQuickAddPet} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                    Pet Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Luna"
                    value={newPet.petName}
                    onChange={(e) =>
                      setNewPet({ ...newPet, petName: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                    Age *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2 Months / 1 Year"
                    value={newPet.petAge}
                    onChange={(e) =>
                      setNewPet({ ...newPet, petAge: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                    Category *
                  </label>
                  <select
                    value={newPet.petCategory}
                    onChange={(e) =>
                      setNewPet({ ...newPet, petCategory: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                  >
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Rabbit">Rabbit</option>
                    <option value="Bird">Bird</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dhaka, Bangladesh"
                    value={newPet.petLocation}
                    onChange={(e) =>
                      setNewPet({ ...newPet, petLocation: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Pet Image URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newPet.petImage}
                  onChange={(e) =>
                    setNewPet({ ...newPet, petImage: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Short Description
                </label>
                <textarea
                  rows="2"
                  placeholder="A friendly, vaccinated pet looking for love..."
                  value={newPet.shortDescription}
                  onChange={(e) =>
                    setNewPet({ ...newPet, shortDescription: e.target.value })
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
                  {isSubmitting ? "Adding..." : "Add Pet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPets;