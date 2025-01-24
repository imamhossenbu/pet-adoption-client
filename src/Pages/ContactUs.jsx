import { useState } from "react";
import emailjs from "emailjs-com";
import ParallaxBanner from "../shared/ParallaxBanner";
import contactImg from "../assets/contact.jpg";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import HeadingSection from "../shared/HeadingSection";
import { Map, Marker } from "pigeon-maps";
import { osm } from "pigeon-maps/providers";
import { Helmet } from "react-helmet";

const ContactUs = () => {
    // Form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        phone: "",
        message: "",
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState("");

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        emailjs
            .send(
                "service_qw43pch",  // Replace with your EmailJS Service ID
                "template_imjva58", // Replace with your EmailJS Template ID
                formData,
                "xPMPQPzivNE4gngbY"   // Replace with your EmailJS Public Key
            )
            .then(
                (response) => {
                    console.log("SUCCESS!", response.status, response.text);
                    setIsSubmitted(true);
                },
                (err) => {
                    console.error("FAILED...", err);
                    setError("Failed to send message. Please try again.");
                }
            );
    };

    return (
        <div>
            <Helmet>
                <title>Contact || PeddyCare</title>
            </Helmet>

            <ParallaxBanner
                bgImage={contactImg}
                heading={"Contact PeddyCare Today"}
                subheading={"We'd love to hear from you! Reach out for support, inquiries, or just to say hello to our pet-loving team."}
            />

            <section className="py-20 bg-gray-100">
                <HeadingSection title="Contact Us" subtitle="We are here to assist you with any inquiries about pet adoption." />

                <div className="w-full md:container mx-auto px-4 md:px-12 lg:px-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white shadow-lg rounded-lg ">
                        {/* Left Side - Contact Information */}
                        <div className="p-2 md:p-10">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Send us a Message</h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Have questions about pet adoption? Need help finding your perfect companion?
                                We're here to assist you every step of the way.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-red-500 text-white p-4 rounded-full">
                                        <FaPhoneAlt size={24} />
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Call Anytime</p>
                                        <p className="text-lg font-bold">+880-1624994532</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="bg-red-500 text-white p-4 rounded-full">
                                        <FaEnvelope size={24} />
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Write Email</p>
                                        <p className="text-lg font-bold">imam.cse9.bu@gmail.com</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="bg-red-500 text-white p-4 rounded-full">
                                        <FaMapMarkerAlt size={24} />
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Visit Office</p>
                                        <p className="text-lg font-bold">
                                            Barisal Sadar, Barisal, Bangladesh.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Contact Form */}
                        <div className="p-10 bg-gray-50">
                            {isSubmitted ? (
                                <p className="text-2xl font-semibold text-green-500">
                                    Thank you! Your message has been sent successfully.
                                </p>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Your Name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                                            required
                                        />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Your Email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <input
                                            type="text"
                                            name="subject"
                                            placeholder="Your Subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="phone"
                                            placeholder="Your Phone Number"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                                            required
                                        />
                                    </div>

                                    <textarea
                                        name="message"
                                        placeholder="Your Message"
                                        rows="4"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                                        required
                                    ></textarea>

                                    <button
                                        type="submit"
                                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
                                    >
                                        Send a Message
                                    </button>
                                </form>
                            )}

                            {error && <p className="text-red-500 mt-4">{error}</p>}
                        </div>
                    </div>
                </div>
            </section>

            <Map provider={osm} height={400} defaultCenter={[22.7010, 90.3535]} defaultZoom={12}>
                <Marker
                    width={30}
                    color="red"
                    anchor={[22.7010, 90.3535]}
                    onClick={() => alert("Barisal Sadar, Bangladesh")}
                />
            </Map>
        </div>
    );
};

export default ContactUs;
