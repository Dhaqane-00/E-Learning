import React, { useRef, useState } from 'react';
import { FiCheck, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useUpdateEnrollmentProgressMutation } from '../store/Api/Enrollment';

const VideoPlayer = ({ 
    videoUrl, 
    lessonId, 
    moduleId, 
    enrollmentId,
    onComplete,
    onNext,
    onPrevious,
    hasNext,
    hasPrevious,
    isCompleted: initialIsCompleted = false
}) => {
    const videoRef = useRef(null);
    const [updateProgress] = useUpdateEnrollmentProgressMutation();
    const [isCompleted, setIsCompleted] = useState(initialIsCompleted);
    const [loading, setLoading] = useState(false);

    const handleCompletion = async () => {
        if (!enrollmentId) return;
        
        setLoading(true);
        try {
            await updateProgress({
                enrollmentId,
                lessonId,
                moduleId,
                completed: !isCompleted
            }).unwrap();
            
            setIsCompleted(!isCompleted);
            if (!isCompleted && onComplete) {
                onComplete(lessonId);
            }
        } catch (error) {
            console.error('Failed to update progress:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
                <video
                    ref={videoRef}
                    className="w-full h-full"
                    controls
                    src={videoUrl}
                    controlsList="nodownload"
                    playsInline
                >
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Navigation and Completion Controls */}
            <div className="flex items-center justify-between bg-bgTwo p-4 rounded-lg">
                <button
                    onClick={onPrevious}
                    disabled={!hasPrevious}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg
                        ${hasPrevious 
                            ? 'text-white hover:bg-bgOne' 
                            : 'text-gray cursor-not-allowed'}`}
                >
                    <FiChevronLeft />
                    Previous
                </button>

                <button
                    onClick={handleCompletion}
                    disabled={loading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg
                        ${isCompleted 
                            ? 'bg-green bg-opacity-20 text-green' 
                            : 'bg-bgOne text-white hover:bg-opacity-80'}`}
                >
                    <FiCheck className={isCompleted ? 'text-green' : 'text-white'} />
                    {loading ? 'Updating...' : isCompleted ? 'Completed' : 'Mark as Complete'}
                </button>

                <button
                    onClick={onNext}
                    disabled={!hasNext}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg
                        ${hasNext 
                            ? 'text-white hover:bg-bgOne' 
                            : 'text-gray cursor-not-allowed'}`}
                >
                    Next
                    <FiChevronRight />
                </button>
            </div>
        </div>
    );
};

export default VideoPlayer; 