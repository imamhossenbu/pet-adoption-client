import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import AuthContext from "../../context/authContext";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const MyDonations = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);

    // Fetch donations for logged-in user
    const { data: donations = [], refetch } = useQuery({
        queryKey: ["myDonations", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/my-donations/${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email,  
    });
    console.log(donations);

    // Handle refund request
    const handleRefund = async (donationId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will remove your donation from this campaign.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, refund it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosSecure.delete(`/refund-donation/${donationId}`); 
                    Swal.fire("Refunded!", "Your donation has been refunded.", "success");
                    refetch();  // Refresh data after refund
                } catch (error) {
                    console.error("Refund error:", error);
                    Swal.fire("Error", "Failed to process refund. Please try again.", "error");
                }
            }
        });
    };

    return (
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <h1 className="text-2xl md:text-3xl font-bold my-6 text-center">My Donations</h1>

            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="table-auto w-full text-left border-collapse">
                    <thead className="bg-[#D1A054] text-white">
                        <tr className="uppercase text-sm md:text-base">
                            <th className="p-3">Pet Image</th>
                            <th className="p-3">Pet Name</th>
                            <th className="p-3">Donated Amount</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donations.map((donation) => (
                            <tr key={donation._id} className="border-b hover:bg-gray-100 text-sm md:text-base">
                                <td className="p-3">
                                    <img src={donation.petImage} alt={donation.petName} className="w-16 h-16 rounded-md object-cover" />
                                </td>
                                <td className="p-3 font-semibold">{donation.petName}</td>
                                <td className="p-3 text-green-500 font-bold">${donation.amount}</td>
                                <td className="p-3 flex justify-center gap-2">
                                    <button
                                        onClick={() => handleRefund(donation._id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                                    >
                                        Ask for Refund
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {donations.length === 0 && (
                    <p className="text-center py-6 text-gray-500">No donations made yet.</p>
                )}
            </div>
        </div>
    );
};

export default MyDonations;
