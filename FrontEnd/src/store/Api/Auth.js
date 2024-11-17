import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const setToken = (token) => {
    Cookies.set("token", token, {
        sameSite: 'None',
        secure: true
    });
};

const setUser = (user) => {
    Cookies.set("user", JSON.stringify(user), {
        sameSite: 'None',
        secure: true
    });
};

const BASE_URL = "http://localhost:3000/api/";

const authApi = createApi({
    baseQuery: fetchBaseQuery({ 
        baseUrl: BASE_URL,
        
    }),
    endpoints: (builder) => ({
        // Existing endpoints
        createUser: builder.mutation({
            query: (formData) => ({
                url: "users/register",
                method: "POST",
                body: formData,
            })
        }),
        
        Login: builder.mutation({
            query: (formData) => ({
                url: "users/login",
                method: "POST",
                body: formData
            }),
            onQueryStarted: async (_, { queryFulfilled }) => {
                try {
                    const result = await queryFulfilled;
                    setToken(result.data.token);
                    setUser(result.data.user);
                    
                } catch (error) {
                    console.log(error);
                }
            }
        }),

        // New Google Auth endpoints
        initiateGoogleAuth: builder.query({
            query: () => ({
                url: "auth/google",
                method: "GET",
                redirect: 'follow'
            })
        }),

        // Handle Google OAuth callback
        handleGoogleCallback: builder.query({
            query: () => ({
                url: `auth/google/callback`,
                method: "GET"
            }),
            onQueryStarted: async (_, { queryFulfilled }) => {
                try {
                    const result = await queryFulfilled;
                    console.log('Google callback response:', result.data);
                    
                    if (result.data && result.data.token) {
                        setToken(result.data.token);
                        setUser(result.data.user);
                        
                        window.location.href = '/';
                    } else {
                        console.error('Invalid response format:', result.data);
                    }
                } catch (error) {
                    console.error('Google auth callback error:', error);
                    window.location.href = '/login?error=auth_failed';
                }
            }
        }),

        // Verify token and get current user
        getCurrentUser: builder.query({
            query: () => ({
                url: "users/profile",
                method: "GET",
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`
                }
            })
        })
    })
});

export const { 
    useCreateUserMutation, 
    useLoginMutation,
    useInitiateGoogleAuthQuery,
    useHandleGoogleCallbackQuery,
    useGetCurrentUserQuery
} = authApi;

export default authApi;
