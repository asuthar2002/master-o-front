import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/UserAuthSlice";
import skillReducer from "../slices/SkillSlice";
import questionReducer from "../slices/QuestionSlice";
import reportReducer from "../slices/ReportsSlice";



export const store = configureStore({
    reducer: {
        auth: authReducer,
        skill: skillReducer,
        question: questionReducer,
        report: reportReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
