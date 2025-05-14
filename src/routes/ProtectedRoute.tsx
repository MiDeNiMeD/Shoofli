import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../models/types';

interface ProtectedRouteProps {
  requiredRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // If still loading authentication state, show loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  
  // If roles are specified, check if user has required role
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    // If user doesn't have required role, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }
  
  // If user is authenticated and has required role, render children
  return <Outlet />;
};

export default ProtectedRoute;