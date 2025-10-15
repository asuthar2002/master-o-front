import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";
import { endpoints } from "../../api/endpoint";
import type { ApiError } from "../../types/errorTypes";
import apiInstance from "../../api/apiInstance";


interface UserPerformance {
    id: number;
    fullName: string;
    totalAttempts: number;
    totalQuestions: number;
    totalCorrect: number;
    averageScore: number;
    lastAttempt: string;
}

interface SkillGap {
    id: number;
    name: string;
    totalAttempts: number;
    correctAnswers: number;
    accuracy: number | null;
}

interface TimeReport {
    userId: number;
    period: string;
    attempts: number;
    avgScore: number;
}

interface ReportsState {
    userPerformance: UserPerformance[];
    skillGaps: SkillGap[];
    timeReport: TimeReport[];
    filterType: "week" | "month";
    loading: boolean;
    error: ApiError | null;
}

const initialState: ReportsState = {
    userPerformance: [],
    skillGaps: [],
    timeReport: [],
    filterType: "month",
    loading: false,
    error: null,
};

export const fetchUserPerformance = createAsyncThunk<UserPerformance[], void, { rejectValue: ApiError }>("reports/fetchUserPerformance", async (_, thunkAPI) => {
    try {
        const res = await apiInstance.get(endpoints.report.userPerformance);
        return res.data.data;
    } catch (err: any) {
        const errorPayload: ApiError = {
            message: err?.response?.data?.message || "Failed to fetch user performance",
            status: err?.response?.status,
            data: err?.response?.data,
        };
        return thunkAPI.rejectWithValue(errorPayload);
    }
});

export const fetchSkillGap = createAsyncThunk<SkillGap[], void, { rejectValue: ApiError }>("reports/fetchSkillGap", async (_, thunkAPI) => {
    try {
        const res = await apiInstance.get(endpoints.report.skillGap);
        return res.data.data;
    } catch (err: any) {
        const errorPayload: ApiError = {
            message: err?.response?.data?.message || "Failed to fetch skill gap report",
            status: err?.response?.status,
            data: err?.response?.data,
        };
        return thunkAPI.rejectWithValue(errorPayload);
    }
});

export const fetchTimeReport = createAsyncThunk<TimeReport[], "week" | "month", { rejectValue: ApiError }>("reports/fetchTimeReport", async (filterType, thunkAPI) => {
    try {
        const res = await apiInstance.get(`${endpoints.report.timeReport}?filterType=${filterType}`);
        return res.data.data;
    } catch (err: any) {
        const errorPayload: ApiError = {
            message: err?.response?.data?.message || "Failed to fetch time-based report",
            status: err?.response?.status,
            data: err?.response?.data,
        };
        return thunkAPI.rejectWithValue(errorPayload);
    }
});

const reportsSlice = createSlice({
    name: "reports",
    initialState,
    reducers: {
        setFilterType(state, action) {
            state.filterType = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserPerformance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserPerformance.fulfilled, (state, action) => {
                state.loading = false;
                state.userPerformance = action.payload;
            })
            .addCase(fetchUserPerformance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? { message: "Unknown user performance error" };
            })

            .addCase(fetchSkillGap.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSkillGap.fulfilled, (state, action) => {
                state.loading = false;
                state.skillGaps = action.payload;
            })
            .addCase(fetchSkillGap.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? { message: "Unknown skill gap error" };
            })

            .addCase(fetchTimeReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTimeReport.fulfilled, (state, action) => {
                state.loading = false;
                state.timeReport = action.payload;
            })
            .addCase(fetchTimeReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? { message: "Unknown time report error" };
            });
    },
});

export const { setFilterType } = reportsSlice.actions;
export default reportsSlice.reducer;
export const selectReports = (state: RootState) => state.report;
