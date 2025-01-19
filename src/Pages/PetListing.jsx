import ParallaxBanner from "../shared/ParallaxBanner";
import image3 from '../assets/image3.jpg'

const PetListing = () => {
    return (
        <div>
            <ParallaxBanner bgImage={image3} heading={'Meet Our Adorable Pets'} subheading={'Find your perfect companion today!'}></ParallaxBanner>
        </div>
    );
};

export default PetListing;