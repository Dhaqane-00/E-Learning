import React, { useContext, useEffect, useState } from 'react'
import CourseCard from '../components/CourseCard';
import { Link, redirect, useNavigate } from 'react-router-dom';
import axios from '../config/axiosConfig'
import { ThreeDot } from 'react-loading-indicators'
import Reviews from '../components/Reviews'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { IoArrowForwardSharp } from "react-icons/io5";
import { WindowWidthContext } from '../context/WindowWidthContext';

import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
// import required modules

function Home() {

    const navigate = useNavigate();

    const [courses, setCourses] = useState({});
    const [isLoading, setIsLoading] = useState(false)


    const { isMobile } = useContext(WindowWidthContext)


    const { ref, inView } = useInView({
        triggerOnce: true, // Animates only the first time it enters the viewport
        threshold: 0.0,    // Trigger animation when 10% of the component is visible
    })


    useEffect(() => {
        async function getAllCourses() {
            try {
                setIsLoading(true)
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

    function handleCourseCardClick(id) {

        navigate(`/course/${id}`)
    }



    return (

        <div className='relative bg-bgOne min-h-screen pb-12'>

            <div className='w-full px-4 sm:min-h-screen bg-bgOne flex flex-col justify-center gap-4 sm:px-24 mb-6 sm:mb-0'>



                <div className='w-full bg-bgTwo p-8 flex flex-col items-start gap-2 border border-border rounded-lg sm:p-20 sm:gap-6'>

                    {/* ---------- headline ------------ */}
                    <div className='text-white text-3xl tracking-tight font-semibold sm:text-7xl'>
                        <h2>Discover the Best</h2>
                        <h2>Developer Resources.</h2>
                    </div>

                    {/* ------------- subtext ------------ */}
                    <div className='text-gray text-lg mb-4 sm:mb-0'>
                        <p>Voted by developers like you, for you.</p>
                    </div>


                    {/* ------------ cta button ---------------- */}
                    <Link to={"/all-courses"} className='text-bgOne bg-gradientForBg px-5 py-2 rounded-full text-sm font-semibold'>View Courses</Link>
                </div>


                {/* ----------------- notification for mobile view ---------------- */}
                {
                    isMobile && isLoading && <div className='flex gap-2 text-xs items-center'>
                        <IoArrowForwardSharp className='text-green' />
                        <p className='text-gray'>Deployed on Render free tier, please be patient.</p>
                    </div>
                }


            </div>


            {/* -------------------------------- COURSES ---------------------------------- */}


            {
                isLoading &&

                <div className='text-center mb-4 w-full' >
                    <ThreeDot color="#9CF57F" size="small" />
                </div>

            }



            {

                isMobile ?

                    // -------------------- MOBILE VIEW ---------------------
                    (

                        !isLoading && (

                            <div className='min-h-96 px-4'>
                                <Swiper
                                    slidesPerView={1.2}
                                    spaceBetween={12}
                                    freeMode={true}

                                    modules={[FreeMode]}
                                    className="text-gray w-full cursor-move"
                                >

                                    {
                                        Object.keys(courses).map((key, index) => {
                                            return <SwiperSlide key={index}>
                                                <CourseCard
                                                    title={courses[key].courseName}
                                                    imageUrl={courses[key].imageUrl}
                                                    instructor={courses[key].instructorName}
                                                    description={courses[key].courseDescription}
                                                    vote={courses[key].vote}
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

                    // ---------------------- DESKTOP VIEW ----------------------

                    (

                        <div className='px-24 w-full mb-20  flex justify-center items-center'>

                            {
                                !isLoading &&

                                (
                                    <div ref={ref} className='masonry'>
                                        {
                                            Object.keys(courses).map((key, index) => {

                                                return <motion.div
                                                    initial={{ y: (100), opacity: 0 }}
                                                    animate={inView ? { y: 0, opacity: 100 } : {}}
                                                    transition={{ delay: 0.1 * index }}

                                                    key={key} className="masonry-item">

                                                    <CourseCard
                                                        title={courses[key].courseName}
                                                        imageUrl={courses[key].imageUrl}
                                                        instructor={courses[key].instructorName}
                                                        description={courses[key].courseDescription}
                                                        vote={courses[key].vote}
                                                        onClick={() => handleCourseCardClick(key)}
                                                        showCTA={true}
                                                        text={"Enroll"}

                                                    />
                                                </motion.div>

                                            })
                                        }

                                    </div>
                                )
                            }


                        </div >



                    )



            }





            {/* ----------------------------------- REVIEWS ------------------------------------- */}

            <div className='w-full px-4 sm:px-24'>

                <div className='bg-bgTwo w-full p-8 sm:p-20 flex flex-col gap-6 sm:gap-16 h-fit sm:h-screen rounded-lg border border-border'>

                    <div className='w-full flex flex-col'>


                        <div className='text-white text-3xl sm:text-7xl tracking-tight font-semibold'>
                            <h2>Success Stories</h2>
                            <h2>from our Community.</h2>
                        </div>


                    </div>

                    <Reviews />

                </div>
            </div>



        </div >

    )
}

export default Home