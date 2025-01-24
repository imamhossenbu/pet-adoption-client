import { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import Sidebar from "./Sidebar"; 
import AuthContext from "../../context/authContext";
import useAdmin from "../../Hooks/useAdmin";

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAdmin, isPending] = useAdmin();
  console.log(isAdmin);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  if(isPending) return <h2>loading.....</h2>

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar for large screens */}
      <div className="hidden lg:flex lg:w-80 bg-gray-800 text-white">
        <Sidebar user={user} />
      </div>

      {/* Drawer for small screens */}
      {isDrawerOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={toggleDrawer}
          ></div>

          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 text-white z-40 lg:hidden">
            <Sidebar  />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-white shadow p-4 flex items-center justify-between">
          <button
            className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-200"
            onClick={toggleDrawer}
          >
            {isDrawerOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          <div className="flex items-center gap-4">
            <img
              src={user?.photoURL}
              alt={user?.displayName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg font-semibold">{user?.displayName}</h2>
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
