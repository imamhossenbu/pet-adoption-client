import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Helmet } from "react-helmet";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaHandHoldingHeart,
  FaDollarSign,
  FaCalendarAlt,
  FaImage,
  FaUpload,
  FaLink,
  FaShieldAlt,
  FaArrowLeft,
  FaCheckCircle,
  FaHeart,
  FaTimes,
  FaBold,
  FaItalic,
  FaListUl
} from "react-icons/fa";
import AuthContext from "../../context/authContext";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { uploadImageToCloud } from "../../utils/cloudinaryUpload";

const quickGoals = [300, 500, 1000, 2500, 5000];

const CreateDonationCampaign = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      maxDonationAmount: "1000",
    },
  });

  const maxDonationWatch = watch("maxDonationAmount");

  // TipTap Rich Editor for medical case story
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Describe the pet's diagnosis, the vet clinic handling treatment, estimated surgery or medication costs, and recovery plan...</p>",
    editorProps: {
      attributes: {
        class: "focus:outline-none outline-none min-h-[130px] text-xs leading-relaxed text-gray-800",
      },
    },
    onUpdate: ({ editor }) => {
      setValue("longDescription", editor.getHTML());
    },
  });

  React.useEffect(() => {
    return () => {
      if (editor) editor.destroy();
    };
  }, [editor]);

  // Handle local file selection with instant preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setImageUrlInput("");
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let finalImageUrl = imageUrlInput;

      // Universal cloud uploader (Cloudinary / ImgBB)
      if (data.petImage && data.petImage[0]) {
        const uploaded = await uploadImageToCloud(data.petImage[0], "campaign");
        if (uploaded) finalImageUrl = uploaded;
      }

      if (!finalImageUrl) {
        finalImageUrl = await uploadImageToCloud(null, "campaign");
      }

      const campaignData = {
        petName: data.petName,
        petImage: finalImageUrl,
        maxDonationAmount: parseFloat(data.maxDonationAmount),
        donatedAmount: 0,
        lastDate: data.lastDate,
        shortDescription: data.shortDescription,
        longDescription: editor?.getHTML() || data.shortDescription,
        createdBy: user?.email || "admin@peddycare.com",
        createdAt: new Date().toISOString(),
        paused: false,
      };

      const res = await axiosSecure.post("/donation-campaigns", campaignData);

      if (res.data.insertedId) {
        Swal.fire({
          title: "Campaign Launched! 💖",
          text: `Emergency medical fund for ${data.petName} is now active.`,
          icon: "success",
          confirmButtonColor: "#FBAE02",
        });
        navigate("/donation-campaigns");
      }
    } catch (err) {
      console.error("Create campaign error:", err);
      Swal.fire({
        title: "Error!",
        text: "Could not create donation campaign. Please try again.",
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      <Helmet>
        <title>Start Donation Campaign || PeddyCare</title>
      </Helmet>

      {/* Top Breadcrumb & Header Banner */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-black text-gray-400 hover:text-black uppercase tracking-wider mb-2 transition"
          >
            <FaArrowLeft className="text-[10px]" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-2xl">
              <FaHandHoldingHeart />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                Start an Emergency Medical Campaign
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Raise life-saving funds for injured, sick, or vulnerable rescued animals.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 bg-emerald-50 border border-emerald-200/60 px-4 py-2 rounded-2xl text-xs font-bold text-emerald-800">
          <FaShieldAlt className="text-emerald-600" />
          <span>100% Secure Stripe Processing</span>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Campaign Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Beneficiary & Target Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-5">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
                <FaHeart className="text-[#FBAE02]" /> 1. Beneficiary & Fund Target
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Pet Name */}
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-1.5">
                    Beneficiary Pet Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bella, Bruno, Oliver"
                    {...register("petName", { required: "Pet name is required" })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FBAE02] transition ${
                      errors.petName ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                  {errors.petName && (
                    <p className="text-red-500 text-[11px] mt-1 font-bold">
                      {errors.petName.message}
                    </p>
                  )}
                </div>

                {/* Target Expiry Date */}
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-1.5">
                    Fundraising Deadline *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      {...register("lastDate", {
                        required: "Deadline date is required",
                      })}
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FBAE02] transition ${
                        errors.lastDate ? "border-red-400" : "border-gray-200"
                      }`}
                    />
                  </div>
                  {errors.lastDate && (
                    <p className="text-red-500 text-[11px] mt-1 font-bold">
                      {errors.lastDate.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Goal Amount & Quick Buttons */}
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1.5">
                  Target Amount Goal ($ USD) *
                </label>
                <div className="relative">
                  <FaDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="number"
                    step="1"
                    min="10"
                    placeholder="1000"
                    {...register("maxDonationAmount", {
                      required: "Target goal is required",
                      min: { value: 10, message: "Goal must be at least $10" },
                    })}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs text-gray-900 font-black focus:outline-none focus:ring-2 focus:ring-[#FBAE02] transition ${
                      errors.maxDonationAmount ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                </div>
                {errors.maxDonationAmount && (
                  <p className="text-red-500 text-[11px] mt-1 font-bold">
                    {errors.maxDonationAmount.message}
                  </p>
                )}

                {/* Quick Goal Selectors */}
                <div className="flex flex-wrap items-center gap-2 mt-2.5">
                  <span className="text-[10px] font-black uppercase text-gray-400">
                    Quick Select:
                  </span>
                  {quickGoals.map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setValue("maxDonationAmount", amt.toString())}
                      className={`px-3 py-1 rounded-xl text-xs font-extrabold transition ${
                        maxDonationWatch === amt.toString()
                          ? "bg-[#FBAE02] text-black"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Emergency Case Descriptions Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-5">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
                <FaCheckCircle className="text-[#FBAE02]" /> 2. Medical Case & Story
              </h3>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1.5">
                  Emergency Headline / Short Summary *
                </label>
                <input
                  type="text"
                  maxLength={140}
                  placeholder="e.g. Urgent orthopedic surgery for Milo after roadside rescue."
                  {...register("shortDescription", {
                    required: "Summary headline is required",
                  })}
                  className={`w-full px-4 py-2.5 rounded-xl border text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FBAE02] transition ${
                    errors.shortDescription ? "border-red-400" : "border-gray-200"
                  }`}
                />
                {errors.shortDescription && (
                  <p className="text-red-500 text-[11px] mt-1 font-bold">
                    {errors.shortDescription.message}
                  </p>
                )}
              </div>

              {/* Detailed Medical Story */}
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1.5">
                  Full Medical Case Story
                </label>
                <div className="border border-gray-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[#FBAE02]">
                  {/* Toolbar */}
                  <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleBold().run()}
                      className={`p-1.5 rounded-lg text-xs font-bold hover:bg-gray-200 transition ${
                        editor?.isActive("bold") ? "bg-gray-200 text-black" : "text-gray-600"
                      }`}
                      title="Bold"
                    >
                      <FaBold />
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleItalic().run()}
                      className={`p-1.5 rounded-lg text-xs font-bold hover:bg-gray-200 transition ${
                        editor?.isActive("italic") ? "bg-gray-200 text-black" : "text-gray-600"
                      }`}
                      title="Italic"
                    >
                      <FaItalic />
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().toggleBulletList().run()}
                      className={`p-1.5 rounded-lg text-xs font-bold hover:bg-gray-200 transition ${
                        editor?.isActive("bulletList") ? "bg-gray-200 text-black" : "text-gray-600"
                      }`}
                      title="Bullet List"
                    >
                      <FaListUl />
                    </button>
                  </div>

                  <div className="p-4 min-h-[140px] text-xs leading-relaxed text-gray-800 bg-white">
                    <EditorContent editor={editor} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Evidence Photo & Launch (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Photo Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-5">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
                <FaImage className="text-[#FBAE02]" /> 3. Medical Evidence / Photo
              </h3>

              {/* Photo Preview Zone */}
              <div className="relative border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden bg-gray-50 hover:bg-gray-100/70 transition flex flex-col items-center justify-center p-4 min-h-[220px] text-center group">
                {imagePreview || imageUrlInput ? (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden group">
                    <img
                      src={imagePreview || imageUrlInput}
                      alt="Campaign Preview"
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageUrlInput("");
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-red-600 transition"
                      title="Remove image"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 p-4">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-xl">
                      <FaUpload />
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-800">
                        Upload Patient / Evidence Photo
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        High resolution JPG or PNG
                      </p>
                    </div>
                    <label className="inline-block cursor-pointer bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold text-[11px] uppercase px-4 py-2 rounded-xl transition shadow-xs mt-2">
                      Choose Photo
                      <input
                        type="file"
                        accept="image/*"
                        {...register("petImage")}
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Or paste direct URL */}
              <div>
                <label className="block text-xs font-black uppercase text-gray-400 mb-1">
                  Or Paste Photo URL Directly:
                </label>
                <div className="relative">
                  <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={imageUrlInput}
                    onChange={(e) => {
                      setImageUrlInput(e.target.value);
                      if (e.target.value) setImagePreview(null);
                    }}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FBAE02] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Transparency Pledge Card */}
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-3xl p-6 border border-amber-500/20 space-y-3">
              <h4 className="text-xs font-black uppercase text-amber-900 flex items-center gap-2">
                <FaShieldAlt className="text-[#FBAE02]" /> Donor Trust & Transparency
              </h4>
              <ul className="text-[11px] text-gray-600 space-y-1.5 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <FaCheckCircle className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>All donations are tracked transparently in real-time.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <FaCheckCircle className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Stripe PCI-DSS certified encrypted transactions.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <FaCheckCircle className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Organizers can post update receipts directly to supporters.</span>
                </li>
              </ul>
            </div>

            {/* Launch Campaign Button */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm uppercase tracking-wide transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Launching Fundraiser...</span>
                ) : (
                  <>
                    <FaHandHoldingHeart className="text-base" /> Launch Campaign Now
                  </>
                )}
              </button>
              <p className="text-[11px] text-gray-400 text-center">
                Your campaign will immediately be displayed on the public Donation Campaigns page.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateDonationCampaign;
