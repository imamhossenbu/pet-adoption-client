import axios from "axios";

/**
 * Universal Image Uploader
 * Supports:
 * 1. Cloudinary (via VITE_CLOUDINARY_CLOUD_NAME & VITE_CLOUDINARY_UPLOAD_PRESET)
 * 2. ImgBB (via VITE_img_hosting_api)
 * 3. Graceful fallback to Unsplash default if network/adblock fails
 */
export const uploadImageToCloud = async (file, fallbackCategory = "dog") => {
  if (!file) return null;

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dd6xynlko";
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "peddycare_preset";
  const imgbbKey = import.meta.env.VITE_img_hosting_api;

  // 1. Try Cloudinary if keys exist
  if (cloudName && uploadPreset) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", "peddycare");

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );
      if (res.data?.secure_url) {
        return res.data.secure_url;
      }
    } catch (err) {
      console.warn("Cloudinary upload failed, attempting fallback...", err);
    }
  }

  // 2. Try ImgBB if key exists
  if (imgbbKey) {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
        formData
      );
      if (res.data?.data?.display_url) {
        return res.data.data.display_url;
      }
    } catch (err) {
      console.warn("ImgBB upload failed, using curated backup...", err);
    }
  }

  // 3. Curated High Quality Fallbacks
  const fallbacks = {
    dog: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
    cat: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
    rabbit: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80",
    bird: "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&w=800&q=80",
    campaign: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80",
  };

  return fallbacks[fallbackCategory?.toLowerCase()] || fallbacks.dog;
};
