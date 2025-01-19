import ParallaxBanner from "../shared/ParallaxBanner";
import image1 from '../assets/image1.jpg'
import CallToAction from "../Components/CallToAction";
import AboutUs from "../Components/AboutUs";
import OurFeatures from "../Components/OurFeatures";
import Testimonial from "../Components/Testimonial";

const Home = () => {
    return (
        <div>
            <ParallaxBanner bgImage={image1} heading={'Find Your New Best Friend'} subheading={'Bringing joy, one paw at a time.'}></ParallaxBanner>
            <CallToAction></CallToAction>
            <AboutUs></AboutUs>
            <OurFeatures></OurFeatures>
            <Testimonial></Testimonial>
        </div>
    );
};

export default Home;