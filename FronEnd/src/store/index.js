import { configureStore } from "@reduxjs/toolkit";
import {authRegister} from "./Api/AuthSlice.js"

const store = configureStore({
    reducer: {
        auth: authRegister
    }
})

export default store
