import { Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import Cookies from 'js-cookie'

const ProtectedRoute = ({ children }) => {
    // Get token from cookies
    const token = Cookies.get('token')
    const user = Cookies.get('user')

    // If there's no token, redirect to login
    if (!token || !user) {
        return <Navigate to="/login" replace />
    }

    // If token exists, render the protected content
    return children
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired
}

export default ProtectedRoute