import React from 'react';
import { FaEnvelope, FaBook, FaArrowRight, FaStar, FaUserPlus } from 'react-icons/fa';
import { IoChevronForward } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom';

function ContributerProfile({ name, email, bio, uploadedCourse, onClick }) {


    return (
        <div className='bg-bgOne border border-border w-full px-8 py-4 flex justify-between items-center hover:bg-bgTwo transition-colors rounded-md'>

            <div className='text-gray mr-12'>
                <div className='flex gap-4 mb-2 text-white'>
                    <h2 className='font-bold text-2xl'>{name}</h2>
                </div>

                {/* <div className='flex items-center mb-3'>
                    <FaEnvelope className="mr-2 " size={13} />
                    <h4>{email}</h4>
                </div> */}

                <div className='flex items-start'>
                    <h4>{bio}</h4>
                </div>

                <button
                    onClick={onClick}
                    className='flex items-center mt-2 bg-gradientForBg bg-clip-text text-transparent'>
                    <FaArrowRight className="mr-2 text-green" size={12} />
                    <h4>Courses: {uploadedCourse}</h4>
                </button>

            </div>

            {/* Follow Icon */}
            <div>
                <FaUserPlus className='text-green cursor-pointer transition-transform transform hover:scale-125' title="Follow" size={24} />
            </div>
        </div>
    );
}

export default ContributerProfile;
