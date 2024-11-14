import React from 'react';

export const ThreeDot = ({ color = "#ffffff", size = "small" }) => {
    const dotSize = size === "small" ? "2" : "3";
    
    return (
        <div className="flex space-x-2 justify-center items-center">
            <div className={`w-${dotSize} h-${dotSize} rounded-full animate-bounce [animation-delay:-0.3s]`} 
                style={{ backgroundColor: color }}></div>
            <div className={`w-${dotSize} h-${dotSize} rounded-full animate-bounce [animation-delay:-0.15s]`}
                style={{ backgroundColor: color }}></div>
            <div className={`w-${dotSize} h-${dotSize} rounded-full animate-bounce`}
                style={{ backgroundColor: color }}></div>
        </div>
    );
};

// Also add a default export if needed
export default ThreeDot; 