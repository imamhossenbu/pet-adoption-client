# PeddyCare - Pet Adoption Platform (Client Side) 🐾

Welcome to **PeddyCare**, a modern, responsive full-stack pet adoption and rescue support platform built to connect rescued animals with loving forever homes.

---

## 🚀 Live Demonstration & Links
- **Live Website:** [https://pet-adoption-3d21e.web.app](https://pet-adoption-3d21e.web.app/)
- **Client Repository:** [https://github.com/imamhossenbu/pet-adoption-client](https://github.com/imamhossenbu/pet-adoption-client)
- **Server Repository:** [https://github.com/imamhossenbu/pet-adoption-server](https://github.com/imamhossenbu/pet-adoption-server)

---

## 🎯 Key Features

### 🐶 Public & Community Features
- **Dynamic Pet Catalog:** Explore pets categorized with instant regex filtering, live search by name, and infinite scroll pagination.
- **Detailed Pet Profiles:** Pet descriptions with image galleries, age, gender, adoption fee, location, and an interactive **Adopt Me** modal.
- **Donation Campaigns:** View verified medical and shelter campaigns with live Stripe credit card checkout and funding progress bars.
- **Care Specialists & Leadership:** Interactive Swiper carousel showcasing certified veterinarians and trainers synced dynamically with the backend.
- **Newsletter Subscription:** Seamless email subscription integrated directly with MongoDB and duplicate protection.
- **Dark / Light Theme:** Custom theme toggler with persistent localStorage state.

### 🛡️ User & Admin Dashboard
- **Role-Based Routing:** Strict protected routes (`AdminRoute` & `PrivateRoute`) backed by JWT authorization.
- **User Dashboard:**
  - Add adoptable pets with direct drag-and-drop Cloudinary file uploads.
  - Track user-submitted adoption applications and incoming requests.
  - Create and manage donation campaigns with real-time donation logs.
- **Admin Command Center:**
  - **Overview Analytics:** Key platform KPI cards and visual donation charts.
  - **User Directory:** Real-time role switching (`Admin` / `User`), status control (`🟢 Active`, `🟡 Suspended`, `🔴 Banned`), and deletion.
  - **All Pets & Campaigns:** Moderation tables with adoption status toggle and campaign pause controls.
  - **Care Specialists & Team:** Comprehensive team management with direct portrait uploads and social link editing.
  - **Newsletter Broadcast:** Manage subscriber lists, one-click copy active emails, and send rich HTML broadcast newsletters via Nodemailer.
  - **Pet Categories & FAQs:** Dynamic CRUD management for category tags and expandable FAQ sections.

---

## 🛠️ Frontend Tech Stack

- **Framework:** React.js 18 + Vite
- **Styling:** Tailwind CSS + DaisyUI
- **State & Caching:** TanStack React Query v5
- **Routing:** React Router DOM v6
- **Authentication:** Firebase Authentication (Email/Password, Google)
- **Forms & Inputs:** React Hook Form + React Quill (WYSIWYG)
- **Animations:** Framer Motion, Swiper.js, Lottie React
- **Payments:** Stripe Elements (`@stripe/react-stripe-js`)
- **Asset Uploads:** Cloudinary direct drag-and-drop integration
- **Notifications:** SweetAlert2 + React Hot Toast

---

## ⚙️ Installation & Local Setup

### 1. Prerequisites
- Node.js (v18+)
- npm or yarn

### 2. Steps to Run Locally
```bash
# Clone repository
git clone https://github.com/imamhossenbu/pet-adoption-client.git
cd pet-adoption-client

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🔐 Environment Variables (`.env.local`)

```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
```

---

## 📄 Credentials & Access

- **Admin Account:** `admin@petadoption.com`
- **Password:** `admin123`

---

## 📜 License
This project is open-source and licensed under the [MIT License](LICENSE).
