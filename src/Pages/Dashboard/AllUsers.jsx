import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from '../../Hooks/useAxiosSecure'


const AllUsers = () => {
    const axiosSecure = useAxiosSecure();


    const { data: users = [], refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users')
            return res.data;
        }
    })

    const handleMakeAdmin = async (id) => {
        const res = await axiosSecure.patch(`/users/admin/${id}`)
        if (res.data.modifiedCount) {
            refetch();
            Swal.fire({
                title: "Updated!",
                text: "User is now an admin",
                icon: "success"
            });

        }
    }


    const handleBanned = async (id, status) => {
        await axiosSecure.patch(`/users/admin/ban/${id}`, { isBanned: !status });
        refetch();
        Swal.fire({
            title: "Success!",
            text: `Account has been ${status ? "unbanned" : "banned"}.`,
            icon: "success",
        });
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Users List</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-orange-400 text-white border-b">
                            <th className="py-3 px-4 text-left  font-semibold">Profile</th>
                            <th className="py-3 px-4 text-left  font-semibold">Name</th>
                            <th className="py-3 px-4 text-left font-semibold">Email</th>
                            <th className="py-3 px-4 text-center font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                                <td className="py-3 px-4">
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={user?.photo || "https://via.placeholder.com/50"}
                                            alt={user.name}
                                            className="w-12 h-12 rounded-full object-cover border border-gray-300 shadow-sm"
                                        />
                                        <span className="font-medium text-gray-700">{user.name}</span>
                                    </div>
                                </td>

                                <td className="py-3 px-4">{user.name}</td>
                                <td className="py-3 px-4">{user.email}</td>
                                <td className="py-3 px-4 text-center">
                                    <button onClick={() => handleMakeAdmin(user._id)}
                                        className={`px-4 py-2 text-white rounded ${user.role === "admin" ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                                        disabled={user.role === "admin"}
                                    >
                                        {user.role === "admin" ? "Admin" : "Make Admin"}
                                    </button>
                                    <button onClick={() => handleBanned(user._id, user?.isBanned)}
                                        className={`px-4 py-2 ml-2 text-white rounded ${user.isBanned ? "bg-gray-400 " : "bg-red-500 hover:bg-red-600"}`}
                                    >
                                        {user.isBanned ? "Banned" : "Ban"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllUsers;