import { createBrowserRouter } from "react-router-dom";
import Root from "../Layout.jsx/Root";
import Home from "../Pages/Home";
import PetListing from "../Pages/PetListing";
import DonationCampaigns from "../Pages/DonationCampaigns";
import Login from "../Pages/LogIn";
import SignUp from "../Pages/SignUp";
import ErrorPage from "../Pages/ErrorPage";

const router = createBrowserRouter([
    {
        path:'/',
        element:<Root></Root>,
        errorElement:<ErrorPage></ErrorPage>,
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
            },
            {
                path:'/login',
                element:<Login></Login>
            },
            {
                path:'/sign-up',
                element:<SignUp></SignUp>
            }
        ]
    }
])


export default router;