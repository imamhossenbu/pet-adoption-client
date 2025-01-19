import { FaGoogle, FaGithub } from "react-icons/fa";
import loginImage from "../assets/login.png";
import bgImg from '../assets/bgForSignUp.jpg'
import { useContext, useState } from "react";
import AuthContext from "../context/authContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const { logIn,googleLogIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        setError("");  // Reset error message

        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        logIn(email, password)
            .then(() => {
                toast.success('Log In Successful');
                form.reset();
                navigate('/');
            })
            .catch((err) => {
                console.error("Login Error:", err.message);
                setError(err.message);
                toast.error("Failed to log in. Please check your credentials.");
            });
    };

    const handleGoogleLogIn=()=>{
        googleLogIn()
        .then(()=>{
          toast.success('Sign Up With Google Successful');
          navigate('/') 
        })
      }

    return (
        <div
            className="min-h-screen flex items-center justify-center relative py-20"
            style={{
                backgroundImage: `url(${bgImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Overlay to reduce opacity */}
            <div className="absolute inset-0 bg-black opacity-30"></div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden flex max-w-4xl w-full relative z-10">
                {/* Left Side: Image */}
                <div className="w-1/2 hidden md:block">
                    <img
                        src={loginImage}
                        alt="Login Illustration"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Right Side: Login Form */}
                <div className="w-full md:w-1/2 p-8">
                    <h2 className="text-3xl font-semibold text-gray-800 text-center">
                        Welcome Back
                    </h2>
                    <p className="text-gray-500 text-center mt-2 mb-6">
                        Login to your account
                    </p>

                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Email Field */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                                required
                            />
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-300"
                        >
                            Login
                        </button>
                    </form>

                    {/* New Account Link */}
                    <div className="text-center mt-4">
                        <p className="text-gray-600">
                            New here?{" "}
                            <a href="/sign-up" className="text-orange-500 font-medium">
                                Create an Account
                            </a>
                        </p>
                    </div>

                    {/* Alternative Login Methods */}
                    <div className="mt-6">
                        <p className="text-center text-gray-500">Or login with</p>
                        <div className="flex justify-center space-x-4 mt-4">
                            <button onClick={handleGoogleLogIn} className="flex items-center bg-white border border-gray-300 px-4 py-2 rounded-md hover:shadow-md transition duration-300">
                                <FaGoogle className="text-red-500 mr-2" />
                                Google
                            </button>
                            <button className="flex items-center bg-white border border-gray-300 px-4 py-2 rounded-md hover:shadow-md transition duration-300">
                                <FaGithub className="text-gray-800 mr-2" />
                                GitHub
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
