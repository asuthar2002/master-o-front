import { Routes, Route } from "react-router-dom";
import { MainLayout } from "../layout/MainLayout";
import NotFound from "../pages/NotFound";
import Signup from "../pages/auth/SignupPage";
import Login from "../pages/auth/LoginPage";
import HomePage from "../pages/public/HomePage";
import ProtectedRoute from "./ProtectedRoute";
import CreateSkill from "../pages/private/CreateSkill";
import CreateQuestion from "../pages/private/CreateQuestion";
import AllQuestions from "../pages/public/AllQuestions";
import ShowQuestions from "../pages/public/ShowQuestions";
import ReportsPage from "../pages/private/ReportsPage";


function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route element={<ProtectedRoute requireAuth={false} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/questions" element={<AllQuestions />} />
          <Route path="/solutions" element={<ShowQuestions />} />
        </Route>

        {/* Logged-in user routes */}
        <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
        </Route>

        {/*Admin-only routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/skill/create-new-skill" element={<CreateSkill />} />
          <Route path="/admin/question/create-new-question" element={<CreateQuestion />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
