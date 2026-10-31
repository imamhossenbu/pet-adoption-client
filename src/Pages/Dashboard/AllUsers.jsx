import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import {
  FaUsers,
  FaUserPlus,
  FaSearch,
  FaShieldAlt,
  FaBan,
  FaTrashAlt,
  FaCheckCircle,
  FaTimes,
  FaUserCog,
  FaUserCheck,
  FaFilter
} from "react-icons/fa";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Skeleton from "react-loading-skeleton";

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "user",
    photo: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  // Filtered users list
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRole =
        roleFilter === "all" ||
        (roleFilter === "admin" && u.role === "admin") ||
        (roleFilter === "user" && u.role !== "admin");
      const currentStatus = u.status || (u.isBanned ? "banned" : "active");
      const matchStatus =
        statusFilter === "all" ||
        currentStatus === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Status Change Handler: Active / Suspended / Banned
  const handleStatusChange = async (user, newStatus) => {
    const statusDescriptions = {
      active: "Restore full account privileges and activate member.",
      suspended: "Temporarily pause user activity and login privileges.",
      banned: "Permanently restrict and block this account.",
    };

    const confirm = await Swal.fire({
      title: `Set Status to ${newStatus.toUpperCase()}?`,
      text: `${user.name}: ${statusDescriptions[newStatus] || ""}`,
      icon: newStatus === "banned" ? "warning" : "question",
      showCancelButton: true,
      confirmButtonColor: newStatus === "banned" ? "#EF4444" : "#FBAE02",
      cancelButtonColor: "#6B7280",
      confirmButtonText: `Yes, Set to ${newStatus}`,
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/users/status/${user._id}`, {
          status: newStatus,
        });
        if (res.data.modifiedCount || res.data.acknowledged) {
          refetch();
          Swal.fire({
            icon: "success",
            title: "Status Updated!",
            text: `${user.name}'s status is now ${newStatus.toUpperCase()}.`,
            timer: 1800,
            showConfirmButton: false,
          });
        }
      } catch (err) {
        Swal.fire("Error!", err.message || "Failed to update status", "error");
      }
    }
  };

  // Role Change Handler: Admin / User
  const handleRoleChange = async (user, newRole) => {
    if (user.role === newRole) return;
    const confirm = await Swal.fire({
      title: `${newRole === "admin" ? "Promote to Admin?" : "Demote to User?"}`,
      text: `Change ${user.name}'s role to ${newRole.toUpperCase()}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FBAE02",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Change Role",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/users/role/${user._id}`, {
          role: newRole,
        });
        if (res.data.modifiedCount || res.data.acknowledged) {
          refetch();
          Swal.fire(
            "Success!",
            `${user.name} is now a ${newRole}.`,
            "success"
          );
        }
      } catch (err) {
        Swal.fire("Error!", err.message || "Failed to update role", "error");
      }
    }
  };

  // Ban / Unban quick toggle
  const handleBanToggle = async (user) => {
    const isCurrentlyBanned = user.status === "banned" || !!user.isBanned;
    const newStatus = isCurrentlyBanned ? "active" : "banned";
    await handleStatusChange(user, newStatus);
  };

  // Delete user
  const handleDeleteUser = async (user) => {
    const confirm = await Swal.fire({
      title: `Delete ${user.name}?`,
      text: "This user account will be permanently removed. This action cannot be undone!",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Delete Permanently",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/users/${user._id}`);
        if (res.data.deletedCount) {
          refetch();
          Swal.fire("Deleted!", "User has been removed.", "success");
        }
      } catch (err) {
        Swal.fire("Error!", "Failed to delete user.", "error");
      }
    }
  };

  // Add User handler
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      Swal.fire("Required", "Please provide both Name and Email.", "warning");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await axiosSecure.post("/users", {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role || "user",
        photo: newUser.photo || "https://i.ibb.co/5GzXkwq/user.png",
        createdAt: new Date().toISOString(),
      });

      if (res.data.insertedId || res.data.acknowledged) {
        Swal.fire("Success!", "User successfully registered.", "success");
        setIsAddModalOpen(false);
        setNewUser({ name: "", email: "", role: "user", photo: "" });
        refetch();
      } else {
        Swal.fire("Notice", res.data.message || "User already exists", "info");
      }
    } catch (err) {
      Swal.fire("Error", err.message || "Failed to create user", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <Helmet>
        <title>Manage Users || PeddyCare Admin</title>
      </Helmet>

      {/* Header and Add User Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#FBAE02] tracking-wider mb-1">
            <FaShieldAlt /> User Management
          </span>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Registered Community Members ({users.length})
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            View, filter, manage roles, ban status, or register new users directly.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold text-xs uppercase px-5 py-3 rounded-2xl transition shadow"
        >
          <FaUserPlus className="text-sm" /> Add New User
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 md:p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search by name or email address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FBAE02] transition"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs">
            <FaFilter className="text-gray-400 text-[11px]" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent font-bold text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admins Only</option>
              <option value="user">Regular Users Only</option>
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
              <option value="active">Active Only</option>
              <option value="suspended">Suspended Only</option>
              <option value="banned">Banned Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton height={50} count={5} className="rounded-xl" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16 px-4">
            <FaUsers className="mx-auto text-4xl text-gray-300 mb-3" />
            <h4 className="text-base font-black text-gray-800">No users found</h4>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              No matching accounts found for your current search and filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200/80 text-gray-400 uppercase font-black tracking-wider">
                  <th className="py-4 px-6">User Profile</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Account Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => {
                  const currentStatus =
                    user.status || (user.isBanned ? "banned" : "active");
                  return (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50/70 transition"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.photo || "https://i.ibb.co/5GzXkwq/user.png"}
                            alt={user.name}
                            className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                          />
                          <div>
                            <p className="font-black text-gray-900 text-sm">
                              {user.name}
                            </p>
                            <span className="text-[10px] text-gray-400">
                              User ID: {user._id?.slice(-6)}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-gray-600 font-semibold">
                        {user.email}
                      </td>

                      {/* Interactive Role Selector */}
                      <td className="py-4 px-6">
                        <select
                          value={user.role || "user"}
                          onChange={(e) => handleRoleChange(user, e.target.value)}
                          className={`text-[11px] font-black px-3 py-1.5 rounded-xl border cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FBAE02] transition shadow-xs ${
                            user.role === "admin"
                              ? "bg-amber-100/80 text-amber-950 border-amber-300"
                              : "bg-blue-50 text-blue-900 border-blue-200"
                          }`}
                        >
                          <option value="user">👤 User</option>
                          <option value="admin">🛡️ Admin</option>
                        </select>
                      </td>

                      {/* Interactive Status Selector */}
                      <td className="py-4 px-6">
                        <select
                          value={currentStatus}
                          onChange={(e) => handleStatusChange(user, e.target.value)}
                          className={`text-[11px] font-black px-3 py-1.5 rounded-xl border cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FBAE02] transition shadow-xs ${
                            currentStatus === "banned"
                              ? "bg-red-50 text-red-800 border-red-300"
                              : currentStatus === "suspended"
                              ? "bg-amber-50 text-amber-800 border-amber-300"
                              : "bg-emerald-50 text-emerald-800 border-emerald-300"
                          }`}
                        >
                          <option value="active">🟢 Active</option>
                          <option value="suspended">🟡 Suspended</option>
                          <option value="banned">🔴 Banned</option>
                        </select>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          {/* Quick Ban / Unban Toggle */}
                          <button
                            onClick={() => handleBanToggle(user)}
                            title={
                              currentStatus === "banned"
                                ? "Activate User"
                                : "Ban User"
                            }
                            className={`p-2 rounded-xl text-xs font-bold transition ${
                              currentStatus === "banned"
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                : "bg-red-100 text-red-800 hover:bg-red-200"
                            }`}
                          >
                            {currentStatus === "banned" ? (
                              <FaUserCheck className="text-sm" />
                            ) : (
                              <FaBan className="text-sm" />
                            )}
                          </button>

                          {/* Delete User Button */}
                          <button
                            onClick={() => handleDeleteUser(user)}
                            title="Delete User Permanently"
                            className="p-2 rounded-xl text-xs font-bold bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-700 transition"
                          >
                            <FaTrashAlt className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add New User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-xl text-gray-400 hover:text-black hover:bg-gray-100 transition"
            >
              <FaTimes />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#FBAE02] flex items-center justify-center text-xl">
                <FaUserPlus />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900">
                  Register New User
                </h3>
                <p className="text-xs text-gray-400">
                  Add a member directly into the system database
                </p>
              </div>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FBAE02]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. john@example.com"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FBAE02]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  System Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FBAE02]"
                >
                  <option value="user">Regular User (Adopter)</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Photo URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={newUser.photo}
                  onChange={(e) =>
                    setNewUser({ ...newUser, photo: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FBAE02]"
                />
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
                  {isSubmitting ? "Creating..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllUsers;