/* eslint-disable react/prop-types */
const HeadingSection = ({ title, subtitle }) => {
    return (
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 relative inline-block">
          {title}
          <span className="block w-24 md:w-32 h-1 bg-orange-500 mx-auto mt-2"></span>
        </h2>
        <p className="mt-4 text-lg  text-gray-600 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>
    );
  };
  
  export default HeadingSection;
  