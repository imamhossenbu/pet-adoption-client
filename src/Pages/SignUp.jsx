import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import signUpImage from "../assets/signup.png"; // Replace with your signup image path
import bgImg from "../assets/bgForSignUp.jpg";  // Replace with your background image
import { useContext, useState } from "react";
import AuthContext from "../context/authContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SignUp = () => {
  const { signUp, updateUserProfile,googleLogIn } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate=useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    setError("");  // Reset error message

    const form = e.target;
    const name = form.name.value;
    const photo = form.photo.value;
    const email = form.email.value;
    const password = form.password.value;

    // Password validation regex
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 6 characters long, contain one uppercase letter, one number, and one special character."
      );
      return;
    }

    signUp(email, password)
      .then(() => {
        updateUserProfile(name, photo)
          .then(() => {
            toast.success("Sign Up Successful");
            navigate('/')
            form.reset();
          })
          .catch((updateErr) => {
            setError("Profile update failed: " + updateErr.message);
          });
      })
      .catch((signUpErr) => {
        setError("Sign-up failed: " + signUpErr.message);
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

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
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
                name="photo"
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  required
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
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

export default SignUp;
