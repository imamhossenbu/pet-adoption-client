import newsletterBg from "../assets/newsletter.jpg";  // Replace with your real image

const Newsletter = () => {
  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat  py-20"
      style={{ backgroundImage: `url(${newsletterBg})` }}
    >
      {/* Overlay to enhance readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 text-center text-white px-6">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
          Subscribe to our newsletter
        </h2>
        <p className="text-lg md:text-xl mb-6">
          We send e-mails once a month, we never send Spam!
        </p>

        {/* Subscription Form */}
        <form className="max-w-lg mx-auto flex flex-col md:flex-row items-center">
          <input
            type="email"
            placeholder="Email"
            className="w-full md:flex-1 px-4 py-3 rounded-l-lg border-0 focus:ring-2 focus:ring-orange-400 text-gray-900"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-r-lg transition duration-300"
          >
            SUBSCRIBE
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
