import { configureStore } from "@reduxjs/toolkit";
import authApi from "./Api/Auth";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware)
})

export default store;
