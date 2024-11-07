import React, { useEffect, useState } from 'react'
import VotingPageCourseCard from '../components/VotingPageCourseCard';
import axios from '../config/axiosConfig'

import { motion } from "framer-motion"


function VoteResources() {

    const [courses, setCourses] = useState([]);

    useEffect(() => {

        async function getTopVotedCourses() {
            try {

                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/public/top-voted`);

                const data = response.data;
                setCourses(data)



            }
            catch (error) {
                if (response.data && response.data.error) {
                    console.log(error);

                }
            }
        }

        getTopVotedCourses();

    }, [])






    return (

        <div className='w-fill min-h-screen bg-bgOne flex justify-center items-center flex-col pb-32'>


            <motion.div animate={{ x: 100 }} />


            {/* -------------- headline -------------- */}
            <div className='min-h-screen flex flex-col justify-center items-center text-center'>

                <motion.h2
                    initial={{ y: (400), opacity: 0 }}
                    animate={{ y: 0, opacity: 100 }}
                    transition={{ delay: 0.1 }}
                    className='font-semibold bg-gradientForBg bg-clip-text text-transparent font-md text-8xl tracking-tighter'>Discover, Vote,</motion.h2>

                <motion.h2
                    initial={{ y: (400), opacity: 0 }}
                    animate={{ y: 0, opacity: 100 }}
                    transition={{ delay: 0.15 }}
                    className='font-semibold bg-gradientForBg bg-clip-text text-transparent  text-8xl tracking-tighter text'
                >
                    Elevate <span className='font-light text-white'>the Best </span>
                </motion.h2>

                <motion.h2
                    initial={{ y: (400), opacity: 0 }}
                    animate={{ y: 0, opacity: 100 }}
                    transition={{ delay: 0.20 }}

                    className='-mt-1 text-white font-light font-md text-8xl tracking-tighter'>Courses.
                </motion.h2>


            </div>


            {/* ----------------- open votes ---------------- */}


            <div className='w-full flex flex-col px-40 overflow-y-hidden'>

                {
                    courses.map((course, index) => {
                        return <VotingPageCourseCard
                            key={index}
                            courseName={course.courseName}
                            instructor={course.instructorName}
                            imageUrl={course.imageUrl}
                            index={index + 1}
                            vote={course.vote}
                        />
                    })
                }

            </div>
        </div>
    )
}

export default VoteResources