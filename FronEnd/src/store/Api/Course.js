import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const BASE_URL = "http://localhost:3000/api/courses"


export const courseApi = createApi({
  reducerPath: "courseApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL, headers: {
    "Authorization": `Bearer ${Cookies.get("token")}`
  }}),
  keepUnusedDataFor: 300,
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
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
  }),
});

export const { useGetAllCoursesQuery, useGetUserCoursesQuery } = courseApi;

export default courseApi;
