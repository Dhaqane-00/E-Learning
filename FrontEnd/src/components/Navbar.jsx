import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { IoCloseSharp } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { Squash as Hamburger } from 'hamburger-react'
import { IoArrowForwardSharp } from "react-icons/io5";
import { motion } from 'framer-motion'
import { WindowWidthContext } from '../context/WindowWidthContext';
import Cookies from 'js-cookie';
import ProtectedRoute from './ProtectedRoute';



function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showNavbar, setShowNavbar] = useState(false);
    const [hideNavbar, setHideNavbar] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isFullCoursePage, setIsFullCoursePage] = useState(false);
    const [showNotificationDiv, setShowNotificationDiv] = useState(true);

    // Add this useEffect to handle token from URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const urlToken = params.get('token');
        
        if (urlToken) {
            Cookies.set('token', urlToken);
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);

    const token = Cookies.get('token');
    const userString = Cookies.get('user');
    const user = userString ? JSON.parse(userString) : null;
    console.log(user);
    console.log(token);


    const handleNotificationDivClose = () => {
        setShowNotificationDiv(false);
    };

    // Handle scroll for navbar hide/show
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setHideNavbar(currentScrollY > lastScrollY);
            setLastScrollY(currentScrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Check if current page is FullCoursePage
    useEffect(() => {
        setIsFullCoursePage(window.location.pathname.includes('/course/'));
    }, []);

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('user');
        localStorage.removeItem('user');
        navigate("/login");
    };

    return (
        isMobile ? (
            // Mobile View
            <div className='bg-bgOne pb-20 w-full'>
                <div className='fixed top-0 w-full flex h-16 z-50 gap-6 items-center justify-between px-4 bg-bgOne border-b border-border'>
                    <Hamburger size={24} color='white' toggled={showNavbar} toggle={setShowNavbar} />
                    <Link to={"/"} className='font-bold bg-gradientForBg text-2xl bg-clip-text text-transparent'>BitByBit</Link>

                    {token ? (
                        <ProtectedRoute>
                            <div className="flex items-center gap-2">
                                <Link to="/my-profile" className='pr-2 text-white font-medium flex items-center gap-1'>
                                    {user?.profileImage ? (
                                        <img
                                            src={user.profileImage}
                                            alt="Profile"
                                            className="w-6 h-6 rounded-full object-cover"
                                        />
                                    ) : (
                                        <MdAccountCircle size={23} />
                                    )}
                                    <span>{user?.name}</span>
                                </Link>
                            </div>
                        </ProtectedRoute>
                    ) : (
                        <Link to="/login" className='pr-2 text-white font-medium flex items-center gap-1'>
                            <MdAccountCircle size={23} />
                            <span>Login</span>
                        </Link>
                    )}
                </div>

                {showNavbar && (
                    <div className='fixed top-16 w-full bg-bgOne z-50 border-b border-border'>
                        <div className='flex flex-col gap-4 p-4'>
                            <Link to="/" className='text-white'>Home</Link>
                            <Link to="/all-courses" className='text-white'>Courses</Link>
                            <Link to="/contributors" className='text-white'>Contributors</Link>
                            <Link to="/about" className='text-white'>About</Link>
                            <Link to="/vote-resources" className='text-white'>Vote Resources</Link>

                            {token && (
                                <ProtectedRoute>
                                    <div className="flex flex-col gap-4">
                                        <Link to="/my-profile" className='text-white'>My Profile</Link>
                                        <Link to="/course/create" className='text-white'>Create Course</Link>
                                        <button onClick={handleLogout} className='text-white text-left border-red-500'>Logout</button>
                                    </div>
                                </ProtectedRoute>
                            )}
                        </div>
                    </div>
                )}
            </div>
        ) : (
            // Desktop View
            <div className={`${hideNavbar ? "hidden" : ""} ${isFullCoursePage ? "hidden" : ""} w-full flex flex-col justify-between items-center text-white text-sm font-medium fixed z-50 top-0 left-0 transition-all duration-300 bg-transparent backdrop-blur-2xl shadow-2xl shadow-bgOne`}>
                {showNotificationDiv && (
                    <div className='bg-gradientForBg w-full text-center py-3'>
                        <p className='text-bgOne'>This app is hosted on Render's free tier, so initial loading might take a few moments. Thank you for your patience!</p>
                        <button
                            className='absolute right-4 top-3 text-bgOne'
                            onClick={handleNotificationDivClose}>
                            <IoCloseSharp size={17} />
                        </button>
                    </div>
                )}
                <div className='w-full flex py-4'>
                    <div className='w-1/4 flex justify-center items-center'>
                        <Link to="/" className='font-bold bg-gradientForBg text-2xl bg-clip-text text-transparent'>BitByBit</Link>
                    </div>

                    <div className='w-2/4 flex justify-center items-center gap-8'>
                        <Link to="/all-courses">Courses</Link>
                        <Link to="/contributors">Contributors</Link>
                        <Link to="/about">About</Link>
                        <Link to="/vote-resources">Vote Resources</Link>
                    </div>

                    <div className='w-1/4 flex justify-center items-center gap-8'>
                        {token ? (
                            <ProtectedRoute>
                                <div className='flex gap-3 justify-center items-center'>
                                    <Link to="/my-profile" className="flex items-center gap-2">
                                        {user?.profileImage ? (
                                            <img
                                                src={user.profileImage}
                                                alt="Profile"
                                                className="w-6 h-6 rounded-full object-cover"
                                            />
                                        ) : (
                                            <MdAccountCircle size={23} />
                                        )}
                                        <span>{user?.name}</span>
                                    </Link>
                                    <button onClick={handleLogout} className='text-white text-left border-red-500'>Logout</button>
                                </div>
                            </ProtectedRoute>
                        ) : (
                            <Link to="/login" className="flex items-center gap-2">
                                <MdAccountCircle size={23} />
                                <span>Login</span>
                            </Link>
                        )}

                        {token && (
                            <ProtectedRoute>
                                <Link to="/course/create" className="bgTwo border border-green text-white font-semibold px-5 py-2 rounded-full shadow-2xl shadow-lime-800">
                                    Contribute
                                </Link>
                            </ProtectedRoute>
                        )}
                    </div>
                </div>
            </div>
        )
    );
}

export default Navbar;
