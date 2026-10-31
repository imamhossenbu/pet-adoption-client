import { useContext, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import Skeleton from "react-loading-skeleton";
import {
  FaPaw,
  FaPlusCircle,
  FaSearch,
  FaEdit,
  FaTrashAlt,
  FaCheckCircle,
  FaExternalLinkAlt,
  FaFilter,
  FaHeart
} from "react-icons/fa";
import AuthContext from "../../context/authContext";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import EmptyState from "../../Components/EmptyState";

const MyAddedPets = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch pets with TanStack React Query
  const {
    data: pets = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-added-pets", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/pet/${user?.email}`);
      return res.data || [];
    },
    enabled: !!user?.email,
  });

  // KPI Calculations
  const totalPets = pets.length;
  const adoptedPets = pets.filter((p) => p.adopted).length;
  const availablePets = pets.filter((p) => !p.adopted).length;

  // Filtered List
  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const matchSearch =
        pet.petName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.petCategory?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "adopted" && pet.adopted) ||
        (statusFilter === "available" && !pet.adopted);
      return matchSearch && matchStatus;
    });
  }, [pets, searchTerm, statusFilter]);

  // Handle Delete
  const handleDelete = (id, petName) => {
    Swal.fire({
      title: `Delete ${petName || "Pet"}?`,
      text: "You won't be able to revert this! The pet listing will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/pet/${id}`);
          if (res.data.deletedCount) {
            refetch();
            Swal.fire({
              title: "Deleted!",
              text: `${petName} has been removed from your listings.`,
              icon: "success",
              confirmButtonColor: "#FBAE02",
            });
          }
        } catch (error) {
          console.error("Error deleting pet:", error);
          Swal.fire("Error!", "Failed to delete the pet. Try again later.", "error");
        }
      }
    });
  };

  // Handle Mark as Adopted
  const handleAdopt = (id, petName) => {
    Swal.fire({
      title: "Mark as Adopted?",
      text: `Has ${petName} found their forever home? This will close new adoption requests.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Mark as Adopted!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.patch(`/pets/${id}`, { adopted: true });
          if (res.data.modifiedCount > 0 || res.data.acknowledged) {
            refetch();
            Swal.fire({
              title: "Congratulations! 🎉",
              text: `${petName} has been marked as adopted!`,
              icon: "success",
              confirmButtonColor: "#10B981",
            });
          }
        } catch (error) {
          console.error("Error updating adoption status:", error);
          Swal.fire("Error!", "Could not update adoption status.", "error");
        }
      }
    });
  };

  return (
    <div className="space-y-6 pb-12">
      <Helmet>
        <title>My Added Pets || PeddyCare Dashboard</title>
      </Helmet>

      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#FBAE02] tracking-wider mb-1">
            <FaPaw /> Pet Management
          </span>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            My Added Pets ({totalPets})
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage your pet listings, update health details, and celebrate adoptions.
          </p>
        </div>

        <Link
          to="/dashboard/add-pet"
          className="inline-flex items-center gap-2 bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold text-xs uppercase px-5 py-3 rounded-2xl transition shadow-sm"
        >
          <FaPlusCircle className="text-sm" /> Add a New Pet
        </Link>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Total Listed Pets
            </p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">{totalPets}</h3>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-[#FBAE02] flex items-center justify-center text-lg">
            <FaPaw />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Adopted by Families
            </p>
            <h3 className="text-2xl font-black text-emerald-600 mt-0.5">
              {adoptedPets}
            </h3>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
            <FaCheckCircle />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Waiting for Homes
            </p>
            <h3 className="text-2xl font-black text-orange-600 mt-0.5">
              {availablePets}
            </h3>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-lg">
            <FaHeart />
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input
            type="text"
            placeholder="Search by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-xl text-xs text-gray-800 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FBAE02]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FaFilter className="text-gray-400 text-xs hidden sm:block" />
          <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold w-full sm:w-auto">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFilter === "all"
                  ? "bg-white text-gray-900 shadow-xs font-black"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              All ({totalPets})
            </button>
            <button
              onClick={() => setStatusFilter("available")}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFilter === "available"
                  ? "bg-white text-gray-900 shadow-xs font-black"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Available ({availablePets})
            </button>
            <button
              onClick={() => setStatusFilter("adopted")}
              className={`px-3 py-1.5 rounded-lg transition ${
                statusFilter === "adopted"
                  ? "bg-white text-gray-900 shadow-xs font-black"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              Adopted ({adoptedPets})
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <Skeleton height={60} count={4} className="rounded-2xl" />
        </div>
      ) : pets.length === 0 ? (
        <EmptyState
          icon={FaPaw}
          badge="No Pets Listed"
          title="You haven't listed any pets yet"
          description="Know an animal looking for love, warmth, and shelter? Add their profile to PeddyCare to connect with verified adopters today."
          actionText="Add Your First Pet"
          actionLink="/dashboard/add-pet"
          actionIcon={FaPlusCircle}
        />
      ) : filteredPets.length === 0 ? (
        <EmptyState
          icon={FaSearch}
          badge="No Results"
          title="No Matching Pets Found"
          description={`No pets match your search "${searchTerm}" or the selected status filter.`}
          actionText="Clear Filters"
          actionOnClick={() => {
            setSearchTerm("");
            setStatusFilter("all");
          }}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200/80 text-gray-400 uppercase font-black tracking-wider">
                  <th className="py-4 px-6 w-16">#</th>
                  <th className="py-4 px-6">Pet Details</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Adoption Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPets.map((pet, index) => (
                  <tr key={pet._id} className="hover:bg-gray-50/70 transition">
                    <td className="py-4 px-6 font-bold text-gray-400">
                      {index + 1}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            pet.petImage ||
                            "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80"
                          }
                          alt={pet.petName}
                          className="w-12 h-12 rounded-2xl object-cover border border-gray-200 shadow-xs shrink-0"
                        />
                        <div>
                          <p className="font-black text-gray-900 text-sm">
                            {pet.petName}
                          </p>
                          <span className="text-[10px] text-gray-400">
                            Age: {pet.petAge || "Not specified"} • Location: {pet.petLocation || "Rescue Shelter"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-block px-2.5 py-1 text-[11px] font-black rounded-lg bg-amber-50 text-amber-900 border border-amber-200/50">
                        {pet.petCategory || "Companion"}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-black px-3 py-1 rounded-full ${
                          pet.adopted
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {pet.adopted ? (
                          <>
                            <FaCheckCircle className="text-emerald-600" /> Adopted
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Available
                          </>
                        )}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {/* View Public Pet Page */}
                        <Link
                          to={`/pet-details/${pet._id}`}
                          title="View Pet Public Page"
                          className="p-2 rounded-xl text-gray-400 hover:text-black hover:bg-gray-100 transition"
                        >
                          <FaExternalLinkAlt className="text-xs" />
                        </Link>

                        {/* Edit Button */}
                        <button
                          onClick={() => navigate(`/dashboard/update-pet/${pet._id}`)}
                          title="Edit Pet Details"
                          className="p-2 rounded-xl text-amber-600 bg-amber-50 hover:bg-amber-100 transition font-bold"
                        >
                          <FaEdit className="text-xs" />
                        </button>

                        {/* Adopt Toggle */}
                        {!pet.adopted && (
                          <button
                            onClick={() => handleAdopt(pet._id, pet.petName)}
                            title="Mark as Adopted"
                            className="p-2 rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition font-bold"
                          >
                            <FaCheckCircle className="text-xs" />
                          </button>
                        )}

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(pet._id, pet.petName)}
                          title="Delete Pet"
                          className="p-2 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition font-bold"
                        >
                          <FaTrashAlt className="text-xs" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAddedPets;
