import { useRef } from "react";
import { FaTimes, FaPrint, FaAward, FaPaw, FaCheckCircle } from "react-icons/fa";

const AdoptionCertificateModal = ({ isOpen, onClose, petData, adopterName }) => {
  const certificateRef = useRef();

  if (!isOpen || !petData) return null;

  const certificateId = `PEDDY-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateFormatted = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-70 flex items-center justify-center p-4">
      {/* Styles for clean PDF printing */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-certificate, #printable-certificate * {
            visibility: visible;
          }
          #printable-certificate {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            margin: 0;
            padding: 20px;
            background: white !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col">
        {/* Modal Controls (Hidden in print) */}
        <div className="no-print bg-[#1D1D1D] text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaAward className="text-[#FBAE02] w-5 h-5" />
            <span className="font-bold text-sm tracking-wide">
              Official Pet Adoption Certificate
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-[#FBAE02] hover:bg-orange-500 text-black font-bold text-xs py-1.5 px-3.5 rounded-lg flex items-center gap-1.5 transition shadow"
            >
              <FaPrint className="w-3.5 h-3.5" /> Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1 rounded-md transition"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Area */}
        <div className="p-4 sm:p-8 bg-amber-50/40 flex justify-center overflow-auto">
          <div
            id="printable-certificate"
            ref={certificateRef}
            className="w-full bg-white border-8 border-double border-[#D1A054] p-6 sm:p-10 rounded-xl relative shadow-md text-center max-w-2xl"
          >
            {/* Background Paw watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
              <FaPaw size={320} className="text-[#D1A054]" />
            </div>

            {/* Corner Ornaments */}
            <div className="absolute top-2 left-2 text-[#D1A054] font-serif text-xl">❖</div>
            <div className="absolute top-2 right-2 text-[#D1A054] font-serif text-xl">❖</div>
            <div className="absolute bottom-2 left-2 text-[#D1A054] font-serif text-xl">❖</div>
            <div className="absolute bottom-2 right-2 text-[#D1A054] font-serif text-xl">❖</div>

            {/* Certificate Header */}
            <div className="mb-4">
              <span className="text-xs uppercase tracking-[0.25em] font-extrabold text-[#D1A054]">
                PeddyCare Animal Welfare Organization
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-serif mt-1">
                Certificate of Adoption
              </h1>
              <p className="text-xs text-gray-500 italic mt-0.5">
                Certificate ID: {certificateId}
              </p>
            </div>

            <div className="w-24 h-0.5 bg-[#D1A054] mx-auto mb-6"></div>

            {/* Certificate Body */}
            <p className="text-xs sm:text-sm text-gray-600 mb-2">
              This is to proudly certify that
            </p>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 border-b border-gray-300 pb-1 max-w-md mx-auto mb-3 font-serif">
              {adopterName || "Dedicated Adopter"}
            </h2>

            <p className="text-xs sm:text-sm text-gray-600 mb-2">
              has officially adopted and given a forever loving home to
            </p>

            {/* Pet Card Highlight */}
            <div className="inline-flex items-center gap-4 bg-orange-50 border border-orange-200 rounded-xl px-5 py-2.5 my-3 shadow-xs">
              {petData.petImage && (
                <img
                  src={petData.petImage}
                  alt={petData.petName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#D1A054]"
                />
              )}
              <div className="text-left">
                <h3 className="text-lg font-extrabold text-orange-900">
                  {petData.petName}
                </h3>
                <p className="text-xs text-gray-600">
                  Category: <span className="font-semibold capitalize">{petData.petCategory || "Pet"}</span> | Age: {petData.petAge} yrs
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto mt-2 mb-8 leading-relaxed">
              In recognition of your pledge to provide unconditional love, nutrition, medical care, and lifelong companionship to this rescued friend.
            </p>

            {/* Signatures & Seal */}
            <div className="grid grid-cols-3 items-end pt-4 border-t border-gray-200 mt-4">
              <div className="text-center">
                <div className="font-serif italic text-sm text-gray-800">PeddyCare Team</div>
                <div className="w-24 sm:w-32 h-0.5 bg-gray-400 mx-auto mt-1"></div>
                <p className="text-[10px] text-gray-500 mt-0.5">Authorized Director</p>
              </div>

              {/* Gold Seal */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FBAE02] to-[#D1A054] flex items-center justify-center text-white shadow-md border-2 border-white">
                  <FaCheckCircle className="w-7 h-7 text-white" />
                </div>
                <span className="text-[9px] uppercase tracking-wider font-bold text-gray-600 mt-1">
                  Verified Seal
                </span>
              </div>

              <div className="text-center">
                <div className="font-medium text-xs text-gray-800">{dateFormatted}</div>
                <div className="w-24 sm:w-32 h-0.5 bg-gray-400 mx-auto mt-1"></div>
                <p className="text-[10px] text-gray-500 mt-0.5">Adoption Date</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdoptionCertificateModal;
