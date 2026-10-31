import { useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  FaChartPie,
  FaUsers,
  FaPaw,
  FaHandHoldingHeart,
  FaClipboardList,
  FaPlusCircle,
  FaHome,
  FaSignOutAlt,
  FaShieldAlt,
  FaCog,
  FaQuestionCircle,
  FaCertificate,
  FaHeart,
  FaTags,
  FaGlobe,
  FaUserFriends,
  FaEnvelopeOpenText
} from "react-icons/fa";
import logo from "../../assets/logo.png";
import AuthContext from "../../context/authContext";
import useAdmin from "../../Hooks/useAdmin";
import Swal from "sweetalert2";

const Sidebar = ({ onClose }) => {
  const { user, logOut } = useContext(AuthContext);
  const [isAdmin] = useAdmin();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirm = await Swal.fire({
      title: "Logout from Dashboard?",
      text: "You will be safely logged out of your session.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#FBAE02",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout",
    });

    if (confirm.isConfirmed) {
      await logOut();
      navigate("/login");
    }
  };

  // Dedicated Admin Menu
  const adminSections = [
    {
      title: "CORE",
      items: [
        { name: "Overview & Analytics", path: "/dashboard", icon: FaChartPie, end: true },
      ],
    },
    {
      title: "MANAGEMENT",
      items: [
        { name: "Manage Users", path: "/dashboard/all-users", icon: FaUsers },
        { name: "Manage Pets", path: "/dashboard/all-pets", icon: FaPaw },
        { name: "Manage Campaigns", path: "/dashboard/all-donations", icon: FaHandHoldingHeart },
        { name: "Adoption Requests", path: "/dashboard/adoption-requests", icon: FaClipboardList },
        { name: "Manage Services", path: "/dashboard/manage-services", icon: FaCog },
        { name: "Manage FAQs", path: "/dashboard/manage-faqs", icon: FaQuestionCircle },
        { name: "Pet Categories", path: "/dashboard/manage-categories", icon: FaTags },
        { name: "Manage Team", path: "/dashboard/manage-team", icon: FaUserFriends },
        { name: "Newsletter", path: "/dashboard/manage-newsletter", icon: FaEnvelopeOpenText },
      ],
    },
    {
      title: "CREATION",
      items: [
        { name: "Add a Pet", path: "/dashboard/add-pet", icon: FaPlusCircle },
        { name: "Create Campaign", path: "/dashboard/create-donation-campaign", icon: FaHeart },
      ],
    },
  ];

  // Dedicated Regular User Menu
  const userSections = [
    {
      title: "MY PORTAL",
      items: [
        { name: "My Overview", path: "/dashboard", icon: FaChartPie, end: true },
        { name: "My Added Pets", path: "/dashboard/my-added-pets", icon: FaPaw },
        { name: "Add a Pet", path: "/dashboard/add-pet", icon: FaPlusCircle },
        { name: "Incoming Requests", path: "/dashboard/adoption-request", icon: FaClipboardList },
        { name: "My Applications", path: "/dashboard/my-adoption-requests", icon: FaCertificate },
      ],
    },
    {
      title: "CAMPAIGNS & GIVING",
      items: [
        { name: "Create Campaign", path: "/dashboard/create-donation-campaign", icon: FaHandHoldingHeart },
        { name: "My Campaigns", path: "/dashboard/my-donation-campaigns", icon: FaHeart },
        { name: "My Donations", path: "/dashboard/my-donations", icon: FaHandHoldingHeart },
      ],
    },
  ];

  const sections = isAdmin ? adminSections : userSections;

  return (
    <aside className="w-full h-full flex flex-col bg-[#141414] text-white border-r border-gray-800 selection:bg-[#FBAE02]">
      {/* Brand Header */}
      <div className="p-6 border-b border-gray-800/80 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-1.5 group-hover:border-[#FBAE02] transition shadow-sm">
            <img src={logo} alt="PeddyCare" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-white">
                Peddy<span className="text-[#FBAE02]">Care</span>
              </span>
            </div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">
              {isAdmin ? "Enterprise Admin" : "User Portal"}
            </p>
          </div>
        </Link>
      </div>

      {/* User Profile Mini Card */}
      <div className="px-6 py-4 mx-4 my-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
        <img
          src={user?.photoURL || "https://i.ibb.co/5GzXkwq/user.png"}
          alt={user?.displayName}
          className="w-10 h-10 rounded-xl object-cover border border-[#FBAE02]/60"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-black text-white truncate">
            {user?.displayName || "Member"}
          </h4>
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full mt-0.5 ${
              isAdmin
                ? "bg-[#FBAE02]/20 text-[#FBAE02] border border-[#FBAE02]/40"
                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            }`}
          >
            {isAdmin ? (
              <>
                <FaShieldAlt className="text-[9px]" /> Administrator
              </>
            ) : (
              <>
                <FaPaw className="text-[9px]" /> Pet Adopter
              </>
            )}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-6 custom-scrollbar">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h5 className="px-3 text-[10px] font-black tracking-wider uppercase text-gray-400">
              {section.title}
            </h5>
            <div className="space-y-1 mt-1">
              {section.items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={i}
                    to={item.path}
                    end={item.end}
                    onClick={() => onClose && onClose()}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs transition duration-200 group ${
                        isActive
                          ? "bg-[#FBAE02] text-black shadow-md font-black"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={`text-base transition ${
                            isActive
                              ? "text-black"
                              : "text-gray-400 group-hover:text-[#FBAE02]"
                          }`}
                        />
                        <span className="truncate">{item.name}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Navigation: Back to Website & Logout */}
      <div className="p-4 border-t border-gray-800/80 space-y-1 bg-black/30">
        <Link
          to="/"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs text-gray-300 hover:bg-white/5 hover:text-white transition"
        >
          <FaGlobe className="text-gray-400 text-sm" />
          <span>Back to Main Website</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition text-left"
        >
          <FaSignOutAlt className="text-sm" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
