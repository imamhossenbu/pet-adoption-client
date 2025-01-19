import ParallaxBanner from "../shared/ParallaxBanner";
import image1 from '../assets/image1.jpg'

const Home = () => {
    return (
        <div>
            <ParallaxBanner bgImage={image1} heading={'Find Your New Best Friend'} subheading={'Bringing joy, one paw at a time.'}></ParallaxBanner>
        </div>
    );
};

export default Home;