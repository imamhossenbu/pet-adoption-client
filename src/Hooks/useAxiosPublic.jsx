import axios from 'axios';



const axiosSecurePublic = axios.create({
    baseURL: 'https://pet-adoption-server-olive.vercel.app'
})
const useAxiosPublic = () => {
    return axiosSecurePublic;
};

export default useAxiosPublic;