import { useQuery } from "@tanstack/react-query";
import { useContext, useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaClipboardList,
  FaCheckCircle,
  FaTimesCircle,
  FaSearch,
  FaFilter,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaw,
  FaCertificate,
  FaUser
} from "react-icons/fa";
import AuthContext from "../../context/authContext";
import useAdmin from "../../Hooks/useAdmin";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Skeleton from "react-loading-skeleton";

const AdoptionRequest = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const [isAdmin] = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: requests = [], isLoading, refetch } = useQuery({
    queryKey: ["adoption-requests", isAdmin ? "all" : user?.email],
    queryFn: async () => {
      const endpoint = isAdmin ? "/all-adoptions" : `/adoptions/${user?.email}`;
      const res = await axiosSecure.get(endpoint);
      return res.data || [];
    },
    enabled: !!user?.email,
  });

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchSearch =
        req.petName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.phone?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "accepted" && req.status === "accepted") ||
        (statusFilter === "rejected" && req.status === "rejected") ||
        (statusFilter === "pending" && !req.status || req.status === "pending");
      return matchSearch && matchStatus;
    });
  }, [requests, searchTerm, statusFilter]);

  const handleStatusUpdate = async (req, newStatus) => {
    const isApprove = newStatus === "accepted";
    const confirm = await Swal.fire({
      title: `${isApprove ? "Approve Adoption?" : "Reject Request?"}`,
      text: isApprove
        ? `Approve ${req.userName}'s request for ${req.petName}? This will automatically mark the pet as Adopted.`
        : `Decline ${req.userName}'s request for ${req.petName}?`,
      icon: isApprove ? "question" : "warning",
      showCancelButton: true,
      confirmButtonColor: isApprove ? "#10B981" : "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: `Yes, ${isApprove ? "Approve" : "Reject"}`,
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/adoptions/status/${req._id}`, {
          status: newStatus,
          petId: req.petId,
        });

        if (res.data.modifiedCount || res.data.acknowledged) {
          refetch();
          Swal.fire({
            title: isApprove ? "Approved!" : "Rejected!",
            text: isApprove
              ? "The adoption application has been approved and pet marked as adopted."
              : "The adoption request has been updated.",
            icon: isApprove ? "success" : "info",
          });
        }
      } catch (err) {
        Swal.fire("Error!", "Failed to update application status.", "error");
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <Helmet>
        <title>Adoption Requests || PeddyCare Dashboard</title>
      </Helmet>

      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#FBAE02] tracking-wider mb-1">
            <FaClipboardList /> Application Management
          </span>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Adoption Applications ({requests.length})
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {isAdmin
              ? "Review and process pet adoption requests from community members."
              : "Review adoption applications submitted for your listed pets."}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 md:p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="relative w-full sm:w-96">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search by pet name, applicant, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FaFilter className="text-gray-400 text-xs" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Applications</option>
            <option value="pending">Pending Review</option>
            <option value="accepted">Approved / Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton height={60} count={5} className="rounded-xl" />
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-16 px-4">
            <FaClipboardList className="mx-auto text-4xl text-gray-300 mb-3" />
            <h4 className="text-base font-black text-gray-800">
              No adoption requests found
            </h4>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              No matching applications found. When users submit an adoption form, they will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200/80 text-gray-400 uppercase font-black tracking-wider">
                  <th className="py-4 px-6">Pet Name</th>
                  <th className="py-4 px-6">Applicant Info</th>
                  <th className="py-4 px-6">Contact & Address</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRequests.map((req) => (
                  <tr key={req._id} className="hover:bg-gray-50/70 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#FBAE02] flex items-center justify-center text-sm font-black">
                          <FaPaw />
                        </div>
                        <div>
                          <p className="font-black text-gray-900 text-sm">
                            {req.petName}
                          </p>
                          {req.petId && (
                            <Link
                              to={`/pet-details/${req.petId}`}
                              className="text-[10px] text-[#FBAE02] hover:underline font-bold"
                            >
                              View Pet Details →
                            </Link>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <p className="font-black text-gray-900">{req.userName}</p>
                      <span className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                        <FaEnvelope className="text-[10px]" /> {req.userEmail}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <p className="text-gray-700 flex items-center gap-1 font-bold">
                        <FaPhoneAlt className="text-gray-400 text-[10px]" />{" "}
                        {req.phone || "N/A"}
                      </p>
                      <span className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                        <FaMapMarkerAlt className="text-[10px]" />{" "}
                        {req.address || "N/A"}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-black px-3 py-1 rounded-full ${
                          req.status === "accepted"
                            ? "bg-emerald-100 text-emerald-800"
                            : req.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {req.status === "accepted" ? (
                          <>
                            <FaCheckCircle className="text-emerald-600" /> Approved
                          </>
                        ) : req.status === "rejected" ? (
                          <>
                            <FaTimesCircle className="text-red-600" /> Rejected
                          </>
                        ) : (
                          "Pending Review"
                        )}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      {req.status === "accepted" ? (
                        <span className="text-emerald-600 font-extrabold text-xs inline-flex items-center gap-1">
                          <FaCheckCircle /> Completed
                        </span>
                      ) : (
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleStatusUpdate(req, "accepted")}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl transition shadow-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(req, "rejected")}
                            className="bg-red-500 hover:bg-red-600 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl transition shadow-xs"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdoptionRequest;
