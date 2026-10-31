import { useContext, useState } from "react";
import AuthContext from "../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import { useFavorites } from "../context/FavoritesContext";
import { FaHeart, FaRegHeart, FaAward, FaCheckCircle, FaShieldAlt } from "react-icons/fa";
import AdoptionCertificateModal from "../Components/AdoptionCertificateModal";
import AdoptionRequestModal from "../Components/AdoptionRequestModal";
import { getPetImage, handleImageError } from "../utils/imageFallback";

const PetDetails = () => {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const { toggleFavorite, isFavorite } = useFavorites();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCertificateOpen, setIsCertificateOpen] = useState(false);

    const axiosSecure = useAxiosSecure();

    const { data: pet = {}, refetch } = useQuery({
        queryKey: ["pet", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/pets/${id}`);
            return res.data;
        },
    });

    return (
        <div className="max-w-6xl mx-auto my-12 p-6 md:p-10 bg-white rounded-2xl shadow-xl border border-gray-100">
            {/* Pet Details Section */}
            <div className="flex flex-col sm:flex-row gap-8 items-start">
                <div className="relative w-full sm:w-1/2 rounded-2xl overflow-hidden shadow-lg border border-gray-200 group">
                    <img
                        src={getPetImage(pet.petImage, pet.petCategory, pet._id)}
                        alt={pet.petName}
                        onError={(e) => handleImageError(e, pet.petCategory)}
                        className="w-full h-80 sm:h-96 object-cover"
                    />
                    <button
                        onClick={() => toggleFavorite(pet)}
                        className="absolute top-4 right-4 p-3 rounded-full bg-white/90 hover:bg-white text-red-500 shadow-md backdrop-blur-sm transition-transform active:scale-95"
                        title={isFavorite(pet._id) ? "Remove from wishlist" : "Save to wishlist"}
                    >
                        {isFavorite(pet._id) ? (
                            <FaHeart className="w-6 h-6 text-red-500" />
                        ) : (
                            <FaRegHeart className="w-6 h-6 text-gray-700 hover:text-red-500" />
                        )}
                    </button>
                    <div className="absolute bottom-4 left-4">
                        <span className="bg-[#1D1D1D]/90 text-[#FBAE02] font-bold text-xs uppercase px-3 py-1.5 rounded-full backdrop-blur-xs">
                            {pet.petCategory || "Pet"}
                        </span>
                    </div>
                </div>

                <div className="flex-1 w-full">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-orange-600">{pet.petName}</h1>
                        <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            <FaCheckCircle className="text-green-600" /> Available for Adoption
                        </span>
                    </div>

                    <p className="text-gray-700 mt-3 text-base leading-relaxed">
                        {pet.shortDescription}
                    </p>

                    {/* Key Attributes Box */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-5 bg-orange-50/60 p-4 rounded-xl border border-orange-100 text-sm">
                        <div>
                            <span className="text-xs text-gray-500 block">Age</span>
                            <strong className="text-gray-900 font-bold">{pet.petAge} Years</strong>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 block">Category</span>
                            <strong className="text-gray-900 font-bold capitalize">{pet.petCategory}</strong>
                        </div>
                        <div>
                            <span className="text-xs text-gray-500 block">Location</span>
                            <strong className="text-gray-900 font-bold">📍 {pet.petLocation}</strong>
                        </div>
                    </div>

                    {/* Health & Temperament Badges */}
                    <div className="mb-6">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1">
                            <FaShieldAlt className="text-orange-500" /> Verified Health & Care Highlights:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            <span className="text-xs bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-md border border-emerald-200">
                                ✓ Fully Vaccinated
                            </span>
                            <span className="text-xs bg-blue-50 text-blue-800 font-semibold px-2.5 py-1 rounded-md border border-blue-200">
                                ✓ Health Checked by Vet
                            </span>
                            <span className="text-xs bg-amber-50 text-amber-900 font-semibold px-2.5 py-1 rounded-md border border-amber-200">
                                ✓ Dewormed & Microchipped
                            </span>
                            <span className="text-xs bg-purple-50 text-purple-800 font-semibold px-2.5 py-1 rounded-md border border-purple-200">
                                ✓ Friendly Temperament
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition duration-200 text-center"
                        >
                            Request Adoption
                        </button>

                        <button
                            onClick={() => setIsCertificateOpen(true)}
                            className="bg-amber-100 hover:bg-[#FBAE02] text-amber-900 hover:text-black font-bold py-3 px-4 rounded-xl shadow-xs transition duration-200 flex items-center gap-2 text-sm"
                            title="Preview Digital Adoption Certificate"
                        >
                            <FaAward className="w-4 h-4 text-orange-600" />
                            Certificate Preview
                        </button>
                    </div>
                </div>
            </div>

            {/* Adoption Certificate Modal */}
            <AdoptionCertificateModal
                isOpen={isCertificateOpen}
                onClose={() => setIsCertificateOpen(false)}
                petData={pet}
                adopterName={user?.displayName || "Prospective Adopter"}
            />

            {/* Long Description */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800">About {pet.petName}</h2>
                <div
                    className="text-gray-700 mt-4"
                    dangerouslySetInnerHTML={{ __html: pet.longDescription }}
                />
            </div>

            {/* Adoption Request Modal */}
            <AdoptionRequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                pet={pet}
                user={user}
                onSuccess={refetch}
            />
        </div>
    );
};

export default PetDetails;
