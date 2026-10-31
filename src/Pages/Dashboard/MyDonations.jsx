import { useQuery } from "@tanstack/react-query";
import { useContext, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import Skeleton from "react-loading-skeleton";
import {
  FaHeart,
  FaDollarSign,
  FaHandHoldingHeart,
  FaCalendarAlt,
  FaReceipt,
  FaUndo,
  FaSearch
} from "react-icons/fa";
import AuthContext from "../../context/authContext";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import EmptyState from "../../Components/EmptyState";

const MyDonations = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch donations for logged-in user
  const {
    data: donations = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["myDonations", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-donations/${user?.email}`);
      return res.data || [];
    },
    enabled: !!user?.email,
  });

  // KPI Computations
  const totalDonated = donations.reduce(
    (acc, d) => acc + (parseFloat(d.amount) || 0),
    0
  );
  const totalCampaignsSupported = donations.length;
  const avgDonation =
    totalCampaignsSupported > 0
      ? Math.round(totalDonated / totalCampaignsSupported)
      : 0;

  // Filtered donations
  const filteredDonations = useMemo(() => {
    return donations.filter((d) =>
      d.petName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [donations, searchTerm]);

  // Handle refund request
  const handleRefund = async (donationId, petName, amount) => {
    Swal.fire({
      title: "Request Donation Refund?",
      text: `Do you want to refund your $${amount} contribution for ${petName}? This will deduct the amount from the campaign total.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Process Refund",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/refund-donation/${donationId}`);
          refetch();
          Swal.fire({
            title: "Refund Processed",
            text: "Your contribution has been refunded.",
            icon: "success",
            confirmButtonColor: "#FBAE02",
          });
        } catch (error) {
          console.error("Refund error:", error);
          Swal.fire("Error", "Failed to process refund. Try again later.", "error");
        }
      }
    });
  };

  return (
    <div className="space-y-6 pb-12">
      <Helmet>
        <title>My Donations || PeddyCare Dashboard</title>
      </Helmet>

      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#FBAE02] tracking-wider mb-1">
            <FaHeart /> Giving & Impact
          </span>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            My Donations ({totalCampaignsSupported})
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Thank you for being a hero to animals in medical need. Track your giving history here.
          </p>
        </div>

        <Link
          to="/donation-campaigns"
          className="inline-flex items-center gap-2 bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold text-xs uppercase px-5 py-3 rounded-2xl transition shadow-sm"
        >
          <FaHandHoldingHeart className="text-sm" /> Support More Pets
        </Link>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Total Donated
            </p>
            <h3 className="text-2xl font-black text-emerald-600 mt-0.5">
              ${totalDonated.toLocaleString()}
            </h3>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
            <FaDollarSign />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Pets Supported
            </p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">
              {totalCampaignsSupported}
            </h3>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-[#FBAE02] flex items-center justify-center text-lg">
            <FaHeart />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Average Gift
            </p>
            <h3 className="text-2xl font-black text-blue-600 mt-0.5">
              ${avgDonation}
            </h3>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
            <FaReceipt />
          </div>
        </div>
      </div>

      {/* Search Input */}
      {donations.length > 0 && (
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              placeholder="Search by pet name or transaction ID..."
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
          <Skeleton height={60} count={3} className="rounded-2xl" />
        </div>
      ) : donations.length === 0 ? (
        <EmptyState
          icon={FaHeart}
          badge="No Donations Yet"
          title="You haven't contributed to any campaigns yet"
          description="Every small contribution feeds hungry rescues, covers emergency surgeries, and restores hope to injured animals."
          actionText="Browse Campaigns to Support"
          actionLink="/donation-campaigns"
          actionIcon={FaHandHoldingHeart}
        />
      ) : filteredDonations.length === 0 ? (
        <EmptyState
          icon={FaSearch}
          badge="No Results"
          title="No Matching Donations"
          description={`No donations matched "${searchTerm}".`}
          actionText="Clear Search"
          actionOnClick={() => setSearchTerm("")}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200/80 text-gray-400 uppercase font-black tracking-wider">
                  <th className="py-4 px-6 w-16">#</th>
                  <th className="py-4 px-6">Campaign Pet</th>
                  <th className="py-4 px-6">Donation Amount</th>
                  <th className="py-4 px-6">Transaction ID</th>
                  <th className="py-4 px-6 text-right">Refund Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDonations.map((donation, index) => (
                  <tr key={donation._id} className="hover:bg-gray-50/70 transition">
                    <td className="py-4 px-6 font-bold text-gray-400">
                      {index + 1}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            donation.petImage ||
                            "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80"
                          }
                          alt={donation.petName}
                          className="w-12 h-12 rounded-2xl object-cover border border-gray-200 shadow-xs shrink-0"
                        />
                        <div>
                          <p className="font-black text-gray-900 text-sm">
                            {donation.petName}
                          </p>
                          <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <FaCalendarAlt className="text-[9px]" /> Verified Gift
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs">
                        <FaDollarSign className="text-[10px]" /> {donation.amount}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-mono text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200">
                        {donation.transactionId || "tx_simulated_demo"}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() =>
                          handleRefund(
                            donation._id,
                            donation.petName,
                            donation.amount
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-700 font-extrabold text-xs transition border border-gray-200 hover:border-red-200"
                        title="Request a refund for this contribution"
                      >
                        <FaUndo className="text-[10px]" /> Ask for Refund
                      </button>
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

export default MyDonations;
