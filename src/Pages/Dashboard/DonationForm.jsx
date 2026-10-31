import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/authContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { FaHandHoldingHeart, FaLock, FaShieldAlt, FaSpinner, FaTimes } from "react-icons/fa";
import PropTypes from "prop-types";

const DonationForm = ({ donationId, onClose, refetch }) => {
    const { user } = useContext(AuthContext);
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [amount, setAmount] = useState("");
    const [clientSecret, setClientSecret] = useState("");
    const [error, setError] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    // Preset donation amounts
    const presets = [10, 25, 50, 100, 250];

    // Generate Payment Intent when amount changes
    useEffect(() => {
        if (Number(amount) > 0) {
            axiosSecure.post('/create-payment-intent', { donation: Number(amount) })
                .then(res => {
                    setClientSecret(res.data.clientSecret);
                })
                .catch(err => {
                    console.error("Payment intent error:", err);
                });
        }
    }, [axiosSecure, amount]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            toast.error("Stripe payment gateway is still loading. Please wait a moment.");
            return;
        }

        const card = elements.getElement(CardElement);
        if (!card) {
            toast.error("Please enter your card details.");
            return;
        }

        setIsProcessing(true);
        setError("");

        try {
            // Create payment method
            const { error: paymentError } = await stripe.createPaymentMethod({
                type: "card",
                card,
            });

            if (paymentError) {
                setError(paymentError.message);
                setIsProcessing(false);
                return;
            }

            if (!clientSecret) {
                setError("Payment gateway is initializing. Please try again.");
                setIsProcessing(false);
                return;
            }

            // Confirm payment with Stripe
            const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: card,
                    billing_details: {
                        name: user?.displayName || "Generous Donor",
                        email: user?.email || "donor@peddycare.org",
                    },
                },
            });

            if (confirmError) {
                setError(confirmError.message);
                toast.error("Payment authorization failed. " + confirmError.message);
                setIsProcessing(false);
                return;
            }

            if (paymentIntent && paymentIntent.status === "succeeded") {
                // Save payment details to database
                const paymentData = {
                    name: user?.displayName || "Generous Donor",
                    email: user?.email,
                    transactionId: paymentIntent.id,
                    amount: Number(amount),
                    donationId: donationId,
                    date: new Date().toISOString(),
                };

                const res = await axiosSecure.post('/payment', paymentData);
                if (res.data?.paymentResult?.insertedId || res.data?.acknowledged) {
                    toast.success(`Donation of $${amount} successfully received! Thank you for saving a pet.`);
                    if (refetch) refetch();
                    onClose();
                    navigate(`/donation-details/${donationId}`);
                } else {
                    toast.success("Payment succeeded with Stripe!");
                    if (refetch) refetch();
                    onClose();
                }
            }
        } catch (err) {
            console.error("Payment processing error:", err);
            setError(err.message || "An error occurred while processing payment.");
            toast.error("Failed to complete donation.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 max-w-lg w-full">
            {/* Header */}
            <div className="bg-[#141414] px-6 py-5 text-white flex items-center justify-between border-b border-gray-800">
                <div>
                    <span className="text-[11px] font-black uppercase text-[#FBAE02] tracking-wider flex items-center gap-1.5">
                        <FaHandHoldingHeart /> Direct Medical Support
                    </span>
                    <h3 className="text-lg font-black text-white mt-0.5">
                        Make a Donation
                    </h3>
                </div>
                <button
                    onClick={onClose}
                    disabled={isProcessing}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition"
                    title="Close"
                >
                    <FaTimes size={14} />
                </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Preset Amount Pills */}
                <div>
                    <label className="block text-[11px] font-black uppercase text-gray-600 mb-2">
                        Select Preset Amount
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                        {presets.map((val) => (
                            <button
                                key={val}
                                type="button"
                                onClick={() => setAmount(String(val))}
                                className={`py-2 rounded-xl text-xs font-black transition border ${
                                    Number(amount) === val
                                        ? "bg-[#FBAE02] text-black border-[#FBAE02] shadow-xs"
                                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-orange-50 hover:border-[#FBAE02]"
                                }`}
                            >
                                ${val}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Custom Amount Input */}
                <div>
                    <label className="block text-[11px] font-black uppercase text-gray-600 mb-1">
                        Or Enter Custom Amount ($) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500 font-bold text-sm">
                            $
                        </span>
                        <input
                            type="number"
                            min="1"
                            step="any"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#FBAE02] focus:border-transparent outline-none transition"
                            required
                            placeholder="e.g. 50"
                        />
                    </div>
                </div>

                {/* Stripe Card Element */}
                <div>
                    <label className="block text-[11px] font-black uppercase text-gray-600 mb-1.5 flex items-center justify-between">
                        <span>Card Information</span>
                        <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                            <FaLock className="text-gray-400" /> 256-bit Encrypted
                        </span>
                    </label>
                    <div className="p-3.5 border border-gray-200 rounded-xl bg-gray-50/70 focus-within:ring-2 focus-within:ring-[#FBAE02] focus-within:bg-white transition">
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: "14px",
                                        color: "#1f2937",
                                        fontFamily: "Lato, sans-serif",
                                        "::placeholder": {
                                            color: "#9ca3af",
                                        },
                                    },
                                    invalid: {
                                        color: "#ef4444",
                                    },
                                },
                            }}
                        />
                    </div>
                    {error && (
                        <p className="text-red-500 text-xs font-bold mt-1.5 flex items-center gap-1">
                            ⚠️ {error}
                        </p>
                    )}
                </div>

                {/* Trust Badge */}
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-2.5 text-[11px] text-emerald-800">
                    <FaShieldAlt className="text-emerald-600 text-sm shrink-0" />
                    <span>
                        100% of this donation directly supports medical treatment and supplies for this case.
                    </span>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isProcessing}
                        className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold transition disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!stripe || !amount || Number(amount) <= 0 || isProcessing}
                        className="inline-flex items-center gap-2 bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-black text-xs uppercase px-5 py-2.5 rounded-xl transition shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? (
                            <>
                                <FaSpinner className="animate-spin text-xs" />
                                <span>Processing Payment...</span>
                            </>
                        ) : (
                            <>
                                <FaHandHoldingHeart className="text-xs" />
                                <span>Donate ${amount ? Number(amount).toFixed(0) : "0"}</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

DonationForm.propTypes = {
    donationId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    refetch: PropTypes.func,
};

export default DonationForm;
