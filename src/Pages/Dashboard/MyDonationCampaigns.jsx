import { useState, useContext, useMemo } from "react";
import { FaEdit, FaPause, FaPlay, FaEye, FaHandHoldingHeart, FaPlusCircle, FaTimes, FaUsers, FaDollarSign, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import Skeleton from "react-loading-skeleton";
import DonationProgress from "../../shared/DonationProgress";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import EmptyState from "../../Components/EmptyState";

const MyDonationCampaigns = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [modalData, setModalData] = useState(null);
  const [selectedCampaignName, setSelectedCampaignName] = useState("");
  const [isLoadingDonators, setIsLoadingDonators] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch user's donation campaigns
  const {
    data: campaigns = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["donation-campaigns", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/donation-campaigns/${user?.email}`);
      return res.data || [];
    },
    enabled: !!user?.email,
  });

  // KPI Computations
  const totalCampaigns = campaigns.length;
  const totalRaised = campaigns.reduce(
    (acc, c) => acc + (parseFloat(c.donatedAmount) || 0),
    0
  );
  const activeCampaigns = campaigns.filter((c) => !c.paused).length;

  // Filtered campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) =>
      c.petName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [campaigns, searchTerm]);

  // Handle pause/unpause of donation campaign
  const handlePauseToggle = async (id, currentStatus) => {
    const willPause = !currentStatus;
    try {
      await axiosSecure.patch(`/donations/${id}`, { paused: willPause });
      refetch();
      Swal.fire({
        title: willPause ? "Campaign Paused" : "Campaign Resumed",
        text: `Donation campaign is now ${willPause ? "paused" : "active and accepting donations"}.`,
        icon: "success",
        confirmButtonColor: "#FBAE02",
      });
    } catch (err) {
      Swal.fire("Error", "Could not toggle campaign status.", "error");
    }
  };

  // Open modal to show donators
  const handleViewDonators = async (campaign) => {
    setSelectedCampaignName(campaign.petName || "Campaign");
    setIsLoadingDonators(true);
    setModalData([]);
    try {
      const res = await axiosSecure.get(`/donators/${campaign._id}`);
      setModalData(res.data || []);
    } catch (err) {
      console.error("Failed to fetch donators", err);
      setModalData([]);
    } finally {
      setIsLoadingDonators(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <Helmet>
        <title>My Donation Campaigns || PeddyCare Dashboard</title>
      </Helmet>

      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#FBAE02] tracking-wider mb-1">
            <FaHandHoldingHeart /> Fundraising
          </span>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            My Donation Campaigns ({totalCampaigns})
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Monitor community contributions, pause or unpause campaigns, and view supporter lists.
          </p>
        </div>

        <Link
          to="/dashboard/create-donation-campaign"
          className="inline-flex items-center gap-2 bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold text-xs uppercase px-5 py-3 rounded-2xl transition shadow-sm"
        >
          <FaPlusCircle className="text-sm" /> Start Campaign
        </Link>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Total Campaigns
            </p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">
              {totalCampaigns}
            </h3>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-[#FBAE02] flex items-center justify-center text-lg">
            <FaHandHoldingHeart />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Total Funds Raised
            </p>
            <h3 className="text-2xl font-black text-emerald-600 mt-0.5">
              ${totalRaised.toLocaleString()}
            </h3>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
            <FaDollarSign />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Active Campaigns
            </p>
            <h3 className="text-2xl font-black text-blue-600 mt-0.5">
              {activeCampaigns}
            </h3>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
            <FaUsers />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      {campaigns.length > 0 && (
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              placeholder="Search campaigns by pet name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-xl text-xs text-gray-800 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FBAE02]"
            />
          </div>
        </div>
      )}

      {/* Content Area */}
      {isLoading ? (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
          <Skeleton height={70} count={3} className="rounded-2xl" />
        </div>
      ) : campaigns.length === 0 ? (
        <EmptyState
          icon={FaHandHoldingHeart}
          badge="No Campaigns"
          title="You haven't launched any donation campaigns"
          description="Crowdfund life-saving surgery, nutrition, and emergency shelter care for pets in critical distress."
          actionText="Start a Donation Campaign"
          actionLink="/dashboard/create-donation-campaign"
          actionIcon={FaPlusCircle}
        />
      ) : filteredCampaigns.length === 0 ? (
        <EmptyState
          icon={FaSearch}
          badge="No Results"
          title="No Matching Campaigns"
          description={`No donation campaigns match your search "${searchTerm}".`}
          actionText="Clear Search"
          actionOnClick={() => setSearchTerm("")}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200/80 text-gray-400 uppercase font-black tracking-wider">
                  <th className="py-4 px-6">Campaign Pet</th>
                  <th className="py-4 px-6">Goal</th>
                  <th className="py-4 px-6 w-72">Funding Progress</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCampaigns.map((campaign) => (
                  <tr key={campaign._id} className="hover:bg-gray-50/70 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            campaign.petImage ||
                            "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80"
                          }
                          alt={campaign.petName}
                          className="w-12 h-12 rounded-2xl object-cover border border-gray-200 shadow-xs shrink-0"
                        />
                        <div>
                          <p className="font-black text-gray-900 text-sm">
                            {campaign.petName}
                          </p>
                          <span className="text-[10px] text-gray-400">
                            Deadline: {campaign.lastDate || "Ongoing"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-black text-gray-900 text-sm">
                        ${campaign.maxDonationAmount?.toLocaleString()}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-emerald-700">
                            ${(campaign.donatedAmount || 0).toLocaleString()} raised
                          </span>
                          <span className="text-gray-400">
                            {Math.min(
                              100,
                              Math.round(
                                ((campaign.donatedAmount || 0) /
                                  (campaign.maxDonationAmount || 1)) *
                                  100
                              )
                            )}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#FBAE02] h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(
                                100,
                                ((campaign.donatedAmount || 0) /
                                  (campaign.maxDonationAmount || 1)) *
                                  100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-black px-3 py-1 rounded-full ${
                          campaign.paused
                            ? "bg-red-50 text-red-800 border border-red-200"
                            : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        }`}
                      >
                        {campaign.paused ? "⏸️ Paused" : "🟢 Active"}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {/* View Donators Button */}
                        <button
                          onClick={() => handleViewDonators(campaign)}
                          title="View Supporters & Donators"
                          className="p-2 rounded-xl text-blue-600 bg-blue-50 hover:bg-blue-100 transition font-bold"
                        >
                          <FaEye className="text-xs" />
                        </button>

                        {/* Edit Campaign */}
                        <button
                          onClick={() =>
                            navigate(`/dashboard/update-donation/${campaign._id}`)
                          }
                          title="Edit Campaign"
                          className="p-2 rounded-xl text-amber-600 bg-amber-50 hover:bg-amber-100 transition font-bold"
                        >
                          <FaEdit className="text-xs" />
                        </button>

                        {/* Pause / Resume Button */}
                        <button
                          onClick={() =>
                            handlePauseToggle(campaign._id, campaign.paused)
                          }
                          title={campaign.paused ? "Resume Campaign" : "Pause Campaign"}
                          className={`p-2 rounded-xl transition font-bold ${
                            campaign.paused
                              ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                              : "text-orange-700 bg-orange-50 hover:bg-orange-100"
                          }`}
                        >
                          {campaign.paused ? (
                            <FaPlay className="text-xs" />
                          ) : (
                            <FaPause className="text-xs" />
                          )}
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

      {/* Donators Modal */}
      {modalData !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-gray-100 relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setModalData(null)}
              className="absolute right-5 top-5 p-2 rounded-xl text-gray-400 hover:text-black hover:bg-gray-100 transition"
            >
              <FaTimes />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-amber-50 text-[#FBAE02]">
                <FaUsers className="text-sm" />
              </span>
              <h3 className="text-lg font-black text-gray-900">
                Campaign Supporters
              </h3>
            </div>
            <p className="text-xs text-gray-400 mb-5">
              People who generously contributed to {selectedCampaignName}.
            </p>

            {isLoadingDonators ? (
              <div className="space-y-3 py-4">
                <Skeleton height={50} count={3} className="rounded-xl" />
              </div>
            ) : modalData.length === 0 ? (
              <div className="text-center py-10 px-4 bg-gray-50 rounded-2xl">
                <FaHandHoldingHeart className="mx-auto text-3xl text-gray-300 mb-2" />
                <h4 className="text-sm font-black text-gray-800">
                  No Donations Yet
                </h4>
                <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                  When kind individuals contribute to this campaign, their names and amounts will be listed here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                {modalData.map((donator, idx) => (
                  <div
                    key={donator._id || idx}
                    className="py-3.5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#FBAE02] flex items-center justify-center font-black text-sm">
                        {(donator.name || donator.userName || "A")[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-gray-900 text-xs">
                          {donator.name || donator.userName || "Anonymous Benefactor"}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {donator.email || "Verified Donor"}
                        </p>
                      </div>
                    </div>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                      +${donator.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-100 text-right">
              <button
                onClick={() => setModalData(null)}
                className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDonationCampaigns;
