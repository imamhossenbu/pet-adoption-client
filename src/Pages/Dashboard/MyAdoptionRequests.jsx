import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import {
  FaCertificate,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaPaw,
  FaSearch,
  FaExternalLinkAlt,
  FaPhoneAlt,
  FaMapMarkerAlt
} from "react-icons/fa";
import AuthContext from "../../context/authContext";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import AdoptionCertificateModal from "../../Components/AdoptionCertificateModal";
import Skeleton from "react-loading-skeleton";

const MyAdoptionRequests = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const [selectedPetForCert, setSelectedPetForCert] = useState(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  // Fetch applications submitted by this user
  const { data: myApplications = [], isLoading } = useQuery({
    queryKey: ["my-submitted-adoptions", user?.email],
    queryFn: async () => {
      // In the server, all applications have { userEmail: applicantEmail, petName, etc. }
      const res = await axiosSecure.get("/all-adoptions");
      return (res.data || []).filter((req) => req.userEmail === user?.email);
    },
    enabled: !!user?.email,
  });

  const handleOpenCertificate = (req) => {
    setSelectedPetForCert({
      petName: req.petName,
      petCategory: req.petCategory || "Companion",
      petImage: req.petImage,
    });
    setIsCertModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      <Helmet>
        <title>My Adoption Applications || PeddyCare Dashboard</title>
      </Helmet>

      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#FBAE02] tracking-wider mb-1">
            <FaPaw /> Adopter Portal
          </span>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            My Adoption Applications ({myApplications.length})
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Track the status of your adoption requests and download official certificates.
          </p>
        </div>

        <Link
          to="/pet-listing"
          className="inline-flex items-center gap-2 bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold text-xs uppercase px-5 py-3 rounded-2xl transition shadow"
        >
          <FaPaw /> Browse More Pets
        </Link>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton height={60} count={4} className="rounded-xl" />
          </div>
        ) : myApplications.length === 0 ? (
          <div className="text-center py-16 px-4">
            <FaPaw className="mx-auto text-4xl text-gray-300 mb-3" />
            <h4 className="text-base font-black text-gray-800">
              No applications submitted yet
            </h4>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              Find an adorable furry friend waiting for love in our pet listings and submit an adoption form!
            </p>
            <Link
              to="/pet-listing"
              className="mt-4 inline-flex items-center gap-2 bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold text-xs uppercase px-5 py-2.5 rounded-xl transition shadow"
            >
              Explore Pets for Adoption
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200/80 text-gray-400 uppercase font-black tracking-wider">
                  <th className="py-4 px-6">Pet Name</th>
                  <th className="py-4 px-6">Phone Provided</th>
                  <th className="py-4 px-6">Address</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Certificate & Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myApplications.map((req) => (
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

                    <td className="py-4 px-6 text-gray-600 font-bold">
                      {req.phone || "N/A"}
                    </td>

                    <td className="py-4 px-6 text-gray-500">
                      {req.address || "N/A"}
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
                            <FaCheckCircle className="text-emerald-600" /> Approved!
                          </>
                        ) : req.status === "rejected" ? (
                          <>
                            <FaTimesCircle className="text-red-600" /> Declined
                          </>
                        ) : (
                          <>
                            <FaClock className="text-amber-500" /> Under Review
                          </>
                        )}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      {req.status === "accepted" ? (
                        <button
                          onClick={() => handleOpenCertificate(req)}
                          className="inline-flex items-center gap-1.5 bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl transition shadow-xs"
                        >
                          <FaCertificate /> View Certificate
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">
                          {req.status === "rejected"
                            ? "Application Closed"
                            : "Awaiting approval"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Adoption Certificate Modal */}
      <AdoptionCertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        petData={selectedPetForCert}
        adopterName={user?.displayName || "Certified Adopter"}
      />
    </div>
  );
};

export default MyAdoptionRequests;
