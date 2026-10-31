import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaExternalLinkAlt,
  FaTimes,
  FaShieldAlt
} from "react-icons/fa";
import { servicesData } from "../../data/servicesData";

const ManageServices = () => {
  const [services, setServices] = useState(servicesData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);

  const handleEditClick = (srv) => {
    setCurrentService({ ...srv });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setServices((prev) =>
      prev.map((s) => (s.id === currentService.id ? currentService : s))
    );
    setIsEditModalOpen(false);
    Swal.fire({
      title: "Service Updated!",
      text: `${currentService.title} details and pricing updated successfully.`,
      icon: "success",
      timer: 1600,
      showConfirmButton: false,
    });
  };

  const handleToggleActive = (id, title, currentState) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, inactive: !currentState } : s))
    );
    Swal.fire({
      title: "Status Changed",
      text: `${title} is now ${currentState ? "Active" : "Paused"}.`,
      icon: "info",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  return (
    <div className="space-y-6 pb-12">
      <Helmet>
        <title>Manage Services || PeddyCare Admin</title>
      </Helmet>

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase text-[#FBAE02] tracking-wider mb-1">
            <FaShieldAlt /> Service Portfolio
          </span>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Manage Platform Services ({services.length})
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Configure pricing tiers, service features, and active availability for adopters.
          </p>
        </div>

        <Link
          to="/services"
          target="_blank"
          className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold text-xs px-4 py-2.5 rounded-xl transition"
        >
          <FaExternalLinkAlt className="text-xs" /> View Public Page
        </Link>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className={`bg-white rounded-3xl p-6 border shadow-sm transition hover:shadow-md flex flex-col justify-between ${
              service.inactive ? "border-red-200 opacity-75" : "border-gray-100"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{service.icon || "🐾"}</span>
                <span
                  className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                    service.inactive
                      ? "bg-red-100 text-red-700"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {service.inactive ? "Paused" : "Active"}
                </span>
              </div>

              <h3 className="text-lg font-black text-gray-900 mb-1">
                {service.title}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                {service.overview?.[0] || "Professional pet care service."}
              </p>

              {/* Pricing Plans Summary */}
              <div className="space-y-2 bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100 mb-4">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                  Pricing Plans (3 Tiers)
                </p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  {service.pricingPlans?.map((plan, i) => (
                    <div
                      key={i}
                      className="bg-white p-2 rounded-xl border border-gray-100 shadow-2xs"
                    >
                      <p className="text-[10px] font-bold text-gray-500 truncate">
                        {plan.name}
                      </p>
                      <p className="text-xs font-black text-[#1D1D1D] mt-0.5">
                        {plan.price}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Highlights count */}
              <div className="flex items-center justify-between text-xs text-gray-500 pb-2">
                <span>Highlights: {service.highlights?.length || 4} features</span>
                <span>FAQs: {service.faqs?.length || 4} Q&A</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
              <Link
                to={`/services/${service.slug}`}
                target="_blank"
                className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1"
              >
                Preview <FaExternalLinkAlt className="text-[10px]" />
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleToggleActive(service.id, service.title, service.inactive)
                  }
                  className={`text-xs font-extrabold px-3 py-1.5 rounded-xl transition ${
                    service.inactive
                      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                      : "bg-red-50 text-red-700 hover:bg-red-100"
                  }`}
                >
                  {service.inactive ? "Activate" : "Pause"}
                </button>
                <button
                  onClick={() => handleEditClick(service)}
                  className="bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl transition"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Service Modal */}
      {isEditModalOpen && currentService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-xl text-gray-400 hover:text-black hover:bg-gray-100 transition"
            >
              <FaTimes />
            </button>

            <h3 className="text-lg font-black text-gray-900 mb-1">
              Edit {currentService.title}
            </h3>
            <p className="text-xs text-gray-400 mb-5">
              Update service title, overview description, and pricing tiers.
            </p>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Service Title
                </label>
                <input
                  type="text"
                  required
                  value={currentService.title}
                  onChange={(e) =>
                    setCurrentService({ ...currentService, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1">
                  Overview Description
                </label>
                <textarea
                  rows="3"
                  value={currentService.overview?.[0] || ""}
                  onChange={(e) => {
                    const newOverviews = [...(currentService.overview || [])];
                    newOverviews[0] = e.target.value;
                    setCurrentService({ ...currentService, overview: newOverviews });
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                  Pricing Plans
                </label>
                <div className="space-y-3">
                  {currentService.pricingPlans?.map((plan, i) => (
                    <div
                      key={i}
                      className="p-3 bg-gray-50 rounded-2xl border border-gray-200/70 flex items-center gap-3"
                    >
                      <input
                        type="text"
                        value={plan.name}
                        onChange={(e) => {
                          const updated = [...currentService.pricingPlans];
                          updated[i].name = e.target.value;
                          setCurrentService({
                            ...currentService,
                            pricingPlans: updated,
                          });
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold"
                        placeholder="Plan Name"
                      />
                      <input
                        type="text"
                        value={plan.price}
                        onChange={(e) => {
                          const updated = [...currentService.pricingPlans];
                          updated[i].price = e.target.value;
                          setCurrentService({
                            ...currentService,
                            pricingPlans: updated,
                          });
                        }}
                        className="w-28 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-black"
                        placeholder="e.g. $25/walk"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold text-xs uppercase px-6 py-2.5 rounded-xl transition shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageServices;
