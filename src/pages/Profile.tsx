import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Technician } from '../models/types';
import { retrieveData, STORAGE_KEYS } from '../services/storageService';
import { User as UserIcon, Mail, Phone, MapPin, Star, PenTool as Tool, DollarSign } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    region: user?.region || '',
    specialty: (user as Technician)?.specialty || '',
    bio: (user as Technician)?.bio || '',
    pricePerService: (user as Technician)?.pricePerService || 0,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Get additional technician data if user is a technician
  const technicianData = user?.role === 'Technician'
    ? retrieveData<Technician[]>(STORAGE_KEYS.TECHNICIANS, []).find(t => t.id === user.id)
    : null;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const updatedUser = await updateUser({
        ...user,
        ...formData,
      });
      
      if (updatedUser) {
        setSuccess('Profile updated successfully');
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-primary-500 px-6 py-8">
            <div className="flex items-center">
              <div className="bg-white text-primary-500 h-20 w-20 rounded-full flex items-center justify-center text-2xl font-bold">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-white">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-primary-100">{user.role}</p>
              </div>
            </div>
          </div>
          
          {/* Profile Content */}
          <div className="p-6">
            {(error || success) && (
              <div className={`mb-4 p-4 rounded-md ${
                error ? 'bg-error-500 bg-opacity-10 text-error-500' : 'bg-success-500 bg-opacity-10 text-success-500'
              }`}>
                {error || success}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <div className="mt-1 relative">
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                        />
                        <UserIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <div className="mt-1 relative">
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                        />
                        <UserIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <div className="mt-1 relative">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                        />
                        <Mail className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <div className="mt-1 relative">
                        <input
                          type="tel"
                          name="phoneNumber"
                          id="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                        />
                        <Phone className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                        Region
                      </label>
                      <div className="mt-1 relative">
                        <input
                          type="text"
                          name="region"
                          id="region"
                          value={formData.region}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                        />
                        <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Technician-specific Information */}
                {user.role === 'Technician' && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
                          Specialty
                        </label>
                        <div className="mt-1 relative">
                          <input
                            type="text"
                            name="specialty"
                            id="specialty"
                            value={formData.specialty}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                          />
                          <Tool className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                          Bio
                        </label>
                        <div className="mt-1">
                          <textarea
                            name="bio"
                            id="bio"
                            rows={4}
                            value={formData.bio}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="pricePerService" className="block text-sm font-medium text-gray-700">
                          Price per Service
                        </label>
                        <div className="mt-1 relative">
                          <input
                            type="number"
                            name="pricePerService"
                            id="pricePerService"
                            min="0"
                            step="0.01"
                            value={formData.pricePerService}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                          />
                          <DollarSign className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      
                      {technicianData && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Rating
                          </label>
                          <div className="mt-1 flex items-center">
                            <Star className="h-5 w-5 text-yellow-400" />
                            <span className="ml-2 text-sm text-gray-600">
                              {technicianData.rating.toFixed(1)} / 5.0
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex justify-end space-x-3">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Save Changes
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;