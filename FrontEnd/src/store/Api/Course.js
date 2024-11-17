import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const BASE_URL = "https://e-learning-backend-v1.vercel.app/api/courses"



export const courseApi = createApi({
  reducerPath: "courseApi",
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
  tagTypes: ['Course'],
  endpoints: (builder) => ({
    getUserCourses: builder.query({
        query: () =>({
            url: "/user-courses",
            method: "GET",
        }),
        providesTags: ['Course'],
    }),
    getAllCourses: builder.query({
        query: () =>({
            url: "/",
            method: "GET",
        }),
        providesTags: ['Course'],
    }),
    getCourseById: builder.query({
        query: (id) =>({
            url: `/${id}`,
            method: "GET",
        }),
        providesTags: (result, error, id) => [{ type: 'Course', id }],
        transformResponse: (response) => {
            if (!response) {
                throw new Error('Course not found');
            }
            return response;
        },
        transformErrorResponse: (response) => {
            return response.data?.message || 'An error occurred';
        }
    }),
  }),
});

export const { useGetAllCoursesQuery, useGetUserCoursesQuery, useGetCourseByIdQuery } = courseApi;

export default courseApi;
