import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom';
import { ThreeDot } from 'react-loading-indicators'
import { useSelector } from 'react-redux'

function ProtectedRoute({ children }) {

    const loggedInUser = useSelector(registerUser)

    if (isLoading) {
        return <div className='text-center'>
            <ThreeDot color="#9CF57F" size="small" />
        </div>
    }

    return loggedInUser ? children : <Navigate to={"/login"} />

}

export default ProtectedRoute