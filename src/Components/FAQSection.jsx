import { useState } from "react";
import dogImage from "../assets/faq.jpg"; 
const faqs = [
    {
        title: "Our Philosophy",
        content: "We believe in providing the best possible care to every pet. Our goal is to connect loving families with the perfect companion and ensure their well-being.",
    },
    {
        title: "Our Organization",
        content: "PeddyCare is dedicated to pet welfare, providing services ranging from adoption to veterinary care. Our team is passionate about animals and their happiness.",
    },
    {
        title: "Partnerships with our team",
        content: "We collaborate with leading animal welfare organizations and veterinary experts to ensure our pets receive the highest standards of care and support.",
    },
];

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20 bg-gray-100">
            <div className="container mx-auto px-6 md:px-10 flex flex-col lg:flex-row items-center gap-12">
                {/* Left Side: Image */}
                <div className="w-full lg:w-1/2">
                    <img
                        src={dogImage}
                        alt="FAQ Dogs"
                        className="w-full h-auto object-cover"
                    />
                </div>

                {/* Right Side: FAQ Section */}
                <div className="w-full lg:w-1/2">
                    <h2 className="text-4xl font-bold text-gray-800 mb-6">
                        Frequently asked questions
                    </h2>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="border-b border-gray-300 pb-4">
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="flex justify-between items-center w-full text-left text-lg font-semibold text-blue-900 focus:outline-none"
                                >
                                    <span>{faq.title}</span>
                                    <span className="text-pink-500">
                                        {openIndex === index ? "▼" : "▶"}
                                    </span>
                                </button>
                                {openIndex === index && (
                                    <p className="mt-3 text-gray-600">{faq.content}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
