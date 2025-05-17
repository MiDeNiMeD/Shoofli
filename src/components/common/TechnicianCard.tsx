import React from 'react';
import { Link } from 'react-router-dom';
import { Technician } from '../../models/types';
import { Star, MapPin, PenTool, MessageSquare } from 'lucide-react';

interface TechnicianCardProps {
  technician: Technician;
}

const TechnicianCard: React.FC<TechnicianCardProps> = ({ technician }) => {
  const {
    id,
    firstName,
    lastName,
    region,
    specialty,
    rating,
    bio,
    pricePerService,
  } = technician;
  
  // Limit bio to a certain number of characters for display
  const shortBio = bio.length > 150 ? `${bio.substring(0, 150)}...` : bio;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <div className="bg-primary-100 text-primary-800 h-16 w-16 rounded-full flex items-center justify-center text-xl font-medium">
              {firstName.charAt(0)}{lastName.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{firstName} {lastName}</h3>
              <p className="text-primary-600 font-medium">{specialty}</p>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{region}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center justify-end mb-1">
              <Star className="h-5 w-5 text-yellow-400 mr-1" />
              <span className="font-semibold">{Number(rating).toFixed(1)}</span>
            </div>
            <p className="text-gray-900 font-bold">${Number(pricePerService).toFixed(2)}</p>
            <p className="text-xs text-gray-500">per service</p>
          </div>
        </div>
        
        <p className="mt-4 text-gray-600 text-sm">{shortBio}</p>
        
        <div className="mt-5 flex space-x-3">
          <Link
            to={`/technicians/${id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PenTool className="h-5 w-5 mr-2" />
            View Profile
          </Link>
          <Link
            to={`/messages/new/${id}`}
            className="inline-flex items-center px-4 py-2 border border-primary-500 text-sm font-medium rounded-md text-primary-500 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TechnicianCard;