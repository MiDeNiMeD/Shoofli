import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Publication, Reclamation } from '../../models/types';
import { retrieveData, STORAGE_KEYS, updateItem } from '../../services/storageService';
import { approveUser, deleteUser } from '../../services/authService';
import { Users, FileText, AlertTriangle, Settings, CheckCircle, XCircle } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'publications' | 'reclamations' | 'settings'>('users');
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [reclamations, setReclamations] = useState<Reclamation[]>([]);
  
  useEffect(() => {
    // Load pending users
    const users = retrieveData<User[]>(STORAGE_KEYS.USERS, [])
      .filter(u => !u.isApproved && u.role !== 'Administrator');
    setPendingUsers(users);
    
    // Load publications
    const pubs = retrieveData<Publication[]>(STORAGE_KEYS.PUBLICATIONS, []);
    setPublications(pubs);
    
    // Load reclamations
    const recs = retrieveData<Reclamation[]>(STORAGE_KEYS.RECLAMATIONS, [])
      .filter(r => r.status === 'Pending');
    setReclamations(recs);
  }, []);
  
  const handleApproveUser = async (userId: string) => {
    const approvedUser = approveUser(userId);
    if (approvedUser) {
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
    }
  };
  
  const handleRejectUser = async (userId: string) => {
    const deleted = deleteUser(userId);
    if (deleted) {
      setPendingUsers(prev => prev.filter(u => u.id !== userId));
    }
  };
  
  const handleDeletePublication = (pubId: string) => {
    const updatedPubs = publications.filter(p => p.id !== pubId);
    setPublications(updatedPubs);
    storeData(STORAGE_KEYS.PUBLICATIONS, updatedPubs);
  };
  
  const handleResolveReclamation = (recId: string, status: 'Resolved' | 'Rejected') => {
    const updatedRec = updateItem<Reclamation>(
      STORAGE_KEYS.RECLAMATIONS,
      recId,
      { status }
    );
    if (updatedRec) {
      setReclamations(prev => prev.filter(r => r.id !== recId));
    }
  };
  
  const renderUsersTab = () => (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
        {pendingUsers.map(user => (
          <div key={user.id} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </h3>
                <div className="mt-1 text-sm text-gray-500">
                  <p>Email: {user.email}</p>
                  <p>Role: {user.role}</p>
                  <p>Region: {user.region}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleApproveUser(user.id)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-success-500 hover:bg-success-600"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Approve
                </button>
                <button
                  onClick={() => handleRejectUser(user.id)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-error-500 hover:bg-error-600"
                >
                  <XCircle className="h-5 w-5 mr-2" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
        {pendingUsers.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No pending users to approve
          </div>
        )}
      </div>
    </div>
  );
  
  const renderPublicationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
        {publications.map(pub => (
          <div key={pub.id} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{pub.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{pub.description}</p>
              </div>
              <button
                onClick={() => handleDeletePublication(pub.id)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-error-500 hover:bg-error-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {publications.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No publications to moderate
          </div>
        )}
      </div>
    </div>
  );
  
  const renderReclamationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
        {reclamations.map(rec => (
          <div key={rec.id} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Reclamation from User #{rec.authorId}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{rec.description}</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleResolveReclamation(rec.id, 'Resolved')}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-success-500 hover:bg-success-600"
                >
                  Resolve
                </button>
                <button
                  onClick={() => handleResolveReclamation(rec.id, 'Rejected')}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-error-500 hover:bg-error-600"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
        {reclamations.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No pending reclamations
          </div>
        )}
      </div>
    </div>
  );
  
  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">System Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Enable User Registration
            </label>
            <div className="mt-1">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                defaultChecked
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Require Email Verification
            </label>
            <div className="mt-1">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                defaultChecked
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Auto-approve Technicians
            </label>
            <div className="mt-1">
              <input
                type="checkbox"
                className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  if (!user || user.role !== 'Administrator') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="mt-2 text-lg text-gray-600">
            Manage users, content, and system settings
          </p>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('users')}
                className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="h-5 w-5 mx-auto mb-1" />
                Users
              </button>
              <button
                onClick={() => setActiveTab('publications')}
                className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'publications'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="h-5 w-5 mx-auto mb-1" />
                Publications
              </button>
              <button
                onClick={() => setActiveTab('reclamations')}
                className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'reclamations'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <AlertTriangle className="h-5 w-5 mx-auto mb-1" />
                Reclamations
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'settings'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Settings className="h-5 w-5 mx-auto mb-1" />
                Settings
              </button>
            </nav>
          </div>
          
          <div className="p-6">
            {activeTab === 'users' && renderUsersTab()}
            {activeTab === 'publications' && renderPublicationsTab()}
            {activeTab === 'reclamations' && renderReclamationsTab()}
            {activeTab === 'settings' && renderSettingsTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;