import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute({ allowedRoles = [] }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  let user = null;

  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Could not read stored user:", error);
    localStorage.removeItem("user");
  }

  if (!token || !user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  if (
    allowedRoles.length > 0 &&
    (!user.role || !allowedRoles.includes(user.role))
  ) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}