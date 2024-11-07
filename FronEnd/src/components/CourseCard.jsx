import React from 'react';
import { BiSolidUpvote } from "react-icons/bi";
import { IoPersonSharp } from "react-icons/io5";
import SecondaryButton from './formComponents/SecondaryButton';


const CourseCard = ({ onClick, title, instructor, description, vote, showCTA, text, imageUrl, isLoading }) => {

  return (
    <div className="course-card relative bg-bgTwo p-3 w-74 overflow-hidden hover:border-2 hover:border-border border-2 border-bgTwo transition-all rounded-md h-fit text-sm sm:w-full sm:text-base sm:96 sm:p-6">

      {imageUrl && (
        <img
          src={imageUrl}
          alt="courseThumbnailImage"
          className="w-full h-40 object-cover rounded-sm mb-6 sm:h-48"
        />
      )}


      <h3 className="text-xl font-semibold mb-2 text-white sm:text-2xl">{title}</h3>


      <div className='text-gray'>


        {
          instructor && <div className=' flex gap-2 items-center mb-2'>
            <IoPersonSharp className='text-green text-sm' />
            <p className="font-semibold ">{instructor}</p>
          </div>
        }


        <p className="mb-4">{description}</p>

        <div className="course-card-rating absolute top-0 right-0 flex items-center bg-gradientForBg min-w-4 min-h-4 p-2 m-2 rounded">
          <div className='flex gap-2 justify-center items-center text-bgOne font-semibold text-xs '>{vote} <BiSolidUpvote className='-mt-0.5' /></div>
        </div>

      </div>

      {
        showCTA && <SecondaryButton isLoading={isLoading} text={text} classname={"text-gray"} onClick={onClick} />
      }
    </div>
  );
};

export default CourseCard;
