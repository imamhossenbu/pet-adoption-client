import { useState } from "react";
import {  useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import DonationForm from "./Dashboard/DonationForm";
import DonationProgress from "../shared/DonationProgress";

// Load Stripe public key
const stripePromise = loadStripe(import.meta.env.VITE_payment_gateway_pk);

const RecommendedDonationDetails = () => {
    const { id } = useParams();
    const axiosSecurePublic = useAxiosPublic();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch donation details
    const { data: donation = {}, isLoading, isError, refetch } = useQuery({
        queryKey: ["donation", id],
        queryFn: async () => {
            const res = await axiosSecurePublic.get(`/donation/${id}`);
            return res.data;
        },
    });


    

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

            {/* Donation Modal */}
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} center>
                <div className="p-6 w-[350px] md:w-[400px]">
                    <Elements stripe={stripePromise}>
                        <DonationForm donationId={id} refetch={refetch} onClose={() => setIsModalOpen(false)} />
                    </Elements>
                </div>
            </Modal>
        </div>
    );
};

export default RecommendedDonationDetails;
