import React from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link } from 'react-router-dom';

function GoBack({ text, goWhere, classname }) {
    return (
        <Link to={goWhere}
            className={`${classname} fixed top-10 left-8 text-gray flex justify-center items-center gap-2 hover:text-white transition-colors duration-300`}
        >
            <IoIosArrowRoundBack size={18} />
            <p className='text-sm'>{text}</p>
        </Link>
    )
}

export default GoBack