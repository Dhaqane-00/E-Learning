import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams, useLocation, Navigate, useNavigate } from 'react-router-dom'
import axios from '../config/axiosConfig'
import GoBack from '../components/GoBack';
import { toast } from 'react-hot-toast';
import PrimaryButton from '../components/formComponents/PrimaryButton'
import { ThreeDot } from 'react-loading-indicators';
import { useGetCourseByIdQuery } from '../store/Api/Course';
import Cookies from 'js-cookie';
import { useCreateEnrollmentMutation } from '../store/Api/Enrollment';
import CourseModules from '../components/CourseModules';

function FullCoursePage() {

    const navigate = useNavigate();
    const ref = useRef();
    const { courseId } = useParams();

    const { data: course, isLoading, error } = useGetCourseByIdQuery(courseId);
    console.log("course", course);
    
    const [createEnrollment] = useCreateEnrollmentMutation();
    const [isEnrolling, setIsEnrolling] = useState(false);

    // Get logged-in user ID from cookies
    const loggedInUserId = JSON.parse(Cookies.get('user'))?._id;
    console.log("loggedInUserId", loggedInUserId);

    useEffect(() => {
        if (ref.current) {
            ref.current.scrollIntoView();
        }
    }, []);

    const handleEnrollCourse = async () => {
        try {
            setIsEnrolling(true);
            const response = await createEnrollment(courseId).unwrap();
            
            toast.success("Successfully enrolled!", {
                position: "top-right",
                style: {
                    background: "#1C1210",
                    color: "#E5E6E6",
                }
            });
            
            navigate(`/course/learn/${response.enrollment._id}`);
        } catch (error) {
            toast.error(error.data?.message || "Failed to enroll in course", {
                position: "top-right",
                style: {
                    background: "#1C1210",
                    color: "#E5E6E6",
                }
            });
        } finally {
            setIsEnrolling(false);
        }
    };

    const renderActionButton = () => {
        if (!loggedInUserId) {
            return (
                <PrimaryButton
                    text="Login to Enroll"
                    onClick={() => navigate('/login')}
                    classname="mt-6"
                />
            );
        }

        if (course?.instructor?._id === loggedInUserId) {
            console.log("course?.instructor?._id", course?.instructor?._id);
            
            return (
                <PrimaryButton
                    text="Edit Course"
                    onClick={() => navigate(`/course/edit/${courseId}`)}
                    classname="mt-6"
                />
            );
        }

        if (course?.isEnrolled) {
            return (
                <PrimaryButton
                    text="Continue Learning"
                    onClick={() => navigate()}
                    classname="mt-6"
                />
            );
        }

        return (
            <PrimaryButton
                text={course?.price === 0 ? "Enroll Now (Free)" : `Enroll Now ($${course?.price})`}
                onClick={handleEnrollCourse}
                isLoading={isEnrolling}
                classname="mt-6"
            />
        );
    };

    if (isLoading) {
        return (
            <div className='flex justify-center items-center min-h-screen bg-bgOne'>
                <ThreeDot color="#9CF57F" size="small" />
            </div>
        );
    }

    return (
        <div className='bg-bgOne text-white px-4 sm:px-24 pb-10 min-h-screen'>
            {/* Course Header */}
            <div className='pt-8 sm:pt-16'>
                <h1 className='text-3xl sm:text-5xl font-bold mb-4'>{course?.title}</h1>
                <p className='text-gray mb-6'>{course?.description}</p>
                
                {/* Instructor Info */}
                <div className='flex items-center gap-4 mb-6'>
                    <img 
                        src={course?.instructor?.profileImage} 
                        alt={course?.instructor?.name}
                        className='w-12 h-12 rounded-full object-cover'
                    />
                    <div>
                        <p className='text-white font-medium'>{course?.instructor?.name}</p>
                        <p className='text-gray text-sm'>{course?.instructor?.email}</p>
                    </div>
                </div>

                {/* Course Details */}
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8'>
                    <div className='bg-bgTwo p-6 rounded-lg border border-border'>
                        <h3 className='text-xl font-semibold mb-4'>Course Details</h3>
                        <p className='text-gray mb-2'>Category: {course?.category}</p>
                        <p className='text-gray mb-2'>Price: ${course?.price}</p>
                        <p className='text-gray'>Created: {new Date(course?.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    <div className='bg-bgTwo p-6 rounded-lg border border-border'>
                        <img 
                            src={course?.thumbnailImage} 
                            alt={course?.title}
                            className='w-full h-48 object-cover rounded-lg'
                        />
                    </div>
                </div>

                {/* Action Button */}
                {renderActionButton()}

                {/* Modules Section */}
                {course?.modules?.length > 0 ? (
                    <div className='mt-8'>
                        <h2 className='text-2xl font-bold mb-4'>Course Content</h2>
                        <CourseModules modules={course?.modules} isEnrolled={course?.isEnrolled} />
                    </div>
                ) : (
                    <p className='text-gray mt-8'>No modules available yet.</p>
                )}
            </div>
        </div>
    );
}

export default FullCoursePage