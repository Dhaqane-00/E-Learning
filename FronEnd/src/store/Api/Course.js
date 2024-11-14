import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const BASE_URL = "http://localhost:3000/api/courses"


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
  endpoints: (builder) => ({
    getUserCourses: builder.query({
        query: () =>({
            url: "/user-courses",
            method: "GET",
        }),
    }),
    getAllCourses: builder.query({
        query: () =>({
            url: "/",
            method: "GET",
        }),
    }),
    getCourseById: builder.query({
        query: (id) =>({
            url: `/${id}`,
            method: "GET",
        }),
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
