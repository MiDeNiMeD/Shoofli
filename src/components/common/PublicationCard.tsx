import React from 'react';
import { Link } from 'react-router-dom';
import { Publication, User } from '../../models/types';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getItemById, STORAGE_KEYS } from '../../services/storageService';

interface PublicationCardProps {
  publication: Publication;
}

const PublicationCard: React.FC<PublicationCardProps> = ({ publication }) => {
  const { id, title, description, imageUrl, createdAt, clientId } = publication;
  
  // Get client data
  const client = getItemById<User>(STORAGE_KEYS.USERS, clientId);
  
  // Format the creation date
  const formattedDate = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  
  // Truncate description for preview
  const shortDescription = description.length > 200 
    ? `${description.substring(0, 200)}...` 
    : description;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      {imageUrl && (
        <div className="h-48 w-full overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        
        <div className="flex items-start space-x-3 mb-4">
          <div className="bg-primary-100 text-primary-800 h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
            {client ? `${client.firstName.charAt(0)}${client.lastName.charAt(0)}` : 'U'}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {client ? `${client.firstName} ${client.lastName}` : 'Unknown User'}
            </p>
            {client && (
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{client.region}</span>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">{shortDescription}</p>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>{formattedDate}</span>
          </div>
          
          <Link
            to={`/publications/${id}`}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-secondary-500 hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PublicationCard;