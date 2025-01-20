import ParallaxBanner from "../shared/ParallaxBanner";
import image1 from '../assets/image1.jpg'
import CallToAction from "../Components/CallToAction";
import AboutUs from "../Components/AboutUs";
import OurFeatures from "../Components/OurFeatures";
import Testimonial from "../Components/Testimonial";
import OurTeam from "../Components/OurTeam";
import { Helmet } from "react-helmet";

const Home = () => {
    return (
        <div>
            <Helmet>
                <title>Home||PeddyCare</title>
            </Helmet>
            <ParallaxBanner bgImage={image1} heading={'Find Your New Best Friend'} subheading={'Bringing joy, one paw at a time.'}></ParallaxBanner>
            <CallToAction></CallToAction>
            <AboutUs></AboutUs>
            <OurFeatures></OurFeatures>
            <Testimonial></Testimonial>
            <OurTeam></OurTeam>
        </div>
    );
};

export default Home;