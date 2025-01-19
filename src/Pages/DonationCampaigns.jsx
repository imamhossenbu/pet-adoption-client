import ParallaxBanner from "../shared/ParallaxBanner";
import image5 from '../assets/image5.jpg'

const DonationCampaigns = () => {
    return (
        <div>
            <ParallaxBanner bgImage={image5} heading={'Give Hope, Save Lives'} subheading={'Every little contribution makes a big difference in their lives'}></ParallaxBanner>
        </div>
    );
};

export default DonationCampaigns;