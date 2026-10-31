import { useNavigate } from "react-router-dom";
import errorBg from "../assets/bgForSignUp.jpg"; // Background image path

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="h-screen w-full flex items-center justify-center bg-cover bg-center text-center relative"
      style={{ backgroundImage: `url(${errorBg})` }}
    >
      {/* Overlay for better visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 text-white px-6 flex flex-col items-center">

        <h1 className="text-6xl md:text-8xl font-extrabold mb-4 drop-shadow-lg">
          Oops!
        </h1>
        <h2 className="text-3xl md:text-5xl font-semibold mb-4 drop-shadow-md">
          Page Not Found
        </h2>
        <p className="text-lg md:text-xl mb-6 drop-shadow-md">
          It looks like the page you’re looking for doesn’t exist or has been moved.
        </p>

        <button
          onClick={() => navigate("/")}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 shadow-lg"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
