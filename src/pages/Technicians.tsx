import React, { useState, useEffect } from 'react';
import { Technician } from '../models/types';
import TechnicianCard from '../components/common/TechnicianCard';
import { retrieveData, STORAGE_KEYS } from '../services/storageService';
import { Search, Filter } from 'lucide-react';

const Technicians: React.FC = () => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  
  useEffect(() => {
    const allTechnicians = retrieveData<Technician[]>(STORAGE_KEYS.TECHNICIANS, [])
      .filter(tech => tech.isApproved);
    setTechnicians(allTechnicians);
  }, []);
  
  const specialties = [...new Set(technicians.map(tech => tech.specialty))];
  const regions = [...new Set(technicians.map(tech => tech.region))];
  
  const filteredTechnicians = technicians.filter(tech => {
    const matchesSearch = tech.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = !selectedSpecialty || tech.specialty === selectedSpecialty;
    const matchesRegion = !selectedRegion || tech.region === selectedRegion;
    
    return matchesSearch && matchesSpecialty && matchesRegion;
  });
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find a Technician</h1>
          <p className="mt-2 text-lg text-gray-600">
            Connect with skilled professionals in your area
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search technicians..."
                className="pl-10 w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              <option value="">All Specialties</option>
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
            
            <select
              className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              <option value="">All Regions</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTechnicians.map(technician => (
            <TechnicianCard key={technician.id} technician={technician} />
          ))}
          
          {filteredTechnicians.length === 0 && (
            <div className="col-span-full text-center py-12">
              <Filter className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No technicians found</h3>
              <p className="mt-1 text-gray-500">
                Try adjusting your search criteria or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Technicians;