import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { RegisterFormData, UserRole } from '../../models/types';
import { Eye, EyeOff } from 'lucide-react';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    region: '',
    role: 'Client',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user starts typing
    if (formError) setFormError('');
    if (error) clearError();
  };
  
  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const role = e.target.value as UserRole;
    setFormData(prev => ({ ...prev, role }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }
    
    if (formData.role === 'Technician' && !formData.specialty) {
      setFormError('Please enter your specialty');
      return;
    }
    
    try {
      setLoading(true);
      const user = await register(formData);
      
      // If user was automatically logged in (admin or first user)
      if (user.isApproved) {
        navigate('/dashboard');
      } else {
        setRegistrationSuccess(true);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to register');
    } finally {
      setLoading(false);
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-success-500 bg-opacity-10">
              <svg
                className="h-6 w-6 text-success-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">Registration successful!</h3>
            <p className="mt-2 text-sm text-gray-500">
              {formData.role === 'Administrator'
                ? 'Your administrator account has been created. You can now log in.'
                : 'Your account is pending approval by an administrator. You will be notified once your account is approved.'}
            </p>
            <div className="mt-6">
              <Link
                to="/login"
                className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-primary-500 hover:text-primary-600">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        {(error || formError) && (
          <div className="bg-error-500 bg-opacity-10 border border-error-500 text-error-500 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error || formError}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="flex flex-col space-y-1">
              <label htmlFor="role" className="text-sm font-medium text-gray-700">
                I want to register as:
              </label>
              <div className="flex space-x-4 mt-1">
                <div className="flex items-center">
                  <input
                    id="role-client"
                    name="role"
                    type="radio"
                    className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300"
                    value="Client"
                    checked={formData.role === 'Client'}
                    onChange={handleRoleChange}
                  />
                  <label htmlFor="role-client" className="ml-2 block text-sm text-gray-700">
                    Client
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="role-technician"
                    name="role"
                    type="radio"
                    className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300"
                    value="Technician"
                    checked={formData.role === 'Technician'}
                    onChange={handleRoleChange}
                  />
                  <label htmlFor="role-technician" className="ml-2 block text-sm text-gray-700">
                    Technician
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="role-admin"
                    name="role"
                    type="radio"
                    className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300"
                    value="Administrator"
                    checked={formData.role === 'Administrator'}
                    onChange={handleRoleChange}
                  />
                  <label htmlFor="role-admin" className="ml-2 block text-sm text-gray-700">
                    Administrator
                  </label>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="XXX-XXX-XXXX"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                Region
              </label>
              <input
                id="region"
                name="region"
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="City, State"
                value={formData.region}
                onChange={handleChange}
              />
            </div>
            
            {formData.role === 'Technician' && (
              <>
                <div>
                  <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
                    Specialty
                  </label>
                  <input
                    id="specialty"
                    name="specialty"
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="e.g., Electrical, Plumbing, IT"
                    value={formData.specialty || ''}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio / Description
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Tell clients about your experience and skills..."
                    value={formData.bio || ''}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="pricePerService" className="block text-sm font-medium text-gray-700">
                    Price per Service ($)
                  </label>
                  <input
                    id="pricePerService"
                    name="pricePerService"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="0.00"
                    value={formData.pricePerService || ''}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading ? 'bg-primary-400' : 'bg-primary-500 hover:bg-primary-600'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;