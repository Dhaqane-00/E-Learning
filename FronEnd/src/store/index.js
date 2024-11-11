import { configureStore } from "@reduxjs/toolkit";
import authApi from "./Api/Auth";
import userApi from "./Api/User";
import courseApi from "./Api/Course";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [courseApi.reducerPath]: courseApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware, userApi.middleware, courseApi.middleware)
})

export default store;
