import React, { useState, useEffect } from 'react';
import { Service } from '../models/types';
import { useAuth } from '../contexts/AuthContext';
import { retrieveData, STORAGE_KEYS, addItem, removeItem } from '../services/storageService';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const ManageServices: React.FC = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
  });
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (user) {
      const technicianServices = retrieveData<Service[]>(STORAGE_KEYS.SERVICES, [])
        .filter(service => service.technicianId === user.id);
      setServices(technicianServices);
    }
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      if (!formData.title.trim() || !formData.description.trim() || !formData.price.trim()) {
        setError('Please fill in all fields');
        return;
      }
      
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        setError('Please enter a valid price');
        return;
      }
      
      if (editingService) {
        // Update existing service
        const updatedService: Service = {
          ...editingService,
          title: formData.title.trim(),
          description: formData.description.trim(),
          price,
        };
        
        const updatedServices = services.map(s =>
          s.id === editingService.id ? updatedService : s
        );
        
        setServices(updatedServices);
        storeData(STORAGE_KEYS.SERVICES, updatedServices);
      } else {
        // Create new service
        const newService: Service = {
          id: uuidv4(),
          title: formData.title.trim(),
          description: formData.description.trim(),
          price,
          technicianId: user.id,
          createdAt: new Date().toISOString(),
        };
        
        addItem(STORAGE_KEYS.SERVICES, newService);
        setServices(prev => [...prev, newService]);
      }
      
      setIsModalOpen(false);
      setEditingService(null);
      setFormData({ title: '', description: '', price: '' });
    } catch (err) {
      setError('Failed to save service');
    }
  };
  
  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      price: service.price.toString(),
    });
    setIsModalOpen(true);
  };
  
  const handleDelete = (serviceId: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      removeItem(STORAGE_KEYS.SERVICES, serviceId);
      setServices(prev => prev.filter(s => s.id !== serviceId));
    }
  };
  
  if (!user || user.role !== 'Technician') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-600">
            Only technicians can manage services.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Services</h1>
            <p className="mt-2 text-lg text-gray-600">
              Create and manage your service offerings
            </p>
          </div>
          
          <button
            onClick={() => {
              setEditingService(null);
              setFormData({ title: '', description: '', price: '' });
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Service
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <div key={service.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="text-gray-400 hover:text-error-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-gray-600">{service.description}</p>
              <div className="mt-4 flex items-center text-lg font-semibold text-gray-900">
                <DollarSign className="h-5 w-5 text-gray-400" />
                {service.price.toFixed(2)}
              </div>
            </div>
          ))}
          
          {services.length === 0 && (
            <div className="col-span-full bg-white rounded-lg shadow-sm p-8 text-center">
              <Plus className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No services yet</h3>
              <p className="mt-1 text-gray-500">
                Start by adding your first service offering
              </p>
              <button
                onClick={() => {
                  setEditingService(null);
                  setFormData({ title: '', description: '', price: '' });
                  setIsModalOpen(true);
                }}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Service
              </button>
            </div>
          )}
        </div>
        
        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <p className="text-sm text-error-500">{error}</p>
                )}
                
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      required
                      min="0"
                      step="0.01"
                      className="block w-full pl-7 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      value={formData.price}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingService(null);
                      setFormData({ title: '', description: '', price: '' });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600"
                  >
                    {editingService ? 'Save Changes' : 'Add Service'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageServices;