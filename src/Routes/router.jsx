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
import PetDetails from "../Pages/PetDetails";
import MyAddedPets from "../Pages/Dashboard/MyAddedPet";
import UpdatePet from "../Pages/Dashboard/UpdatePet";
import PrivateRoute from "./PrivateRoute";
import AdoptionRequest from "../Pages/Dashboard/AdoptionRequest";
import CreateDonationCampaign from "../Pages/Dashboard/CreateDonationCampaign";
import MyDonationCampaigns from "../Pages/Dashboard/MyDonationCampaigns";
import DonationDetails from "../Pages/Dashboard/DonationDetails";
import UpdateDonation from "../Pages/Dashboard/UpdateDonation";
import MyDonations from "../Pages/Dashboard/MyDonations";


const router = createBrowserRouter([
    {
        path: '/',
        element: <Root></Root>,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            {
                path: '/',
                element: <Home></Home>
            },
            {
                path: '/pet-listing',
                element: <PetListing></PetListing>
            },
            {
                path: '/pet-details/:id',
                element: <PrivateRoute><PetDetails></PetDetails></PrivateRoute>
            },
            {
                path: '/donation-campaigns',
                element: <DonationCampaigns></DonationCampaigns>
            },

            {
                path: 'donation-details/:id',
                element: <PrivateRoute><DonationDetails></DonationDetails></PrivateRoute>
            },

            {
                path: '/login',
                element: <Login></Login>
            },
            {
                path: '/sign-up',
                element: <SignUp></SignUp>
            },
            {
                path: '/contact',
                element: <ContactUs></ContactUs>
            },
            {
                path: '/services',
                element: <Services></Services>
            }
        ]
    },
    {
        path: '/dashboard',
        element: <Dashboard></Dashboard>,
        children: [

            // user route
            {
                path: 'add-pet',
                element: <PrivateRoute><AddPet></AddPet></PrivateRoute>
            },
            {
                path: 'my-added-pets',
                element: <PrivateRoute><MyAddedPets></MyAddedPets></PrivateRoute>
            },
            {
                path: 'update-pet/:id',
                element: <PrivateRoute><UpdatePet></UpdatePet></PrivateRoute>
            },
            {
                path: 'adoption-request',
                element: <PrivateRoute><AdoptionRequest></AdoptionRequest></PrivateRoute>
            },
            {
                path: 'create-donation-campaign',
                element: <PrivateRoute><CreateDonationCampaign></CreateDonationCampaign></PrivateRoute>
            },
            {
                path: 'my-donation-campaigns',
                element: <PrivateRoute><MyDonationCampaigns></MyDonationCampaigns></PrivateRoute>
            },
            {
                path:'edit-donation/:id',
                element:<PrivateRoute><UpdateDonation></UpdateDonation></PrivateRoute>
            },
            {
                path:'my-donations',
                element:<PrivateRoute><MyDonations></MyDonations></PrivateRoute>
            }

        ]
    }
])


export default router;