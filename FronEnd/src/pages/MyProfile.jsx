import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../config/axiosConfig';
import Input from '../components/formComponents/Input'
import Logout from '../components/Logout';
import SecondaryButton from '../components/formComponents/SecondaryButton'
import CourseCard from '../components/CourseCard';
import { WindowWidthContext } from '../context/WindowWidthContext';


import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
// import required modules

import { useGetEnrolledCoursesQuery, useGetUploadedCoursesQuery, useUpdateUserProfileMutation, useGetUserProfileQuery } from '../store/Api/User';


function MyProfile() {

    const navigate = useNavigate();

    const loggedInUser = JSON.parse(Cookies.get("user") || '{}');
    const { isMobile } = useContext(WindowWidthContext)

    const { data: userProfile } = useGetUserProfileQuery();
    const { data: enrolledCourses = {}, isLoading: isEnrolledLoading } = useGetEnrolledCoursesQuery();
    const { data: uploadedCourses = {}, isLoading: isUploadedLoading } = useGetUploadedCoursesQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

    const [enrolledOrUpdated, setEnrolledOrUpdated] = useState("enrolled");


    const [formData, setFormData] = useState({
        email: userProfile?.email || "",
        password: "",
        name: userProfile?.name || ""
    });


    const handleInputChange = (e) => {
        setFormData(prev => ({
            ...prev, [e.target.name]: e.target.value
        }));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        console.log(formData);


        try {
            const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/user/update-profile`, formData);

            const data = response.data;
            console.log(data);

            toast.success("Updated Successfully", {
                position: "top-right",
                style: {
                    background: "#131415",
                    color: "#9CF57F",
                }

            })


            // Successfully registered, navigate to home
            navigate("/");
        } catch (error) {

            toast.error("Failed to Update", {
                position: "top-right",
                style: {
                    background: "#131415",
                    color: "#9CF57F",
                }

            })
            console.log(error);

        }
    };



    console.log(enrolledCourses);


    function handleCourseCardClick(id) {
        navigate(`/course/${id}`)
    }


    function handleSetEnrolledOrUpdated(value) {
        setEnrolledOrUpdated(value)
    }



    return (

        <div className='pt-4 sm:pt-32 pb-10 w-full min-h-screen bg-bgOne flex flex-col px-4'>


            <div className='w-full sm:w-1/2 flex flex-col items-center gap-6 '>

                <div className='flex w-full sm:w-1/2 justify-start items-center gap-3'>
                    <SecondaryButton
                        text={"Enrolled"}
                        onClick={() => handleSetEnrolledOrUpdated("enrolled")}
                        classname={`text-gray rounded-md ${enrolledOrUpdated === 'enrolled' ? "border-green" : "border-border"}`}
                    />
                    
                    {loggedInUser.role === 'instructor' && (
                        <SecondaryButton
                            text={"Uploaded"}
                            onClick={() => handleSetEnrolledOrUpdated("uploaded")}
                            classname={`text-gray rounded-md ${enrolledOrUpdated === 'uploaded' ? 'border-green' : 'border-border'}`}
                        />
                    )}

                    {isMobile && (
                        <SecondaryButton
                            text={"Profile"}
                            onClick={() => handleSetEnrolledOrUpdated("profile")}
                            classname={`text-gray rounded-md ${enrolledOrUpdated === 'profile' ? 'border-green' : 'border-border'}`}
                        />
                    )}
                </div>




                {
                    enrolledOrUpdated === "enrolled" &&

                    <div className='w-full sm:w-1/2 text-white  items-start flex flex-col gap-4'>

                        <div className='flex justify-start w-full sm:w-1/2'>
                            <h2 className='uppercase text-white text-3xl sm:text-4xl font-semibold'>Enrolled <br /><span className='text-white text-5xl sm:text-6xl'>Courses.</span></h2>
                        </div>

                        {isEnrolledLoading ? (
                            <div className='w-full text-center'>
                                <ThreeDot color="#9CF57F" size="small" />
                            </div>
                        ) : (
                            <>
                                {
                                    Object.keys(enrolledCourses).map(key => {
                                        return <SwiperSlide key={key} >

                                            <CourseCard
                                                title={enrolledCourses[key].courseName}
                                                instructor={enrolledCourses[key].instructorName}
                                                description={enrolledCourses[key].courseDescription}
                                                vote={enrolledCourses[key].vote}
                                                onClick={() => handleCourseCardClick(key)}
                                                showCTA={true}
                                                text={"Continue"}
                                            />
                                        </SwiperSlide>
                                    })
                                }
                            </>
                        )}



                        <div className='flex flex-col gap-2'>
                            {
                                Object.keys(enrolledCourses).map((key) => {
                                    return <div key={key}
                                        className=''
                                    >

                                        <CourseCard
                                            title={enrolledCourses[key].courseName}
                                            instructor={enrolledCourses[key].instructorName}
                                            description={enrolledCourses[key].courseDescription}
                                            vote={enrolledCourses[key].vote}
                                            onClick={() => handleCourseCardClick(key)}
                                            showCTA={true}
                                            text={"Continue"}
                                        />

                                    </div>
                                })
                            }
                        </div>
                    </div>
                }


                {
                    enrolledOrUpdated === "uploaded" && loggedInUser.role === 'instructor' &&

                    <div className='w-full sm:w-1/2 text-white  items-start flex flex-col gap-4'>

                        <div className='flex justify-start w-full sm:w-1/2'>
                            <h2 className='uppercase text-white text-3xl sm:text-4xl font-semibold'>Uploaded <br /><span className='text-white text-5xl sm:text-6xl'>Courses.</span></h2>
                        </div>

                        {isUploadedLoading ? (
                            <div className='w-full text-center'>
                                <ThreeDot color="#9CF57F" size="small" />
                            </div>
                        ) : (
                            <>
                                {
                                    Object.keys(uploadedCourses).map(key => {
                                        return <SwiperSlide key={key} >

                                            <CourseCard
                                                title={uploadedCourses[key].courseName}
                                                instructor={uploadedCourses[key].instructorName}
                                                description={uploadedCourses[key].courseDescription}
                                                vote={uploadedCourses[key].vote}
                                                onClick={() => handleCourseCardClick(key)}
                                                showCTA={true}
                                                text={"View"}
                                            />
                                        </SwiperSlide>
                                    })
                                }
                            </>
                        )}



                        <div className='flex flex-col gap-2'>
                            {
                                Object.keys(uploadedCourses).map((key) => {
                                    return <div key={key}
                                        className=''
                                    >

                                        <CourseCard
                                            title={uploadedCourses[key].courseName}
                                            instructor={uploadedCourses[key].instructorName}
                                            description={uploadedCourses[key].courseDescription}
                                            vote={uploadedCourses[key].vote}
                                            onClick={() => handleCourseCardClick(key)}
                                            showCTA={true}
                                            text={"View"}
                                        />

                                    </div>
                                })
                            }
                        </div>
                    </div>
                }

                {
                    enrolledOrUpdated === "profile" &&
                    <form className='text-white w-full flex flex-col justify-start items-center p-12'>

                        <div className='h-24 w-full '>
                            <Input
                                totalWidth={"w-full"}
                                className={""}
                                type={"text"}
                                name={"name"}
                                value={formData.name}
                                placeholder={"your name"}
                                onChange={(e) => handleInputChange(e)}

                            />

                            {errors && <p className='mt-2 text-xs text-gray'>{errors.name}</p>}
                        </div>

                        <div className='h-24 w-full '>
                            <Input
                                totalWidth={"w-full"}
                                className={""}
                                type={"email"}
                                name={"email"}
                                value={formData.email}
                                placeholder={"your email"}
                                onChange={(e) => handleInputChange(e)}

                            />
                            {errors && <p className='mt-2 text-xs text-gray'>{errors.email}</p>}

                        </div>

                        <div className='h-24 w-full '>

                            <Input
                                totalWidth={"w-full"}
                                className={""}
                                type={"password"}
                                name={"password"}
                                value={formData.password}
                                placeholder={"your password"}
                                onChange={(e) => handleInputChange(e)}

                            />
                            {errors && <p className='mt-2 text-xs text-gray'>{errors.password}</p>}

                        </div>





                        <div className='flex w-full'>
                            <SecondaryButton
                                text={"Update Changes"}
                                classname={`w-1/2 text-white py-3 rounded-none text-xs border-border`}
                                onClick={handleSubmit}
                            >Update Profile</SecondaryButton>



                            {/* ----------------------- show logout button if user logged in -------------------- */}
                            {
                                loggedInUser &&
                                <Logout

                                />
                            }


                        </div>

                    </form>
                }


            </div>


            {/* --------------- gradient line ----------------- */}

            {!isMobile && <div className='h-96 gradient-line-vertical fixed top-1/2 left-1/2 translate-x-1/2 -translate-y-1/2 w-[1px]'></div>
            }




            {/* ----------------- update profile form ------------------ */}

            {!isMobile && <form className='mt-8 w-1/2 flex flex-col justify-start items-center sm:fixed right-0 top-0 translate-y-1/3'>

                <div className='h-24 w-1/2 '>
                    <Input
                        totalWidth={"w-full"}
                        className={""}
                        type={"text"}
                        name={"name"}
                        value={formData.name}
                        placeholder={"your name"}
                        onChange={(e) => handleInputChange(e)}
                    />

                </div>

                <div className='h-24 w-1/2 '>
                    <Input
                        totalWidth={"w-full"}
                        className={""}
                        type={"email"}
                        name={"email"}
                        value={formData.email}
                        placeholder={"your email"}
                        onChange={(e) => handleInputChange(e)}
                    />

                </div>

                <div className='h-24 w-1/2 '>

                    <Input
                        totalWidth={"w-full"}
                        className={""}
                        type={"password"}
                        name={"password"}
                        value={formData.password}
                        placeholder={"your password"}
                        onChange={(e) => handleInputChange(e)}
                    />

                </div>


                <div>
                    <input type="file" name="profileImage"
                        className='hidden'
                        onChange={(e) => handleInputChange(e)}
                    />

                    <div className='border border-border border-dashed text-sm'>
                        Update Image
                    </div>
                </div>



                <div className='flex w-1/2'>
                    <SecondaryButton
                        text={"Update Changes"}
                        classname={`w-1/2 text-white py-3 rounded-none border-border`}
                        onClick={handleUpdateSubmit}
                    >Update Profile</SecondaryButton>



                    {/* ----------------------- show logout button if user logged in -------------------- */}
                    {
                        loggedInUser &&
                        <Logout

                        />
                    }


                </div>

            </form>}
        </div>
    );
}

export default MyProfile;
