import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";
import { endpoints } from "../../api/endpoint";
import authInstance from "../../api/authInstance";
import type { ApiError } from "../../types/errorTypes";
import axios from "axios";


interface SignupData {
    fullName: string;
    email: string;
    password: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
}

interface AuthState {
    user: User | null;
    loading: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    error: ApiError | null;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
    error: null,
};

export const userSignup = createAsyncThunk<{ user: User; accessToken: string; refreshToken?: string }, SignupData, { rejectValue: ApiError }>("auth/signupUser", async (userData, thunkAPI) => {
    try {
        const response = await authInstance.post(endpoints.auth.registerUser, userData);
        return response.data;
    } catch (err: any) {
        const errorPayload: ApiError = {
            message: err?.response?.data?.message || err?.message || "Signup failed",
            status: err?.response?.status,
            data: err?.response?.data,
        };
        return thunkAPI.rejectWithValue(errorPayload);
    }
});


export const loginUser = createAsyncThunk<{ user: User; accessToken: string; refreshToken?: string }, { email: string; password: string }, { rejectValue: ApiError }>("auth/loginUser", async ({ email, password }, thunkAPI) => {
    try {
        const response = await authInstance.post(endpoints.auth.loginUser, { email, password });
        return response.data.data;
    } catch (err: any) {
        const errorPayload: ApiError = {
            message: err?.response?.data?.message || err?.message || "Login failed",
            status: err?.response?.status,
            data: err?.response?.data,
        };
        return thunkAPI.rejectWithValue(errorPayload);
    }
});

export const refreshUser = createAsyncThunk<{ user: User; accessToken: string }, void, { rejectValue: ApiError }>("auth/refreshUser", async (_, thunkAPI) => {
    try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
            throw new Error("No refresh token found");
        }
        const response = await axios.post(endpoints.auth.refreshToken, { refreshToken });
        return response.data.data;
    } catch (err: any) {
        const errorPayload: ApiError = {
            message: err?.response?.data?.message || err?.message || "Session expired",
            status: err?.response?.status,
            data: err?.response?.data,
        };
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return thunkAPI.rejectWithValue(errorPayload);
    }
});




const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.error = null;
            localStorage.clear();
        },
    },
    extraReducers: (builder) => {
        builder

            .addCase(userSignup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userSignup.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken || null;
                localStorage.setItem("refreshToken", action.payload.refreshToken || "");
                localStorage.setItem("accessToken", action.payload.accessToken);
            })
            .addCase(userSignup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? { message: "Unknown signup error" };
            })

            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken || null;
                localStorage.setItem("refreshToken", action.payload.refreshToken || "");
                localStorage.setItem("accessToken", action.payload.accessToken);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? { message: "Unknown login error" };
            })

            .addCase(refreshUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(refreshUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
            })
            .addCase(refreshUser.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.accessToken = null;
                state.error = action.payload ?? { message: "Failed to refresh session" };
            });
    },
});


export const { logout } = authSlice.actions;
export default authSlice.reducer;
export const selectAuth = (state: RootState) => state.auth;
