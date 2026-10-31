import { FaTrash, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/authContext";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const MyAddedPets = () => {
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const { user } = useContext(AuthContext);
    const [pets, setPets] = useState([]);


    useEffect(() => {
        axiosSecure.get(`/pet/${user?.email}`)
            .then(res => {
                setPets(res.data)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [axiosSecure])

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                // Proceed with deletion
                axiosSecure
                    .delete(`/pet/${id}`)
                    .then((res) => {
                        if (res.data.deletedCount) {
                            // Update the state by removing the deleted pet
                            setPets((prevPets) => prevPets.filter((pet) => pet._id !== id));
                            // Show success alert
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your pet has been deleted.",
                                icon: "success",
                                confirmButtonColor: "#3085d6",
                            });
                        }
                    })
                    .catch((error) => {
                        console.error("Error deleting pet:", error);
                        Swal.fire({
                            title: "Error!",
                            text: "Something went wrong. Please try again later.",
                            icon: "error",
                            confirmButtonColor: "#d33",
                        });
                    });
            }
        });
    };

    const handleAdopt = (id) => {
        axiosSecure.patch(`/pets/${id}`, { adopted: true })
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    setPets(prevPets =>
                        prevPets.map(pet =>
                            pet._id === id ? { ...pet, adopted: true } : pet
                        )
                    );
                    Swal.fire({
                        title: "Adopted!",
                        text: "The pet has been marked as adopted.",
                        icon: "success",
                    });
                }
            })
            .catch(error => {
                console.error("Error updating adoption status:", error);
                Swal.fire({
                    title: "Error!",
                    text: "Could not update the adoption status. Please try again.",
                    icon: "error",
                });
            });
    };

    return (
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <h1 className="text-2xl md:text-3xl font-bold my-6 text-center">My Added Pets</h1>
            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="table-auto w-full text-left border-collapse">
                    {/* Table Head */}
                    <thead className="bg-[#D1A054] text-white">
                        <tr className="uppercase text-sm md:text-base">
                            <th className="p-3">S/N</th>
                            <th className="p-3">Pet Image</th>
                            <th className="p-3">Pet Name</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Adoption Status</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    {/* Table Body */}
                    <tbody>
                        {pets.map((pet, index) => (
                            <tr
                                key={pet._id}
                                className="border-b hover:bg-gray-100 text-sm md:text-base"
                            >
                                <td className="p-3 font-semibold">{index + 1}</td>
                                <td className="p-3">
                                    <div className="flex items-center justify-center">
                                        <div className="mask mask-squircle rounded-md h-12 w-12 overflow-hidden">
                                            <img
                                                src={pet.petImage}
                                                alt={pet.petName}
                                                className="object-cover h-full w-full"
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td className="p-3">{pet.petName}</td>
                                <td className="p-3">{pet.petCategory}</td>
                                <td className="p-3">
                                    <span
                                        className={`px-2 py-1 rounded text-white ${pet.adopted ? "bg-green-500" : "bg-red-500"
                                            }`}
                                    >
                                        {pet.adopted ? "Adopted" : "Not Adopted"}
                                    </span>
                                </td>
                                <td className="p-3 flex justify-center gap-2">
                                    {/* Edit Button */}
                                    <button
                                        onClick={() => navigate(`/dashboard/update-pet/${pet._id}`)}
                                        className="text-blue-500 hover:text-blue-700"
                                        title="Edit"
                                    >
                                        <FaEdit size={20} />
                                    </button>
                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDelete(pet._id)}
                                        className="text-red-500 hover:text-red-700"
                                        title="Delete"
                                    >
                                        <FaTrash size={20} />
                                    </button>
                                    {/* Adopt Button */}
                                    <button onClick={() => handleAdopt(pet._id)}
                                        disabled={pet.adopted}
                                        className={`text-white px-4 py-2 rounded ${pet.adopted
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-green-500 hover:bg-green-600"
                                            }`}
                                    >
                                        {pet.adopted ? "Adopted" : "Adopt"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyAddedPets;
