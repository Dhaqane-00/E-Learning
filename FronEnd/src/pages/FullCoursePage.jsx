import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams, useLocation, Navigate, useNavigate } from 'react-router-dom'
import axios from '../config/axiosConfig'
import GoBack from '../components/GoBack';
import { toast } from 'react-hot-toast';
import PrimaryButton from '../components/formComponents/PrimaryButton'
import { ThreeDot } from 'react-loading-indicators';

import courseApi, { useGetAllCoursesQuery } from '../store/Api/Course';

import Cookies from 'js-cookie';

const loggedInUser = Cookies.get("user.name")

function FullCoursePage() {

    const navigate = useNavigate();
    const ref = useRef();
    const { courseId } = useParams();

    const { data: courses, isLoading, error } = useGetAllCoursesQuery();
    const [course, setCourse] = useState(null)
    const [endCourseIsLoading, setEndCourseIsLoading] = useState(false)

    useEffect(() => {
        if (ref.current) {
            ref.current.scrollIntoView();
        }
    }, []);

    useEffect(() => {
        if (courses) {
            const foundCourse = courses.find(c => c._id === courseId);
            setCourse(foundCourse);
        }
    }, [courses, courseId]);

    async function handleVoteClick(courseId) {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/course/${courseId}/vote-course`);

            const data = response.data;

            if (response.status == 200) {
                toast.success("Successfully Voted!", {
                    position: "top-right",
                    style: {
                        background: "#1C1210",
                        color: "#E5E6E6",
                    }
                })
            }


        }

        catch (error) {
            if (error.response && error.response.data) {
                console.log(error.response.data);

                toast.error("Already Voted!", {
                    position: "top-right",
                    style: {
                        background: "#1C1210",
                        color: "#E5E6E6",
                    }
                })

            }
        }


    }


    async function handleEndCourse() {
        try {
            setEndCourseIsLoading(true)

            toast.success("Course removed", {
                position: "top-right",
                style: {
                    background: "#1C1210",
                    color: "#E5E6E6",
                }

            })

            await axios.post(`${import.meta.env.VITE_BASE_URL}/course/${courseId}/end-course`)
            navigate("/")

        }
        catch (e) {

            toast.error("Last action failed", {
                position: "top-right",
                style: {
                    background: "#1C1210",
                    color: "#E5E6E6",
                }

            })
            console.log(e);

        }
        finally {
            setEndCourseIsLoading(false)
        }

    }




    return (
        <div ref={ref} className='bg-bgOne text-white px-24 pb-10 min-h-screen'>

            <GoBack
                text={"Go Back"}
                goWhere={"/all-courses"}
            />


            {
                isLoading ?

                    (

                        <div className='flex justify-center items-center min-h-screen text-center'>
                            <ThreeDot color="#9CF57F" size="small" />
                        </div>
                    )

                    :

                    (



                        <div>

                            <div className='w-2/3 pt-36'>

                                <div className='mb-12'>
                                    <div className='flex gap-4 items-center mb-8'>
                                        <h1 className='text-4xl font-bold'>{course?.courseName}</h1>
                                        <div className='bg-bgOne border border-green w-fit px-6 py-2 rounded-full text-sm font-semibold'>
                                            {course?.chapters.length} Chapters
                                        </div>
                                    </div>
                                    
                                    <div className='bg-bgTwo p-8 rounded-md'>
                                        <div className='flex gap-6 mb-6'>
                                            <div className='flex items-center gap-2'>
                                                <span className='text-gray'>Instructor:</span>
                                                <span className='font-semibold'>{course?.instructorName}</span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <span className='text-gray'>Votes:</span>
                                                <span className='font-semibold'>{course?.votes || 0}</span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <span className='text-gray'>Price:</span>
                                                <span className='font-semibold'>${course?.price || 'Free'}</span>
                                            </div>
                                        </div>
                                        
                                        <div className='mb-6'>
                                            <h3 className='text-gray mb-2'>Description</h3>
                                            <p className='text-white'>{course?.description}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    {
                                        course?.chapters?.map((chapter, index) => (
                                            <div key={index} className='mb-8 bg-bgTwo px-8 py-6 flex flex-col gap-y-4'>

                                                <div className='border px-4 py-2 border-border'>
                                                    <h2 className='font-bold text-xl'>{chapter.chapterName}</h2>
                                                </div>


                                                <div className='border px-4 py-2 border-border'>
                                                    <p>{chapter.chapterContent}</p>
                                                </div>

                                            </div>
                                        ))
                                    }
                                </div>
                            </div>


                            {
                                course?.instructorName == loggedInUser && <PrimaryButton
                                    onClick={handleEndCourse}
                                    text={"End Course"}
                                    isLoading={endCourseIsLoading}
                                />
                            }

                        </div>
                    )


            }


        </div>
    )


}

export default FullCoursePage