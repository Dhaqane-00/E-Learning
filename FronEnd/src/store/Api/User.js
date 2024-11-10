import { createApi , fetchBaseQuery } from "@reduxjs/toolkit/query";
import Cookies from "js-cookie";

const BASE_URL = "http://localhost:3000/api/users"

const token = Cookies.get("token");

export const userApi = createApi({
    reducerPath: "UserApi",
    baseQuery: fetchBaseQuery({ 
        baseUrl: BASE_URL, 
        headers: {
            Authorization: `Bearer ${token}`
        } 
    }),
    endpoints: (builder) => ({
        getUserProfile: builder.query({
            query: () => ({
                url: "/profile",
                method: "GET",
            }),
            onQueryStarted: async (data, { queryFulfilled }) => {
                console.log(data);
            }
        })
    })
})


export default userApi;
