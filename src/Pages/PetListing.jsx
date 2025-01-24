import ParallaxBanner from "../shared/ParallaxBanner";
import image3 from "../assets/image3.jpg";
import { Helmet } from "react-helmet";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import Select from "react-select";
import HeadingSection from "../shared/HeadingSection";
import { NavLink } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

const PetListing = () => {
    const axiosSecurePublic = useAxiosPublic();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [page, setPage] = useState(1); // Track the current page

    const categoryOptions = [
        { value: "dog", label: "Dogs" },
        { value: "cat", label: "Cats" },
        { value: "rabbit", label: "Rabbits" },
        { value: "bird", label: "Birds" },
    ];

    // Fetch paginated data using TanStack Query
    const {
        data,
        isLoading,
        isError,
        isFetching,
    } = useQuery({
        queryKey: ["pets", selectedCategory, searchTerm, page], // Depend on category, searchTerm, and page
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
        keepPreviousData: true, // Keep previous data while fetching new data
    });

    const pets = data?.pets || [];
    const hasMore = data?.hasMore || false; // Check if more pages exist

    // Handle category change
    const handleCategoryChange = (selectedOption) => {
        setSelectedCategory(selectedOption);
        setPage(1); // Reset to the first page when the category changes
    };

    // Handle search term change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(1); // Reset to the first page when the search term changes
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
                    {/* Search and Category Filter */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <input
                            type="text"
                            placeholder="Search pets by name"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="p-2 border rounded-md w-full md:w-1/3"
                        />
                        <Select
                            options={categoryOptions}
                            isClearable
                            placeholder="Filter by category"
                            onChange={handleCategoryChange}
                            className="w-full md:w-1/3"
                        />
                    </div>

                    {/* Display Pets */}
                    {isLoading || isFetching ? (
                        <div className="fixed inset-0 bg-gray-100 flex justify-center items-center z-50">
                            <div className="w-full max-w-md p-4">
                                <Skeleton count={5} height={30} className="mb-2" />
                                <Skeleton count={1} height={50} className="mb-4" />
                                <Skeleton count={3} height={20} className="mb-2" />
                            </div>
                        </div>
                    ) : isError ? (
                        <div>Error fetching pets. Please try again later.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pets.map((pet) => (
                                <div
                                    key={pet._id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 group relative transform hover:scale-105 transition duration-300 ease-in-out"
                                >
                                    {/* Image Section */}
                                    <img
                                        src={pet.petImage}
                                        alt={pet.petName}
                                        className="w-full h-64 object-cover"
                                    />

                                    {/* Button Overlay (Only for Medium+ Devices) */}
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 sm:flex sm:justify-center sm:items-center transition duration-300 ease-in-out hidden sm:block">
                                        <NavLink
                                            to={`/pet-details/${pet._id}`}
                                            onClick={() => {
                                                window.scrollTo({ top: 0, behavior: "smooth" });
                                            }}
                                            className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-300 opacity-0 group-hover:opacity-100"
                                        >
                                            View Details
                                        </NavLink>
                                    </div>

                                    {/* Pet Details */}
                                    <div className="p-4">
                                        <h3 className="text-xl font-bold text-orange-600 mb-2">
                                            {pet.petName}
                                        </h3>
                                        <div className="flex items-center text-gray-600 mb-2">
                                            <span className="mr-2">📍</span>
                                            <span>{pet.petLocation}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-gray-600">
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
                                                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition duration-300 w-full text-center"
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
