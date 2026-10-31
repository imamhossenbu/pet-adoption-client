import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
// import useAxiosSecure from "./useAxiosSecure";
import AuthContext from "../context/authContext";
import useAxiosSecure from "./useAxiosSecure";

const useAdmin = () => {
    const { user,loading } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const { data: isAdmin,isPending} = useQuery({
        queryKey: [user?.email, 'isAdmin'],
        enabled:!loading,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/admin/${user?.email}`);
            return res.data.admin;
        },
        
    });
    return [isAdmin,isPending];
};

export default useAdmin;
