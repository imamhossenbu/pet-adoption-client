# Pet Adoption Platform - Client Side

Welcome to the **Pet Adoption Platform**, a web application that connects individuals with pets in need of loving homes. This platform allows users to browse, adopt, and contribute to pet adoption campaigns, making it easier to find the perfect pet companion.

## 🚀 Live URL

[Pet Adoption Platform](https://pet-adoption-3d21e.web.app/)

## 🎯 Project Purpose

The goal of this project is to leverage technology to create a user-friendly and responsive platform for pet adoption. Users can search for pets, adopt them, and contribute to donation campaigns to support pets in need.

## 🏗 Key Features

- **User Authentication:**
  - Email/password registration & login
  - Social authentication (Google, Facebook, GitHub)
  - Role-based access (User/Admin)
- **Pet Listing Page:**
  - View available pets in a grid layout
  - Search by pet name or filter by category
  - Infinite scrolling for seamless browsing
- **Pet Details Page:**
  - Detailed view with an "Adopt" button
  - Adoption request modal with user details
- **Donation Campaigns:**
  - Browse and contribute to donation campaigns
  - Stripe payment integration
- **User Dashboard:**
  - Add and manage pets
  - Track adoption requests and donations
- **Admin Dashboard:**
  - Manage users, pets, and donations
  - Assign admin roles
- **UI/UX Enhancements:**
  - Fully responsive design
  - Dark/light mode toggle
  - Skeleton loaders for smooth UX

## 🛠 Technologies Used

### Frontend Stack

- **React.js** - Core library for building the UI
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Shadcn-ui** - Component library for UI elements
- **TanStack Query** - Data fetching and caching
- **Firebase Authentication** - User authentication
- **React Hook Form** - Form handling
- **React Query** - State and data management
- **Stripe API** - Payment integration
- **Cloudinary** - Image upload
- **React-Quill** - WYSIWYG text editor

## ⚙ Installation & Setup

### Prerequisites

Ensure you have the following installed:

- Node.js (v16+)
- npm or yarn

### Steps to Run the Project

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pet-adoption-client.git
Navigate to the project directory:
bash
Copy
Edit
cd pet-adoption-client
Install dependencies:
bash
Copy
Edit
npm install
Create a .env file in the root directory and add your Firebase and API configurations:
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
Start the development server:
npm run dev
Open the app in your browser at http://localhost:5173
📂 Project Structure:-
pet-adoption-client
│-- public
│-- src
│   │-- components
│   │-- pages
│   │-- context
│   │-- hooks
│   │-- services
│   │-- styles
│   └-- utils
│-- .env
│-- package.json
│-- README.md
🔐 Security Measures
Environment variables are used to secure sensitive data such as Firebase and MongoDB credentials.
JWT tokens are used for authentication and authorization.
Firebase domain authorization for deployment security.
🚀 Deployment
The project is deployed on Firebase Hosting. Ensure to:

Run the build command:
npm run build
Deploy to Firebase:
bash
Copy
Edit
firebase deploy
📜 Meaningful Commits
Ensure at least 20 meaningful commits with descriptive messages following conventional commit style.
Example commit message:
csharp
Copy
Edit
feat: add pet adoption form with validation
📄 Additional Information
Admin Credentials:

Email: admin@petadoption.com
Password: admin123
Links:

Client Side Repository
Server Side Repository
🙏 Acknowledgements
Thanks to all contributors who made this project possible. Special thanks to the open-source community for providing valuable tools and resources.

