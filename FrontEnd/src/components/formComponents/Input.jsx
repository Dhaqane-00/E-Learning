import React from 'react'
import { RiArrowRightUpLine } from "react-icons/ri";

function Input({ className, type, name, value, placeholder, onChange, totalWidth}) {


    const firstLetter = name.slice(0, 1).toUpperCase();
    const labelName = firstLetter + name.slice(1, name.length);

    return (
        <div className={`${totalWidth} flex flex-col items-start justify-center gap-2 `}>

            <label className=' text-white' htmlFor={name}>{labelName}</label>

            <div className='flex items-center justify-center w-full '>
                <input type={type}
                    name={name}
                    className={`placeholder-gray p-0 pr-8 w-full text-white bg-transparent flex items-center justify-center border-none focus:border-none focus:ring-0 ${className}`}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                />



            </div>



            <div className='line-1'></div>

        </div>
    )
}

export default Input