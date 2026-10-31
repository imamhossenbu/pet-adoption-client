/* eslint-disable no-unused-vars */
import { useState, useMemo } from "react";
import { FaEdit, FaPause, FaPlay, FaEye, FaTrashAlt, FaHandHoldingHeart, FaSearch, FaFilter, FaTimes, FaPlusCircle } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import DonationProgress from "../../shared/DonationProgress";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Skeleton from "react-loading-skeleton";
import EmptyState from "../../Components/EmptyState";
import UserAvatar from "../../Components/UserAvatar";

const AllDonationCampaign = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [modalData, setModalData] = useState(null);
  const [selectedCampaignName, setSelectedCampaignName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch all donation campaigns for admin
  const { data: campaigns = [], refetch, isLoading } = useQuery({
    queryKey: ["all-donation-campaigns"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/donation-campaigns`);
      return res.data || [];
    },
  });

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const matchSearch =
        c.petName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.createdBy?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && !c.paused) ||
        (statusFilter === "paused" && c.paused);
      return matchSearch && matchStatus;
    });
  }, [campaigns, searchTerm, statusFilter]);

  // Handle pause/unpause of donation campaign
  const handlePauseToggle = async (id, status, petName) => {
    await axiosSecure.patch(`donations/${id}`, { paused: !status });
    refetch();
    Swal.fire({
      title: "Success!",
      text: `${petName}'s campaign has been ${status ? "resumed" : "paused"}.`,
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // Handle deleting a donation campaign
  const handleDelete = async (id, petName) => {
    Swal.fire({
      title: `Delete campaign for ${petName}?`,
      text: "This emergency fund campaign will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axiosSecure.delete(`donations/${id}`);
        refetch();
        Swal.fire("Deleted!", "The campaign has been removed.", "success");
      }
    });
  };

  // Open modal to show donators
  const handleViewDonators = async (campaign) => {
    setSelectedCampaignName(campaign.petName);
    try {
      const res = await axiosSecure.get(`donators/${campaign._id}`);
      setModalData(res.data || []);
    } catch (err) {
      setModalData([]);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <Helmet>
        <title>Manage Campaigns || PeddyCare Admin</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#FBAE02] tracking-wider mb-1">
            <FaHandHoldingHeart /> Fundraising Management
          </span>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Emergency Donation Campaigns ({campaigns.length})
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Monitor medical funds, inspect supporters and donations, pause or update goals.
          </p>
        </div>

        <Link
          to="/dashboard/create-donation-campaign"
          className="inline-flex items-center gap-2 bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold text-xs uppercase px-5 py-3 rounded-2xl transition shadow"
        >
          <FaPlusCircle className="text-sm" /> Create New Campaign
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 md:p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="relative w-full sm:w-96">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search campaigns by pet name or organizer..."
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
            <option value="all">All Campaigns</option>
            <option value="active">Active Campaigns</option>
            <option value="paused">Paused Campaigns</option>
          </select>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton height={60} count={5} className="rounded-xl" />
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <EmptyState
            icon={FaHandHoldingHeart}
            badge="No Campaigns"
            title="No Donation Campaigns Found"
            description={
              searchTerm || statusFilter !== "all"
                ? "No campaigns match your current search query or filter."
                : "No donation campaigns have been created on the platform yet."
            }
            actionText="Create Campaign"
            actionLink="/dashboard/create-donation-campaign"
            actionIcon={FaPlusCircle}
            secondaryText="Clear Filters"
            secondaryOnClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
            }}
            className="my-10"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200/80 text-gray-400 uppercase font-black tracking-wider">
                  <th className="py-4 px-6">Pet / Campaign</th>
                  <th className="py-4 px-6">Target Goal</th>
                  <th className="py-4 px-6">Fundraising Progress</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCampaigns.map((campaign) => (
                  <tr
                    key={campaign._id}
                    className="hover:bg-gray-50/70 transition"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={campaign.petImage}
                          alt={campaign.petName}
                          className="w-12 h-12 rounded-2xl object-cover border border-gray-200"
                        />
                        <div>
                          <p className="font-black text-gray-900 text-sm">
                            {campaign.petName}
                          </p>
                          <span className="text-[10px] text-gray-400">
                            By: {campaign.createdBy || "Admin"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-black text-gray-900 text-sm">
                      ${campaign.maxDonationAmount}
                    </td>

                    <td className="py-4 px-6 min-w-[200px]">
                      <DonationProgress
                        donatedAmount={campaign.donatedAmount || 0}
                        maxDonationAmount={campaign.maxDonationAmount}
                      />
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-black px-3 py-1 rounded-full ${
                          campaign.paused
                            ? "bg-red-100 text-red-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {campaign.paused ? "Paused" : "Active"}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        {/* Donators list */}
                        <button
                          onClick={() => handleViewDonators(campaign)}
                          className="p-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                          title="View Supporters & Donations"
                        >
                          <FaEye className="text-sm" />
                        </button>

                        {/* Edit Campaign */}
                        <button
                          onClick={() =>
                            navigate(`/dashboard/edit-donation/${campaign._id}`)
                          }
                          className="p-2 rounded-xl text-xs font-bold bg-amber-50 text-[#FBAE02] hover:bg-amber-100 transition"
                          title="Edit Campaign"
                        >
                          <FaEdit className="text-sm" />
                        </button>

                        {/* Pause / Resume */}
                        <button
                          onClick={() =>
                            handlePauseToggle(
                              campaign._id,
                              campaign.paused,
                              campaign.petName
                            )
                          }
                          className={`p-2 rounded-xl text-xs font-bold transition ${
                            campaign.paused
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                          }`}
                          title={campaign.paused ? "Resume Campaign" : "Pause Campaign"}
                        >
                          {campaign.paused ? (
                            <FaPlay className="text-xs" />
                          ) : (
                            <FaPause className="text-xs" />
                          )}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() =>
                            handleDelete(campaign._id, campaign.petName)
                          }
                          className="p-2 rounded-xl text-xs font-bold bg-red-50 text-red-700 hover:bg-red-100 transition"
                          title="Delete Campaign"
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

      {/* Donators Modal */}
      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setModalData(null)}
              className="absolute right-5 top-5 p-2 rounded-xl text-gray-400 hover:text-black hover:bg-gray-100 transition"
            >
              <FaTimes />
            </button>

            <h3 className="text-lg font-black text-gray-900 mb-1">
              Supporters of {selectedCampaignName}
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              All community members who have contributed to this medical fund.
            </p>

            {modalData.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-8">
                No donations have been made to this campaign yet.
              </p>
            ) : (
              <ul className="divide-y divide-gray-100 text-xs">
                {modalData.map((d, i) => (
                  <li key={d._id || i} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        name={d.name || d.userName || d.email}
                        email={d.email}
                        photo={d.photo}
                        className="w-9 h-9 rounded-xl text-xs font-black shadow-xs shrink-0"
                      />
                      <div>
                        <p className="font-black text-gray-900">{d.name || "Generous Donor"}</p>
                        <p className="text-[11px] text-gray-400">{d.email}</p>
                      </div>
                    </div>
                    <span className="font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs">
                      ${d.amount}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => setModalData(null)}
              className="mt-6 w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold text-xs rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllDonationCampaign;
