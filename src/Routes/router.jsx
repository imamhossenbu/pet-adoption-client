import { createBrowserRouter } from "react-router-dom";
import Root from "../Layout.jsx/Root";
import Home from "../Pages/Home";
import PetListing from "../Pages/PetListing";
import DonationCampaigns from "../Pages/DonationCampaigns";
import Login from "../Pages/LogIn";
import SignUp from "../Pages/SignUp";
import ErrorPage from "../Pages/ErrorPage";
import ContactUs from "../Pages/ContactUs";
import Services from "../Pages/Services";
import Dashboard from "../Pages/Dashboard/Dashboard";
import AddPet from "../Pages/Dashboard/AddPet";


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
            },
            {
                path:'/contact',
                element:<ContactUs></ContactUs>
            },
            {
                path:'/services',
                element:<Services></Services>
            }
        ]
    },
    {
        path:'/dashboard',
        element:<Dashboard></Dashboard>,
        children:[

            // user route
            {
                path:'add-pet',
                element:<AddPet></AddPet>
            },
        ]
    }
])


export default router;