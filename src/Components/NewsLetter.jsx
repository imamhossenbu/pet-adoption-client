import {useState } from "react";
import emailjs from "emailjs-com";
import newsletterBg from "../assets/newsletter.jpg";
import Swal from "sweetalert2";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "service_qw43pch",
        "template_7dzfa4c",
        {
          email: email,
        },
        "xPMPQPzivNE4gngbY"
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
          Swal.fire({
            title: "Success.",
            text: "Thanks for Subscribing us.",
            icon: "success",
          });
          setIsSubmitted(true);
        },
        (err) => {
          console.error("FAILED...", err);
          Swal.fire({
            title: "Error!",
            text: "Failed to subscribe. Please try again.",
            icon: "error",
          });
          setError("Failed to subscribe. Please try again.");
        }
      );
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
          <p className="text-2xl font-semibold text-green-400">
            Thanks for subscribing!
          </p>
        ) : (
          <form
            onSubmit={sendEmail}
            className="max-w-lg mx-auto flex flex-col md:flex-row items-center"
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full md:flex-1 px-4 py-3 rounded-l-lg border-0 focus:ring-2 focus:ring-orange-400 text-gray-900"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-r-lg transition duration-300"
            >
              SUBSCRIBE
            </button>
          </form>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </section>
  );
};

export default Newsletter;
