import ParallaxBanner from "../shared/ParallaxBanner";
import contactImg from '../assets/contact.jpg'
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import HeadingSection from "../shared/HeadingSection";
import { Map, Marker } from 'pigeon-maps'
import { osm } from 'pigeon-maps/providers'

const ContactUs = () => {
    return (
        <div>
            <ParallaxBanner bgImage={contactImg} heading={'Contact PeddyCare Today'} subheading={"We'd love to hear from you! Reach out for support, inquiries, or just to say hello to our pet-loving team."}></ParallaxBanner>

            <section className="py-20 bg-gray-100">
                <HeadingSection title="Contact Us"
                    subtitle="We are here to assist you with any inquiries about pet adoption. Feel free to reach out to us." > </HeadingSection>
                <div className="container mx-auto px-6 md:px-12 lg:px-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white shadow-lg rounded-lg overflow-hidden">

                        {/* Left Side - Contact Information */}
                        <div className="p-10">
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">Send us a Message</h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Have questions about pet adoption? Need help finding your perfect companion?
                                We're here to assist you every step of the way. Reach out to us and we'll be
                                happy to answer your inquiries.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-red-500 text-white p-4 rounded-full">
                                        <FaPhoneAlt size={24} />
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Call Anytime</p>
                                        <p className="text-lg font-bold">(800) 555-0199</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="bg-red-500 text-white p-4 rounded-full">
                                        <FaEnvelope size={24} />
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Write Email</p>
                                        <p className="text-lg font-bold">support@peddycare.com</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="bg-red-500 text-white p-4 rounded-full">
                                        <FaMapMarkerAlt size={24} />
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Visit Office</p>
                                        <p className="text-lg font-bold">
                                            123 Pet Adoption Street, New York, NY 10001, USA
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Contact Form */}
                        <div className="p-10 bg-gray-50">
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                                        required
                                    />
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input
                                        type="text"
                                        placeholder="Your Subject"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Your Phone Number"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                                        required
                                    />
                                </div>

                                <textarea
                                    placeholder="Your Message"
                                    rows="4"
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
                        </div>
                    </div>
                </div>
            </section>
            <Map provider={osm} height={400} defaultCenter={[22.7010, 90.3535]} defaultZoom={12}>
                <Marker
                    width={50}
                    anchor={[22.7010, 90.3535]}
                    onClick={() => alert("Barisal Sadar, Bangladesh")}
                />
            </Map>

        </div>
    );
};

export default ContactUs;