import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import useAxiosPublic from '../../Hooks/useAxiosPublic';
import Swal from 'sweetalert2';
import AuthContext from '../../context/authContext';
import { useNavigate } from 'react-router-dom';

const categoryOptions = [
    { value: 'dog', label: 'Dog', color: '#FF5630' },
    { value: 'cat', label: 'Cat', color: '#0052CC' },
    { value: 'rabbit', label: 'Rabbit', color: '#36B37E' },
    { value: 'bird', label: 'Bird', color: '#FFAB00' },
];

const animatedComponents = makeAnimated();
const image_hosting_key = import.meta.env.VITE_img_hosting_api;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;


const AddPet = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const axiosSecurePublic = useAxiosPublic();

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm();

    // Tiptap Editor for Long Description
    const editor = useEditor({
        extensions: [StarterKit],
        content: '',
        onUpdate: ({ editor }) => {
            setValue('longDescription', editor.getHTML());
        },
    });

    React.useEffect(() => {
        return () => {
            if (editor) editor.destroy();
        };
    }, [editor]);


    // Form Submission Handler
    const onSubmit = async (data) => {
        const imageFile = { image: data.image[0] };
        const res = await axiosSecurePublic.post(image_hosting_api, imageFile, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        console.log(res.data.data.display_url);
        if (res.data.status === 200) {
            const petData = {
                ...data,
                petCategory: data.petCategory.value, // Extract value from react-select
                petImage: res.data.data.display_url,
                dateAdded: new Date().toISOString(),
                adopted: false,
                petAge: parseFloat(data.petAge),
                userEmail: user.email,
            };
            const petItemRes = await axiosSecurePublic.post('/pet', petData);
            if (petItemRes.data.insertedId) {
                reset();
                Swal.fire({
                    title: "Added!",
                    text: "Your item has been added.",
                    icon: "success"
                })
                navigate('/pet-listing')
            }
        }


    };

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white shadow-md rounded-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Add a Pet</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Two Columns for Pet Name and Age */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pet Name */}
                    <div>
                        <label className="block font-medium mb-1">Pet Name</label>
                        <input
                            type="text"
                            {...register('petName', { required: 'Pet name is required' })}
                            className={`block w-full border rounded-md p-2 ${errors.petName ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.petName && (
                            <p className="text-red-500 text-sm mt-1">{errors.petName.message}</p>
                        )}
                    </div>

                    {/* Pet Age */}
                    <div>
                        <label className="block font-medium mb-1">Pet Age (in years)</label>
                        <input
                            type="text"
                            {...register('petAge', {
                                required: 'Pet age is required',
                                validate: value => {
                                    const number = parseFloat(value);
                                    if (isNaN(number)) {
                                        return 'Age must be a valid number';
                                    }
                                    if (number < 0) {
                                        return 'Age must be a positive number';
                                    }
                                    return true;
                                },
                            })}
                            className={`block w-full border rounded-md p-2 ${errors.petAge ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Enter pet age (e.g., 3.5)"
                        />
                        {errors.petAge && (
                            <p className="text-red-500 text-sm mt-1">{errors.petAge.message}</p>
                        )}
                    </div>
                </div>

                {/* Pet Category */}
                <div>
                    <label className="block font-medium mb-1">Pet Category</label>
                    <Select
                        options={categoryOptions}
                        components={animatedComponents}
                        closeMenuOnSelect={true}
                        onChange={(selectedOption) => setValue('petCategory', selectedOption)}
                        placeholder="Select a category"
                    />
                    {errors.petCategory && (
                        <p className="text-red-500 text-sm mt-1">{errors.petCategory.message}</p>
                    )}
                </div>

                {/* Pet Location */}
                <div>
                    <label className="block font-medium mb-1">Pet Location</label>
                    <input
                        type="text"
                        {...register('petLocation', { required: 'Pet location is required' })}
                        className={`block w-full border rounded-md p-2 ${errors.petLocation ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.petLocation && (
                        <p className="text-red-500 text-sm mt-1">{errors.petLocation.message}</p>
                    )}
                </div>

                {/* Short Description */}
                <div>
                    <label className="block font-medium mb-1">Short Description</label>
                    <textarea
                        {...register('shortDescription', {
                            required: 'Short description is required',
                            maxLength: {
                                value: 100,
                                message: 'Short description cannot exceed 150 characters',
                            },
                        })}
                        className={`block w-full border rounded-md p-2 ${errors.shortDescription ? 'border-red-500' : 'border-gray-300'
                            }`}
                    ></textarea>
                    {errors.shortDescription && (
                        <p className="text-red-500 text-sm mt-1">{errors.shortDescription.message}</p>
                    )}
                </div>

                {/* Long Description */}
                <div>
                    <label className="block font-medium mb-1">Long Description</label>
                    <div className="border border-gray-300 rounded-md shadow p-2">
                        <div className="h-48 overflow-y-auto">
                            <EditorContent editor={editor} className="h-full" />
                        </div>
                    </div>
                    {errors.longDescription && (
                        <p className="text-red-500 text-sm mt-1">{errors.longDescription.message}</p>
                    )}
                </div>

                {/* Pet Image */}
                <div>
                    <label className="block font-medium mb-1">Pet Image</label>
                    <input
                        {...register('image')}
                        type="file"
                        accept="image/*"
                        className={`block w-full border rounded-md p-2`}
                    />
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600 transition duration-300 w-full"
                    >
                        Add Pet
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddPet;
