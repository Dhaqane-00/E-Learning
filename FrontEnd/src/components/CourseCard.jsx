import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function CourseCard({
    title,
    imageUrl,
    instructor,
    description,
    vote,
    price,
    onClick,
    onClickView,
    showCTA,
    text
}) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (course?._id) {
            navigate(`/course/${course._id}`);
        }
    };

    return (
        <div className="bg-bgTwo p-4 rounded-lg border border-border" onClick={onClickView}>
            {/* Course Image */}
            <img 
                src={imageUrl} 
                alt={title}
                className="w-full h-48 object-cover rounded-lg mb-4"
            />

            {/* Course Info */}
            <div className="space-y-2">
                <h3 className="text-white text-xl font-semibold">{title}</h3>
                <p className="text-gray text-sm">{instructor}</p>
                <p className="text-gray text-sm line-clamp-2">{description}</p>
                
                {/* Stats */}
                <div className="flex justify-between items-center">
                    <span className="text-green">⭐ {vote}</span>
                    <span className="text-white font-semibold">
                        {price === 0 ? 'Free' : `$${price}`}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default CourseCard;
