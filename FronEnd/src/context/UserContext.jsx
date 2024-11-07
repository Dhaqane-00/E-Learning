import axios from "../config/axiosConfig";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";


export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState();
    const { loggedInUser } = useContext(AuthContext);

    useEffect(() => {
        async function fetchUser() {
            if (loggedInUser) {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile`)
                    setUser(response.data)
                }
                catch (error) {
                    console.log("Error fetching user details: ", error);

                }
            }

        }
        fetchUser();
    }, [loggedInUser])


    console.log(user);

    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    )

}