/* eslint-disable react/prop-types */
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Swal from "sweetalert2";

const DonationForm = ({ donationId, onClose }) => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecurePublic = useAxiosPublic();
    const [amount, setAmount] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        if (!amount || isNaN(amount) || amount <= 0) {
            Swal.fire("Error", "Please enter a valid donation amount.", "error");
            return;
        }

        const cardElement = elements.getElement(CardElement);
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card: cardElement,
        });

        if (error) {
            Swal.fire("Error", error.message, "error");
            return;
        }

        const { data } = await axiosSecurePublic.post("/donations/charge", {
            donationId,
            amount,
            paymentMethodId: paymentMethod.id,
        });

        if (data.success) {
            Swal.fire("Success", "Donation Successful!", "success");
            onClose();
        } else {
            Swal.fire("Error", "Payment failed, try again.", "error");
        }
    };

    return (
        <div className="bg-white py-6 px-10 rounded-lg shadow-lg w-full max-w-4xl">
            <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">Make a Donation</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Donation Amount Field */}
                <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                        Donation Amount ($)
                    </label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                        required
                        placeholder="Enter amount"
                    />
                </div>

                {/* Card Element */}
                <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                        Credit Card Details
                    </label>
                    <div className="p-4 border border-gray-300 rounded-md bg-gray-50">
                        <CardElement className="focus:outline-none" />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 transition duration-300"
                        disabled={!stripe}
                    >
                        Donate
                    </button>
                </div>
            </form>

            {/* Secure Payment Badge */}
            <div className="mt-6 text-center text-gray-600">
                <p className="text-sm">
                    <i className="fas fa-lock"></i> Secure Payment Powered by Stripe
                </p>
            </div>
        </div>
    );
};

export default DonationForm;
