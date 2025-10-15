export const APP_URL = "https://master-o-quizz-back-a.up.railway.app"

export const endpoints = { 
    auth: {
        registerUser: `${APP_URL}/api/auth/signup`,
        loginUser: `${APP_URL}/api/auth/login`,
        refreshToken: `${APP_URL}/api/auth/me`,
    },
    skill: {
        createSkill: `${APP_URL}/api/admin/skills/create`,
        getAllSkills: `${APP_URL}/api/admin/skills/`,
    },
    question: {
        createQuestion: `${APP_URL}/api/admin/question/create`,
        getAllQuestions: `${APP_URL}/api/admin/question/`,
        checkQuestionAnswer: `${APP_URL}/api/admin/question/`,
    },
    report: {
        userPerformance: `${APP_URL}/api/admin/report/user-performance`,
        skillGap: `${APP_URL}/api/admin/report/skill-gap`,
        timeReport: `${APP_URL}/api/admin/report/time-report`,
    }
}