import React from 'react'
import { Navigate } from 'react-router-dom';
import { ThreeDot } from 'react-loading-indicators'
import Cookies from 'js-cookie'
import { Outlet } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const loggedInUser = Cookies.get('user')

    if (!loggedInUser) {
        return <Navigate to={"/login"} />
    }

    return children || <Outlet />
}

export default ProtectedRoute