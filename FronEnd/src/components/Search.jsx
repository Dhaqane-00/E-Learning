import React from 'react'

function Search({classname, onSearch, placeholder, icon}) {

    return (
        <div className={`w-72 sm:w-96 ${classname}`}>


            <div className='relative w-full'>

                <input
                    type="text"
                    placeholder={placeholder}
                    className='pl-12 w-full bg-bgTwo pr-6 text-white border-border focus:border-border focus:ring-0 rounded-full py-3 placeholder-gray '
                    onChange={(e) => onSearch(e.target.value)}
                />

                <div className='text-green absolute  top-1/2 -translate-y-1/2 left-5'>
                    {icon}
                </div>
            </div>

        </div>
    )
}

export default Search