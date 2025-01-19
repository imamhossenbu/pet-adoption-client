
import { FaFacebook, FaTwitter, FaEnvelope, FaInstagram } from "react-icons/fa";
import { FiMapPin, FiPhone, FiClock } from "react-icons/fi";
import logo from "../../public/logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-[#1D1D1D] text-white">
            <div className="flex justify-center items-center gap-2 py-6 border-b border-gray-700">
                <div>
                    <img className="w-[60px]" src={logo} alt="" />
                </div>
                <h2 className="text-3xl font-bold">PeddyCare</h2>
            </div>
            {/* Top Section */}
            <div className="container mx-auto px-4 md:px-8 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center  py-8">
                    {/* Address Section */}
                    <div className="flex md:flex-row items-center  gap-3">
                        <div className="bg-red-500 p-4 rounded-full">
                            <FiMapPin className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-lg">516 Columbia Blvd</p>
                            <p>Sonoma, CA 21202</p>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="flex md:flex-row items-center  gap-3">
                        <div className="bg-red-500 p-4 rounded-full ">
                            <FiPhone className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-lg">Office: 772-619-6309</p>
                            <p>Inquiries: 772-619-6432</p>
                        </div>
                    </div>

                    {/* Working Hours Section */}
                    <div className="flex md:flex-row items-center  gap-3">
                        <div className="bg-red-500 p-4 rounded-full">
                            <FiClock className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-lg">Mon - Fri: 9am - 8pm</p>
                            <p>Sat - Sun: Closed</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className=" bg-[#232323]">
                <ul className="flex py-7 justify-center space-x-3 text-gray-400 ">
                    <li className="hover:text-white">
                        <Link to='/'> Home</Link>
                    </li>
                    <li className="hover:text-white">
                        <Link to='/pet-listing'> Pet Listing</Link>
                    </li>
                    <li className="hover:text-white">
                        <Link to='/donation-campaigns'> Donation Campaigns</Link>
                    </li>
                </ul>
            </div>

            {/* Bottom Section */}
            <div className="py-6">
                <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between">
                    {/* Logo and Copyright */}
                    <div className="flex items-center mb-4 md:mb-0">
                        <img
                            src={logo} // Replace with your logo path
                            alt="Logo"
                            className="h-8 w-auto mr-3"
                        />
                        <span className="text-md text-gray-400">
                            © 2025 PeddyCare. All rights reserved.
                        </span>
                    </div>

                    {/* Social Icons */}
                    <div className="flex space-x-4">
                        <a href="#facebook" className=" hover:text-gray-600">
                            <FaFacebook className="h-5 w-5" />
                        </a>
                        <a href="#twitter" className=" hover:text-gray-600">
                            <FaTwitter className="h-5 w-5" />
                        </a>
                        <a href="#email" className=" hover:text-gray-600">
                            <FaEnvelope className="h-5 w-5" />
                        </a>
                        <a href="#instagram" className=" hover:text-gray-600">
                            <FaInstagram className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
