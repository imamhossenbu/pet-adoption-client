import { useNavigate } from "react-router-dom";
import adoptImage from "../assets/image3.jpg";  // Use a real pet adoption image
import HeadingSection from "../shared/HeadingSection";

const CallToAction = () => {
    const navigate = useNavigate();

    return (
        <div className="pt-20">
            <HeadingSection
                title="Adopt a Pet Today!"
                subtitle="Give them the loving home they deserve and experience unconditional love and joy."
            />
            <section
                className="relative bg-cover bg-center  bg-fixed bg-no-repeat h-[500px] flex items-center justify-center text-center"
                style={{ backgroundImage: `url(${adoptImage})` }}
            >
                {/* Overlay for visibility */}
                <div className="absolute inset-0 bg-black bg-opacity-60"></div>

                <div className="relative z-10 max-w-2xl px-6 text-white">
                    <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                        Adopt a Pet, Change a Life!
                    </h2>
                    <p className="text-lg md:text-xl mb-6">
                        Give these loving animals the home they deserve. Open your heart and make a difference today.
                    </p>
                    <button
                        onClick={() => navigate("/adopt")}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300"
                    >
                        Find Your Companion
                    </button>
                </div>
            </section>
        </div>
    );
};

export default CallToAction;
