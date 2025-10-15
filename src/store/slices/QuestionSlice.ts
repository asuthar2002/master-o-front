import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiInstance from "../../api/apiInstance";
import { endpoints } from "../../api/endpoint";

export const createQuestion = createAsyncThunk(
    "question/createQuestion",
    async (questionData: any, { rejectWithValue }) => {
        try {
            const res = await apiInstance.post(endpoints.question.createQuestion, questionData);
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || { error: "Request failed" });
        }
    }
);

export const fetchAllQuestions = createAsyncThunk(
    "question/fetchAllQuestions",
    async (
        { page = 1, limit = 1 }: { page?: number; limit?: number },
        { rejectWithValue }
    ) => {
        try {
            const res = await apiInstance.get(`${endpoints.question.getAllQuestions}?page=${page}&limit=${limit}`);
            return res.data.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data || { error: "Failed to fetch questions" });
        }
    }
);

export const checkQuestionAnswer = createAsyncThunk("question/checkQuestionAnswer", async ({ questionId, selectedIndex }: { questionId: number; selectedIndex: number }, { rejectWithValue }) => {
    try {
        const res = await apiInstance.post(endpoints.question.checkQuestionAnswer, {
            questionId,
            selectedIndex,
        });
        return res.data.data;
    } catch (err: any) {
        return rejectWithValue(err.response?.data || { error: "Failed to check answer" });
    }
}
);

const questionSlice = createSlice({
    name: "question",
    initialState: {
        loading: false,
        allQuestions: [] as any[],
        totalPages: 1,
        currentPage: 1,
        lastAnswerResult: null as null | { correct: boolean; message: string },
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createQuestion.pending, (state) => {
                state.loading = true;
            })
            .addCase(createQuestion.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createQuestion.rejected, (state) => {
                state.loading = false;
            })

            .addCase(fetchAllQuestions.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllQuestions.fulfilled, (state, action) => {
                state.loading = false;
                state.allQuestions = action.payload?.questions || [];
                state.totalPages = action.payload?.totalPages || 1;
                state.currentPage = action.payload?.currentPage || 1;
            })
            .addCase(fetchAllQuestions.rejected, (state) => {
                state.loading = false;
            })
            .addCase(checkQuestionAnswer.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkQuestionAnswer.fulfilled, (state, action) => {
                state.loading = false;
                state.lastAnswerResult = action.payload;
            })
            .addCase(checkQuestionAnswer.rejected, (state, action) => {
                state.loading = false;
                state.lastAnswerResult = {
                    correct: false,
                    message: (action.payload as any)?.error || "Something went wrong",
                };
            });
    },
});

export default questionSlice.reducer;
