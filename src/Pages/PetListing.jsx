import ParallaxBanner from "../shared/ParallaxBanner";
import image3 from '../assets/image3.jpg';
import { Helmet } from "react-helmet";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import Select from "react-select";
import { useInView } from "react-intersection-observer";
import HeadingSection from '../shared/HeadingSection'

const PetListing = () => {
    const axiosSecurePublic = useAxiosPublic();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const { ref, inView } = useInView(); // Intersection Observer hook

    const categoryOptions = [
        { value: "dog", label: "Dogs" },
        { value: "cat", label: "Cats" },
        { value: "rabbit", label: "Rabbits" },
        { value: "bird", label: "Birds" },
    ];

    // Fetch data using useInfiniteQuery
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: ['pets', selectedCategory, searchTerm],
        queryFn: async ({ pageParam = 1 }) => {
            const res = await axiosSecurePublic.get(`/pets?page=${pageParam}&limit=10`, {
                params: {
                    category: selectedCategory?.value || undefined,
                    search: searchTerm || undefined,
                },
            });
            return res.data;
        },
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.hasMore ? allPages.length + 1 : undefined;
        },
    });


    // Fetch next page when inView becomes true
    if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error fetching pets. Please try again later.</div>;
    }

    // Combine all pages of data
    const pets = data?.pages.flatMap((page) => page.pets) || [];

    return (
        <div>
            <Helmet>
                <title>Pet Listing || PeddyCare</title>
            </Helmet>
            <ParallaxBanner bgImage={image3} heading={'Meet Our Adorable Pets'} subheading={'Find your perfect companion today!'}></ParallaxBanner>
            <div className="py-20">
                <HeadingSection title='Find Your Perfect Companion' subtitle='Explore a variety of pets waiting to become a part of your family.Filter by category or search to find your perfect match!'></HeadingSection>
                <div className="container mx-auto px-4 md:px-10">
                    {/* Search and Category Filter */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <input
                            type="text"
                            placeholder="Search pets by name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="p-2 border rounded-md w-full md:w-1/3"
                        />
                        <Select
                            options={categoryOptions}
                            isClearable
                            placeholder="Filter by category"
                            onChange={(selectedOption) => setSelectedCategory(selectedOption)}
                            className="w-full md:w-1/3"
                        />
                    </div>

                    {/* Pet Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pets.map((pet) => (
                            <div
                                key={pet.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 group relative"
                            >
                                <div className="relative">
                                    <img
                                        src={pet.petImage}
                                        alt={pet.petName}
                                        className="w-full h-64 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300 flex justify-center items-center">
                                        <button
                                            className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-300"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-xl font-bold text-orange-600 mb-2">{pet.petName}</h3>
                                    <div className="flex items-center text-gray-600 mb-2">
                                        <span className="mr-2">📍</span>
                                        <span>{pet.petLocation}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-gray-600">
                                        <span>Age: {pet.petAge} years</span>
                                        <span>Birth: {new Date().getFullYear() - parseInt(pet.petAge)}</span>
                                    </div>
                                    <div className="sm:hidden mt-4">
                                        <button
                                            className="bg-orange-500 text-white w-full py-2 rounded-md hover:bg-orange-600 transition duration-300"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Loader for Infinite Scroll */}
                    <div ref={ref} className="text-center mt-8">
                        {isFetchingNextPage && <div>Loading more pets...</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetListing;
