import { useState } from "react";
import newsletterBg from "../assets/newsletter.jpg";
import Swal from "sweetalert2";
import useAxiosPublic from "../Hooks/useAxiosPublic";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const axiosPublic = useAxiosPublic();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError("");

    try {
      const res = await axiosPublic.post("/newsletter/subscribe", { email });
      Swal.fire({
        title: res.data.alreadySubscribed ? "Already Subscribed!" : "Subscribed!",
        text: res.data.message || "Thank you for joining our community newsletter.",
        icon: "success",
        confirmButtonColor: "#FBAE02",
      });
      setIsSubmitted(true);
      setEmail("");
    } catch (err) {
      console.error("Subscription error:", err);
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || "Failed to subscribe. Please try again.",
        icon: "error",
      });
      setError("Failed to subscribe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat bg-fixed py-20"
      style={{ backgroundImage: `url(${newsletterBg})` }}
    >
      {/* Overlay to enhance readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 text-center text-white px-6">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
          Subscribe to our newsletter
        </h2>
        <p className="text-lg md:text-xl mb-6">
          We send emails once a month, we never send Spam!
        </p>

        {/* Show Thank You Message or Form */}
        {isSubmitted ? (
          <div className="bg-emerald-500/20 border border-emerald-400 text-emerald-300 px-6 py-3 rounded-2xl max-w-md mx-auto font-bold text-sm">
            ✓ Thanks for subscribing! You'll receive our monthly rescues digest.
          </div>
        ) : (
          <form
            onSubmit={handleSubscribe}
            className="max-w-lg mx-auto flex flex-col sm:flex-row items-center gap-2 sm:gap-0"
          >
            <input
              type="email"
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:flex-1 px-5 py-3.5 rounded-2xl sm:rounded-r-none border-0 focus:ring-2 focus:ring-[#FBAE02] text-gray-900 text-sm shadow-md"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold px-7 py-3.5 rounded-2xl sm:rounded-l-none transition duration-300 shadow-md text-xs uppercase tracking-wider disabled:opacity-60"
            >
              {isSubmitting ? "Subscribing..." : "SUBSCRIBE"}
            </button>
          </form>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </section>
  );
};

export default Newsletter;
