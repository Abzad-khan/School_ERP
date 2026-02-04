import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RoleRoute({ children, allowedRoles }) {
  const { role } = useAuth();

  if (!allowedRoles?.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
