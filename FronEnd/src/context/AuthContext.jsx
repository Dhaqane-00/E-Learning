import React, { createContext, useState, useEffect } from 'react';
import axios from '../config/axiosConfig'
import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';


// Create the context
export const AuthContext = createContext();

// AuthProvider component to wrap your app
export const AuthProvider = ({ children }) => {



    //this state contains the name of the logged in user
    const [loggedInUser, setLoggedInUser] = useState("");

    const [isLoading, setIsLoading] = useState(true)

    // Check for JWT in local storage or session storage to determine login status
    useEffect(() => {


        const token = localStorage.getItem("jwtToken");

        if (token) {
            try {
                const decoded_jwt = jwtDecode(token);
                const name = decoded_jwt.name;
                setLoggedInUser(name);
            }
            catch (e) {
                console.log("Invalid token", e)
                localStorage.removeItem("jwtToken")
            }

        }
        setIsLoading(false)
    }, []);


    // Logout function to clear token and update state
    async function logout() {
        try {
            localStorage.removeItem('jwtToken');

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/public/logout`);


            setLoggedInUser("");


            return response.status;

        }
        catch (error) {
            console.error("Failed to logout. Please try again.")
        }

    };


    async function login(loginData) {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/public/login`, loginData);

            const { jwtToken } = response.data;

            const decoded_jwt = jwtDecode(jwtToken);
            const name = decoded_jwt.name;

            // Store the token in localStorage
            localStorage.setItem("jwtToken", jwtToken);

            // Set the logged in user name
            setLoggedInUser(name);

            return response.status;

        } catch (error) {
            console.error("Invalid token received during login", error);
        }

    }

    // Provide isLoggedIn state and logout function to child components
    return (
        <AuthContext.Provider value={{ loggedInUser, setLoggedInUser, logout, login, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
