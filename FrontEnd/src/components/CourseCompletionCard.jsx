import React from 'react';
import { FiAward } from 'react-icons/fi';
import { useGetEnrollmentProgressQuery } from '../store/Api/Enrollment';

const CourseCompletionCard = ({ enrollmentId }) => {
    const { data: progress } = useGetEnrollmentProgressQuery(enrollmentId, {
        skip: !enrollmentId
    });

    const isCompleted = progress?.progress === 100;

    return (
        <div className="bg-bgTwo p-6 rounded-lg">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${
                    isCompleted ? 'bg-green bg-opacity-20' : 'bg-gray bg-opacity-20'
                }`}>
                    <FiAward className={`text-2xl ${
                        isCompleted ? 'text-green' : 'text-gray'
                    }`} />
                </div>
                <div>
                    <h3 className="font-semibold">
                        {isCompleted ? 'Course Completed!' : 'Course in Progress'}
                    </h3>
                    <p className="text-sm text-gray">
                        {isCompleted 
                            ? 'Congratulations on completing the course!' 
                            : `${progress?.progress || 0}% complete`
                        }
                    </p>
                </div>
            </div>
            {isCompleted && (
                <button className="mt-4 w-full bg-green text-white py-2 rounded-lg">
                    Download Certificate
                </button>
            )}
        </div>
    );
};

export default CourseCompletionCard; 