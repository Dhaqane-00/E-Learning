import React from 'react';
import { FiCheck, FiClock, FiLock } from 'react-icons/fi';
import { useGetEnrollmentProgressQuery } from '../store/Api/Enrollment';

const LessonProgress = ({ lessonId, enrollmentId, isLocked }) => {
    const { data: progress } = useGetEnrollmentProgressQuery(enrollmentId, {
        skip: !enrollmentId
    });

    const isCompleted = progress?.completedLessons?.includes(lessonId);

    return (
        <div className="flex items-center gap-2">
            {isLocked ? (
                <FiLock className="text-gray" />
            ) : isCompleted ? (
                <FiCheck className="text-green" />
            ) : (
                <FiClock className="text-primary" />
            )}
            <span className={`text-sm ${isCompleted ? 'text-green' : 'text-gray'}`}>
                {isCompleted ? 'Completed' : isLocked ? 'Locked' : 'In Progress'}
            </span>
        </div>
    );
};

export default LessonProgress; 