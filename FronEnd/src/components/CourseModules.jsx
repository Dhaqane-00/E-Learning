import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiPlay, FiLock, FiBook } from 'react-icons/fi';
import { BiTime } from 'react-icons/bi';

const CourseModules = ({ modules, isEnrolled }) => {
    const [expandedModules, setExpandedModules] = useState(new Set());
    const [activeLesson, setActiveLesson] = useState(null);

    const toggleModule = (moduleId) => {
        setExpandedModules(prev => {
            const newSet = new Set(prev);
            if (newSet.has(moduleId)) {
                newSet.delete(moduleId);
            } else {
                newSet.add(moduleId);
            }
            return newSet;
        });
    };

    const handleLessonClick = (lesson) => {
        if (isEnrolled) {
            setActiveLesson(lesson);
        }
    };

    const LessonContent = ({ lesson }) => {
        if (!lesson) return null;

        if (lesson.type === 'Video' && lesson.videoUrl) {
            return (
                <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
                    <video
                        controls
                        className="w-full h-full"
                        src={lesson.videoUrl}
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            );
        }

        if (lesson.type === 'Text' && lesson.content) {
            return (
                <div className="prose prose-invert max-w-none">
                    <div className="bg-bgTwo p-6 rounded-lg">
                        {lesson.content}
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Player Section */}
            <div className="lg:col-span-2 space-y-4">
                {activeLesson ? (
                    <>
                        <LessonContent lesson={activeLesson} />
                        <div className="bg-bgTwo p-4 rounded-lg">
                            <h3 className="text-xl font-semibold mb-2">{activeLesson.title}</h3>
                            {activeLesson.content && (
                                <p className="text-gray">{activeLesson.content}</p>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="bg-bgTwo p-8 rounded-lg text-center">
                        <FiPlay className="text-4xl text-primary mx-auto mb-4" />
                        <h3 className="text-xl font-semibold">Select a lesson to start learning</h3>
                        <p className="text-gray mt-2">Choose from the curriculum on the right</p>
                    </div>
                )}
            </div>

            {/* Curriculum Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4">Course Curriculum</h3>
                {modules.map((module, moduleIndex) => (
                    <div 
                        key={module._id}
                        className="bg-bgTwo rounded-xl border border-border overflow-hidden"
                    >
                        <button
                            onClick={() => toggleModule(module._id)}
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-opacity-50"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-primary font-semibold">
                                    {moduleIndex + 1}
                                </span>
                                <div className="text-left">
                                    <h3 className="font-semibold text-lg">{module.title}</h3>
                                    <p className="text-gray text-sm">
                                        {module.lessons?.length} lessons
                                    </p>
                                </div>
                            </div>
                            {expandedModules.has(module._id) ? 
                                <FiChevronUp className="text-2xl text-gray" /> : 
                                <FiChevronDown className="text-2xl text-gray" />
                            }
                        </button>

                        {expandedModules.has(module._id) && (
                            <div className="border-t border-border">
                                {module.lessons?.map((lesson, lessonIndex) => (
                                    <button 
                                        key={lesson._id}
                                        onClick={() => handleLessonClick(lesson)}
                                        className={`w-full px-6 py-3 flex items-center gap-4 hover:bg-bgOne transition-colors
                                            ${lessonIndex !== module.lessons.length - 1 ? 'border-b border-border' : ''}
                                            ${activeLesson?._id === lesson._id ? 'bg-bgOne' : ''}`}
                                    >
                                        <div className="w-6 h-6 rounded-full bg-bgOne flex items-center justify-center">
                                            {!isEnrolled ? (
                                                <FiLock className="text-sm text-gray" />
                                            ) : lesson.type === 'Video' ? (
                                                <FiPlay className="text-sm text-primary" />
                                            ) : (
                                                <FiBook className="text-sm text-primary" />
                                            )}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <h4 className="font-medium">{lesson.title}</h4>
                                            <div className="flex items-center gap-2 text-gray text-sm">
                                                <BiTime />
                                                <span>
                                                    {lesson.duration ? `${Math.round(lesson.duration / 60)} mins` : 'Text lesson'}
                                                </span>
                                            </div>
                                        </div>
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