import React, { useState, useEffect } from 'react';
import { Availability } from '../models/types';
import { useAuth } from '../contexts/AuthContext';
import { retrieveData, STORAGE_KEYS, addItem, removeItem } from '../services/storageService';
import { Calendar as CalendarIcon, Clock, Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const AvailabilityCalendar: React.FC = () => {
  const { user } = useAuth();
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
  });
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (user) {
      const techAvailability = retrieveData<Availability[]>(STORAGE_KEYS.AVAILABILITY, [])
        .filter(slot => slot.technicianId === user.id)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setAvailability(techAvailability);
    }
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      const { date, startTime, endTime } = formData;
      
      if (!date || !startTime || !endTime) {
        setError('Please fill in all fields');
        return;
      }
      
      const start = new Date(`${date}T${startTime}`);
      const end = new Date(`${date}T${endTime}`);
      
      if (end <= start) {
        setError('End time must be after start time');
        return;
      }
      
      const newSlot: Availability = {
        id: uuidv4(),
        technicianId: user.id,
        date,
        startTime,
        endTime,
        isBooked: false,
      };
      
      addItem(STORAGE_KEYS.AVAILABILITY, newSlot);
      setAvailability(prev => [...prev, newSlot].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      ));
      
      setIsModalOpen(false);
      setFormData({ date: '', startTime: '', endTime: '' });
    } catch (err) {
      setError('Failed to add availability slot');
    }
  };
  
  const handleDelete = (slotId: string) => {
    if (window.confirm('Are you sure you want to delete this availability slot?')) {
      removeItem(STORAGE_KEYS.AVAILABILITY, slotId);
      setAvailability(prev => prev.filter(slot => slot.id !== slotId));
    }
  };
  
  const groupByDate = (slots: Availability[]) => {
    const groups: { [key: string]: Availability[] } = {};
    slots.forEach(slot => {
      if (!groups[slot.date]) {
        groups[slot.date] = [];
      }
      groups[slot.date].push(slot);
    });
    return groups;
  };
  
  if (!user || user.role !== 'Technician') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-600">
            Only technicians can manage availability.
          </p>
        </div>
      </div>
    );
  }
  
  const groupedSlots = groupByDate(availability);
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Availability Calendar</h1>
            <p className="mt-2 text-lg text-gray-600">
              Manage your available time slots
            </p>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Availability
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {Object.entries(groupedSlots).length > 0 ? (
            Object.entries(groupedSlots).map(([date, slots]) => (
              <div key={date} className="border-b last:border-b-0">
                <div className="bg-gray-50 px-6 py-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {slots.map(slot => (
                    <div key={slot.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-gray-400" />
                          <span className="ml-2 text-gray-900">
                            {new Date(`2000-01-01T${slot.startTime}`).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: 'numeric',
                            })}
                            {' - '}
                            {new Date(`2000-01-01T${slot.endTime}`).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: 'numeric',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          {slot.isBooked ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-500 bg-opacity-10 text-success-500">
                              Booked
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-500 bg-opacity-10 text-primary-500">
                              Available
                            </span>
                          )}
                          {!slot.isBooked && (
                            <button
                              onClick={() => handleDelete(slot.id)}
                              className="text-gray-400 hover:text-error-500"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No availability set</h3>
              <p className="mt-1 text-gray-500">
                Start by adding your available time slots
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Availability
              </button>
            </div>
          )}
        </div>
        
        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Add Availability Slot
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <p className="text-sm text-error-500">{error}</p>
                )}
                
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    id="startTime"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={formData.startTime}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    id="endTime"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    value={formData.endTime}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setFormData({ date: '', startTime: '', endTime: '' });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-500 hover:bg-primary-600"
                  >
                    Add Slot
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

export default AvailabilityCalendar;