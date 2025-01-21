import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import AuthContext from '../../context/authContext';
import useAxiosPublic from '../../Hooks/useAxiosPublic';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

// Cloudinary/ImgBB API Key (Replace with your actual API key)
const image_hosting_key = import.meta.env.VITE_img_hosting_api;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const CreateDonationCampaign = () => {
    const { user } = useContext(AuthContext);
    const axiosSecurePublic = useAxiosPublic();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm();

    // Submit handler
    const onSubmit = async (data) => {
        try {
            // Upload Image to ImgBB/Cloudinary
            const imageData = new FormData();
            imageData.append('image', data.petImage[0]);

            const imageRes = await axiosSecurePublic.post(image_hosting_api, imageData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (imageRes.data.success) {
                // Construct the donation campaign data
                const donationData = {
                    petName:data.petName,
                    petImage: imageRes.data.data.display_url, // Uploaded image URL
                    maxDonationAmount: parseFloat(data.maxDonationAmount),
                    lastDate: data.lastDate,
                    shortDescription: data.shortDescription,
                    longDescription: data.longDescription,
                    createdBy: user?.email,
                    createdAt: new Date().toISOString(), // Store creation timestamp
                };

                // Send the donation data to the backend
                const res = await axiosSecurePublic.post('/donation-campaigns', donationData);

                if (res.data.insertedId) {
                    Swal.fire({
                        title: "Success!",
                        text: "Donation campaign created successfully.",
                        icon: "success",
                    });
                    navigate('/donation-campaigns'); // Redirect after submission
                }
            }
        } catch (error) {
            console.error('Error creating campaign:', error);
            Swal.fire({
                title: "Error!",
                text: "Something went wrong while creating the campaign.",
                icon: "error",
            });
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white shadow-md rounded-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create Donation Campaign</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* pet name */}
                <div>
                    <label className="block font-medium mb-1">Pet Name</label>
                    <input
                        type="text"
                        {...register('petName', { required: 'Pet Name is required' })}
                        className="block w-full border rounded-md p-2"
                    />
                    {errors.petName && <p className="text-red-500 text-sm mt-1">{errors.petName.message}</p>}
                </div>

                {/* Pet Picture */}
                <div>
                    <label className="block font-medium mb-1">Pet Picture</label>
                    <input
                        type="file"
                        {...register('petImage', { required: 'Pet picture is required' })}
                        className="block w-full border rounded-md p-2"
                        accept="image/*"
                    />
                    {errors.petImage && <p className="text-red-500 text-sm mt-1">{errors.petImage.message}</p>}
                </div>

                {/* Maximum Donation Amount */}
                <div>
                    <label className="block font-medium mb-1">Maximum Donation Amount</label>
                    <input
                        type="number"
                        step="0.01"
                        {...register('maxDonationAmount', {
                            required: 'Maximum donation amount is required',
                            min: { value: 1, message: 'Amount must be greater than 0' }
                        })}
                        className="block w-full border rounded-md p-2"
                    />
                    {errors.maxDonationAmount && <p className="text-red-500 text-sm mt-1">{errors.maxDonationAmount.message}</p>}
                </div>

                {/* Last Date of Donation */}
                <div>
                    <label className="block font-medium mb-1">Last Date of Donation</label>
                    <input
                        type="date"
                        {...register('lastDate', { required: 'Last date is required' })}
                        className="block w-full border rounded-md p-2"
                    />
                    {errors.lastDate && <p className="text-red-500 text-sm mt-1">{errors.lastDate.message}</p>}
                </div>

                {/* Short Description */}
                <div>
                    <label className="block font-medium mb-1">Short Description</label>
                    <input
                        type="text"
                        {...register('shortDescription', {
                            required: 'Short description is required',
                            maxLength: { value: 100, message: 'Maximum 100 characters allowed' }
                        })}
                        className="block w-full border rounded-md p-2"
                    />
                    {errors.shortDescription && <p className="text-red-500 text-sm mt-1">{errors.shortDescription.message}</p>}
                </div>

                {/* Long Description */}
                <div>
                    <label className="block font-medium mb-1">Long Description</label>
                    <textarea
                        rows="5"
                        {...register('longDescription', { required: 'Long description is required' })}
                        className="block w-full border rounded-md p-2"
                    ></textarea>
                    {errors.longDescription && <p className="text-red-500 text-sm mt-1">{errors.longDescription.message}</p>}
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 transition duration-300 w-full"
                    >
                        Create Campaign
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateDonationCampaign;
