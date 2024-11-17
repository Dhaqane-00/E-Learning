import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const BASE_URL = "https://e-learning-backend-v1.vercel.app/api/enrollments"

export const enrollmentApi = createApi({
  reducerPath: "enrollmentApi",
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
  tagTypes: ['Enrollment'],
  endpoints: (builder) => ({
    // Get all enrollments for current user
    getUserEnrollments: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: ['Enrollment']
    }),

    // Get specific enrollment details
    getEnrollmentDetails: builder.query({
      query: (enrollmentId) => ({
        url: `/${enrollmentId}`,
        method: "GET",
      }),
      providesTags: ['Enrollment']
    }),

    // Get enrollment progress
    getEnrollmentProgress: builder.query({
      query: (enrollmentId) => ({
        url: `/${enrollmentId}/progress`,
        method: "GET",
      }),
      providesTags: ['Enrollment']
    }),

    // Update enrollment progress
    updateEnrollmentProgress: builder.mutation({
      query: ({ enrollmentId, lessonId, moduleId }) => ({
        url: `/${enrollmentId}/progress`,
        method: "PUT",
        body: { lessonId, moduleId }
      }),
      invalidatesTags: ['Enrollment']
    }),

    // Submit quiz score
    submitQuizScore: builder.mutation({
      query: ({ enrollmentId, lessonId, score }) => ({
        url: `/${enrollmentId}/quiz`,
        method: "POST",
        body: { lessonId, score }
      }),
      invalidatesTags: ['Enrollment']
    }),

    // Create new enrollment
    createEnrollment: builder.mutation({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "POST"
      }),
      invalidatesTags: ['Enrollment']
    })
  }),
});

export const { 
  useGetUserEnrollmentsQuery,
  useGetEnrollmentDetailsQuery,
  useGetEnrollmentProgressQuery,
  useUpdateEnrollmentProgressMutation,
  useSubmitQuizScoreMutation,
  useCreateEnrollmentMutation
} = enrollmentApi;

export default enrollmentApi;

