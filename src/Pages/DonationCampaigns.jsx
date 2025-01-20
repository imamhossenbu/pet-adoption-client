import ParallaxBanner from "../shared/ParallaxBanner";
import image5 from '../assets/image5.jpg'
import { Helmet } from "react-helmet";

const DonationCampaigns = () => {
    return (
        <div>
            <Helmet>
                <title>Donation||PeddyCare</title>
            </Helmet>
            <ParallaxBanner bgImage={image5} heading={'Give Hope, Save Lives'} subheading={'Every little contribution makes a big difference in their lives'}></ParallaxBanner>
        </div>
    );
};

export default DonationCampaigns;