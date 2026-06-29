import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// allowedRoles = which roles can access this page
// e.g. <ProtectedRoute allowedRoles={['admin']}>
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  // Not logged in at all → kick to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role → kick to login too
  // (e.g. a client trying to visit /admin directly via URL)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  // All good — show the actual page
  return children;
};

export default ProtectedRoute;