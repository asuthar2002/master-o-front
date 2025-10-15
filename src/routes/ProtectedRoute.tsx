import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hook/hook";
import { selectAuth } from "../store/slices/UserAuthSlice";

interface ProtectedRouteProps {
    allowedRoles?: string[];
    requireAuth?: boolean;
}

const ProtectedRoute = ({ allowedRoles, requireAuth = true }: ProtectedRouteProps) => {
    const { user } = useAppSelector(selectAuth);


    if (!requireAuth) {
        return <Outlet />;
    }


    if (!user) {
        return <Navigate to="/login" replace />;
    }


    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
