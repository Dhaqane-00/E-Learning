import React from 'react';
import { useAuth } from '../context/AuthContext';

function Logout() {
    const { logout } = useAuth();

    async function handleLogout() {
        try {
            const status = await logout();
            if (status === 200) {
                console.log("Logout Success");
            } else {
                console.log("Logout Failed");
            }
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    }

    return (
        <button
            className={`w-1/2 text-sm px-5 bg-gradientForBg text-bgOne py-3 font-medium border-2`}
            onClick={handleLogout}
        >
            Logout Profile
        </button>
    );
}

export default Logout;
