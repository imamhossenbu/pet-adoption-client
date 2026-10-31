import  { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import useAxiosPublic from '../../Hooks/useAxiosPublic';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import Swal from 'sweetalert2';
import AuthContext from '../../context/authContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const categoryOptions = [
    { value: 'dog', label: 'Dog', color: '#FF5630' },
    { value: 'cat', label: 'Cat', color: '#0052CC' },
    { value: 'rabbit', label: 'Rabbit', color: '#36B37E' },
    { value: 'bird', label: 'Bird', color: '#FFAB00' },
];

const animatedComponents = makeAnimated();
const image_hosting_key = import.meta.env.VITE_img_hosting_api;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;


const UpdatePet = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const axiosSecurePublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();
    const { id } = useParams();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    // Tiptap Editor for Long Description
    const editor = useEditor({
        extensions: [StarterKit],
        content: '',
        editorProps: {
            attributes: {
                class: 'focus:outline-none outline-none min-h-[140px] text-sm leading-relaxed text-gray-800',
            },
        },
        onUpdate: ({ editor }) => {
            setValue('longDescription', editor.getHTML());
        },
    });



    const { data: pets = [] } = useQuery({
        queryKey: ['pets'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/pets/${id}`)
            return res.data;
        }
    })

    useEffect(() => {
        if (pets) {
            setValue('petName', pets.petName);
            setValue('petAge', pets.petAge);
            setValue('petLocation', pets.petLocation);
            setValue('shortDescription', pets.shortDescription);
            if (editor && pets.longDescription) {
                editor.commands.setContent(pets.longDescription);
            }
            if (pets.petCategory) {
                const selectedCategory = categoryOptions.find(option => option.value === pets.petCategory);
                setValue('petCategory', selectedCategory);
            }
        }
    }, [pets, setValue, editor]);



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
            const updatedPetData = {
                petName: data.petName,
                petAge: parseFloat(data.petAge),
                petCategory: data.petCategory.value,
                petLocation: data.petLocation,
                shortDescription: data.shortDescription,
                longDescription: editor.getHTML(),
                petImage: res.data.data.display_url,
                userEmail: user.email,
                dateAdded: new Date().toISOString(),
                adopted:false
            };
            const response = await axiosSecure.put(`/pet/${id}`, updatedPetData);
            console.log(response);
            if (response.data.modifiedCount > 0) {
                Swal.fire({
                    title: "Updated!",
                    text: "Pet details have been updated successfully.",
                    icon: "success",
                });
                navigate('/dashboard/my-added-pets'); // Redirect to the My Added Pets page
            }
            else {
                Swal.fire({
                    title: "Error!",
                    text: "Something went wrong while updating the pet. Please try again.",
                    icon: "error",
                });
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
                            defaultValue={pets.petName}
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
                            type="number"
                            defaultValue={pets.petAge}
                            {...register('petAge', {
                                required: 'Pet age is required',
                                min: { value: 0, message: 'Age must be a positive number' },
                            })}
                            className={`block w-full border rounded-md p-2 ${errors.petAge ? 'border-red-500' : 'border-gray-300'
                                }`}
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
                        // value={categoryOptions.find(option => option.value === pets.petCategory)}
                        defaultValue={categoryOptions.find(option=>option.value === pets.category)}
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
                        defaultValue={pets.petLocation}
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
                        defaultValue={pets.shortDescription}
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
                            <EditorContent editor={editor}
                                defaultValue={pets.longDescription}
                                className="h-full" />
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
                        Update Pet
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdatePet;
