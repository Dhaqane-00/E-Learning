import React from 'react';
import { useGetEnrollmentProgressQuery } from '../store/Api/Enrollment';

const EnrollmentProgress = ({ enrollmentId }) => {
    const { data: progress, isLoading } = useGetEnrollmentProgressQuery(enrollmentId);

    if (isLoading) {
        return <div>Loading progress...</div>;
    }

    return (
        <div className="bg-bgTwo p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Your Progress</h3>
            <div className="w-full bg-bgOne rounded-full h-2.5">
                <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${progress?.progress || 0}%` }}
                ></div>
            </div>
            <div className="mt-2 text-gray">
                <span>{progress?.progress || 0}% Complete</span>
            </div>
            
            {/* Module Progress */}
            <div className="mt-4 space-y-2">
                {progress?.moduleProgress?.map((module) => (
                    <div key={module.module} className="text-sm">
                        <div className="flex justify-between mb-1">
                            <span>{module.title}</span>
                            <span>{module.progress}%</span>
                        </div>
                        <div className="w-full bg-bgOne rounded-full h-1.5">
                            <div 
                                className="bg-green h-1.5 rounded-full" 
                                style={{ width: `${module.progress}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EnrollmentProgress; 