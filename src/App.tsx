import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Technicians from './pages/Technicians';
import TechnicianProfile from './pages/TechnicianProfile';
import Publications from './pages/Publications';
import PublicationDetails from './pages/PublicationDetails';
import PostPublication from './pages/PostPublication';
import ManageServices from './pages/ManageServices';
import AvailabilityCalendar from './pages/AvailabilityCalendar';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import AdminPanel from './pages/admin/AdminPanel';
import ProtectedRoute from './routes/ProtectedRoute';
import { initializeAuthSystem } from './services/authService';

// Initialize the auth system with a default admin if no users exist
initializeAuthSystem();

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/technicians" element={<Technicians />} />
                <Route path="/technicians/:id" element={<TechnicianProfile />} />
                <Route path="/publications" element={<Publications />} />
                <Route path="/publications/:id" element={<PublicationDetails />} />
                
                {/* Protected routes for all authenticated users */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/notifications" element={<Notifications />} />
                </Route>
                
                {/* Client-only routes */}
                <Route element={<ProtectedRoute requiredRoles={['Client']} />}>
                  <Route path="/post-publication" element={<PostPublication />} />
                </Route>
                
                {/* Technician-only routes */}
                <Route element={<ProtectedRoute requiredRoles={['Technician']} />}>
                  <Route path="/manage-services" element={<ManageServices />} />
                  <Route path="/calendar" element={<AvailabilityCalendar />} />
                </Route>
                
                {/* Admin-only routes */}
                <Route element={<ProtectedRoute requiredRoles={['Administrator']} />}>
                  <Route path="/admin" element={<AdminPanel />} />
                </Route>
                
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;