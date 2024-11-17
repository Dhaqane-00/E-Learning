import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { IoPersonSharp } from "react-icons/io5";
import { BiSolidUpvote } from "react-icons/bi";
import { invariant, motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer'

function VotingPageCourseCard({ courseName, instructor, index, imageUrl, vote }) {

    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1
    })
    return (

        <motion.div

            initial={{ x: (-300), opacity: 0 }}
            animate={inView ? { x: 0, opacity: 100 } : {}}
            transition={{ delay: 0.1 * index }}


            className='flex justify-start items-center w-full h-fit' >

            <div ref={ref} className='w-full  bg-gradient-to-b from-bgTwo to-bgOne rounded-xl px-4 py-4'>

                <div className='w-full bg-gradientForBg to-bgOne rounded-lg px-0.5 py-0.5'>

                    <div className='w-full bg-bgOne rounded-lg gap-4 px-6 text-white flex justify-between'>



                        <div className='w-1/6 flex justify-center '>
                            <h4 className='flex gap-3 font-semibold text-xl justify-start items-center'> <BiSolidUpvote size={15} className='text-green' /> {vote}</h4>
                        </div>


                        <div className='w-4/6 flex justify-start'>
                            <h4 className='py-10 text-4xl tracking-tighter font-bold flex justify-start items-center bg-gradientForBg bg-clip-text text-transparent'>{courseName}</h4>
                        </div>

                        <div className='  w-1/6 flex justify-center'>
                            <h4 className='flex font-semibold text-xl gap-4 justify-start items-center'> <IoPersonSharp size={15} className='text-green' /> {instructor}</h4>
                        </div>




                    </div>
                </div>

            </div>

        </motion.div >


    )
}

export default VotingPageCourseCard