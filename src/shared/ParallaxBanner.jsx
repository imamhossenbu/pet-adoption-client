/* eslint-disable react/prop-types */


const ParallaxBanner = ({ bgImage, heading, subheading }) => {
  return (
    <div
      className="relative h-[400px] md:h-[450px] flex items-center justify-center text-center text-white"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',  // Parallax effect
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div> 
      <div className="relative z-10 px-6">
        <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">{heading}</h1>
        <p className="text-lg md:text-2xl mt-2 drop-shadow-md">{subheading}</p>
      </div>
    </div>
  );
};

export default ParallaxBanner;
