import { configureStore } from "@reduxjs/toolkit";
import authApi from "./Api/Auth";
import userApi from "./Api/User";
import courseApi from "./Api/Course";
import enrollmentApi from "./Api/Enrollment";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [courseApi.reducerPath]: courseApi.reducer,
        [enrollmentApi.reducerPath]: enrollmentApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware, userApi.middleware, courseApi.middleware, enrollmentApi.middleware)
})

export default store;
