import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    user: null,
    loading: false,
    error: null
}

export const authRegister = createAsyncThunk("auth/register", async (userData) => {
    const response = await axios.post("http://localhost:5000/api/register", userData)
    return response.data
})

const createAuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(authRegister.pending, (state,actions)=>{
            state.loading = true
        })
        .addCase(authRegister.fulfilled, (state,actions)=>{
            state.loading = false
            state.user = actions.payload
        })
        .addCase(authRegister.rejected, (state,actions)=>{
            state.loading = false
            state.error = actions.error.message
        })
    }
})

export default createAuthSlice.reducer
