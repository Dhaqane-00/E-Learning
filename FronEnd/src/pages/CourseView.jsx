import React from 'react';
import CourseModules from '../components/CourseModules';
import CourseCompletionCard from '../components/CourseCompletionCard';

const CourseView = ({ courseId, enrollmentId }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <CourseModules
                    modules={modules}
                    isEnrolled={!!enrollmentId}
                    enrollmentId={enrollmentId}
                />
            </div>
            <div>
                <CourseCompletionCard enrollmentId={enrollmentId} />
            </div>
        </div>
    );
};

export default CourseView; 