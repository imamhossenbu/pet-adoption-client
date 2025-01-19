import { FaGoogle, FaGithub } from "react-icons/fa";
import signUpImage from "../assets/signup.png"; // Replace with your signup image path
import bgImg from "../assets/bgForSignUp.jpg";  // Replace with your background image

const SignUp = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center py-20 relative"
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
            src={signUpImage}
            alt="Sign Up Illustration"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Side: Sign Up Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-semibold text-gray-800 text-center">
            Create an Account
          </h2>
          <p className="text-gray-500 text-center mt-2 mb-6">
            Sign up to get started
          </p>

          <form className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                required
              />
            </div>

            {/* Photo URL Field */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Photo URL
              </label>
              <input
                type="url"
                placeholder="Enter your photo URL"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
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
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                required
              />
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-300"
            >
              Sign Up
            </button>
          </form>

          {/* Already have an account link */}
          <div className="text-center mt-4">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-orange-500 font-medium">
                Go to Login
              </a>
            </p>
          </div>

          {/* Alternative Sign-Up Methods */}
          <div className="mt-6">
            <p className="text-center text-gray-500">Or sign up with</p>
            <div className="flex justify-center space-x-4 mt-4">
              <button className="flex items-center bg-white border border-gray-300 px-4 py-2 rounded-md hover:shadow-md transition duration-300">
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

export default SignUp;
