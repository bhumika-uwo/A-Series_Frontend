import { Navigate, useLocation } from 'react-router';

/**
 * ProtectedRoute Component
 * Wraps around routes that require authentication.
 * Redirects to login if user is not authenticated.
 */
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const location = useLocation();

  const getUser = () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  };

  const user = getUser();

  // 1. Check Authentication
  if (!user || !user.email) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check Admin Role (if required)
  if (requireAdmin && user.role?.toLowerCase() !== 'admin') {
    return <Navigate to="/dashboard/marketplace" replace />;
  }

  return children;
};

export default ProtectedRoute;
