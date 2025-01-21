import { useContext, useState } from "react";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import AuthContext from "../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const PetDetails = () => {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        phone: "",
        address: "",
    });

    const axiosSecurePublic = useAxiosPublic();

    const { data: pet = {} } = useQuery({
        queryKey: ["pet", id],
        queryFn: async () => {
            const res = await axiosSecurePublic.get(`/pets/${id}`);
            return res.data;
        },
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAdopt = async (e) => {
        e.preventDefault();
        const adoptionData = {
            petId: pet._id,
            petName: pet.petName,
            petImage: pet.petImage,
            userName: user?.displayName,
            userEmail: user?.email,
            phone: formData.phone,
            address: formData.address,
        };

        
            const res = await axiosSecurePublic.post("/adoption", adoptionData);

            if (res.data.insertedId) {
                setIsModalOpen(false);
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Adoption request sent successfully",
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/pet-listing');
            }
            else{
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "Failed to submit adoption request",
                    showConfirmButton: false,
                    timer: 1500
                });

        } 
    };

    return (
        <div className="max-w-6xl mx-auto my-20 p-6 bg-white rounded shadow-md">
            {/* Pet Details Section */}
            <div className="flex flex-col sm:flex-row">
                <img
                    src={pet.petImage}
                    alt={pet.petName}
                    className="w-full sm:w-1/3 h-64 object-cover rounded-lg"
                />
                <div className="sm:ml-6 mt-4 sm:mt-0">
                    <h1 className="text-4xl font-bold text-orange-600">{pet.petName}</h1>
                    <p className="text-gray-700 mt-2">
                        <strong>Short Description: </strong>
                        {pet.shortDescription}
                    </p>
                    <div className="mt-2">
                        <p className="text-gray-700">
                            <strong>Age:</strong> {pet.petAge} years
                        </p>
                        <p className="text-gray-700">
                            <strong>Category:</strong> {pet.petCategory}
                        </p>
                        <p className="text-gray-700">
                            <strong>Location:</strong> {pet.petLocation}
                        </p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="mt-6 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-300"
                    >
                        Adopt
                    </button>
                </div>
            </div>

            {/* Long Description */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800">About {pet.petName}</h2>
                <div
                    className="text-gray-700 mt-4"
                    dangerouslySetInnerHTML={{ __html: pet.longDescription }}
                />
            </div>

            {/* Modal */}
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} center>
                <div className="w-[350px] md:w-[400px] p-6">
                    <h2 className="text-2xl font-bold text-orange-600 mb-4">
                        Adopt {pet.petName}
                    </h2>
                    <form onSubmit={handleAdopt} className="space-y-4">
                        {/* Pet Info */}
                        <input type="hidden" name="petId" value={pet.id} />
                        <input type="hidden" name="petName" value={pet.petName} />
                        <input type="hidden" name="petImage" value={pet.petImage} />

                        {/* User Info */}
                        <div>
                            <label className="block font-medium">Name</label>
                            <input
                                type="text"
                                value={user?.displayName || ""}
                                disabled
                                className="w-full p-2 border rounded bg-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block font-medium">Email</label>
                            <input
                                type="email"
                                value={user?.email || ""}
                                disabled
                                className="w-full p-2 border rounded bg-gray-100"
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block font-medium">Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter your phone number"
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block font-medium">Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter your address"
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-300"
                        >
                            Submit Adoption Request
                        </button>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default PetDetails;
