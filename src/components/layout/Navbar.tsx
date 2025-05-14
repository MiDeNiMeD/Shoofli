import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { Bell, Menu, X, LogOut, User, Settings } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-primary-500 font-bold text-2xl">
                Shoofli
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-transparent text-gray-500 hover:border-primary-500 hover:text-primary-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/technicians"
                className="border-transparent text-gray-500 hover:border-primary-500 hover:text-primary-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Find Technicians
              </Link>
              <Link
                to="/publications"
                className="border-transparent text-gray-500 hover:border-primary-500 hover:text-primary-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Publications
              </Link>
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className="border-transparent text-gray-500 hover:border-primary-500 hover:text-primary-500 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <>
                <Link to="/notifications" className="ml-2 px-2 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-gray-500 relative">
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center transform translate-x-1 -translate-y-1">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <Link to="/messages" className="ml-2 px-2 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Messages</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </Link>
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <Link to="/profile" className="flex items-center space-x-2">
                      <div className="bg-primary-100 text-primary-800 h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium">
                        {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
                      </div>
                      <span className="text-gray-700 text-sm font-medium hidden md:block">
                        {user?.firstName} {user?.lastName}
                      </span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="ml-4 px-3 py-1 rounded-md text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 flex items-center gap-1"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium text-primary-500 hover:text-primary-600"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-primary-500 hover:bg-primary-600"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-primary-500 hover:text-primary-500 text-base font-medium"
            onClick={closeMobileMenu}
          >
            Home
          </Link>
          <Link
            to="/technicians"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-primary-500 hover:text-primary-500 text-base font-medium"
            onClick={closeMobileMenu}
          >
            Find Technicians
          </Link>
          <Link
            to="/publications"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-primary-500 hover:text-primary-500 text-base font-medium"
            onClick={closeMobileMenu}
          >
            Publications
          </Link>
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:border-primary-500 hover:text-primary-500 text-base font-medium"
              onClick={closeMobileMenu}
            >
              Dashboard
            </Link>
          )}
        </div>
        {isAuthenticated ? (
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="bg-primary-100 text-primary-800 h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium">
                  {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-sm font-medium text-gray-500">{user?.email}</div>
              </div>
              <Link 
                to="/notifications" 
                className="ml-auto flex-shrink-0 bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 relative"
                onClick={closeMobileMenu}
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center transform translate-x-1 -translate-y-1">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            </div>
            <div className="mt-3 space-y-1">
              <Link
                to="/profile"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                onClick={closeMobileMenu}
              >
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Your Profile
                </div>
              </Link>
              <Link
                to="/messages"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                onClick={closeMobileMenu}
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Messages
                </div>
              </Link>
              {user?.role === 'Administrator' && (
                <Link
                  to="/admin"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  onClick={closeMobileMenu}
                >
                  <div className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Admin Panel
                  </div>
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                <div className="flex items-center">
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="space-y-1 px-4">
              <Link
                to="/login"
                className="block text-center py-2 px-4 rounded-md text-base font-medium text-primary-500 hover:text-primary-600"
                onClick={closeMobileMenu}
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="block text-center py-2 px-4 rounded-md text-base font-medium text-white bg-primary-500 hover:bg-primary-600"
                onClick={closeMobileMenu}
              >
                Sign up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;