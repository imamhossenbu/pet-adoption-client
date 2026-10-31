import { Helmet } from "react-helmet";
import ParallaxBanner from "../shared/ParallaxBanner";
import image1 from '../assets/image1.jpg';
import ImpactStats from "../Components/ImpactStats";
import PetsCategory from "../Components/PetsCategory";
import FeaturedPets from "../Components/FeaturedPets";
import MatchmakerBanner from "../Components/MatchmakerBanner";
import HowItWorks from "../Components/HowItWorks";
import UrgentCampaigns from "../Components/UrgentCampaigns";
import CallToAction from "../Components/CallToAction";
import AboutUs from "../Components/AboutUs";
import OurFeatures from "../Components/OurFeatures";
import FAQSection from "../Components/FAQSection";
import Testimonial from "../Components/Testimonial";
import OurTeam from "../Components/OurTeam";

const Home = () => {
    return (
        <div className="overflow-hidden">
            <Helmet>
                <title>Home || PeddyCare</title>
            </Helmet>
            
            {/* Hero Banner */}
            <ParallaxBanner
                bgImage={image1}
                heading={'Find Your New Best Friend'}
                subheading={'Bringing joy, one paw at a time.'}
            />

            {/* Dynamic Real-Time Impact Statistics */}
            <ImpactStats />

            {/* Pet Categories Buttons */}
            <PetsCategory />

            {/* Dynamic Featured Pets Grid (Real-time from Database) */}
            <FeaturedPets />

            {/* Smart Pet Matchmaker AI Quiz Banner */}
            <MatchmakerBanner />

            {/* 4-Step How Adoption Works Guide */}
            <HowItWorks />

            {/* Dynamic Urgent Medical Campaigns from Database */}
            <UrgentCampaigns />

            {/* Call To Action */}
            <CallToAction />

            {/* About Us */}
            <AboutUs />

            {/* Our Features & Care */}
            <OurFeatures />

            {/* Interactive FAQ Accordion */}
            <FAQSection />

            {/* Testimonials */}
            <Testimonial />

            {/* Meet Our Team */}
            <OurTeam />
        </div>
    );
};

export default Home;