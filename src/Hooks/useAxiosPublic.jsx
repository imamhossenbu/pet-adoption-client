import axios from 'axios';



const axiosSecurePublic = axios.create({
    baseURL: 'http://localhost:3000'
})
const useAxiosPublic = () => {
    return axiosSecurePublic;
};

export default useAxiosPublic;