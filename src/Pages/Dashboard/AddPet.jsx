import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Helmet } from "react-helmet";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaPaw,
  FaImage,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaArrowLeft,
  FaUpload,
  FaLink,
  FaBold,
  FaItalic,
  FaListUl,
  FaShieldAlt,
  FaTimes
} from "react-icons/fa";
import AuthContext from "../../context/authContext";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { uploadImageToCloud } from "../../utils/cloudinaryUpload";

const categoryList = [
  { value: "dog", label: "Dog", icon: "🐕" },
  { value: "cat", label: "Cat", icon: "🐈" },
  { value: "rabbit", label: "Rabbit", icon: "🐇" },
  { value: "bird", label: "Bird", icon: "🦜" },
];

const AddPet = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [selectedCategory, setSelectedCategory] = useState("dog");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vaccineChecks, setVaccineChecks] = useState({
    vaccinated: true,
    dewormed: true,
    spayed: false,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      petCategory: "dog",
    },
  });

  const shortDescWatch = watch("shortDescription") || "";

  // TipTap Rich Text Editor
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Tell the adopter about this pet's personality, behavior with kids and other pets, and daily routine...</p>",
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
      setImageUrlInput(""); // clear direct url if file selected
    }
  };

  // Form Submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let finalImageUrl = imageUrlInput;

      // If user uploaded a local file, upload via universal cloud uploader
      if (data.image && data.image[0]) {
        const uploaded = await uploadImageToCloud(data.image[0], selectedCategory);
        if (uploaded) finalImageUrl = uploaded;
      }

      // If neither, use curated category fallback
      if (!finalImageUrl) {
        finalImageUrl = await uploadImageToCloud(null, selectedCategory);
      }

      const petData = {
        petName: data.petName,
        petAge: data.petAge,
        petCategory: selectedCategory,
        petLocation: data.petLocation,
        shortDescription: data.shortDescription,
        longDescription: editor?.getHTML() || data.shortDescription,
        petImage: finalImageUrl,
        userEmail: user?.email || "anonymous@peddycare.com",
        adopted: false,
        dateAdded: new Date().toISOString(),
        healthStatus: vaccineChecks,
      };

      const res = await axiosSecure.post("/pet", petData);

      if (res.data.insertedId) {
        Swal.fire({
          title: "Pet Listed Successfully! 🐾",
          text: `${data.petName} is now live and waiting for a loving home.`,
          icon: "success",
          confirmButtonColor: "#FBAE02",
        });
        navigate("/dashboard/my-added-pets");
      }
    } catch (err) {
      console.error("Add pet error:", err);
      Swal.fire({
        title: "Submission Error",
        text: "Failed to publish pet listing. Please try again.",
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      <Helmet>
        <title>Add a Pet for Adoption || PeddyCare</title>
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
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#FBAE02] flex items-center justify-center text-2xl">
              <FaPaw />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                List a Pet for Adoption
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Provide accurate details and health information to connect with certified adopters.
              </p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 bg-amber-50/80 border border-amber-200/50 px-4 py-2 rounded-2xl text-xs font-bold text-amber-900">
          <FaShieldAlt className="text-[#FBAE02]" />
          <span>Verified Listing System</span>
        </div>
      </div>

      {/* Main Form Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-5">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
                <FaPaw className="text-[#FBAE02]" /> 1. Pet Profile & Identity
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-1.5">
                    Pet Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Charlie, Milo, Daisy"
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

                <div>
                  <label className="block text-xs font-black uppercase text-gray-500 mb-1.5">
                    Age / Approximate *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 6 Months, 2 Years"
                    {...register("petAge", { required: "Pet age is required" })}
                    className={`w-full px-4 py-2.5 rounded-xl border text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FBAE02] transition ${
                      errors.petAge ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                  {errors.petAge && (
                    <p className="text-red-500 text-[11px] mt-1 font-bold">
                      {errors.petAge.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Category Selector with visual buttons */}
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-2">
                  Pet Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {categoryList.map((cat) => (
                    <button
                      type="button"
                      key={cat.value}
                      onClick={() => {
                        setSelectedCategory(cat.value);
                        setValue("petCategory", cat.value);
                      }}
                      className={`p-3 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                        selectedCategory === cat.value
                          ? "bg-amber-50 border-[#FBAE02] text-black shadow-xs ring-2 ring-[#FBAE02]/30"
                          : "border-gray-200 hover:bg-gray-50 text-gray-600"
                      }`}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="text-xs font-black">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1.5">
                  Current Location / Shelter City *
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    placeholder="e.g. Gulshan, Dhaka / Chittagong"
                    {...register("petLocation", {
                      required: "Location is required",
                    })}
                    className={`w-full pl-11 pr-4 py-2.5 rounded-xl border text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FBAE02] transition ${
                      errors.petLocation ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                </div>
                {errors.petLocation && (
                  <p className="text-red-500 text-[11px] mt-1 font-bold">
                    {errors.petLocation.message}
                  </p>
                )}
              </div>
            </div>

            {/* Descriptions Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-5">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
                <FaCheckCircle className="text-[#FBAE02]" /> 2. Descriptions & Story
              </h3>

              {/* Short Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-black uppercase text-gray-500">
                    Short Summary (Quick Highlight) *
                  </label>
                  <span className="text-[11px] text-gray-400">
                    {shortDescWatch.length}/120 characters
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={120}
                  placeholder="e.g. Friendly 1-year golden retriever, loves kids & fetch."
                  {...register("shortDescription", {
                    required: "Short summary is required",
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

              {/* Long Description (TipTap) */}
              <div>
                <label className="block text-xs font-black uppercase text-gray-500 mb-1.5">
                  Detailed Bio & Background Story
                </label>
                <div className="border border-gray-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[#FBAE02]">
                  {/* TipTap Toolbar */}
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

          {/* Right Column: Media, Health & Publish (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Pet Photo Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-5">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
                <FaImage className="text-[#FBAE02]" /> 3. Pet Photograph
              </h3>

              {/* Photo Preview Zone */}
              <div className="relative border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden bg-gray-50 hover:bg-gray-100/70 transition flex flex-col items-center justify-center p-4 min-h-[220px] text-center group">
                {imagePreview || imageUrlInput ? (
                  <div className="relative w-full h-48 rounded-xl overflow-hidden group">
                    <img
                      src={imagePreview || imageUrlInput}
                      alt="Pet Preview"
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
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 text-[#FBAE02] flex items-center justify-center text-xl">
                      <FaUpload />
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-800">
                        Upload Photo (Cloudinary / Direct)
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        PNG, JPG or WEBP up to 5MB
                      </p>
                    </div>
                    <label className="inline-block cursor-pointer bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-extrabold text-[11px] uppercase px-4 py-2 rounded-xl transition shadow-xs mt-2">
                      Choose File
                      <input
                        type="file"
                        accept="image/*"
                        {...register("image")}
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
                  Or Paste Image URL Directly:
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

            {/* Health & Veterinary Check Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
                <FaShieldAlt className="text-[#FBAE02]" /> 4. Health & Medical Status
              </h3>

              <div className="space-y-2.5">
                <label className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer hover:bg-amber-50/50 transition">
                  <input
                    type="checkbox"
                    checked={vaccineChecks.vaccinated}
                    onChange={(e) =>
                      setVaccineChecks({
                        ...vaccineChecks,
                        vaccinated: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-[#FBAE02] rounded focus:ring-[#FBAE02]"
                  />
                  <div>
                    <p className="text-xs font-black text-gray-900">
                      Core Vaccinations Complete
                    </p>
                    <p className="text-[10px] text-gray-400">
                      Rabies, DHPP / FVRCP immunization up to date
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer hover:bg-amber-50/50 transition">
                  <input
                    type="checkbox"
                    checked={vaccineChecks.dewormed}
                    onChange={(e) =>
                      setVaccineChecks({
                        ...vaccineChecks,
                        dewormed: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-[#FBAE02] rounded focus:ring-[#FBAE02]"
                  />
                  <div>
                    <p className="text-xs font-black text-gray-900">Dewormed & Parasite Free</p>
                    <p className="text-[10px] text-gray-400">
                      Regularly treated for fleas, ticks, and internal parasites
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100 cursor-pointer hover:bg-amber-50/50 transition">
                  <input
                    type="checkbox"
                    checked={vaccineChecks.spayed}
                    onChange={(e) =>
                      setVaccineChecks({
                        ...vaccineChecks,
                        spayed: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-[#FBAE02] rounded focus:ring-[#FBAE02]"
                  />
                  <div>
                    <p className="text-xs font-black text-gray-900">Spayed / Neutered</p>
                    <p className="text-[10px] text-gray-400">
                      Surgically altered to prevent pet overpopulation
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Publish Button */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-[#FBAE02] hover:bg-orange-500 text-black hover:text-white font-black text-sm uppercase tracking-wide transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Publishing Pet Listing...</span>
                ) : (
                  <>
                    <FaPaw className="text-base" /> Publish Pet for Adoption
                  </>
                )}
              </button>
              <p className="text-[11px] text-gray-400 text-center">
                Your listing will be immediately accessible in the adoption directory.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPet;
