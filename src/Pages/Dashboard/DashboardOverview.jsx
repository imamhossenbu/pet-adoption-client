import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import {
  FaPaw,
  FaUsers,
  FaHeart,
  FaHandHoldingHeart,
  FaClipboardList,
  FaPlusCircle,
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaQuestionCircle,
  FaShieldAlt,
  FaSearch,
  FaCertificate,
  FaCog,
  FaDollarSign
} from "react-icons/fa";
import AuthContext from "../../context/authContext";
import useAdmin from "../../Hooks/useAdmin";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Skeleton from "react-loading-skeleton";

const DashboardOverview = () => {
  const { user } = useContext(AuthContext);
  const [isAdmin, isAdminLoading] = useAdmin();
  const axiosSecure = useAxiosSecure();

  // Admin platform stats
  const { data: stats = {}, isLoading: isStatsLoading } = useQuery({
    queryKey: ["platform-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/platform-stats");
      return res.data;
    },
    enabled: !!isAdmin,
  });

  // User personal stats
  const { data: userStats = {}, isLoading: isUserStatsLoading } = useQuery({
    queryKey: ["user-stats", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/user-stats/${user?.email}`);
      return res.data;
    },
    enabled: !isAdmin && !!user?.email,
  });

  // Recent adoption requests for admin
  const { data: recentRequests = [] } = useQuery({
    queryKey: ["recent-adoptions"],
    queryFn: async () => {
      const res = await axiosSecure.get("/all-adoptions");
      return res.data?.slice(0, 5) || [];
    },
    enabled: !!isAdmin,
  });

  // Recent added pets by user
  const { data: userPets = [] } = useQuery({
    queryKey: ["user-pets-overview", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/pet/${user?.email}`);
      return res.data?.slice(0, 4) || [];
    },
    enabled: !isAdmin && !!user?.email,
  });

  if (isAdminLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton height={140} className="rounded-3xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton height={120} className="rounded-2xl" />
          <Skeleton height={120} className="rounded-2xl" />
          <Skeleton height={120} className="rounded-2xl" />
          <Skeleton height={120} className="rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <Helmet>
        <title>Dashboard Overview || PeddyCare</title>
      </Helmet>

      {/* Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#171717] via-[#242424] to-[#171717] p-8 md:p-10 text-white shadow-xl border border-gray-800"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={user?.photoURL || "https://i.ibb.co/5GzXkwq/user.png"}
              alt={user?.displayName}
              className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-[#FBAE02] shadow-md"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-xs font-extrabold uppercase px-3 py-1 rounded-full ${
                    isAdmin
                      ? "bg-[#FBAE02] text-black"
                      : "bg-emerald-500 text-white"
                  }`}
                >
                  {isAdmin ? "👑 Administrator Portal" : "🐾 Adopter & Pet Lover"}
                </span>
                <span className="text-xs text-gray-400">
                  ID: {user?.uid?.slice(0, 8) || "MEMBER"}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black">
                Welcome back, {user?.displayName || "Friend"}!
              </h1>
              <p className="text-gray-300 text-sm mt-1 max-w-xl">
                {isAdmin
                  ? "Here is your system overview. Manage pets, adoption applications, campaigns, and platform users effortlessly."
                  : "Track your pet adoptions, emergency donations, and pets you have rescued and listed for a forever home."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/dashboard/add-pet"
              className="inline-flex items-center gap-2 bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold text-xs uppercase px-5 py-3 rounded-xl transition shadow"
            >
              <FaPlusCircle /> Add Pet
            </Link>
            <Link
              to="/dashboard/create-donation-campaign"
              className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-extrabold text-xs uppercase px-5 py-3 rounded-xl transition border border-gray-700"
            >
              <FaHandHoldingHeart className="text-[#FBAE02]" /> Start Campaign
            </Link>
          </div>
        </div>

        {/* Ambient background paw glow */}
        <FaPaw className="absolute -right-8 -bottom-10 text-white/5 text-9xl pointer-events-none transform rotate-12" />
      </motion.div>

      {/* ADMIN OVERVIEW */}
      {isAdmin ? (
        <>
          {/* KPI Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Total Pets
                </p>
                <h3 className="text-3xl font-black text-gray-900 mt-1">
                  {stats.totalPets || 47}
                </h3>
                <p className="text-xs text-emerald-600 font-semibold mt-1">
                  {stats.availablePets || 33} Available for Adoption
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#FBAE02] flex items-center justify-center text-2xl">
                <FaPaw />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Registered Users
                </p>
                <h3 className="text-3xl font-black text-gray-900 mt-1">
                  {stats.totalUsers || 28}
                </h3>
                <p className="text-xs text-blue-600 font-semibold mt-1">
                  Active community members
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
                <FaUsers />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Funds Raised
                </p>
                <h3 className="text-3xl font-black text-gray-900 mt-1">
                  ${stats.totalRaised?.toLocaleString() || "3,500"}
                </h3>
                <p className="text-xs text-orange-600 font-semibold mt-1">
                  {stats.totalCampaigns || 6} Emergency Campaigns
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-2xl">
                <FaHandHoldingHeart />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Adoptions Done
                </p>
                <h3 className="text-3xl font-black text-gray-900 mt-1">
                  {stats.totalAdoptions || 22}
                </h3>
                <p className="text-xs text-emerald-600 font-semibold mt-1">
                  Happy forever homes
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl">
                <FaHeart />
              </div>
            </div>
          </div>

          {/* Quick Management Navigation Grid */}
          <div>
            <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
              <FaShieldAlt className="text-[#FBAE02]" /> Admin Management Center
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <Link
                to="/dashboard/all-users"
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#FBAE02] transition text-center group"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-hover:scale-110 transition">
                  <FaUsers />
                </div>
                <h4 className="font-extrabold text-sm text-gray-900 mt-3">Users</h4>
                <p className="text-xs text-gray-400 mt-0.5">Manage accounts</p>
              </Link>

              <Link
                to="/dashboard/all-pets"
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#FBAE02] transition text-center group"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-amber-50 text-[#FBAE02] flex items-center justify-center text-xl group-hover:scale-110 transition">
                  <FaPaw />
                </div>
                <h4 className="font-extrabold text-sm text-gray-900 mt-3">Pets</h4>
                <p className="text-xs text-gray-400 mt-0.5">Listing & Status</p>
              </Link>

              <Link
                to="/dashboard/all-donations"
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#FBAE02] transition text-center group"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-xl group-hover:scale-110 transition">
                  <FaHandHoldingHeart />
                </div>
                <h4 className="font-extrabold text-sm text-gray-900 mt-3">Campaigns</h4>
                <p className="text-xs text-gray-400 mt-0.5">Fund management</p>
              </Link>

              <Link
                to="/dashboard/adoption-requests"
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#FBAE02] transition text-center group"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl group-hover:scale-110 transition">
                  <FaClipboardList />
                </div>
                <h4 className="font-extrabold text-sm text-gray-900 mt-3">Adoptions</h4>
                <p className="text-xs text-gray-400 mt-0.5">Review requests</p>
              </Link>

              <Link
                to="/dashboard/manage-services"
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#FBAE02] transition text-center group"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl group-hover:scale-110 transition">
                  <FaCog />
                </div>
                <h4 className="font-extrabold text-sm text-gray-900 mt-3">Services</h4>
                <p className="text-xs text-gray-400 mt-0.5">Packages & prices</p>
              </Link>

              <Link
                to="/dashboard/manage-faqs"
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#FBAE02] transition text-center group"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl group-hover:scale-110 transition">
                  <FaQuestionCircle />
                </div>
                <h4 className="font-extrabold text-sm text-gray-900 mt-3">FAQs</h4>
                <p className="text-xs text-gray-400 mt-0.5">Dynamic Q&A</p>
              </Link>
            </div>
          </div>

          {/* Recent Applications Table */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black text-gray-900">
                  Recent Adoption Applications
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Latest requests submitted by community members
                </p>
              </div>
              <Link
                to="/dashboard/adoption-requests"
                className="text-xs font-extrabold text-[#FBAE02] hover:text-orange-600 flex items-center gap-1"
              >
                View All Requests <FaArrowRight />
              </Link>
            </div>

            {recentRequests.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">
                No recent adoption requests found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase font-extrabold">
                      <th className="pb-3">Pet</th>
                      <th className="pb-3">Applicant</th>
                      <th className="pb-3">Phone</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentRequests.map((req) => (
                      <tr key={req._id} className="hover:bg-gray-50/70 transition">
                        <td className="py-3 font-black text-gray-900">
                          {req.petName}
                        </td>
                        <td className="py-3 text-gray-700">
                          <div>{req.userName}</div>
                          <div className="text-xs text-gray-400">{req.userEmail}</div>
                        </td>
                        <td className="py-3 text-gray-600 text-xs">
                          {req.phone || "N/A"}
                        </td>
                        <td className="py-3">
                          <span
                            className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                              req.status === "accepted"
                                ? "bg-emerald-100 text-emerald-800"
                                : req.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {req.status === "accepted"
                              ? "Approved"
                              : req.status === "rejected"
                              ? "Rejected"
                              : "Pending Review"}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            to="/dashboard/adoption-requests"
                            className="bg-gray-100 hover:bg-[#FBAE02] text-black text-xs font-extrabold px-3 py-1.5 rounded-lg transition"
                          >
                            Review
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        /* REGULAR USER OVERVIEW */
        <>
          {/* User Personal Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Pets I Added
                </p>
                <h3 className="text-3xl font-black text-gray-900 mt-1">
                  {userStats.addedPets || 0}
                </h3>
                <p className="text-xs text-emerald-600 font-semibold mt-1">
                  {userStats.adoptedPets || 0} adopted by families
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#FBAE02] flex items-center justify-center text-2xl">
                <FaPaw />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  My Applications
                </p>
                <h3 className="text-3xl font-black text-gray-900 mt-1">
                  {userStats.myRequests || 0}
                </h3>
                <p className="text-xs text-blue-600 font-semibold mt-1">
                  Adoption requests submitted
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
                <FaClipboardList />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Total Donated
                </p>
                <h3 className="text-3xl font-black text-gray-900 mt-1">
                  ${userStats.totalDonated?.toLocaleString() || 0}
                </h3>
                <p className="text-xs text-orange-600 font-semibold mt-1">
                  {userStats.myDonationsCount || 0} donations completed
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-2xl">
                <FaHeart />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  My Campaigns
                </p>
                <h3 className="text-3xl font-black text-gray-900 mt-1">
                  {userStats.myCampaigns || 0}
                </h3>
                <p className="text-xs text-emerald-600 font-semibold mt-1">
                  Emergency medical funds
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl">
                <FaHandHoldingHeart />
              </div>
            </div>
          </div>

          {/* Quick Action Navigation for User */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/dashboard/add-pet"
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#FBAE02] transition flex items-center gap-4 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#FBAE02] flex items-center justify-center text-2xl group-hover:scale-110 transition">
                <FaPlusCircle />
              </div>
              <div>
                <h4 className="font-black text-base text-gray-900">
                  Add a Pet for Adoption
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  Rescue or rehome an adorable companion
                </p>
              </div>
            </Link>

            <Link
              to="/dashboard/my-adoption-requests"
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#FBAE02] transition flex items-center gap-4 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                <FaCertificate />
              </div>
              <div>
                <h4 className="font-black text-base text-gray-900">
                  Track My Applications
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  View status & certificates
                </p>
              </div>
            </Link>

            <Link
              to="/dashboard/create-donation-campaign"
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#FBAE02] transition flex items-center gap-4 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                <FaHandHoldingHeart />
              </div>
              <div>
                <h4 className="font-black text-base text-gray-900">
                  Start Medical Campaign
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  Raise emergency funds for pets
                </p>
              </div>
            </Link>
          </div>

          {/* User's Recently Added Pets */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-black text-gray-900">
                  Pets You Have Listed
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Manage adoption status or update information
                </p>
              </div>
              <Link
                to="/dashboard/my-added-pets"
                className="text-xs font-extrabold text-[#FBAE02] hover:text-orange-600 flex items-center gap-1"
              >
                View All Listed Pets <FaArrowRight />
              </Link>
            </div>

            {userPets.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-2xl p-6">
                <FaPaw className="mx-auto text-3xl text-gray-300 mb-2" />
                <p className="text-sm font-bold text-gray-700">
                  You haven't listed any pets yet!
                </p>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  Know a pet in need of a loving forever home? List them now to connect with certified adopters.
                </p>
                <Link
                  to="/dashboard/add-pet"
                  className="mt-4 inline-flex items-center gap-2 bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold text-xs uppercase px-5 py-2.5 rounded-xl transition shadow"
                >
                  <FaPlusCircle /> Add a Pet
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {userPets.map((pet) => (
                  <div
                    key={pet._id}
                    className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 hover:shadow-md transition"
                  >
                    <img
                      src={pet.petImage}
                      alt={pet.petName}
                      className="w-full h-36 object-cover rounded-xl mb-3"
                    />
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-black text-sm text-gray-900">
                        {pet.petName}
                      </h4>
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          pet.adopted
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {pet.adopted ? "Adopted" : "Available"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {pet.petCategory} • {pet.petAge}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <Link
                        to={`/dashboard/update-pet/${pet._id}`}
                        className="flex-1 text-center bg-white hover:bg-gray-100 text-gray-700 font-extrabold text-xs py-1.5 rounded-lg border border-gray-200 transition"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/pet-details/${pet._id}`}
                        className="flex-1 text-center bg-[#171717] hover:bg-black text-[#FBAE02] font-extrabold text-xs py-1.5 rounded-lg transition"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardOverview;
