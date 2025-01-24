
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../Hooks/useAxiosSecure";


const AllPets = () => {
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const [pets, setPets] = useState([]);

    useEffect(() => {
        axiosSecure.get('/allPets')
            .then(res => {
                setPets(res.data);
            })
    }, [axiosSecure])

    console.log(pets); // Ensure pets is always an array



    const handleUpdate = (id) => {
        navigate(`/dashboard/update-pet/${id}`)
    }

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


    const handleAdopted = async (status, id) => {
        const res = await axiosSecure.patch(`/update-adoption/${id}`, { adopted: !status })
        console.log(res.data);
        if (res.data) {
            setPets((prevPets) =>
                prevPets.map((pet) =>
                    pet._id === id ? { ...pet, adopted: !status } : pet
                )
            );
        }
        Swal.fire({
            title: "Success!",
            text: `Account has been ${status ? "not adopted" : "adopted"}.`,
            icon: "success",
        });

    }
    console.log(pets);


    return (
        <div className="container mx-auto p-6">
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                    <thead>
                        <tr className="bg-orange-500 text-white">
                            <th className="py-3 px-4 text-left">Pet Image</th>
                            <th className="py-3 px-4 text-left">Name</th>
                            <th className="py-3 px-4 text-left">Owner</th>
                            <th className="py-3 px-4 text-center">Status</th>
                            <th className="py-3 px-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pets?.map((pet) => (
                            <tr key={pet.id} className="border-b hover:bg-gray-100 transition">
                                <td className="py-3 px-4">
                                    <img src={pet.petImage} alt={pet.petName} className="w-16 h-16 rounded-lg shadow-sm border border-gray-300" />
                                </td>
                                <td className="py-3 px-4 font-medium text-gray-800">{pet.petName}</td>
                                <td className="py-3 px-4 text-gray-600">{pet?.userEmail ? pet?.userEmail : ' N/A'}</td>
                                <td className="py-3 px-4 text-center">
                                    <button onClick={() => handleAdopted(pet?.adopted, pet._id)} className={`px-4 py-2 rounded-full text-white text-sm ${pet?.adopted ? "bg-green-500" : "bg-red-500"}`}>
                                        {pet?.adopted ? 'Adopted' : 'Not Adopted'}
                                    </button>
                                </td>
                                <td className="py-3 px-4 text-center">
                                    <button onClick={() => handleUpdate(pet._id)} className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2 hover:bg-blue-600 transition">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(pet._id)} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
                                        Delete
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

export default AllPets;