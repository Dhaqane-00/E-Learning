import React, { useContext } from 'react'
import CourseCard from '../components/CourseCard';
import { Link, redirect, useNavigate } from 'react-router-dom';
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
import courseApi, { useGetAllCoursesQuery } from '../store/Api/Course';

function Home() {

    const navigate = useNavigate();

    const { isMobile } = useContext(WindowWidthContext)

    const { data: coursesData, isLoading } = useGetAllCoursesQuery();

    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.0,
    });

    const handleCourseCardClick = (course) => {
        const path = coursesData.message === 'Continue Learning' 
            ? `/course/learn/${course.enrollmentId}`
            : `/course/${course._id}`;
        navigate(path);
    };

    const handleViewClick = (course) => {
        navigate(`/course/${course._id}`);
    };

    const renderCourseCard = (course) => (
        <CourseCard
            key={course._id}
            title={course.title}
            imageUrl={course.thumbnailImage}
            instructor={course.instructor.name}
            description={course.description}
            vote={course.vote}
            price={course.price}
            onClick={() => handleCourseCardClick(course)}
            onClickView={() => handleViewClick(course)}
            showCTA={true}
        />
    );

    const renderMobileView = () => (
        <div className='min-h-96 px-4'>
            <Swiper
                slidesPerView={1.2}
                spaceBetween={12}
                freeMode={true}
                modules={[FreeMode]}
                className="text-gray w-full cursor-move"
            >
                {coursesData.courses.map((course) => (
                    <SwiperSlide key={course._id}>
                        {renderCourseCard(course)}
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );

    const renderDesktopView = () => (
        <div className='px-24 w-full mb-20 flex justify-center items-center'>
            <div ref={ref} className='masonry'>
                {coursesData.courses.map((course, index) => (
                    <motion.div
                        key={course._id}
                        initial={{ y: 100, opacity: 0 }}
                        animate={inView ? { y: 0, opacity: 100 } : {}}
                        transition={{ delay: 0.1 * index }}
                        className="masonry-item"
                    >
                        {renderCourseCard(course)}
                    </motion.div>
                ))}
            </div>
        </div>
    );

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
                {/* {
                    isMobile && isLoading && <div className='flex gap-2 text-xs items-center'>
                        <IoArrowForwardSharp className='text-green' />
                        <p className='text-gray'>Deployed on Render free tier, please be patient.</p>
                    </div>
                } */}


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

                        !isLoading && coursesData?.courses?.length > 0 && (

                            renderMobileView()

                        )


                    )

                    :

                    // ---------------------- DESKTOP VIEW ----------------------

                    (

                        !isLoading && coursesData?.courses?.length > 0 && (

                            renderDesktopView()

                        )



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