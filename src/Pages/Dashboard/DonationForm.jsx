/* eslint-disable react/prop-types */
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/authContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const DonationForm = ({ donationId, onClose ,refetch}) => {
    const { user } = useContext(AuthContext);
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [amount, setAmount] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const [error, setError] = useState("");

    // Generate Payment Intent when amount changes
    useEffect(() => {
        if (amount > 0) {
            axiosSecure.post('/create-payment-intent', { donation: amount })
                .then(res => {
                    setClientSecret(res.data.clientSecret);
                })
                .catch(err => console.error("Payment intent error:", err));
        }
    }, [axiosSecure, amount]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            toast.error("Stripe is not properly initialized.");
            return;
        }

        const card = elements.getElement(CardElement);
        if (!card) {
            toast.error("Please enter valid card details.");
            return;
        }

        // Create payment method
        const { error: paymentError, paymentMethod } = await stripe.createPaymentMethod({
            type: "card",
            card,
        });

        if (paymentError) {
            setError(paymentError.message);
            return;
        }
        else{
            console.log('Payment successful:', paymentMethod);
            setError('');
        }

        setError("");

        // Confirm payment
        const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: card,
                billing_details: {
                    name: user?.displayName || "Anonymous",
                    email: user?.email || "anonymous",
                },
            },
        });
        console.log(paymentIntent);

        if (confirmError) {
            toast.error("Payment failed. Please try again.");
            console.error("Confirm error", confirmError);
        } else {
            if (paymentIntent.status === "succeeded") {

                // Save payment details to database
                const paymentData = {
                    name: user?.displayName,
                    email: user?.email,
                    transactionId: paymentIntent.id,
                    amount: amount,
                    donationId: donationId,
                    date: new Date().toISOString(),
                };

                try {
                    const res = await axiosSecure.post('/payment', paymentData);
                    console.log(res);
                    if (res.data.paymentResult.insertedId) {
                        toast.success("Donation successful!");
                        refetch();
                        onClose();
                        navigate(`/donation-details/${donationId}`);
                    }
                } catch (err) {
                    toast.error("Failed to save payment details.");
                    console.error("Payment save error:", err);
                }
            }
        }
    };

    return (
        <div className="bg-white py-6 px-8 rounded-lg shadow-lg w-full max-w-4xl">
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
                        placeholder="Enter donation amount"
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
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
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
                        disabled={!stripe || !clientSecret || !amount}
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
