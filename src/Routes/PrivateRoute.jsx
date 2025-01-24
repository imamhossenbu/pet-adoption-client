/* eslint-disable react/prop-types */
import { useContext } from "react";
import AuthContext from "../context/authContext";
import { Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return (
            <div className="fixed inset-0 bg-gray-100 flex justify-center items-center z-50">
                <div className="w-full max-w-md p-4">
                    <Skeleton count={5} height={30} className="mb-2" />
                    <Skeleton count={1} height={50} className="mb-4" />
                    <Skeleton count={3} height={20} className="mb-2" />
                </div>
            </div>
        );
    }
    if (user?.isBanned) {
        toast.error("Access denied. Your account is banned.");
        return <Navigate to="/login" />;
    }


    if (user) {
        return children;
    }

    return <Navigate to="/login" state={{ from: location }} replace></Navigate>;

};

export default PrivateRoute;