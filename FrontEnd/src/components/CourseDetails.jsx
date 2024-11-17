import React from 'react';
import { FiClock, FiBook, FiUser, FiBarChart, FiDollarSign, FiAward } from 'react-icons/fi';
import EnrollButton from './EnrollButton';

const CourseDetails = ({ course, progress }) => {
    return (
        <div className="bg-bgTwo rounded-lg overflow-hidden">
            {/* Course Image Banner */}
            <div className="relative w-full h-[300px]">
                <img 
                    src={course?.thumbnailImage} 
                    alt={course?.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = defaultCourseImg;
                    }}
                />
                {/* Overlay with course price if not enrolled */}
                {!course?.isEnrolled && (
                    <div className="absolute top-4 right-4 bg-bgOne bg-opacity-90 px-4 py-2 rounded-full">
                        <div className="flex items-center gap-2">
                            <FiDollarSign className="text-primary" />
                            <span className="text-white font-semibold">
                                {course?.price ? `$${course.price}` : 'Free'}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Course Content */}
            <div className="p-6 space-y-6">
                {/* Course Header */}
                <div className="space-y-4">
                    <div className="flex justify-between items-start">
                        <h1 className="text-3xl font-bold text-white">{course?.title}</h1>
                    </div>
                    <p className="text-gray">{course?.description}</p>
                </div>

                {/* Enrollment/Progress Section */}
                <div className="bg-bgOne p-6 rounded-lg space-y-6">
                    {course?.isEnrolled ? (
                        // Progress Section for enrolled users
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white">Your Progress</h3>
                            <div className="w-full bg-bgTwo rounded-full h-2">
                                <div 
                                    className="bg-primary h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress?.progress || 0}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray">
                                    {progress?.completedLessons?.length || 0} lessons completed
                                </span>
                                <span className="text-primary">
                                    {progress?.progress || 0}% Complete
                                </span>
                            </div>
                        </div>
                    ) : (
                        // Enrollment Section for non-enrolled users
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-bold text-white">
                                        {course?.price > 0 ? `$${course.price}` : 'Free'}
                                    </h3>
                                    <p className="text-gray">One-time payment</p>
                                </div>
                                <div className="flex items-center gap-2 text-primary">
                                    <FiAward className="text-xl" />
                                    <span>Certificate Included</span>
                                </div>
                            </div>
                            
                            <EnrollButton 
                                courseId={course?._id}
                                price={course?.price}
                                isEnrolled={course?.isEnrolled}
                            />

                            {/* What's Included Section */}
                            <div className="space-y-3 pt-4">
                                <h4 className="font-semibold text-white">What's included:</h4>
                                <ul className="space-y-2 text-gray">
                                    <li className="flex items-center gap-2">
                                        <FiClock className="text-primary" />
                                        {course?.duration || '0'} hours of content
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <FiBook className="text-primary" />
                                        {course?.modules?.length || 0} modules
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <FiAward className="text-primary" />
                                        Certificate of completion
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <FiUser className="text-primary" />
                                        Full lifetime access
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* Course Content Overview */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">Course Content</h3>
                    <div className="space-y-2">
                        {course?.modules?.map((module, index) => (
                            <div 
                                key={module._id} 
                                className="flex justify-between text-gray bg-bgOne p-3 rounded-lg"
                            >
                                <span>Module {index + 1}: {module.title}</span>
                                <span>{module.lessons?.length || 0} lessons</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails; 