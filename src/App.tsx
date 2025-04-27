import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import AppRoutes from "./routes/Approutes";

function App() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user && (location.pathname === "/login" || location.pathname === "/register")) {
      navigate("/");
    }
  }, [user, loading, navigate, location]);

  // Check if the current path is an auth page
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/auth/callback";

  return (
    <>
      {isAuthPage ? (
        <AuthLayout>
          <AppRoutes />
        </AuthLayout>
      ) : (
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      )}
    </>
  );
}

export default App;
