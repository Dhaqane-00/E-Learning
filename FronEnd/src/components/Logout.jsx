import axios from '../config/axiosConfig';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Logout() {

    const { logout } = useContext(AuthContext)

    async function handleLogout() {

        try {
            const status = await logout();
            if (status === 200) {

                console.log("Logout Success");

                navigate("/");
            }
            else {
                console.log("Logout Failed");
            }

        } catch (error) {
            console.error("Error logging out: ", error);
            // Optionally, handle error feedback to the user here
        }
    }

    return (

        <button
            className={`w-1/2 text-sm px-5 bg-gradientForBg text-bgOne py-3 font-medium`}
            onClick={handleLogout}
        >
            Logout Profile
        </button>
    );
}

export default Logout;
