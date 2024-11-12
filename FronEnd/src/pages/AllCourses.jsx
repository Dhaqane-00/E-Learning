import React, { useContext, useState } from 'react'
import CourseCard from '../components/CourseCard'
import { useNavigate } from 'react-router-dom'
import axios from '../config/axiosConfig'
import { ThreeDot } from 'react-loading-indicators'
import Search from '../components/Search'
import { HiMiniDocumentMagnifyingGlass } from "react-icons/hi2";
import GoBack from '../components/GoBack';
import { motion } from 'framer-motion'
import { WindowWidthContext } from '../context/WindowWidthContext';
import { toast } from 'react-hot-toast'

import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
// import required modules

import { useGetAllCoursesQuery } from '../store/Api/Course';


function AllCourses() {

    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState("");

    const { isMobile } = useContext(WindowWidthContext)

    const { data: courses = {}, isLoading, error } = useGetAllCoursesQuery();

    console.log(courses);




    const filteredCourses = courses?.courses?.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];






    async function handleCourseCardClick(course) {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/course/${course._id}/enroll-course`);
            
            toast.success("Course Enrolled", {
                position: "top-right",
                style: {
                    background: "#1C1210",
                    color: "#E5E6E6",
                }
            });
            
            navigate(`/course/learn/${response.data.enrollmentId}`);
        } catch (error) {
            toast.error("Enrollment Failed", {
                position: "top-right",
                style: {
                    background: "#1C1210",
                    color: "#E5E6E6",
                }
            });
            console.log(error);
        }
    }

    const handleViewClick = (course) => {
        navigate(`/course/${course._id}`);
    };

    const headline = "</ Learn for Free />"


    return (

        <div className='bg-bgOne min-h-screen  sm:px-24 flex flex-col items-center relative overflow-hidden py-8 sm:py-12 w-full'>

            <GoBack text={"Go Back"} goWhere={"/"} />


            <h3 className='text-3xl px-2 sm:text-6xl font-bold text-center sm:pt-10 text-white'>{headline}</h3>


            <h5 className='text-sm sm:text-lg font-medium text-center mt-2 sm:mt-4 mb-6 sm:mb-12 text-gray'>Unlock Your Future Today!</h5>

            <Search
                classname={""}
                placeholder={"Search Courses"}
                onSearch={setSearchQuery}
                icon={<HiMiniDocumentMagnifyingGlass size={18} />}
            />


            {/* ---------------------------- COURSES -------------------------------- */}


            {
                isLoading &&
                <div className='mt-40 text-center'>
                    <ThreeDot color="#9CF57F" size="small" />
                </div>

            }


            {
                isMobile ?

                    // --------------------- MOBILE VIEW ----------------------
                    (


                        !isLoading && (


                            <div className='min-h-96 w-full'>

                                {searchQuery && filteredCourses.length == 0 && <p className='text-center text-sm text-gray mt-28'>No course found with the name : {searchQuery}</p>}

                                <Swiper
                                    slidesPerView={1.2}
                                    spaceBetween={12}
                                    freeMode={true}

                                    modules={[FreeMode]}
                                    className="text-gray w-full mt-4 cursor-move p-4"
                                >

                                    {

                                        (searchQuery ? filteredCourses : courses?.courses || []).map((course, index) => {
                                            return <SwiperSlide key={course._id}>
                                                <CourseCard
                                                    title={course.title}
                                                    imageUrl={course.thumbnailImage}
                                                    instructor={course.instructor.name}
                                                    description={course.description}
                                                    vote={course.vote}
                                                    price={course.price}
                                                    onClick={() => handleCourseCardClick(course)}
                                                    onClickView={() => handleViewClick(course)}
                                                    showCTA={true}
                                                    text="Enroll"
                                                />
                                            </SwiperSlide>
                                        })
                                    }
                                </Swiper>

                            </div>

                        )
                    )

                    :



                    // --------------------- DESKTOP VIEW -------------------------
                    (



                        !isLoading && courses.length == 0 ?
                            (
                                <p className='text-gray mt-32 text-center'>No courses available.</p>
                            )

                            :

                            (

                                (
                                    <div className='mt-12 relative'>

                                        {searchQuery && filteredCourses.length == 0 && <p className='text-gray mt-28'>No course found with the name : {searchQuery}</p>}

                                        <div className='masonry'>
                                            {
                                                (searchQuery ? filteredCourses : courses?.courses || []).map((course, index) => {
                                                    return <motion.div
                                                        key={course._id}
                                                        initial={{ y: (100), opacity: 0 }}
                                                        animate={{ y: 0, opacity: 100 }}
                                                        transition={{ delay: 0.1 * index }}
                                                        className='masonry-item'
                                                    >
                                                        <CourseCard
                                                            title={course.title}
                                                            imageUrl={course.thumbnailImage}
                                                            instructor={course.instructor.name}
                                                            description={course.description}
                                                            vote={course.vote}
                                                            price={course.price}
                                                            onClick={() => handleCourseCardClick(course)}
                                                            onClickView={() => handleViewClick(course)}
                                                            showCTA={true}
                                                            text="Enroll"
                                                        />
                                                    </motion.div>
                                                })
                                            }
                                        </div>

                                    </div>
                                )
                            )


                    )


            }
        </div >

    )

}

export default AllCourses