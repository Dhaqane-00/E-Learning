import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams, useLocation, Navigate, useNavigate } from 'react-router-dom'
import axios from '../config/axiosConfig'
import GoBack from '../components/GoBack';
import { toast } from 'react-hot-toast';
import PrimaryButton from '../components/formComponents/PrimaryButton'
import { ThreeDot } from 'react-loading-indicators';
import { AuthContext } from '../context/AuthContext'

function FullCoursePage() {

    const navigate = useNavigate();
    const ref = useRef();
    const { courseId } = useParams();

    const { loggedInUser } = useContext(AuthContext)
    const [course, setCourse] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [endCourseIsLoading, setEndCourseIsLoading] = useState(false)

    useEffect(() => {
        if (ref.current) {
            ref.current.scrollIntoView();
        }
    }, []);


    useEffect(() => {
        async function getCourse() {
            try {
                setIsLoading(true)
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/public/course/${courseId}`);
                const data = response.data;
                setCourse(data);
            }
            catch (e) {
                console.error("Error fetching course : ", e);
            }
            finally {
                setIsLoading(false)
            }
        }
        getCourse();
    }, [])






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

                            {
                                course?.instructorName != loggedInUser && <PrimaryButton
                                    text={"Up Vote"}
                                    classname={"fixed top-10 right-8 font-semibold"}
                                    onClick={() => handleVoteClick(courseId)}
                                />
                            }

                            <div className='w-2/3 pt-36'>

                                <div className='flex gap-4 items-center mb-8'>
                                    <h1 className='text-4xl font-bold '>{course?.courseName}</h1>

                                    <div className='bg-bgOne  border border-green w-fit px-6 py-2 rounded-full text-sm font-semibold'>{course?.chapters.length} Chapters</div>
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


                            {/* when a user ends a course, course will be removed from the user's 'Enrolled course list' */}

                            {/* also if the course is uploaded by the logged in user, do not show 'end course' */}

                            {
                                course?.instructorName != loggedInUser && <PrimaryButton
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