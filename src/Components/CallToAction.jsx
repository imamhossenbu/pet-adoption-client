import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import adoptImage from "../assets/image3.jpg";
import HeadingSection from "../shared/HeadingSection";

const CallToAction = () => {
    const navigate = useNavigate();

    return (
        <div className="pt-20 overflow-hidden">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <HeadingSection
                    title="Adopt a Pet Today!"
                    subtitle="Give them the loving home they deserve and experience unconditional love and joy."
                />
            </motion.div>
            <section
                className="relative bg-cover bg-center bg-fixed bg-no-repeat h-[500px] flex items-center justify-center text-center"
                style={{ backgroundImage: `url(${adoptImage})` }}
            >
                {/* Overlay for visibility */}
                <div className="absolute inset-0 bg-black/65"></div>

                <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10 max-w-2xl px-6 text-white"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                        Adopt a Pet, Change a Life!
                    </h2>
                    <p className="text-lg md:text-xl mb-6 text-gray-200">
                        Give these loving animals the home they deserve. Open your heart and make a difference today.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            navigate("/pet-listing");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg transition duration-300"
                    >
                        Find Your Companion
                    </motion.button>
                </motion.div>
            </section>
        </div>
    );
};

export default CallToAction;
