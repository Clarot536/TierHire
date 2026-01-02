import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = () => {
    const { user } = useAuth();
    console.log("Hi", user);
    if (!user) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
