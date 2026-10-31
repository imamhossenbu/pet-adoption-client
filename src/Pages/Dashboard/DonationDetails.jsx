import { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import DonationForm from "../Dashboard/DonationForm";
import DonationProgress from "../../shared/DonationProgress";

// Load Stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_payment_gateway_pk);

const DonationDetails = () => {
    const { id } = useParams();
    const axiosSecurePublic = useAxiosPublic();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recommendedDonations, setRecommendedDonations] = useState([]);

    // Fetch donation details
    const { data: donation = {}, isLoading, isError, refetch } = useQuery({
        queryKey: ["donation", id],
        queryFn: async () => {
            const res = await axiosSecurePublic.get(`/donation/${id}`);
            return res.data;
        },
    });

    // Fetch recommended donations
    const fetchRecommendedDonations = async () => {
        try {
            const res = await axiosSecurePublic.get(`/donations/recommended?exclude=${id}`);
            setRecommendedDonations(res.data.slice(0, 3));  // Get 3 recommended donations
        } catch (error) {
            console.error("Error fetching recommended donations:", error);
        }
    };

    const handleDonationSuccess = () => {
        fetchRecommendedDonations();  // Fetch recommendations after success
        setIsModalOpen(false);
    };
    

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading donation details</div>;

    return (
        <div className="max-w-6xl mx-auto my-20 p-6 bg-white rounded shadow-md">
            {/* Donation Details Section */}
            <div className="flex flex-col sm:flex-row">
                <img
                    src={donation.petImage}
                    alt={donation.petName}
                    className="w-full sm:w-1/3 h-72 object-cover rounded-lg"
                />
                <div className="sm:ml-6 mt-4 sm:mt-0">
                    <h1 className="text-4xl font-bold text-orange-600">{donation.petName}</h1>
                    <p className="text-gray-700 mt-2">
                        <strong>Short Description: </strong>
                        {donation.shortDescription}
                    </p>
                    <div className="mt-2">
                        <p className="text-gray-700">
                            <strong>Max Donation Amount:</strong> ${donation.maxDonationAmount}
                        </p>
                        <p className="text-gray-700">
                            <strong>Donated Amount:</strong> ${donation.donatedAmount || 0}
                        </p>
                        <p className="text-gray-700">
                            <strong>Last Date:</strong> {new Date(donation.lastDate).toDateString()}
                        </p>
                    </div>
                    <div className="pt-2">
                        <DonationProgress donatedAmount={donation.donatedAmount} maxDonationAmount={donation.maxDonationAmount} />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)} 
                        disabled={donation?.paused}
                        className="mt-4 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-300"
                    >
                        Donate Now
                    </button>
                </div>
            </div>

            {/* Long Description */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800">About {donation.petName}</h2>
                <div
                    className="text-gray-700 mt-4"
                    dangerouslySetInnerHTML={{ __html: donation.longDescription }}
                />
            </div>

            {/* Recommended Donations */}
            {recommendedDonations.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Recommended Donations</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recommendedDonations.map((campaign) => (
                            <div
                                key={campaign._id}
                                className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 transition-transform duration-300 hover:scale-105"
                            >
                                <img
                                    src={campaign.petImage}
                                    alt={campaign.petName}
                                    className="w-full h-56 object-cover"
                                />
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-orange-500 mb-2">
                                        {campaign.petName}
                                    </h3>
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div>
                                            <p className="text-gray-600 mb-2">
                                                <strong>Max Donation:</strong> ${campaign.maxDonationAmount}
                                            </p>
                                            <p className="text-gray-600 mb-4">
                                                <strong>Donated Amount:</strong> ${campaign.donatedAmount ? campaign.donatedAmount : 0}
                                            </p>
                                        </div>

                                        {/* Progress Bar */}
                                        <div>
                                            <DonationProgress donatedAmount={campaign.donatedAmount} maxDonationAmount={campaign.maxDonationAmount}></DonationProgress>
                                        </div>
                                    </div>

                                    <NavLink
                                        to={campaign._id === id ? "#" : `/donation-details/recommended/${campaign._id}`}
                                        onClick={(e) => {
                                            if (campaign._id === id) {
                                                e.preventDefault(); 
                                            }
                                        }}
                                        className="mt-4 inline-block bg-orange-500 text-white py-2 px-6 rounded-md hover:bg-orange-600 transition duration-300"
                                    >
                                        View Details
                                    </NavLink>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Unified Donation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
                    <Elements stripe={stripePromise}>
                        <DonationForm donationId={id} refetch={refetch} onClose={handleDonationSuccess} />
                    </Elements>
                </div>
            )}
        </div>
    );
};

export default DonationDetails;
