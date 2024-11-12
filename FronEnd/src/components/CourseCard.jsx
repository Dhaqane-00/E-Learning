import React from 'react';
import { motion } from 'framer-motion';

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

                {/* Action Buttons */}
                {showCTA && (
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={onClick}
                            className="px-4 py-2 bg-green text-bgOne rounded-full font-semibold hover:bg-opacity-90 transition-colors text-sm"
                        >
                            {text}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CourseCard;
