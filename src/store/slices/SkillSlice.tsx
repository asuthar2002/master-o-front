import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";
import { endpoints } from "../../api/endpoint";
import type { ApiError } from "../../types/errorTypes";
import apiInstance from "../../api/apiInstance";

interface SkillState {
    allSkills: any[] | null;
    loading: boolean;
    error: ApiError | null;
}

const initialState: SkillState = {
    allSkills: null,
    loading: false,
    error: null,
};


export const createSkill = createAsyncThunk("skills/createSkill", async (skillData: { name: string }, { rejectWithValue }) => {
    try {
        const response = await apiInstance.post(endpoints.skill.createSkill, skillData);
        return response.data.data;
    } catch (err: any) {
        const errorPayload: ApiError = {
            message: err?.response?.data?.message || err?.message,
            status: err?.response?.status,
            data: err?.response?.data,
        };
        return rejectWithValue(errorPayload);
    }
}
);


export const fetchAllSkills = createAsyncThunk("skills/fetchAll", async (_, { rejectWithValue }) => {
    try {
        const response = await apiInstance.get(endpoints.skill.getAllSkills);
        return response.data.data;
    } catch (err: any) {
        const errorPayload: ApiError = {
            message: err?.response?.data?.message || err?.message,
            status: err?.response?.status,
            data: err?.response?.data,
        };
        return rejectWithValue(errorPayload);
    }
}
);

const skillSlice = createSlice({
    name: "skill",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createSkill.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSkill.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = null;
                if (state.allSkills) {
                    state.allSkills.push(action.payload?.data || action.payload);
                } else {
                    state.allSkills = [action.payload?.data || action.payload];
                }
            })
            .addCase(createSkill.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchAllSkills.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllSkills.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.allSkills = action.payload?.data || action.payload;
            })
            .addCase(fetchAllSkills.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default skillSlice.reducer;
export const selectSkill = (state: RootState) => state.skill;
