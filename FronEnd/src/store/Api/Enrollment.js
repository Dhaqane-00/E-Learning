import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
const BASE_URL = "http://localhost:3000/api/enrollments"

export const enrollmentApi = createApi({
    reducerPath: "enrollmentApi",
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, headers: {
            Authorization: `Bearer ${Cookies.get("token")}`
        }
    }),
    endpoints: (builder) => ({
        createEnrollment: builder.mutation({
            query: (courseId) => ({
                url: `/${courseId}`,
                method: "POST",
            })
        }),
        getUserEnrollments: builder.query({
            query: () => ({
                url: "/",
                method: "GET",
            })
        })
    })
})

export const { useCreateEnrollmentMutation, useGetUserEnrollmentsQuery } = enrollmentApi;

export default enrollmentApi;

