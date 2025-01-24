import { useState } from "react";
import { FaEdit, FaPause, FaEye, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import DonationProgress from "../../shared/DonationProgress";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
// import AuthContext from "../../context/authContext";

const AllDonationCampaign = () => {
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    // const { user } = useContext(AuthContext);
    const [modalData, setModalData] = useState(null);

    // Fetch all donation campaigns for admin
    const { data: campaigns = [], refetch, isLoading } = useQuery({
        queryKey: ["all-donation-campaigns"],
        queryFn: async () => {
            const res = await axiosSecure.get(`/donation-campaigns`);
            return res.data;
        },
    });

    if (isLoading) return <h2 className="text-center mt-10 text-gray-600">Loading...</h2>;

    // Handle pause/unpause of donation campaign
    const handlePauseToggle = async (id, status) => {
        await axiosSecure.patch(`donations/${id}`, { paused: !status });
        refetch();
        Swal.fire({
            title: "Success!",
            text: `Donation campaign has been ${status ? "unpaused" : "paused"}.`,
            icon: "success",
        });
    };

    // Handle deleting a donation campaign
    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axiosSecure.delete(`donations/${id}`);
                refetch();
                Swal.fire({
                    title: "Deleted!",
                    text: "The donation campaign has been deleted.",
                    icon: "success",
                });
            }
        });
    };

    // Open modal to show donators
    const handleViewDonators = async (donationId) => {
        const res = await axiosSecure.get(`donators/${donationId}`);
        setModalData(res.data);
    };

    return (
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <h1 className="text-2xl md:text-3xl font-bold my-6 text-center">
                All Donation Campaigns
            </h1>
            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="table-auto w-full text-left border-collapse">
                    <thead className="bg-[#D1A054] text-white">
                        <tr className="uppercase text-sm md:text-base">
                            <th className="p-3">Pet Name</th>
                            <th className="p-3">Max Donation</th>
                            <th className="p-3">Donation Progress</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {campaigns.map((campaign) => (
                            <tr
                                key={campaign._id}
                                className="border-b hover:bg-gray-100 text-sm md:text-base"
                            >
                                <td className="p-3">{campaign?.petName}</td>
                                <td className="p-3">${campaign.maxDonationAmount}</td>
                                <td className="p-3">
                                    <DonationProgress
                                        donatedAmount={campaign.donatedAmount}
                                        maxDonationAmount={campaign.maxDonationAmount}
                                    />
                                </td>
                                <td className="p-3 flex justify-center gap-3">
                                    {/* Edit Campaign */}
                                    <button
                                        onClick={() => navigate(`/dashboard/edit-donation/${campaign._id}`)}
                                        className="text-blue-500 hover:text-blue-700"
                                        title="Edit"
                                    >
                                        <FaEdit size={20} />
                                    </button>

                                    {/* Pause/Unpause Campaign */}
                                    <button
                                        onClick={() => handlePauseToggle(campaign._id, campaign?.paused)}
                                        className={`text-${campaign.paused ? "green" : "red"}-500 hover:text-${campaign.paused ? "green" : "red"}-700`}
                                        title={campaign.paused ? "Unpause" : "Pause"}
                                    >
                                        <FaPause size={20} />
                                    </button>

                                    {/* View Donators */}
                                    <button
                                        onClick={() => handleViewDonators(campaign._id)}
                                        className="text-gray-500 hover:text-gray-700"
                                        title="View Donators"
                                    >
                                        <FaEye size={20} />
                                    </button>

                                    {/* Delete Campaign */}
                                    <button
                                        onClick={() => handleDelete(campaign._id)}
                                        className="text-red-500 hover:text-red-700"
                                        title="Delete"
                                    >
                                        <FaTrash size={20} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Donators Modal */}
            {modalData && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Donators List</h2>
                        <ul>
                            {modalData.map((donator) => (
                                <li key={donator._id} className="border-b py-2">
                                    <strong>Name:</strong> {donator.name} <br />
                                    <strong>Email:</strong> {donator.email} <br />
                                    <strong>Amount:</strong> ${donator.amount}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => setModalData(null)}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllDonationCampaign;
