/* eslint-disable react/prop-types */
import { useContext } from 'react';
import useAdmin from '../Hooks/useAdmin';
import { Navigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/authContext';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const [isAdmin, isPending] = useAdmin();
    const location = useLocation();

    if (loading || isPending) {
        return (
            <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex justify-center items-center z-50">
                <div className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-xl border border-gray-100 text-center">
                    <div className="w-14 h-14 mx-auto mb-4 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center animate-pulse text-2xl font-bold">
                        🐾
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Verifying Admin Privileges</h3>
                    <Skeleton count={2} height={14} className="mb-2 rounded" />
                    <Skeleton width={120} height={10} className="rounded" />
                </div>
            </div>
        );
    }

    if (user && isAdmin) {
        return children;
    }

    return <Navigate to="/login" state={{ from: location }} replace></Navigate>;
};

export default AdminRoute;