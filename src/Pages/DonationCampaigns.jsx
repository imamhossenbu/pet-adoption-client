import ParallaxBanner from "../shared/ParallaxBanner";
import image5 from '../assets/image5.jpg'
import { Helmet } from "react-helmet";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import { useInView } from "react-intersection-observer";
import { NavLink } from "react-router-dom";
import HeadingSection from '../shared/HeadingSection'
import DonationProgress from "../shared/DonationProgress";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import { getPetImage, handleImageError } from "../utils/imageFallback";
import EmptyState from "../Components/EmptyState";
import { FaHandHoldingHeart } from "react-icons/fa";

const DonationCampaigns = () => {
    const axiosSecurePublic = useAxiosPublic();
    const { ref, inView } = useInView();
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch donation campaigns with infinite scroll
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: ["donations", searchTerm],
        queryFn: async ({ pageParam = 1 }) => {
            const res = await axiosSecurePublic.get("/donations", {
                params: {
                    page: pageParam,
                    limit: 6,  // Load 6 items per page
                    search: searchTerm || undefined,
                },
            });
            return res.data;
        },
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.hasMore ? allPages.length + 1 : undefined;
        },
    });

    // Trigger fetchNextPage when inView is true
    if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
    }

    // Combine paginated data
    const campaigns = data?.pages.flatMap((page) => page.donations) || [];

    return (
        <>
            <div>
                <Helmet>
                    <title>Donation || PeddyCare</title>
                </Helmet>
                <ParallaxBanner bgImage={image5} heading={'Give Hope, Save Lives'} subheading={'Every little contribution makes a big difference in their lives'}></ParallaxBanner>
            </div>


            <div className="container mx-auto px-4 md:px-10 py-20">
                <HeadingSection title={'Support Our Furry Friends'} subtitle={'Every Contribution Helps Bring Them a Brighter Future. Join Our Mission to Make a Difference!'}></HeadingSection>
                {/* Search Bar */}
                <div className="mb-8 flex justify-center">
                    <input
                        type="text"
                        placeholder="Search by pet name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-1/2 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                    />
                </div>

                {/* Donation Campaign Cards */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="bg-white rounded-2xl p-5 shadow border border-gray-100 flex flex-col">
                                <Skeleton height={224} className="rounded-xl mb-4" />
                                <Skeleton width={160} height={24} className="rounded mb-2" />
                                <Skeleton count={2} height={12} className="rounded mb-4" />
                                <div className="flex justify-between items-center p-3.5 bg-orange-50/50 rounded-xl mb-4 border border-orange-100">
                                    <div className="w-1/2">
                                        <Skeleton width={60} height={10} className="mb-1" />
                                        <Skeleton width={90} height={22} className="mb-1" />
                                        <Skeleton width={70} height={10} />
                                    </div>
                                    <Skeleton circle width={56} height={56} />
                                </div>
                                <Skeleton height={44} className="rounded-xl mt-auto" />
                            </div>
                        ))}
                    </div>
                ) : isError ? (
                    <div className="text-center py-10 text-red-500 font-semibold">Error fetching donation campaigns. Please try again later.</div>
                ) : campaigns.length === 0 ? (
                    <EmptyState
                        icon={FaHandHoldingHeart}
                        badge="No Campaigns"
                        title="No Donation Campaigns Found"
                        description={searchTerm ? `No campaigns found matching "${searchTerm}". Try another search term.` : "There are currently no active donation campaigns."}
                        actionText={searchTerm ? "Clear Search" : undefined}
                        actionOnClick={searchTerm ? () => setSearchTerm("") : undefined}
                        className="my-10"
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {campaigns.map((campaign) => (
                        <div
                            key={campaign._id}
                            className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 transition-transform duration-300 hover:scale-105"
                        >
                            <img
                                src={getPetImage(campaign.petImage, "dog", campaign._id)}
                                alt={campaign.petName}
                                onError={(e) => handleImageError(e, "dog")}
                                className="w-full h-56 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-orange-500 mb-2">
                                    {campaign.petName}
                                </h3>
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div>
                                        <p className="text-gray-600 mb-2">
                                            <strong>Max Donation:</strong> ${campaign.maxDonationAmount}
                                        </p>
                                        <p className="text-gray-600 mb-4">
                                            <strong>Donated Amount:</strong> ${campaign.donatedAmount ? campaign.donatedAmount : 0}
                                        </p>
                                    </div>

                                    {/* Progress Bar */}
                                    <div>
                                        <DonationProgress donatedAmount={campaign.donatedAmount} maxDonationAmount={campaign.maxDonationAmount}></DonationProgress>
                                    </div>
                                </div>

                                <NavLink
                                    to={`/donation-details/${campaign._id}`}
                                    className="mt-4 inline-block bg-orange-500 text-white py-2 px-6 rounded-md hover:bg-orange-600 transition duration-300"
                                >
                                    View Details
                                </NavLink>
                            </div>
                        </div>
                    ))}
                </div>
                )}

                {/* Infinite Scroll Loader */}
                <div ref={ref} className="text-center mt-8">
                    {isFetchingNextPage && <div>Loading more campaigns...</div>}
                </div>
            </div>
        </>
    );
};

export default DonationCampaigns;
