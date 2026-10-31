import ParallaxBanner from "../shared/ParallaxBanner";
import servicesImg from '../assets/services.jpg'
import ServicesCategory from "../Components/ServicesCategory";
import FAQSection from "../Components/FAQSection";
import { Helmet } from "react-helmet";

const Services = () => {
    return (
        <div>
            <Helmet>
                <title>Services||PeddyCare</title>
            </Helmet>
            <ParallaxBanner bgImage={servicesImg} heading={'Pet Care, Simplified'} subheading={'Providing expert care and support to keep your pets happy and healthy.'}></ParallaxBanner>
            <ServicesCategory></ServicesCategory>
            <FAQSection></FAQSection>
        </div>
    );
};

export default Services;