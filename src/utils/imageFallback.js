export const DEFAULT_CATEGORY_IMAGES = {
  dog: [
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80",
  ],
  cat: [
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=800&q=80",
  ],
  rabbit: [
    "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1518796745738-41048802f99a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1591382696684-38c427c7547a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1535241749838-299277b6305f?auto=format&fit=crop&w=800&q=80",
  ],
  bird: [
    "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1522926197415-e5a8a329af5c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=800&q=80",
  ],
};

/**
 * Returns a guaranteed valid image URL. If url is from imgbb (which returns 503 unavailable)
 * or missing, it returns a high-resolution Unsplash pet image based on category and optional seed.
 */
export const getPetImage = (url, category, seed = 0) => {
  const isImgBB = typeof url === "string" && (url.includes("ibb.co") || url.includes("imgbb"));
  if (!url || isImgBB) {
    const cat = (category || "dog").toLowerCase();
    const list = DEFAULT_CATEGORY_IMAGES[cat] || DEFAULT_CATEGORY_IMAGES.dog;
    let index = 0;
    if (typeof seed === "number") {
      index = Math.abs(seed) % list.length;
    } else if (typeof seed === "string") {
      index = Math.abs(seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % list.length;
    }
    return list[index];
  }
  return url;
};

/**
 * Error fallback handler for <img> tags
 */
export const handleImageError = (e, category) => {
  const cat = (category || "dog").toLowerCase();
  const list = DEFAULT_CATEGORY_IMAGES[cat] || DEFAULT_CATEGORY_IMAGES.dog;
  e.target.onerror = null;
  e.target.src = list[0];
};

export default getPetImage;
