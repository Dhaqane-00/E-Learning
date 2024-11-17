import React from 'react';
import { useGetEnrollmentProgressQuery } from '../store/Api/Enrollment';

const ModuleProgress = ({ moduleId, enrollmentId }) => {
    const { data: progress } = useGetEnrollmentProgressQuery(enrollmentId, {
        skip: !enrollmentId
    });

    const moduleProgress = progress?.moduleProgress?.find(
        mp => mp.module === moduleId
    );

    return (
        <div className="w-full space-y-2">
            <div className="flex justify-between text-sm">
                <span className="text-gray">Progress</span>
                <span className="text-primary">{moduleProgress?.progress || 0}%</span>
            </div>
            <div className="w-full bg-bgTwo rounded-full h-1.5">
                <div
                    className="bg-primary h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${moduleProgress?.progress || 0}%` }}
                />
            </div>
        </div>
    );
};

export default ModuleProgress; 