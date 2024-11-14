import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronUp, FiPlay, FiLock, FiBook, FiCheck } from 'react-icons/fi';
import { useGetEnrollmentProgressQuery } from '../store/Api/Enrollment';
import VideoPlayer from './VideoPlayer';

const CourseModules = ({ modules, isEnrolled, enrollmentId }) => {
    const [expandedModules, setExpandedModules] = useState(new Set());
    const [activeLesson, setActiveLesson] = useState(null);
    const [activeLessonIndex, setActiveLessonIndex] = useState({ moduleIndex: 0, lessonIndex: 0 });
    const [completedLessons, setCompletedLessons] = useState(new Set());

    const { data: progressData } = useGetEnrollmentProgressQuery(
        enrollmentId,
        { skip: !isEnrolled || !enrollmentId }
    );

    useEffect(() => {
        if (progressData?.completedLessons) {
            setCompletedLessons(new Set(progressData.completedLessons));
        }
    }, [progressData]);

    const findLessonIndices = (lessonId) => {
        for (let moduleIndex = 0; moduleIndex < modules.length; moduleIndex++) {
            const lessonIndex = modules[moduleIndex].lessons.findIndex(
                lesson => lesson._id === lessonId
            );
            if (lessonIndex !== -1) {
                return { moduleIndex, lessonIndex };
            }
        }
        return null;
    };

    const handleLessonClick = (lesson, moduleId) => {
        if (!isEnrolled) return;
        const indices = findLessonIndices(lesson._id);
        if (indices) {
            setActiveLessonIndex(indices);
            setActiveLesson({ ...lesson, moduleId });
            setExpandedModules(prev => new Set([...prev, moduleId]));
        }
    };

    const handleLessonComplete = (lessonId) => {
        setCompletedLessons(prev => new Set([...prev, lessonId]));
    };

    const navigateToLesson = (direction) => {
        const { moduleIndex, lessonIndex } = activeLessonIndex;
        let newModuleIndex = moduleIndex;
        let newLessonIndex = lessonIndex;

        if (direction === 'next') {
            if (lessonIndex + 1 < modules[moduleIndex].lessons.length) {
                newLessonIndex++;
            } else if (moduleIndex + 1 < modules.length) {
                newModuleIndex++;
                newLessonIndex = 0;
            }
        } else {
            if (lessonIndex > 0) {
                newLessonIndex--;
            } else if (moduleIndex > 0) {
                newModuleIndex--;
                newLessonIndex = modules[newModuleIndex].lessons.length - 1;
            }
        }

        if (newModuleIndex !== moduleIndex || newLessonIndex !== lessonIndex) {
            const newLesson = modules[newModuleIndex].lessons[newLessonIndex];
            handleLessonClick(newLesson, modules[newModuleIndex]._id);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Player Section */}
            <div className="lg:col-span-2 space-y-4">
                {activeLesson ? (
                    <>
                        <VideoPlayer
                            videoUrl={activeLesson.videoUrl}
                            lessonId={activeLesson._id}
                            moduleId={activeLesson.moduleId}
                            enrollmentId={enrollmentId}
                            onComplete={handleLessonComplete}
                            onNext={() => navigateToLesson('next')}
                            onPrevious={() => navigateToLesson('previous')}
                            hasNext={
                                activeLessonIndex.lessonIndex + 1 < modules[activeLessonIndex.moduleIndex].lessons.length ||
                                activeLessonIndex.moduleIndex + 1 < modules.length
                            }
                            hasPrevious={
                                activeLessonIndex.lessonIndex > 0 ||
                                activeLessonIndex.moduleIndex > 0
                            }
                            isCompleted={completedLessons.has(activeLesson._id)}
                        />
                        <div className="bg-bgTwo p-4 rounded-lg">
                            <h3 className="text-xl font-semibold mb-2">
                                {activeLesson.title}
                            </h3>
                            {activeLesson.content && (
                                <p className="text-gray">{activeLesson.content}</p>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="bg-bgTwo p-8 rounded-lg text-center">
                        <FiPlay className="text-4xl text-primary mx-auto mb-4" />
                        <h3 className="text-xl font-semibold">
                            Select a lesson to start learning
                        </h3>
                        <p className="text-gray mt-2">
                            Choose from the curriculum on the right
                        </p>
                    </div>
                )}
            </div>

            {/* Curriculum Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4">Course Curriculum</h3>
                {modules?.map((module, moduleIndex) => (
                    <div key={module._id} className="bg-bgTwo rounded-lg overflow-hidden">
                        <button
                            onClick={() => {
                                const newExpanded = new Set(expandedModules);
                                if (newExpanded.has(module._id)) {
                                    newExpanded.delete(module._id);
                                } else {
                                    newExpanded.add(module._id);
                                }
                                setExpandedModules(newExpanded);
                            }}
                            className="w-full px-6 py-4 flex justify-between items-center"
                        >
                            <h4 className="font-semibold text-left">
                                Module {moduleIndex + 1}: {module.title}
                            </h4>
                            {expandedModules.has(module._id) ? 
                                <FiChevronUp /> : 
                                <FiChevronDown />
                            }
                        </button>

                        {expandedModules.has(module._id) && (
                            <div className="border-t border-border">
                                {module.lessons?.map((lesson, lessonIndex) => (
                                    <button
                                        key={lesson._id}
                                        onClick={() => handleLessonClick(lesson, module._id)}
                                        disabled={!isEnrolled}
                                        className={`w-full px-6 py-3 flex items-center gap-4 
                                            hover:bg-bgOne transition-colors
                                            ${lessonIndex !== module.lessons.length - 1 ? 'border-b border-border' : ''}
                                            ${activeLesson?._id === lesson._id ? 'bg-bgOne' : ''}
                                            ${completedLessons.has(lesson._id) ? 'bg-opacity-10 bg-green' : ''}`}
                                    >
                                        <div className="w-6 h-6 rounded-full bg-bgOne flex items-center justify-center">
                                            {!isEnrolled ? (
                                                <FiLock className="text-sm text-gray" />
                                            ) : completedLessons.has(lesson._id) ? (
                                                <FiCheck className="text-sm text-green" />
                                            ) : lesson.videoUrl ? (
                                                <FiPlay className="text-sm text-primary" />
                                            ) : (
                                                <FiBook className="text-sm text-primary" />
                                            )}
                                        </div>
                                        <span className="text-left">{lesson.title}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseModules;