import ParallaxBanner from "../shared/ParallaxBanner";
import image3 from '../assets/image3.jpg'
import { Helmet } from "react-helmet";

const PetListing = () => {
    return (
        <div>
            <Helmet>
                <title>Pet Listing||PeddyCare</title>
            </Helmet>
            <ParallaxBanner bgImage={image3} heading={'Meet Our Adorable Pets'} subheading={'Find your perfect companion today!'}></ParallaxBanner>
        </div>
    );
};

export default PetListing;