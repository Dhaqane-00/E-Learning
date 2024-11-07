import React, { useContext, useEffect, useState } from 'react'
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


function AllCourses() {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);


    const [courses, setCourses] = useState({})

    const [searchQuery, setSearchQuery] = useState("");

    const { isMobile } = useContext(WindowWidthContext)


    useEffect(() => {

        async function getAllCourses() {
            try {
                setIsLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/public/all-courses`);
                setCourses(response.data)

            }
            catch (e) {
                console.error("Error fetching courses : ", e);
            }
            finally {
                setIsLoading(false)
            }
        }
        getAllCourses();


    }, [])

    console.log(courses);




    const filteredCourses = Object.keys(courses).filter(key =>
        courses[key].courseName.toLowerCase().includes(searchQuery.toLowerCase())
        ||
        courses[key].courseDescription.toLowerCase().includes(searchQuery.toLowerCase())
    ).map(key => courses[key]);






    async function handleCourseCardClick(id) {
        try {

            //take me to the full course page
            navigate(`/course/${id}`)

            toast.success("Course Enrolled", {
                position: "top-right",
                style: {
                    background: "#1C1210",
                    color: "#E5E6E6",
                }

            })


            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/course/${id}/enroll-course`);

            console.log(response.data);


        }
        catch (error) {
            toast.error("Enroll Failed", {
                position: "top-right",
                style: {
                    background: "#1C1210",
                    color: "#E5E6E6",
                }

            })
            console.log(error);

        }

    }



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

                                        Object.keys(searchQuery ? filteredCourses : courses).map((key, index) => {
                                            return <SwiperSlide key={index}>
                                                <CourseCard
                                                    title={searchQuery ? filteredCourses[key].courseName : courses[key].courseName}
                                                    imageUrl={searchQuery ? filteredCourses[key].imageUrl : courses[key].imageUrl}
                                                    instructor={searchQuery ? filteredCourses[key].instructorName : courses[key].instructorName}
                                                    description={searchQuery ? filteredCourses[key].courseDescription : courses[key].courseDescription}
                                                    vote={searchQuery ? filteredCourses[key].vote : courses[key].vote}
                                                    onClick={() => handleCourseCardClick(key)}
                                                    showCTA={true}
                                                    text={"Enroll"}

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
                                                Object.keys(searchQuery ? filteredCourses : courses).map((key, index) => {
                                                    return <motion.div
                                                        initial={{ y: (100), opacity: 0 }}
                                                        animate={{ y: 0, opacity: 100 }}
                                                        transition={{ delay: 0.1 * index }}
                                                        className='masonry-item'
                                                    >
                                                        <CourseCard
                                                            title={searchQuery ? filteredCourses[key].courseName : courses[key].courseName}
                                                            imageUrl={searchQuery ? filteredCourses[key].imageUrl : courses[key].imageUrl}
                                                            instructor={searchQuery ? filteredCourses[key].instructorName : courses[key].instructorName}
                                                            description={searchQuery ? filteredCourses[key].courseDescription : courses[key].courseDescription}
                                                            vote={searchQuery ? filteredCourses[key].vote : courses[key].vote}
                                                            onClick={() => handleCourseCardClick(key)}
                                                            showCTA={true}
                                                            text={"Enroll"}
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