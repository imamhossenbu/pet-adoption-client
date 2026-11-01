import axios from "axios";

const axiosSecurePublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://pet-adoption-server-olive.vercel.app",
});
const useAxiosPublic = () => {
  return axiosSecurePublic;
};

export default useAxiosPublic;
