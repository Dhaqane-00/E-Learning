import React, { useEffect, useState } from 'react'
import axios from '../config/axiosConfig'
import { useParams } from 'react-router-dom'
import { ThreeDot } from 'react-loading-indicators';
import CourseCard from '../components/CourseCard';

function CoursesUploadedByUser() {

    const { userId } = useParams();

    const [isLoading, setIsLoading] = useState(true);

    const [courses, setCourses] = useState([])

    useEffect(() => {

        async function getCourses() {

            try {
                setIsLoading(true)

                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/userId/${userId}/uploaded-courses`)

                const data = await response.data;



                setCourses(data)


            }
            catch (error) {
                console.error(error)
            }
            finally {
                setIsLoading(false)
            }
        }

        getCourses();

        

    }, [])

     return (

        <div className='bg-bgOne pt-36 px-12 pb-10 min-h-screen'>



            {
                isLoading ?
                    (
                        <div className='mt-40 text-center'>
                            <ThreeDot color="#9CF57F" size="small" />
                        </div>
                    )
                    :

                    (
                        <div className='masonry'>
                            {
                                courses.map((course, index) => {
                                    return <div className='masonry-item' key={index}>
                                        <CourseCard

                                            title={course.courseName}
                                            description={course.courseDescription}
                                            vote={course.vote}
                                            showCTA={false}

                                        />
                                    </div>
                                })
                            }

                        </div>
                    )
            }
        </div>

    )
}

export default CoursesUploadedByUser