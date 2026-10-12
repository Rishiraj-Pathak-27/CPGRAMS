import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const location = useLocation();
    const token = localStorage.getItem('token');
    const userRaw = localStorage.getItem('user');

    if (!token || !userRaw) {
        return <Navigate to="/auth" replace state={{ from: location }} />;
    }

    let user;
    try {
        user = JSON.parse(userRaw);
    } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return <Navigate to="/auth" replace state={{ from: location }} />;
    }

    if (Array.isArray(allowedRoles) && allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/auth" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
