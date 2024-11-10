import { configureStore } from "@reduxjs/toolkit";
import authApi from "./Api/Auth";
import userApi from "./Api/User";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [userApi.reducerPath]: userApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware, userApi.middleware)
})

export default store;
