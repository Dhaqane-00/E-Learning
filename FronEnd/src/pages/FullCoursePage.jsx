import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetCourseByIdQuery } from '../store/Api/Course';
import { useGetEnrollmentProgressQuery } from '../store/Api/Enrollment';
import CourseModules from '../components/CourseModules';
import CourseDetails from '../components/CourseDetails';
import { ThreeDot } from '../components/Loader/ThreeDot';

function FullCoursePage() {
    const { id } = useParams();
    const { data: course, isLoading: courseLoading } = useGetCourseByIdQuery(id, {
        skip: !id
    });

    const { data: progress } = useGetEnrollmentProgressQuery(
        course?.enrollmentId,
        { skip: !course?.isEnrolled || !course?.enrollmentId }
    );
    
    if (courseLoading) {
        return (
            <div className='min-h-screen bg-bgOne flex justify-center items-center'>
                <ThreeDot color="#9CF57F" size="small" />
            </div>
        );
    }
    if (!course) {
        return (
            <div className='min-h-screen bg-bgOne text-white flex justify-center items-center'>
                <p>Course not found</p>
            </div>
        );
    }
    return (
        <div className='bg-bgOne text-white px-4 sm:px-24 pb-10 min-h-screen'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8'>
                {/* Course Details Section */}
                <div className='lg:col-span-3'>
                    <CourseDetails course={course} progress={progress} />
                </div>

                {/* Course Content Section */}
                <div className='lg:col-span-3'>
                    {course.modules?.length > 0 ? (
                        <CourseModules 
                            modules={course.modules} 
                            isEnrolled={course.isEnrolled}
                            enrollmentId={course.enrollmentId} 
                        />
                    ) : (
                        <p className='text-gray mt-8'>No modules available yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FullCoursePage;