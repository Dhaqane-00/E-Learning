import React, { useState } from 'react';
import { useCreateEnrollmentMutation } from '../store/Api/Enrollment';
import { FiShoppingCart, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

const EnrollButton = ({ courseId, price, isEnrolled }) => {
    const [createEnrollment, { isLoading }] = useCreateEnrollmentMutation();
    const [error, setError] = useState(null);

    const handleEnroll = async () => {
        const token = Cookies.get('token');
        if (!token) {
            toast.error('Please login to enroll in this course');
            return;
        }

        try {
            toast.loading('Enrolling in course...', {
                id: 'enrollmentLoading'
            });

            await createEnrollment(courseId).unwrap();
            
            toast.dismiss('enrollmentLoading');
            toast.success('Successfully enrolled in course!');
            
            console.log('Enrollment successful');
            window.location.reload();
        } catch (err) {
            toast.dismiss('enrollmentLoading');
            toast.error('Failed to enroll in course');
            
            console.log(err);
            setError(err.message || 'Failed to enroll in course');
        }
    };

    if (isEnrolled) {
        return (
            <button 
                className="w-full bg-green bg-opacity-20 text-green py-3 px-6 rounded-lg flex items-center justify-center gap-2 cursor-default"
                disabled
            >
                <FiCheck className="text-xl" />
                Enrolled
            </button>
        );
    }

    return (
        <div className="space-y-2">
            <button
                onClick={handleEnroll}
                disabled={isLoading}
                className="w-full bg-primary hover:bg-opacity-90 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2"
            >
                <FiShoppingCart className="text-xl" />
                {isLoading ? 'Processing...' : price > 0 ? `Enroll for $${price}` : 'Enroll Now (Free)'}
            </button>
            {error && (
                <p className="text-red text-sm text-center">{error}</p>
            )}
        </div>
    );
};

export default EnrollButton; 