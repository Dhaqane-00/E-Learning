import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const BASE_URL = "http://localhost:3000/api/users"

export const userApi = createApi({
    reducerPath: "UserApi",
    baseQuery: fetchBaseQuery({ 
        baseUrl: BASE_URL,
        prepareHeaders: (headers) => {
            const token = Cookies.get("token");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        }
    }),
    endpoints: (builder) => ({
        getUserProfile: builder.query({
            query: () => ({
                url: "/profile",
                method: "GET",
            }),
        }),
        updateUserProfile: builder.mutation({
            query: (formData) => ({
                url: "/profile",
                method: "PUT",
                body: formData,
            }),
        }),
        getEnrolledCourses: builder.query({
            query: () => ({
                url: "/enrollments",
                method: "GET",
            }),
        }),
        getUploadedCourses: builder.query({
            query: () => ({
                url: "/uploaded-courses",
                method: "GET",
            }),
        }),
    })
});

export const {
    useGetUserProfileQuery,
    useUpdateUserProfileMutation,
    useGetEnrolledCoursesQuery,
    useGetUploadedCoursesQuery
} = userApi;

export default userApi;
