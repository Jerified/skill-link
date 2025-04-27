import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-center">Loading...</div>; 
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
