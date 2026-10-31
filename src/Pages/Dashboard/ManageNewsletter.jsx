import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import Swal from "sweetalert2";
import {
  FaEnvelopeOpenText,
  FaPaperPlane,
  FaSearch,
  FaTrashAlt,
  FaCopy,
  FaCheckCircle,
  FaTimes,
  FaShieldAlt,
  FaUsers,
  FaCalendarAlt,
  FaBan,
  FaSpinner,
  FaCheck
} from "react-icons/fa";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import Skeleton from "react-loading-skeleton";

const ManageNewsletter = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);

  // Broadcast form state
  const [broadcastForm, setBroadcastForm] = useState({
    subject: "",
    heading: "",
    content: "",
  });

  // Fetch subscribers from backend
  const { data = {}, isLoading, refetch } = useQuery({
    queryKey: ["admin-newsletter-subscribers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/newsletter/subscribers");
      return res.data || { subscribers: [], stats: { total: 0, active: 0, unsubscribed: 0 } };
    },
  });

  const subscribers = data.subscribers || [];
  const stats = data.stats || { total: subscribers.length, active: 0, unsubscribed: 0 };

  // Filter subscribers
  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((sub) => {
      const matchSearch = sub.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && sub.status === "active") ||
        (statusFilter === "unsubscribed" && sub.status === "unsubscribed");
      return matchSearch && matchStatus;
    });
  }, [subscribers, searchTerm, statusFilter]);

  // Copy all active emails to clipboard
  const handleCopyEmails = () => {
    const activeEmails = subscribers
      .filter((s) => s.status === "active")
      .map((s) => s.email)
      .join(", ");

    if (!activeEmails) {
      Swal.fire("Notice", "No active subscriber emails to copy.", "info");
      return;
    }

    navigator.clipboard.writeText(activeEmails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    Swal.fire({
      icon: "success",
      title: "Copied!",
      text: `${subscribers.filter((s) => s.status === "active").length} email addresses copied to clipboard.`,
      timer: 1800,
      showConfirmButton: false,
    });
  };

  // Toggle subscriber status
  const handleToggleStatus = async (subscriber) => {
    const newStatus = subscriber.status === "active" ? "unsubscribed" : "active";
    const confirm = await Swal.fire({
      title: `${newStatus === "active" ? "Reactivate Subscriber?" : "Unsubscribe User?"}`,
      text: `Change ${subscriber.email}'s status to ${newStatus.toUpperCase()}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: newStatus === "active" ? "#10B981" : "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: `Yes, Set to ${newStatus}`,
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/newsletter/subscribers/status/${subscriber._id}`, {
          status: newStatus,
        });
        if (res.data.modifiedCount || res.data.acknowledged) {
          refetch();
          Swal.fire("Updated!", `Subscriber is now ${newStatus}.`, "success");
        }
      } catch (err) {
        Swal.fire("Error!", "Failed to update subscriber status.", "error");
      }
    }
  };

  // Delete subscriber
  const handleDeleteSubscriber = async (id, email) => {
    const confirm = await Swal.fire({
      title: `Delete ${email}?`,
      text: "This subscriber will be permanently removed from your list.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Delete",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/newsletter/subscribers/${id}`);
        if (res.data.deletedCount) {
          refetch();
          Swal.fire("Deleted!", "Subscriber removed.", "success");
        }
      } catch (err) {
        Swal.fire("Error!", "Failed to delete subscriber.", "error");
      }
    }
  };

  // Broadcast Email to all active subscribers
  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastForm.subject || !broadcastForm.content) {
      Swal.fire("Required", "Please provide Subject and Content.", "warning");
      return;
    }

    const activeCount = subscribers.filter((s) => s.status === "active").length;
    if (activeCount === 0) {
      Swal.fire("No Recipients", "There are no active subscribers to broadcast to.", "warning");
      return;
    }

    const confirm = await Swal.fire({
      title: "Send Newsletter Broadcast?",
      text: `This will send an email blast to all ${activeCount} active subscriber(s).`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#FBAE02",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Send Broadcast!",
    });

    if (confirm.isConfirmed) {
      setIsSending(true);
      try {
        const res = await axiosSecure.post("/newsletter/send", broadcastForm);
        if (res.data.success) {
          Swal.fire({
            icon: "success",
            title: "Broadcast Dispatched!",
            text: res.data.message || `Sent to ${res.data.recipientCount} subscribers.`,
          });
          setIsBroadcastModalOpen(false);
          setBroadcastForm({ subject: "", heading: "", content: "" });
        }
      } catch (err) {
        Swal.fire("Error", err.response?.data?.message || "Failed to broadcast newsletter.", "error");
      } finally {
        setIsSending(false);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <Helmet>
        <title>Manage Newsletter || PeddyCare Admin</title>
      </Helmet>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#FBAE02] tracking-wider mb-1">
            <FaShieldAlt /> Audience & Engagement
          </span>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Newsletter Subscribers ({subscribers.length})
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage your email subscriber community and broadcast rescue updates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopyEmails}
            className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold text-xs uppercase px-4 py-3 rounded-2xl transition"
            title="Copy all active subscriber emails"
          >
            {copied ? <FaCheck className="text-emerald-600" /> : <FaCopy />}
            <span>{copied ? "Copied!" : "Copy Emails"}</span>
          </button>

          <button
            onClick={() => setIsBroadcastModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold text-xs uppercase px-5 py-3 rounded-2xl transition shadow"
          >
            <FaPaperPlane className="text-sm" /> Send Broadcast
          </button>
        </div>
      </div>

      {/* Quick KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Subscribers</p>
            <h3 className="text-2xl font-black text-gray-900 mt-0.5">{stats.total}</h3>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-[#FBAE02] flex items-center justify-center text-lg">
            <FaUsers />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Active Audience</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-0.5">{stats.active}</h3>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
            <FaCheckCircle />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Unsubscribed</p>
            <h3 className="text-2xl font-black text-gray-400 mt-0.5">{stats.unsubscribed}</h3>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-gray-100 text-gray-500 flex items-center justify-center text-lg">
            <FaBan />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input
            type="text"
            placeholder="Search subscribers by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-xl text-xs text-gray-800 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FBAE02]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
          >
            <option value="all">All Subscribers</option>
            <option value="active">Active Only</option>
            <option value="unsubscribed">Unsubscribed Only</option>
          </select>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton height={50} count={5} className="rounded-xl" />
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="text-center py-16 px-4">
            <FaEnvelopeOpenText className="mx-auto text-4xl text-gray-300 mb-3" />
            <h4 className="text-base font-black text-gray-800">No subscribers found</h4>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              Subscribers will automatically appear here when visitors join the newsletter on your website.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200/80 text-gray-400 uppercase font-black tracking-wider">
                  <th className="py-4 px-6">Subscriber Email</th>
                  <th className="py-4 px-6">Subscription Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSubscribers.map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-50/70 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#FBAE02] flex items-center justify-center font-black">
                          @
                        </div>
                        <div>
                          <p className="font-black text-gray-900 text-sm">{sub.email}</p>
                          <span className="text-[10px] text-gray-400">
                            Source: {sub.source || "Website Footer"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-gray-600 font-semibold">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <FaCalendarAlt className="text-[10px] text-gray-400" />
                        <span>
                          {sub.subscribedAt
                            ? new Date(sub.subscribedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : "Recently"}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleStatus(sub)}
                        title="Click to toggle status"
                        className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-3 py-1 rounded-full border transition ${
                          sub.status === "active"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                            : "bg-red-50 text-red-800 border-red-200 hover:bg-red-100"
                        }`}
                      >
                        {sub.status === "active" ? (
                          <>
                            <FaCheckCircle className="text-emerald-600 text-[10px]" /> Subscribed
                          </>
                        ) : (
                          <>
                            <FaBan className="text-red-500 text-[10px]" /> Unsubscribed
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDeleteSubscriber(sub._id, sub.email)}
                        title="Delete Subscriber Permanently"
                        className="p-2 rounded-xl text-xs font-bold bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-700 transition"
                      >
                        <FaTrashAlt className="text-sm" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Broadcast Email Modal */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsBroadcastModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-xl text-gray-400 hover:text-black hover:bg-gray-100 transition"
            >
              <FaTimes />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-amber-50 text-[#FBAE02]">
                <FaPaperPlane className="text-sm" />
              </span>
              <h3 className="text-lg font-black text-gray-900">
                Compose Newsletter Broadcast
              </h3>
            </div>
            <p className="text-xs text-gray-400 mb-5">
              Send an email newsletter blast directly to all {stats.active} active subscriber(s).
            </p>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Email Subject Line *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 🐾 New Rescues Looking for Homes This Weekend!"
                  value={broadcastForm.subject}
                  onChange={(e) =>
                    setBroadcastForm({ ...broadcastForm, subject: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Newsletter Headline / Header (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. November Paws Digest & Adoption Spotlight"
                  value={broadcastForm.heading}
                  onChange={(e) =>
                    setBroadcastForm({ ...broadcastForm, heading: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Email Message Body *
                </label>
                <textarea
                  rows="6"
                  required
                  placeholder="Write your newsletter announcement, success stories, adoption updates, or care advice..."
                  value={broadcastForm.content}
                  onChange={(e) =>
                    setBroadcastForm({ ...broadcastForm, content: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none leading-relaxed"
                ></textarea>
              </div>

              {/* Live Preview Box */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <span className="text-[10px] font-black uppercase text-gray-400 block mb-2">
                  Preview in Email Client
                </span>
                <div className="bg-white p-4 rounded-xl border border-gray-200 text-left">
                  <h4 className="text-sm font-black text-gray-900 mb-1">
                    {broadcastForm.heading || broadcastForm.subject || "Subject Headline"}
                  </h4>
                  <p className="text-xs text-gray-600 whitespace-pre-line leading-relaxed">
                    {broadcastForm.content || "Your newsletter content preview will appear here..."}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold text-xs uppercase px-6 py-2.5 rounded-xl transition shadow disabled:opacity-50 flex items-center gap-2"
                >
                  {isSending ? (
                    <>
                      <FaSpinner className="animate-spin" /> Dispatching...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="text-xs" /> Send to {stats.active} Subscribers
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageNewsletter;
