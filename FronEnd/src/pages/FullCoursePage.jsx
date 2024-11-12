import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams, useLocation, Navigate, useNavigate } from 'react-router-dom'
import axios from '../config/axiosConfig'
import GoBack from '../components/GoBack';
import { toast } from 'react-hot-toast';
import PrimaryButton from '../components/formComponents/PrimaryButton'
import { ThreeDot } from 'react-loading-indicators';
import { useGetCourseByIdQuery } from '../store/Api/Course';
import Cookies from 'js-cookie';

function FullCoursePage() {

    const navigate = useNavigate();
    const ref = useRef();
    const { courseId } = useParams();

    const { data: course, isLoading, error } = useGetCourseByIdQuery(courseId);
    const [endCourseIsLoading, setEndCourseIsLoading] = useState(false)

    // Get logged-in user ID from cookies
    const loggedInUserId = Cookies.get('userId');

    useEffect(() => {
        if (ref.current) {
            ref.current.scrollIntoView();
        }
    }, []);


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

    const handleEnrollCourse = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/course/${courseId}/enroll-course`);
            
            toast.success("Successfully enrolled!", {
                position: "top-right",
                style: {
                    background: "#1C1210",
                    color: "#E5E6E6",
                }
            });
            
            navigate(`/course/learn/${response.data.enrollmentId}`);
        } catch (error) {
            toast.error("Enrollment failed", {
                position: "top-right",
                style: {
                    background: "#1C1210",
                    color: "#E5E6E6",
                }
            });
            console.log(error);
        }
    };




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

                            {/* Show UpVote button only if the user is not the instructor */}
                            {course?.instructor?._id !== loggedInUserId && (
                                <PrimaryButton
                                    text={"Up Vote"}
                                    classname={"fixed top-10 right-8 font-semibold"}
                                    onClick={() => handleVoteClick(courseId)}
                                />
                            )}

                            <div className='w-2/3 pt-36'>

                                <div className='mb-8'>
                                    <img 
                                        src={course?.thumbnailImage} 
                                        alt={course?.title}
                                        className="w-full h-[400px] object-cover rounded-lg"
                                    />
                                </div>

                                <div className='flex gap-4 items-center mb-8'>
                                    <h1 className='text-4xl font-bold '>{course?.title}</h1>

                                    <div className='bg-bgOne  border border-green w-fit px-6 py-2 rounded-full text-sm font-semibold'>{course?.modules?.length || 0} Modules</div>
                                </div>

                                <div className='mb-12'>
                                    <div className='flex gap-6 mb-6'>
                                        <div className='flex items-center gap-3'>
                                            <img 
                                                src={course?.instructor?.profileImage} 
                                                alt={course?.instructor?.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div>
                                                <span className='text-gray block text-sm'>Instructor</span>
                                                <span className='font-semibold'>{course?.instructor?.name}</span>
                                            </div>
                                        </div>

                                        <div className='flex items-center gap-2'>
                                            <span className='text-gray'>Category:</span>
                                            <span className='font-semibold'>{course?.category}</span>
                                        </div>

                                        <div className='flex items-center gap-2'>
                                            <span className='text-gray'>Price:</span>
                                            <span className='font-semibold'>
                                                {course?.price === 0 ? 'Free' : `$${course?.price}`}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className='mb-6'>
                                        <h3 className='text-gray mb-2'>Description</h3>
                                        <p className='text-white'>{course?.description}</p>
                                    </div>

                                    {course?.tags?.length > 0 && (
                                        <div className='flex gap-2 flex-wrap'>
                                            {course.tags.map((tag, index) => (
                                                <span 
                                                    key={index}
                                                    className='bg-bgOne px-3 py-1 rounded-full text-sm'
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    {course?.modules?.map((module, index) => (
                                        <div key={index} className="mb-4">
                                            {/* Add your module rendering logic here */}
                                        </div>
                                    ))}
                                </div>
                            </div>


                            <PrimaryButton
                                onClick={handleEndCourse}
                                text={"End Course"}
                                isLoading={endCourseIsLoading}
                            />

                            <PrimaryButton
                                text={course?.price === 0 ? "Enroll Now (Free)" : `Enroll Now ($${course?.price})`}
                                onClick={handleEnrollCourse}
                                classname="mt-6"
                            />

                        </div>
                    )


            }


        </div>
    )


}

export default FullCoursePage