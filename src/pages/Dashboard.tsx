import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Publication, Demand } from '../models/types';
import { retrieveData, STORAGE_KEYS } from '../services/storageService';
import { Calendar, Users, FileText, MessageSquare, Bell, Settings, Star, PenTool as Tool } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  const renderClientDashboard = () => {
    const publications = retrieveData<Publication[]>(STORAGE_KEYS.PUBLICATIONS, [])
      .filter(pub => pub.clientId === user?.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    const demands = retrieveData<Demand[]>(STORAGE_KEYS.DEMANDS, [])
      .filter(demand => demand.clientId === user?.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-full">
          <h2 className="text-2xl font-bold mb-4">Welcome back, {user?.firstName}!</h2>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Your Publications</h3>
            <Link
              to="/post-publication"
              className="text-primary-500 hover:text-primary-600 font-medium text-sm"
            >
              Post New
            </Link>
          </div>
          {publications.length > 0 ? (
            <div className="space-y-4">
              {publications.slice(0, 3).map(pub => (
                <div key={pub.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <h4 className="font-medium">{pub.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{pub.description.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No publications yet</p>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Active Demands</h3>
            <span className="text-sm text-gray-500">{demands.length} total</span>
          </div>
          {demands.length > 0 ? (
            <div className="space-y-4">
              {demands.slice(0, 3).map(demand => (
                <div key={demand.id} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
                  <div>
                    <p className="font-medium">{demand.description.substring(0, 50)}...</p>
                    <span className={`text-sm ${
                      demand.status === 'Completed' ? 'text-success-500' :
                      demand.status === 'Accepted' ? 'text-primary-500' :
                      'text-warning-500'
                    }`}>
                      {demand.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No active demands</p>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/technicians"
              className="flex flex-col items-center justify-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100"
            >
              <Tool className="h-6 w-6 text-primary-500 mb-2" />
              <span className="text-sm font-medium text-primary-700">Find Technician</span>
            </Link>
            <Link
              to="/messages"
              className="flex flex-col items-center justify-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100"
            >
              <MessageSquare className="h-6 w-6 text-primary-500 mb-2" />
              <span className="text-sm font-medium text-primary-700">Messages</span>
            </Link>
            <Link
              to="/notifications"
              className="flex flex-col items-center justify-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100"
            >
              <Bell className="h-6 w-6 text-primary-500 mb-2" />
              <span className="text-sm font-medium text-primary-700">Notifications</span>
            </Link>
            <Link
              to="/profile"
              className="flex flex-col items-center justify-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100"
            >
              <Settings className="h-6 w-6 text-primary-500 mb-2" />
              <span className="text-sm font-medium text-primary-700">Settings</span>
            </Link>
          </div>
        </div>
      </div>
    );
  };
  
  const renderTechnicianDashboard = () => {
    const demands = retrieveData<Demand[]>(STORAGE_KEYS.DEMANDS, [])
      .filter(demand => demand.technicianId === user?.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-full">
          <h2 className="text-2xl font-bold mb-4">Welcome back, {user?.firstName}!</h2>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Service Requests</h3>
            <span className="text-sm text-gray-500">{demands.length} total</span>
          </div>
          {demands.length > 0 ? (
            <div className="space-y-4">
              {demands.slice(0, 3).map(demand => (
                <div key={demand.id} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
                  <div>
                    <p className="font-medium">{demand.description.substring(0, 50)}...</p>
                    <span className={`text-sm ${
                      demand.status === 'Completed' ? 'text-success-500' :
                      demand.status === 'Accepted' ? 'text-primary-500' :
                      'text-warning-500'
                    }`}>
                      {demand.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No service requests yet</p>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Your Services</h3>
          <Link
            to="/manage-services"
            className="block w-full p-4 bg-primary-50 rounded-lg hover:bg-primary-100 text-center"
          >
            <Tool className="h-6 w-6 text-primary-500 mx-auto mb-2" />
            <span className="text-sm font-medium text-primary-700">Manage Services</span>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/calendar"
              className="flex flex-col items-center justify-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100"
            >
              <Calendar className="h-6 w-6 text-primary-500 mb-2" />
              <span className="text-sm font-medium text-primary-700">Calendar</span>
            </Link>
            <Link
              to="/messages"
              className="flex flex-col items-center justify-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100"
            >
              <MessageSquare className="h-6 w-6 text-primary-500 mb-2" />
              <span className="text-sm font-medium text-primary-700">Messages</span>
            </Link>
            <Link
              to="/notifications"
              className="flex flex-col items-center justify-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100"
            >
              <Bell className="h-6 w-6 text-primary-500 mb-2" />
              <span className="text-sm font-medium text-primary-700">Notifications</span>
            </Link>
            <Link
              to="/profile"
              className="flex flex-col items-center justify-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100"
            >
              <Settings className="h-6 w-6 text-primary-500 mb-2" />
              <span className="text-sm font-medium text-primary-700">Settings</span>
            </Link>
          </div>
        </div>
      </div>
    );
  };
  
  const renderAdminDashboard = () => {
    const pendingUsers = retrieveData<User[]>(STORAGE_KEYS.USERS, [])
      .filter(u => !u.isApproved && u.role !== 'Administrator');
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-full">
          <h2 className="text-2xl font-bold mb-4">Administrator Dashboard</h2>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Pending Approvals</h3>
            <span className="text-sm text-gray-500">{pendingUsers.length} total</span>
          </div>
          {pendingUsers.length > 0 ? (
            <div className="space-y-4">
              {pendingUsers.slice(0, 3).map(user => (
                <div key={user.id} className="flex items-center justify-between border-b pb-4 last:border-b-0 last:pb-0">
                  <div>
                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                    <span className="text-sm text-gray-500">{user.role}</span>
                  </div>
                  <Link
                    to="/admin"
                    className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                  >
                    Review
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No pending approvals</p>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/admin"
              className="flex flex-col items-center justify-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100"
            >
              <Users className="h-6 w-6 text-primary-500 mb-2" />
              <span className="text-sm font-medium text-primary-700">Manage Users</span>
            </Link>
            <Link
              to="/admin/publications"
              className="flex flex-col items-center justify-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100"
            >
              <FileText className="h-6 w-6 text-primary-500 mb-2" />
              <span className="text-sm font-medium text-primary-700">Publications</span>
            </Link>
            <Link
              to="/admin/reports"
              className="flex flex-col items-center justify-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100"
            >
              <Star className="h-6 w-6 text-primary-500 mb-2" />
              <span className="text-sm font-medium text-primary-700">Reviews</span>
            </Link>
            <Link
              to="/admin/settings"
              className="flex flex-col items-center justify-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100"
            >
              <Settings className="h-6 w-6 text-primary-500 mb-2" />
              <span className="text-sm font-medium text-primary-700">Settings</span>
            </Link>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {user?.role === 'Client' && renderClientDashboard()}
        {user?.role === 'Technician' && renderTechnicianDashboard()}
        {user?.role === 'Administrator' && renderAdminDashboard()}
      </div>
    </div>
  );
};

export default Dashboard;