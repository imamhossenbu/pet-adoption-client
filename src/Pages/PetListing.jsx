import ParallaxBanner from "../shared/ParallaxBanner";
import image3 from "../assets/image3.jpg";
import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import Select from "react-select";
import HeadingSection from "../shared/HeadingSection";
import { NavLink, useSearchParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import { useFavorites } from "../context/FavoritesContext";
import { FaHeart, FaRegHeart, FaPaw, FaTimes } from "react-icons/fa";
import { getPetImage, handleImageError } from "../utils/imageFallback";

const categoryOptions = [
    { value: "dog", label: "Dogs" },
    { value: "cat", label: "Cats" },
    { value: "rabbit", label: "Rabbits" },
    { value: "bird", label: "Birds" },
];

const PetListing = () => {
    const axiosSecurePublic = useAxiosPublic();
    const { toggleFavorite, isFavorite } = useFavorites();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [page, setPage] = useState(1); // Track the current page

    // Read and sync category from URL query parameters (e.g. ?category=cat)
    const categoryParam = searchParams.get("category");

    useEffect(() => {
        if (categoryParam) {
            const matched = categoryOptions.find(
                (opt) => opt.value.toLowerCase() === categoryParam.toLowerCase()
            );
            setSelectedCategory(matched || null);
        } else {
            setSelectedCategory(null);
        }
        setPage(1);
    }, [categoryParam]);

    // Fetch paginated data using TanStack Query
    const {
        data,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["pets", selectedCategory?.value, searchTerm, page], // Depend on category, searchTerm, and page
        queryFn: async () => {
            const res = await axiosSecurePublic.get(`/pets`, {
                params: {
                    page,
                    limit: 9,
                    category: selectedCategory?.value || undefined,
                    search: searchTerm || undefined,
                },
            });
            return res.data;
        },
        keepPreviousData: true,
    });

    const pets = data?.pets || [];
    const hasMore = data?.hasMore || false; // Check if more pages exist

    // Handle category change
    const handleCategoryChange = (selectedOption) => {
        setSelectedCategory(selectedOption);
        setPage(1);
        if (selectedOption?.value) {
            setSearchParams({ category: selectedOption.value });
        } else {
            setSearchParams({});
        }
    };

    // Quick filter button helper
    const handleQuickCategorySelect = (categoryValue) => {
        if (!categoryValue) {
            handleCategoryChange(null);
        } else {
            const matched = categoryOptions.find((opt) => opt.value === categoryValue);
            handleCategoryChange(matched || null);
        }
    };

    // Handle search term change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const handleNextPage = () => {
        if (hasMore) setPage((prev) => prev + 1);
    };

    const handlePreviousPage = () => {
        if (page > 1) setPage((prev) => prev - 1);
    };

    return (
        <div>
            <Helmet>
                <title>Pet Listing || PeddyCare</title>
            </Helmet>
            <ParallaxBanner
                bgImage={image3}
                heading="Meet Our Adorable Pets"
                subheading="Find your perfect companion today!"
            />
            <div className="py-20">
                <HeadingSection
                    title="Find Your Perfect Companion"
                    subtitle="Explore a variety of pets waiting to become a part of your family. Filter by category or search to find your perfect match!"
                />
                <div className="container mx-auto px-4 md:px-10">
                    {/* Matchmaker Quiz Teaser Banner */}
                    <div className="mb-8 p-4 md:p-6 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                        <div className="flex items-center gap-3">
                            <span className="p-3 bg-[#FBAE02] text-black rounded-xl text-xl shadow-xs">
                                <FaPaw />
                            </span>
                            <div>
                                <h3 className="font-extrabold text-gray-900 text-base md:text-lg flex items-center gap-2">
                                    Need help deciding? Try Smart Matchmaker!
                                    <span className="text-[10px] bg-orange-600 text-white font-bold px-2 py-0.5 rounded-full uppercase">New</span>
                                </h3>
                                <p className="text-xs text-gray-600">
                                    Answer 5 quick lifestyle questions to find your dream companion with compatibility scores.
                                </p>
                            </div>
                        </div>
                        <NavLink
                            to="/pet-matchmaker"
                            className="bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-bold text-xs md:text-sm py-2.5 px-5 rounded-xl transition duration-200 shadow whitespace-nowrap flex items-center gap-1.5"
                        >
                            Take 1-Min Quiz →
                        </NavLink>
                    </div>

                    {/* Quick Category Filter Pills */}
                    <div className="mb-6 flex flex-wrap items-center gap-2.5">
                        <span className="text-xs font-bold text-gray-500 mr-1 uppercase tracking-wider">Quick Filter:</span>
                        <button
                            type="button"
                            onClick={() => handleQuickCategorySelect(null)}
                            className={`px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition-all duration-200 border ${
                                !selectedCategory
                                    ? "bg-[#1D1D1D] text-[#FBAE02] border-[#1D1D1D] shadow-sm"
                                    : "bg-white text-gray-700 border-gray-200 hover:border-orange-300"
                            }`}
                        >
                            🐾 All Pets
                        </button>
                        {[
                            { value: "dog", label: "🐕 Dogs" },
                            { value: "cat", label: "🐈 Cats" },
                            { value: "rabbit", label: "🐇 Rabbits" },
                            { value: "bird", label: "🦜 Birds" },
                        ].map((cat) => {
                            const isActive = selectedCategory?.value === cat.value;
                            return (
                                <button
                                    key={cat.value}
                                    type="button"
                                    onClick={() => handleQuickCategorySelect(cat.value)}
                                    className={`px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold transition-all duration-200 border ${
                                        isActive
                                            ? "bg-[#FBAE02] text-black border-[#FBAE02] shadow-sm"
                                            : "bg-white text-gray-700 border-gray-200 hover:border-orange-300"
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            );
                        })}

                        {selectedCategory && (
                            <button
                                type="button"
                                onClick={() => handleCategoryChange(null)}
                                className="ml-auto inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-bold px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
                            >
                                <FaTimes className="w-3 h-3" /> Clear Filter
                            </button>
                        )}
                    </div>

                    {/* Search and Category Filter Inputs */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <input
                            type="text"
                            placeholder="Search pets by name..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="p-3 border border-gray-200 rounded-xl w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
                        />
                        <div className="w-full md:w-1/3">
                            <Select
                                options={categoryOptions}
                                isClearable
                                placeholder="Select category dropdown..."
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                className="react-select-container text-sm"
                            />
                        </div>
                    </div>

                    {/* Display Pets */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <div key={n} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col">
                                    <Skeleton height={220} className="rounded-xl mb-4" />
                                    <div className="flex justify-between items-center mb-2">
                                        <Skeleton width={140} height={22} className="rounded" />
                                        <Skeleton width={70} height={18} className="rounded-full" />
                                    </div>
                                    <Skeleton width={150} height={14} className="mb-3 rounded" />
                                    <Skeleton count={2} height={12} className="mb-4 rounded" />
                                    <Skeleton height={42} className="rounded-xl mt-auto" />
                                </div>
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="text-center py-10 text-red-500 font-semibold">Error fetching pets. Please try again later.</div>
                    ) : pets.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 max-w-md mx-auto">
                            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                                🐾
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">No Pets Found</h3>
                            <p className="text-xs text-gray-500 mb-6">
                                We couldn&lsquo;t find any unadopted pets matching your current filter. Try selecting another category or clearing your search.
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    handleCategoryChange(null);
                                    setSearchTerm("");
                                }}
                                className="bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition duration-200 shadow-xs"
                            >
                                Reset All Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pets.map((pet) => (
                                <div
                                    key={pet._id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 group relative transform hover:scale-105 transition duration-300 ease-in-out"
                                >
                                    {/* Favorite Wishlist Button */}
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            toggleFavorite(pet);
                                        }}
                                        className="absolute top-3 right-3 z-20 p-2.5 rounded-full bg-white/90 hover:bg-white text-red-500 shadow-md backdrop-blur-sm transition-transform active:scale-90"
                                        title={isFavorite(pet._id) ? "Remove from favorites" : "Save to favorites"}
                                        aria-label="Toggle favorite"
                                    >
                                        {isFavorite(pet._id) ? (
                                            <FaHeart className="w-4 h-4 text-red-500" />
                                        ) : (
                                            <FaRegHeart className="w-4 h-4 text-gray-700 hover:text-red-500" />
                                        )}
                                    </button>

                                    {/* Category Badge */}
                                    <div className="absolute top-3 left-3 z-10">
                                        <span className="bg-[#1D1D1D]/80 backdrop-blur-xs text-[#FBAE02] font-extrabold text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                                            {pet.petCategory || "Pet"}
                                        </span>
                                    </div>

                                    {/* Image Section */}
                                    <img
                                        src={getPetImage(pet.petImage, pet.petCategory, pet._id)}
                                        alt={pet.petName}
                                        onError={(e) => handleImageError(e, pet.petCategory)}
                                        className="w-full h-64 object-cover"
                                    />

                                    {/* Button Overlay (Only for Medium+ Devices) */}
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 sm:flex sm:justify-center sm:items-center transition duration-300 ease-in-out hidden sm:block">
                                        <NavLink
                                            to={`/pet-details/${pet._id}`}
                                            onClick={() => {
                                                window.scrollTo({ top: 0, behavior: "smooth" });
                                            }}
                                            className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-300 opacity-0 group-hover:opacity-100 font-bold"
                                        >
                                            View Details
                                        </NavLink>
                                    </div>

                                    {/* Pet Details */}
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="text-xl font-bold text-orange-600">
                                                {pet.petName}
                                            </h3>
                                            <span className="text-[11px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-md">
                                                ✓ Vaccinated
                                            </span>
                                        </div>
                                        <div className="flex items-center text-gray-600 mb-2">
                                            <span className="mr-2">📍</span>
                                            <span>{pet.petLocation}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-gray-600 text-sm">
                                            <span>Age: {pet.petAge} years</span>
                                            <span>
                                                Birth: {new Date().getFullYear() - parseInt(pet.petAge)}
                                            </span>
                                        </div>

                                        {/* Always Visible Button on Small Devices */}
                                        <div className="block sm:hidden mt-4">
                                            <NavLink
                                                to={`/pet-details/${pet._id}`}
                                                onClick={() => {
                                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                                }}
                                                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition duration-300 w-full text-center block font-bold"
                                            >
                                                View Details
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    <div className="flex justify-center items-center mt-8 gap-4">
                        <button
                            onClick={handlePreviousPage}
                            disabled={page === 1}
                            className={`px-4 py-2 rounded-md ${page === 1
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-orange-500 text-white hover:bg-orange-600"
                                }`}
                        >
                            Previous
                        </button>
                        <span className="text-gray-600 font-semibold">Page {page}</span>
                        <button
                            onClick={handleNextPage}
                            disabled={!hasMore}
                            className={`px-4 py-2 rounded-md ${!hasMore
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-orange-500 text-white hover:bg-orange-600"
                                }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetListing;
