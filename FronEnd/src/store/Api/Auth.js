import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";


const setToken = (token) => {
    Cookies.set("token", token, {
        sameSite: 'None',
        secure: true  // Required when using SameSite=None
    });
}
//save user in cookies
const setUser = (user) => {
    Cookies.set("user", JSON.stringify(user), {
        sameSite: 'None',
        secure: true  // Required when using SameSite=None
    });
}

const BASE_URL = "http://localhost:3000/api/users"
const authApi = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder) => ({
        //create user
        createUser: builder.mutation({
            query: (formData) => ({
                url: "/register",
                method: "POST",
                body: formData,
            })
        }),
        // Login
        Login: builder.mutation({
            query: (formData) => ({
                url: "/login",
                method: "POST",
                body: formData
            }),
            onQueryStarted: async (formData, { queryFulfilled }) => {
                //save Cookies
                try {
                    console.log(formData);
                    const result = await queryFulfilled;
                    setToken(result.data.token);
                    //save User in cookies
                    setUser(result.data.user);
                    //how to get user from cookies
                    const user = JSON.parse(Cookies.get("user"));
                    console.log("user", user);
                } catch (error) {
                    console.log(error);
                }
            }
        }),
    })
})

export const { useCreateUserMutation, useLoginMutation } = authApi;

export default authApi;
