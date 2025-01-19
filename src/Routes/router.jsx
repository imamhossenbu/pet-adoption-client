import { createBrowserRouter } from "react-router-dom";
import Root from "../Layout.jsx/Root";
import Home from "../Pages/Home";
import PetListing from "../Pages/PetListing";
import DonationCampaigns from "../Pages/DonationCampaigns";

const router = createBrowserRouter([
    {
        path:'/',
        element:<Root></Root>,
        children:[
            {
                path:'/',
                element:<Home></Home>
            },
            {
                path:'/pet-listing',
                element:<PetListing></PetListing>
            },
            {
                path:'/donation-campaigns',
                element:<DonationCampaigns></DonationCampaigns>
            }
        ]
    }
])


export default router;